import { Configuration } from "./config"
import { RelayPayload, RelayHeaders, RelayRequest, RelayProof, RelayResponse, Session, MajorityResponse } from "./rpc/models"
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
import { ChallengeRequest } from "./rpc/models/input/challenge-request"
import { ChallengeResponse } from "./rpc/models/output/challenge-response"
import { RelayMeta } from "./rpc/models/input/relay-meta"

/**
 *
 * HTTPMethod enum with the possible Staking status values
 */
export enum HTTPMethod {
  POST = "POST",
  GET = "GET",
  DELETE = "DELETE",
  NA = ""
}

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

    if (rpcProvider !== undefined) {
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
    if (rpcProvider !== undefined) {
      this.innerRpc = new RPC(rpcProvider)
    }

    if (this.innerRpc !== undefined) {
      return this.innerRpc
    }
  }

  /**
   *
   * Sends a Relay Request to multiple nodes for manual consensus
   * @param {string} data - string holding the json rpc call.
   * @param {string} blockchain - Blockchain hash.
   * @param {PocketAAT} pocketAAT - Pocket Authentication Token.
   * @param {Configuration} configuration - Pocket configuration object.
   * @param {RelayHeaders} headers - (Optional) An object holding the HTTP Headers.
   * @param {HTTPMethod} method - (Optional) HTTP method for REST API calls.
   * @param {string} path - (Optional) REST API path.
   * @param {Node} node - (Optional) Session node which will receive the Relay.
   * @returns {ConsensusRelayResponse | ChallengeResponse | Error} - A Consensus Relay Response object, Challenge response or error.
   * @memberof Pocket
   */
  public async sendConsensusRelay(
    data: string,
    blockchain: string,
    pocketAAT: PocketAAT,
    configuration: Configuration = this.configuration,
    headers?: RelayHeaders,
    method: HTTPMethod = HTTPMethod.NA,
    path = "",
    node?: Node
  ): Promise<ConsensusRelayResponse | ChallengeResponse | Error> {
    const consensusNodes: ConsensusNode[] = []
    let firstResponse: RelayResponse | undefined

    try {
      // Checks if max consensus nodes count is 0, meaning it wasn't configured for local concensus.
      if (this.configuration.consensusNodeCount === 0) {
        return new Error("Failed to send a relay with local consensus, configuration consensusNodeCount is 0")
      }
      // Perform the relays based on the max consensus nodes count
      for (let index = 0; index < this.configuration.consensusNodeCount; index++) {
        const consensusNodeResponse = await this.sendRelay(data, blockchain, pocketAAT, configuration, headers || undefined, method, path, node, true)
        // Check if ConsensusNode type
        if (typeGuard(consensusNodeResponse, ConsensusNode)) {
          // Save the first response
          if (index === 0) {
            firstResponse = consensusNodeResponse.relayResponse
          }
          consensusNodes.push(consensusNodeResponse)
        } else if (typeGuard(consensusNodeResponse, RpcError)) {
          return new Error("Relay error: " + consensusNodeResponse.message)
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
        consensusNodes
      )

      // Check if acceptDisputedResponses is true or false
      if (consensusRelayResponse.consensusResult) {
        return consensusRelayResponse
      } else if (configuration.acceptDisputedResponses) {
        return consensusRelayResponse
      } else if (consensusRelayResponse.majorityResponse !== undefined && consensusRelayResponse.minorityResponse !== undefined) {
        // Create the challenge request
        const challengeRequest = new ChallengeRequest(consensusRelayResponse.majorityResponse!, consensusRelayResponse.minorityResponse!)
        // Send the challenge request
        const challengeResponse = await this.rpc()!.query.requestChallenge(challengeRequest)
        // Return a challenge response
        if (typeGuard(challengeResponse, ChallengeResponse)) {
          return challengeResponse
        }
        return new Error(challengeResponse.message)
      } else {
        return new Error("Failed to send a consensus relay due to false consensus result, not acepting disputed responses without proper majority and minority responses.")
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
   * @param {Configuration} configuration - Pocket configuration object.
   * @param {RelayHeaders} headers - (Optional) An object holding the HTTP Headers.
   * @param {HTTPMethod} method - (Optional) HTTP method for REST API calls.
   * @param {string} path - (Optional) REST API path.
   * @param {Node} node - (Optional) Session node which will receive the Relay.
   * @param {boolean} consensusEnabled - (Optional) True or false if the relay will be sent to multiple nodes for consensus, default is false.
   * @returns {RelayResponse} - A Relay Response object.
   * @memberof Pocket
   */
  public async sendRelay(
    data: string,
    blockchain: string,
    pocketAAT: PocketAAT,
    configuration: Configuration = this.configuration,
    headers?: RelayHeaders,
    method: HTTPMethod = HTTPMethod.NA,
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
      // Check if consensus relay is enabled
      if (consensusEnabled) {
        if (this.configuration.consensusNodeCount > currentSession.sessionNodes.length) {
          return new RpcError("", "Failed to send a consensus relay, number of max consensus nodes is higher thant the actual nodes in current session")
        }
        const serviceNodeOrError = currentSession.getUniqueSessionNode()
        if (typeGuard(serviceNodeOrError, Error)) {
          return RpcError.fromError(serviceNodeOrError as Error)
        }
        serviceNode = serviceNodeOrError as Node
      } else {
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
      }

      // Final Service Node check
      if (serviceNode === undefined) {
        return new RpcError("0", "Could not determine a Service Node to submit this relay")
      }

      // Assign session service node to the rpc instance
      const serviceProvider = new HttpRpcProvider(serviceNode.serviceURL)
      this.rpc(serviceProvider)

      // Create Relay Payload
      const relayPayload = new RelayPayload(data, method, path, headers || null)

      // Check if account is available for signing
      const clientAddressHex = addressFromPublickey(Buffer.from(pocketAAT.clientPublicKey, 'hex')).toString("hex")
      const isUnlocked = await this.keybase.isUnlocked(clientAddressHex)
      if (!isUnlocked) {
        return new RpcError("0", "Client account " + clientAddressHex + " for this AAT is not unlocked")
      }

      // Produce signature payload
      const relayMeta = new RelayMeta(BigInt(currentSession.sessionHeader.sessionBlockHeight) + BigInt(currentSession.getBlocksSinceCreation(configuration)))
      const requestHash = new RequestHash(relayPayload, relayMeta)
      const entropy = BigInt(Math.floor(Math.random() * 99999999999999999))

      const proofBytes = RelayProof.bytes(
        entropy,
        currentSession.sessionHeader.sessionBlockHeight,
        serviceNode.publicKey,
        blockchain,
        pocketAAT,
        requestHash
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
        entropy,
        currentSession.sessionHeader.sessionBlockHeight,
        serviceNode.publicKey,
        blockchain,
        pocketAAT,
        signatureHex,
        requestHash
      )

      // Relay to be sent
      const relay = new RelayRequest(relayPayload, relayMeta, relayProof)
      // Send relay
      const result = await this.innerRpc!.client.relay(relay, configuration.validateRelayResponses, configuration.requestTimeOut)

      // Check session out of sync error
      if (typeGuard(result, RpcError)) {
        const rpcError = result as RpcError
        // Refresh the current session if we get this error code
        if (rpcError.code === "1124") {
          let sessionRefreshed = false
          for (let retryIndex = 0; retryIndex < configuration.maxSessionRefreshRetries; retryIndex++) {
            // Get the current session
            const currentSessionOrError = await this.sessionManager.requestCurrentSession(pocketAAT, blockchain, configuration)
            if (typeGuard(currentSessionOrError, RpcError)) {
              // If error or same session, don't even retry relay
              continue
            } else if (typeGuard(currentSessionOrError, Session)) {
              const newSession = currentSessionOrError as Session
              if (newSession.sessionKey === currentSessionOrError.sessionKey) {
                // If we get the same session skip this attempt
                continue
              }
            }
            sessionRefreshed = true
            break
          }

          if (sessionRefreshed) {
            // If a new session is succesfully obtained retry the relay
            // This won't cause an endless loop because the relay will only be retried only if the session was refreshed
            return this.sendRelay(data, blockchain, pocketAAT, configuration, headers, method, path, node, consensusEnabled)
          } else {
            return rpcError
          }
        } else {
          return rpcError
        }
      } else if (consensusEnabled && typeGuard(result, RelayResponse)) {
        // Handle consensus
        if (currentSession.sessionNodes.indexOf(serviceNode)) {
          currentSession.sessionNodes[currentSession.sessionNodes.indexOf(serviceNode)].alreadyInConsensus = true
        }
        return new ConsensusNode(serviceNode, false, result)
      } else {
        return result
      }
    } catch (error) {
      return RpcError.fromError(error)
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