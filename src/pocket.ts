import { Configuration } from "./config"
import {RelayPayload, RelayHeaders, RelayRequest, RelayProof, RelayResponse, Session} from "./rpc/models"
import { addressFromPublickey, validatePrivateKey, publicKeyFromPrivate, typeGuard } from "./utils"
import { SessionManager } from "./session/session-manager"
import { Node, RPC, IRPCProvider, RpcError, HttpRpcProvider } from "./rpc"
import { Keybase } from "./keybase/keybase"
import { UnlockedAccount, Account } from "./keybase/models"
import { RoutingTable } from "./routing-table/routing-table"
import { PocketAAT } from "@pokt-network/aat-js"
import { TransactionSigner, ITransactionSender, InMemoryKVStore, IKVStore, TransactionSender } from "./"
import { ConsensusRelayResponse } from "./rpc/models/output/consensus-relay-response"
import { ConsensusNode } from "./rpc/models/consensus-node"
import { RequestHash } from "./rpc/models/input/request-hash"
import { MajorityResponse } from "./rpc/models/input/majority-response"
import { MinorityResponse } from "./rpc/models/input/minority-response"
import { ChallengeRequest } from "./rpc/models/input/challenge-request"
import { ChallengeResponse } from "./rpc/models/output/challenge-response"
import { RelayMeta } from "./rpc/models/input/relay-meta"

/**
 *
 *
 * @class Pocket
 */
export class Pocket {
  public readonly configuration: Configuration
  public readonly keybase: Keybase
  public readonly sessionManager: SessionManager
  public readonly routingTable: RoutingTable
  private innerRpc?: RPC

  /**
   * Creates an instance of Pocket.
   * @param {URL} dispatchers - Array holding the initial dispatcher url(s).
   * @param {IRPCProvider} rpcProvider - Provider which will be used to reach out to the Pocket Core RPC interface.
   * @param {Configuration} configuration - Configuration object.
   * @param {IKVStore} store - Save data using a Key/Value relationship. This object save information in memory.
   * @memberof Pocket
   */
  constructor(
    dispatchers: URL[],
    rpcProvider?: IRPCProvider,
    configuration: Configuration = new Configuration(),
    store: IKVStore = new InMemoryKVStore()
  ) {
    this.configuration = configuration
    try {
      this.routingTable = new RoutingTable(dispatchers, configuration, store)
      this.sessionManager = new SessionManager(this.routingTable, store)
      this.keybase = new Keybase(store)
    } catch (error) {
      throw error
    }
    
    if(rpcProvider !== undefined) {
      this.innerRpc = new RPC(rpcProvider)
    }
  }

  /**
   * Creates a new instance of RPC if you set an IRPCProvider or return the previous existing instance
   * @param {IRPCProvider} rpcProvider - Provider which will be used to reach out to the Pocket Core RPC interface.
   * @returns {RPC} - A RPC object.
   * @memberof Pocket
   */
  public rpc(rpcProvider?: IRPCProvider): RPC | undefined {
    if(rpcProvider !== undefined) {
      this.innerRpc = new RPC(rpcProvider)
    }

    if(this.innerRpc !== undefined) {
      return this.innerRpc
    } 
  }


  public async sendConsensusRelay(
    data: string,
    blockchain: string,
    pocketAAT: PocketAAT,
    configuration: Configuration = this.configuration,
    headers?: RelayHeaders,
    method = "",
    path = "",
    node?: Node
  ): Promise<ConsensusRelayResponse | ChallengeResponse | Error> {
    const consensusNodes: ConsensusNode[] = []
    let firstResponse: RelayResponse | undefined

    try {
      // Checks if max consensus nodes count is 0, meaning it wasn't configured for local concensus.
      if (this.configuration.maxConsensusNodes === 0) {
        return new Error("Failed to send a relay with local consensus, configuration maxConsensusNodes is 0")
      }
      // Perform the relays based on the max consensus nodes count
      for (let index = 0; index < this.configuration.maxConsensusNodes; index++) {
        const consensusNodeResponse = await this.sendRelay(data, blockchain, pocketAAT, configuration, headers ?? {"":""}, method, path, node)
        // Check if ConsensusNode type
        if (typeGuard(consensusNodeResponse, ConsensusNode)) {
          // Save the first response
          if (index === 0) {
            firstResponse = consensusNodeResponse.relayResponse
          }
          consensusNodes.push(consensusNodeResponse)
        } else if (typeGuard(consensusNodeResponse, RpcError)){
          return new Error("Relay error: "+ consensusNodeResponse.message)
        }
      }
      // Check consensus nodes length
      if (consensusNodes.length === 0 || firstResponse === undefined) {
        return new Error("Failed to send a relay with local consensus, no responses.")
      }
      // Add the consensus node list to the consensus relay response
      const consensusRelayResponse = new ConsensusRelayResponse(
        firstResponse!.signature,
        firstResponse!.payload,
        firstResponse!.proof,
        consensusNodes
      )

      // Check if acceptDisputedResponses is true or false
      if (consensusRelayResponse.consensusResult) {
        return consensusRelayResponse
      } else if (configuration.acceptDisputedResponses) {
        return consensusRelayResponse
      } else {
        // Create the challenge request
        const challengeRequest = new ChallengeRequest(consensusRelayResponse.majorityResponse, consensusRelayResponse.minorityResponse)
        // Send the challenge request
        const challengeResponse = await this.rpc()!.query.requestChallenge(challengeRequest)

        if (typeGuard(challengeResponse, ChallengeResponse)) {
          return challengeResponse
        }
        return new Error(challengeResponse.message)
      }
    } catch (err) {
      return err
    }
  }
  /**
   *
   * Sends a Relay Request
   * @param {string} data - string holding the json rpc call.
   * @param {string} blockchain - Blockchain hash.
   * @param {PocketAAT} pocketAAT - Pocket Authentication Token.
   * @param {RequestHash} requestHash - RequestHash object.
   * @param {Configuration} configuration - Pocket configuration object.
   * @param {RelayHeaders} headers - (Optional) An object holding the HTTP Headers.
   * @param {string} method - (Optional) HTTP method for REST API calls.
   * @param {string} path - (Optional) REST API path.
   * @param {Node} node - (Optional) Session node which will receive the Relay.
   * @returns {RelayResponse} - A Relay Response object.
   * @memberof Pocket
   */
  public async sendRelay(
    data: string,
    blockchain: string,
    pocketAAT: PocketAAT,
    configuration: Configuration = this.configuration,
    headers?: RelayHeaders,
    method = "",
    path = "",
    node?: Node,
    consensusEnabled: boolean = false
  ): Promise<RelayResponse | ConsensusNode | RpcError> {
    try {
      // Get the current session
      const currentSessionOrError = await this.sessionManager.getCurrentSession(pocketAAT, blockchain, configuration)

      if (typeGuard(currentSessionOrError, RpcError)) {
        return currentSessionOrError as RpcError
      }

      // Set the currentSession
      const currentSession = currentSessionOrError as Session

      // Determine the service node
      let serviceNode: Node
      // Provide a random service node from the session
      if (node !== undefined) {
        if (currentSession.isNodeInSession(node)) {
          serviceNode = node as Node
        } else {
          return new RpcError("0", "Provided Node is not part of the current session for this application, check your PocketAAT")
        }
      } else {
        const serviceNodeOrError = currentSession.getSessionNode()
        if (typeGuard(serviceNodeOrError, Error)) {
          return RpcError.fromError(serviceNodeOrError as Error)
        }
        serviceNode = serviceNodeOrError as Node
      }

      // Final Service Node check
      if (serviceNode === undefined) {
        return new RpcError("0", "Could not determine a Service Node to submit this relay")
      }

      // Assign session service node to the rpc instance
      const serviceProvider = new HttpRpcProvider(serviceNode.serviceURL)
      this.rpc(serviceProvider)
      // Create Relay Payload
      const relayPayload = new RelayPayload(data, method, path, headers)

      // Check if account is available for signing
      const clientAddressHex = addressFromPublickey(Buffer.from(pocketAAT.clientPublicKey, 'hex')).toString("hex")
      const isUnlocked = await this.keybase.isUnlocked(clientAddressHex)
      if (!isUnlocked) {
        return new RpcError("0", "Client account " + clientAddressHex + " for this AAT is not unlocked")
      }
      // Request Hash
      const relayMeta = new RelayMeta(currentSession.sessionHeader.sessionBlockHeight)
      const requestHash = new RequestHash(relayPayload, relayMeta)

      // Produce signature payload
      const entropy = BigInt(Math.floor(Math.random() * 99999999999999999))
      const proofBytes = RelayProof.bytes(
          requestHash,
          entropy,
          currentSession.sessionHeader.sessionBlockHeight,
          serviceNode.publicKey,
          blockchain,
          pocketAAT
      )

      // Sign
      const signatureOrError = await this.keybase.signWithUnlockedAccount(clientAddressHex, proofBytes)
      if (typeGuard(signatureOrError, Error)) {
        return new RpcError("0", "Error signing Relay proof")
      }
      const signature = signatureOrError as Buffer
      const signatureHex = signature.toString("hex")

      // Produce RelayProof
      const relayProof = new RelayProof(
          requestHash,
          entropy,
          currentSession.sessionHeader.sessionBlockHeight,
          serviceNode.publicKey,
          blockchain,
          pocketAAT,
          signatureHex
      )

      // Relay to be sent
      const relay = new RelayRequest(relayPayload, relayMeta, relayProof)
      // Send relay
      const result = await this.innerRpc!.client.relay(relay, configuration.requestTimeOut)
      // 
      if (consensusEnabled && typeGuard(result, RelayResponse)) {
        return new ConsensusNode(serviceNode, false, result)
      } else {
        return result
      }
    } catch (error) {
      return error
    }
  }

  /**
   * Creates an ITransactionSender given a private key
   * @param {Buffer | string} privateKey 
   * @returns {ITransactionSender} - Interface with all the possible MsgTypes in a Pocket Network transaction and a function to submit the transaction to the network.
   * @memberof Pocket
   */
  public withPrivateKey(privateKey: Buffer | string): ITransactionSender | Error {
    try {
      const privKeyBuffer = typeGuard(privateKey, Buffer) ? privateKey as Buffer : Buffer.from(privateKey as string, 'hex')
      if (!validatePrivateKey(privKeyBuffer)) {
        throw new Error("Invalid private key")
      }
      const pubKey = publicKeyFromPrivate(privKeyBuffer)
      const unlockedAccount = new UnlockedAccount(new Account(pubKey, ''), privKeyBuffer)
      return new TransactionSender(this, unlockedAccount)
    } catch (err) {
      return err
    }
  }

  /**
   * Creates an ITransactionSender given an already imported account into this instanc keybase
   * @param {Buffer | string} address - address of the account
   * @param {string} passphrase - passphrase for the account
   * @returns {ITransactionSender} - Interface with all the possible MsgTypes in a Pocket Network transaction and a function to submit the transaction to the network.
   * @memberof Pocket
   */
  public async withImportedAccount(address: Buffer | string, passphrase: string): Promise<ITransactionSender | Error> {
    const unlockedAccountOrError = await this.keybase.getUnlockedAccount(
      typeGuard(address, "string") ? address as string : (address as Buffer).toString("hex"),
      passphrase)

    if (typeGuard(unlockedAccountOrError, Error)) {
      return unlockedAccountOrError as Error
    } else {
      return new TransactionSender(this, (unlockedAccountOrError as UnlockedAccount))
    }
  }

  /**
   * Creates an ITransactionSender given a {TransactionSigner} function
   * @param {TransactionSigner} txSigner - Function which will sign the transaction bytes
   * @returns {ITransactionSender} - Interface with all the possible MsgTypes in a Pocket Network transaction and a function to submit the transaction to the network.
   * @memberof Pocket
   */
  public withTxSigner(txSigner: TransactionSigner): ITransactionSender | Error {
    try {
      return new TransactionSender(this, undefined, txSigner)
    } catch (err) {
      return err
    }
  }
}

export * from "@pokt-network/aat-js"