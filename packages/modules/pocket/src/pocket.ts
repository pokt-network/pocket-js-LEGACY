import { Configuration } from "@pokt-network/pocket-js-configuration"
import { RelayPayload, RelayHeaders, RelayRequest, RelayProof, RelayResponse, RelayMeta, RequestHash } from "@pokt-network/pocket-js-relay-models"
import { Session, MajorityResponse, ConsensusRelayResponse, ConsensusNode, ChallengeRequest, ChallengeResponse, Node } from "@pokt-network/pocket-js-rpc-models"
import { addressFromPublickey, validatePrivateKey, publicKeyFromPrivate, typeGuard, RpcError } from "@pokt-network/pocket-js-utils"
import { SessionManager } from "@pokt-network/pocket-js-session-manager"
import { IRPCProvider, HttpRpcProvider } from "@pokt-network/pocket-js-http-provider"
import { UnlockedAccount, Account, Keybase } from "@pokt-network/pocket-js-keybase"
import { PocketAAT } from "@pokt-network/aat-js"
import { IKVStore, InMemoryKVStore } from "@pokt-network/pocket-js-storage"
import { TransactionSigner, ITransactionSender, TransactionSender } from "@pokt-network/pocket-js-transactions"
import { HTTPMethod } from "@pokt-network/pocket-js-relayer"
import { Client } from "@pokt-network/pocket-js-rpc-client"
import { Query } from "@pokt-network/pocket-js-query"

/**
 *
 *
 * @class Pocket
 */
export class Pocket {
  public readonly configuration: Configuration
  public readonly keybase: Keybase
  public readonly sessionManager: SessionManager
  private client?: Client
  private query?: Query

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
    this.sessionManager = new SessionManager(dispatchers, configuration, store)
    this.keybase = new Keybase(store)

    if (rpcProvider !== undefined) {
      this.client = new Client(rpcProvider)
      this.query = new Query(rpcProvider)
    }

  }

  /**
   * Returns the Session Manager's routing table dispatcher's count
   * @returns {Number} - Dispatcher's count.
   * @memberof Pocket
   */
  public getDispatchersCount() {
    return this.sessionManager.getDispatchersCount()
  }

  /**
   * Creates a new instance of the RPC Query if you set an IRPCProvider or return the previous existing instance
   * @param {IRPCProvider} rpcProvider - Provider which will be used to reach out to the Pocket Core RPC interface.
   * @returns {RPC} - A RPC object.
   * @memberof Pocket
   */
  public Query(rpcProvider?: IRPCProvider): Query | undefined {
    if (rpcProvider !== undefined) {
      this.query = new Query(rpcProvider)
    }

    if (this.query !== undefined) {
      return this.query
    }
  }

  /**
   * Creates a new instance of the CLient RPC if you set an IRPCProvider or return the previous existing instance
   * @param {IRPCProvider} rpcProvider - Provider which will be used to reach out to send transactions and relays.
   * @returns {RPC} - A RPC object.
   * @memberof Pocket
   */
  public Client(rpcProvider?: IRPCProvider): Client | undefined {
    if (rpcProvider !== undefined) {
      this.client = new Client(rpcProvider)
    }

    if (this.client !== undefined) {
      return this.client
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
        } else if (typeGuard(consensusNodeResponse, Error)) {
          return consensusNodeResponse
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
        const challengeResponse = await this.query!.requestChallenge(challengeRequest)
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
   * @returns {RelayResponse | ConsensusNode | Error} - A Relay Response, Consensus Node for Consensus Relay or an Error.
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
  ): Promise<RelayResponse | ConsensusNode | Error> {
    try {
      // Get the current session
      const currentSessionOrError = await this.sessionManager.getCurrentSession(pocketAAT, blockchain, configuration)

      if (typeGuard(currentSessionOrError, Error)) {
        return currentSessionOrError
      }

      // Set the currentSession; may be refreshed below if the block height is stale
      let currentSession = currentSessionOrError as Session

      // Determine the service node
      const serviceNodeOrError = this.resolveRelayNode(currentSession, consensusEnabled, configuration, node)

      if (typeGuard(serviceNodeOrError, Error)) {
        return serviceNodeOrError
      }

      const serviceNode = serviceNodeOrError as Node

      // Final Service Node check
      if (serviceNode === undefined) {
        return new Error("Could not determine a Service Node to send this relay")
      }

      // Assign session service node to the rpc instance
      const serviceProvider = new HttpRpcProvider(serviceNode.serviceURL)
      const client = new Client(serviceProvider)

      // Create Relay Payload
      const relayPayload = new RelayPayload(data, method, path, headers || null)

      // Check if account is available for signing
      const clientAddressHex = addressFromPublickey(Buffer.from(pocketAAT.clientPublicKey, 'hex')).toString("hex")
      const isUnlocked = await this.keybase.isUnlocked(clientAddressHex)

      if (!isUnlocked) {
        return new Error("Client account " + clientAddressHex + " for this AAT is not unlocked")
      }

      // Produce signature payload
      const relayMeta = new RelayMeta(BigInt(currentSession.sessionHeader.sessionBlockHeight))
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

      // Sign the proof bytes with an unlocked account
      const signatureOrError = await this.keybase.signWithUnlockedAccount(clientAddressHex, proofBytes)

      if (typeGuard(signatureOrError, Error)) {
        return new Error("Error signing Relay proof: " + signatureOrError.message)
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
      const result = await client.relay(
        relay,
        configuration.validateRelayResponses,
        configuration.requestTimeOut,
        configuration.rejectSelfSignedCertificates
      )

      // The following object holds the same information need to create a relay
      // We pass it into the resolveSendRelayResult for the scenario in which the sendRelay is called again
      const relayData = {
        aat: pocketAAT,
        blockchain,
        configuration,
        currentSession,
        data,
        headers,
        method,
        path,
        node,
        consensusEnabled
      }

      return await this.resolveSendRelayResult(result, relayData)
    } catch (error) {
      return error
    }
  }

  /**
   * Resolves the node logic for a sendRelay
   * @param {Session} session - Session object used for the relay.
   * @param {boolean} consensusEnabled - True or false if the relay will be sent to multiple nodes for consensus.
   * @param {Configuration} configuration - Provided configuration object.
   * @param {Node} node - Session node which will receive the Relay.
   * @returns {Node} - .
   * @memberof Pocket
   */
  private resolveRelayNode(session: Session, consensusEnabled: boolean, configuration: Configuration, node?: Node): Node | Error {
    // Check if consensus relay is enabled
    if (consensusEnabled) {
      if (configuration.consensusNodeCount > session.sessionNodes.length) {
        return new Error("Failed to send a consensus relay, number of max consensus nodes is higher thant the actual nodes in current session")
      }
      const serviceNodeOrError = session.getUniqueSessionNode()

      return serviceNodeOrError
    } else {
      // Provide a random service node from the session
      if (node !== undefined) {
        if (session.isNodeInSession(node)) {
          return node as Node
        } else {
          return new Error("Provided Node is not part of the current session for this application, check your PocketAAT")
        }
      } else {
        const serviceNodeOrError = session.getSessionNode()

        return serviceNodeOrError
      }
    }
  }

  /**
   * Resolves the node logic for a sendRelay
   * @param {RelayResponse | RpcError} result - Session object used for the relay.
   * @param {any} relayData - Relay data that holds the information used to send the relay.
   * @returns {RelayResponse | ConsensusNode | Error} - A Relay Response, Consensus Node for Consensus Relay or an Error.
   * @memberof Pocket
   */
  private async resolveSendRelayResult(result: RelayResponse | RpcError, relayData: any): Promise<RelayResponse | ConsensusNode | Error> {
    // Check session out of sync error
    if (typeGuard(result, RpcError)) {
      const rpcError = result as RpcError
      // Refresh the current session if we get this error code
      if (
        rpcError.code === "60" || // InvalidBlockHeightError = errors.New("the block height passed is invalid")
        rpcError.code === "75" ||
        rpcError.code === "14" // OutOfSyncRequestError = errors.New("the request block height is out of sync with the current block height")
      ) {

        // Remove outdated session
        this.sessionManager.destroySession(relayData.pocketAAT, relayData.blockchain)
        let sessionRefreshed = false
        for (
          let retryIndex = 0;
          retryIndex < relayData.configuration.maxSessionRefreshRetries;
          retryIndex++
        ) {
          // Get the current session
          const newSessionOrError = await this.sessionManager.requestCurrentSession(
            relayData.pocketAAT,
            relayData.blockchain,
            relayData.configuration
          )
          if (typeGuard(newSessionOrError, Error)) {
            // If error or same session, don't even retry relay
            continue
          } else if (typeGuard(newSessionOrError, Session)) {
            const newSession = newSessionOrError as Session
            if (newSession.sessionHeader.sessionBlockHeight === relayData.currentSession.sessionHeader.sessionBlockHeight) {
              // If we get the same session skip this attempt
              continue
            }
            relayData.currentSession = newSession as Session
          }
          sessionRefreshed = true
          break
        }

        if (sessionRefreshed) {
          // If a new session is succesfully obtained retry the relay
          // This won't cause an endless loop because the relay will only be retried only if the session was refreshed
          return this.sendRelay(
            relayData.data,
            relayData.blockchain,
            relayData.pocketAAT,
            relayData.configuration,
            relayData.headers,
            relayData.method,
            relayData.path,
            relayData.node,
            relayData.consensusEnabled
          )
        } else {
          return new Error(rpcError.message)
        }
      } else {
        return new Error(rpcError.message)
      }
    } else if (relayData.consensusEnabled && typeGuard(result, RelayResponse)) {
      // Handle consensus
      if (relayData.currentSession.sessionNodes.indexOf(relayData.serviceNode)) {
        relayData.currentSession.sessionNodes[relayData.currentSession.sessionNodes.indexOf(relayData.serviceNode)].alreadyInConsensus = true
      }
      return new ConsensusNode(relayData.serviceNode, false, result)
    } else {
      // Add the used session node to the routing table dispatcher's list
      this.sessionManager.addNewDispatcher(relayData.serviceNode)

      return result
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
      return new TransactionSender(this.client?.rpcProvider!, unlockedAccount)
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
      return new TransactionSender(this.client?.rpcProvider!, (unlockedAccountOrError as UnlockedAccount))
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
      return new TransactionSender(this.client?.rpcProvider!, undefined, txSigner)
    } catch (err) {
      return err
    }
  }
}

export * from "@pokt-network/aat-js"