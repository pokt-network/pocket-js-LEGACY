import { Configuration } from "./config"
import { RelayPayload, RelayHeaders, RelayRequest, RelayProof, RelayResponse, Session, DispatchResponse } from "./rpc/models"
import { addressFromPublickey, validatePrivateKey, publicKeyFromPrivate, typeGuard } from "./utils"
import { SessionManager } from "./session/session-manager"
import { Node, RPC, IRPCProvider, RpcError, HttpRpcProvider } from "./rpc"
import { Keybase } from "./keybase/keybase"
import { UnlockedAccount, Account } from "./keybase/models"
import { PocketAAT } from "@pokt-network/aat-js"
import { TransactionSigner, ITransactionSender, InMemoryKVStore, IKVStore, TransactionSender } from "./"
import { ConsensusRelayResponse } from "./rpc/models/output/consensus-relay-response"
import { ConsensusNode } from "./rpc/models/consensus-node"
import { RequestHash } from "./rpc/models/input/request-hash"
import { ChallengeRequest } from "./rpc/models/input/challenge-request"
import { ChallengeResponse } from "./rpc/models/output/challenge-response"
import { RelayMeta } from "./rpc/models/input/relay-meta"
import { BaseProfiler } from "./utils/base-profiler"
import { ProfileResult } from "./utils/models/profile-result"
import { NoOpProfiler } from "./utils/no-op-profiler"

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
  private innerRpc?: RPC
  private profiler: BaseProfiler

  /**
   * Creates an instance of Pocket.
   * @param {URL} dispatchers - Array holding the initial dispatcher url(s).
   * @param {IRPCProvider} rpcProvider - Provider which will be used to reach out to the Pocket Core RPC interface.
   * @param {Configuration} configuration - Configuration object.
   * @param {IKVStore} store - Save data using a Key/Value relationship. This object save information in memory.
   * @param {BaseProfiler} profiler - BaseProfiler implementation for metrics, defaults to an empty NoOpProfiler.
   * @memberof Pocket
   */
  constructor(
    dispatchers: URL[],
    rpcProvider?: IRPCProvider,
    configuration: Configuration = new Configuration(),
    store: IKVStore = new InMemoryKVStore(),
    profiler: BaseProfiler = new NoOpProfiler()
  ) {
    this.configuration = configuration
    this.sessionManager = new SessionManager(dispatchers, configuration, store)
    this.keybase = new Keybase(store)
    this.profiler = profiler

    if (rpcProvider !== undefined) {
      this.innerRpc = new RPC(rpcProvider)
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
  ): Promise<ConsensusRelayResponse | ChallengeResponse | RpcError> {
    const consensusNodes: ConsensusNode[] = []
    let firstResponse: RelayResponse | undefined

    try {
      // Checks if max consensus nodes count is 0, meaning it wasn't configured for local concensus.
      if (this.configuration.consensusNodeCount === 0) {
        return new RpcError("NA","Failed to send a relay with local consensus, configuration consensusNodeCount is 0")
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
        return new RpcError("NA", "Failed to send a relay with local consensus, no responses.")
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
        const challengeResponseOrError = await this.rpc()!.query.requestChallenge(challengeRequest)
        // Return a challenge response
        if (typeGuard(challengeResponseOrError, ChallengeResponse)) {
          return challengeResponseOrError
        }
        return challengeResponseOrError
      } else {
        return new RpcError("NA", "Failed to send a consensus relay due to false consensus result, not acepting disputed responses without proper majority and minority responses.")
      }
    } catch (err) {
      return RpcError.fromError(err)
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
    consensusEnabled: boolean = false,
    requestID = "",
  ): Promise<RelayResponse | ConsensusNode | RpcError> {
    try {
      const profileResults: ProfileResult[] = []
      const functionName = "send_relay"

      // Profiler
      let profileResult = new ProfileResult("get_current_session")
      // Get the current session
      const currentSessionOrError = await this.sessionManager.getCurrentSession(pocketAAT, blockchain, configuration)
      profileResult.save()
      profileResults.push(profileResult)
      if (typeGuard(currentSessionOrError, Error)) {
        return RpcError.fromError(currentSessionOrError)
      }

      // Set the currentSession; may be refreshed below if the block height is stale
      let currentSession = currentSessionOrError as Session

      // Determine the service node
      let serviceNode: Node
      // Check if consensus relay is enabled
      if (consensusEnabled) {
        if (this.configuration.consensusNodeCount > currentSession.sessionNodes.length) {
          return new RpcError("NA", "Failed to send a consensus relay, number of max consensus nodes is higher thant the actual nodes in current session")
        }
        // Profiler
        profileResult = new ProfileResult("get_unique_session_node")
        const serviceNodeOrError = currentSession.getUniqueSessionNode()
        profileResult.save()
        profileResults.push(profileResult)
        if (typeGuard(serviceNodeOrError, Error)) {
          return RpcError.fromError(serviceNodeOrError)
        }
        serviceNode = serviceNodeOrError as Node
      }else {
        // Provide a random service node from the session
        if (node !== undefined) {
          if (currentSession.isNodeInSession(node)) {
            serviceNode = node as Node
          } else {
            return new RpcError("NA", "Provided Node is not part of the current session for this application, check your PocketAAT")
          }
        } else {
          // Profiler
          profileResult = new ProfileResult("get_session_node")
          const serviceNodeOrError = currentSession.getSessionNode()
          profileResult.save()
          profileResults.push(profileResult)
          if (typeGuard(serviceNodeOrError, Error)) {
            return RpcError.fromError(serviceNodeOrError)
          }
          serviceNode = serviceNodeOrError as Node
        }
      }

      // Final Service Node check
      if (serviceNode === undefined) {
        return new RpcError("NA", "Could not determine a Service Node to submit this relay")
      }
      
      // Assign session service node to the rpc instance
      const serviceProvider = new HttpRpcProvider(serviceNode.serviceURL)
      const rpc = new RPC(serviceProvider)

      // Create Relay Payload
      const relayPayload = new RelayPayload(data, method, path, headers || null)

      // Profiler
      profileResult = new ProfileResult("address_from_public_key")
      // Check if account is available for signing
      const clientAddressHex = addressFromPublickey(Buffer.from(pocketAAT.clientPublicKey, 'hex')).toString("hex")
      profileResult.save()
      profileResults.push(profileResult)
      // Profiler
      profileResult = new ProfileResult("keybase_is_unlocked")
      const isUnlocked = await this.keybase.isUnlocked(clientAddressHex)
      profileResult.save()
      profileResults.push(profileResult)
      if (!isUnlocked) {
        return new RpcError("NA", "Client account " + clientAddressHex + " for this AAT is not unlocked")
      }

      // Produce signature payload
      const relayMeta = new RelayMeta(BigInt(currentSession.sessionHeader.sessionBlockHeight))
      const requestHash = new RequestHash(relayPayload, relayMeta)
      const entropy = BigInt(Math.floor(Math.random() * 99999999999999999))
      // Profiler
      profileResult = new ProfileResult("relay_proof_bytes")
      const proofBytes = RelayProof.bytes(
        entropy,
        currentSession.sessionHeader.sessionBlockHeight,
        serviceNode.publicKey,
        blockchain,
        pocketAAT,
        requestHash
      )
      profileResult.save()
      profileResults.push(profileResult)
      // Profiler
      profileResult = new ProfileResult("sign_with_unlocked_account")
      // Sign
      const signatureOrError = await this.keybase.signWithUnlockedAccount(clientAddressHex, proofBytes)
      profileResult.save()
      profileResults.push(profileResult)
      if (typeGuard(signatureOrError, Error)) {
        await this.profiler.flushResults({ requestID, blockchain }, functionName, profileResults)
        return new RpcError("NA", "Error signing Relay proof: "+signatureOrError.message)
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

      // Profiler
      profileResult = new ProfileResult("rpc_client_relay")
      // Send relay
      const result = await rpc.client.relay(
        relay,
        configuration.validateRelayResponses,
        configuration.requestTimeOut,
        configuration.rejectSelfSignedCertificates
      )
      profileResult.save()
      profileResults.push(profileResult)
      // Check session out of sync error
      if (typeGuard(result, RpcError)) {
        const rpcError = result as RpcError
        // Ask for dispatch
        // Refresh the current session if we get this error code
        if (
          rpcError.code === "60" || // InvalidBlockHeightError = errors.New("the block height passed is invalid")
          rpcError.code === "75" || // OutOfSyncRequestError = errors.New("the request block height is out of sync with the current block height")
          rpcError.code === "14" 
        ) {
          // Profiler
          profileResult = new ProfileResult("destroy_session")
          // Remove outdated session
          this.sessionManager.destroySession(pocketAAT, blockchain)
          profileResult.save()
          profileResults.push(profileResult)
          let sessionRefreshed = false
          for (
            let retryIndex = 0;
            retryIndex < configuration.maxSessionRefreshRetries;
            retryIndex++
          ) {
            // Update the current session if is available from the network error response
            if ( rpcError.session !== undefined) {
              // Profiler
              profileResult = new ProfileResult("update_current_session")
              const newSessionOrError = await this.sessionManager.updateCurrentSession(
                rpcError.session,
                pocketAAT,
                blockchain,
                configuration
              )
              profileResult.save()
              profileResults.push(profileResult)
              if (typeGuard(newSessionOrError, Error)) {
                // If error or same session, don't even retry relay
                continue
              } else if (typeGuard(newSessionOrError, Session)) {
                const newSession = newSessionOrError as Session
                if (newSession.sessionHeader.sessionBlockHeight === currentSession.sessionHeader.sessionBlockHeight) {
                  // If we get the same session skip this attempt
                  continue
                }
                currentSession = newSession as Session
              }
              sessionRefreshed = true
              break
            } else {
              profileResult = new ProfileResult("request_new_session")
              const newSessionOrError = await this.sessionManager.requestNewSession(
                pocketAAT,
                blockchain,
                configuration
              )
              profileResult.save()
              profileResults.push(profileResult)
              if (typeGuard(newSessionOrError, Error)) {
                // If error or same session, don't even retry relay
                continue
              } else if (typeGuard(newSessionOrError, Session)) {
                const newSession = newSessionOrError as Session
                if (newSession.sessionHeader.sessionBlockHeight === currentSession.sessionHeader.sessionBlockHeight) {
                  // If we get the same session skip this attempt
                  continue
                }
                currentSession = newSession as Session
              }
              sessionRefreshed = true
              break
            }
          }

          if (sessionRefreshed) {
            // Profiler
            profileResult = new ProfileResult("session_refreshed_send_relay")
            // If a new session is succesfully obtained retry the relay
            // This won't cause an endless loop because the relay will only be retried only if the session was refreshed
            const refreshedRelay = await this.sendRelay(
              data,
              blockchain,
              pocketAAT,
              configuration,
              headers,
              method,
              path,
              node,
              consensusEnabled,
              requestID
            )
            profileResult.save()
            profileResults.push(profileResult)
            await this.profiler.flushResults({ requestID, blockchain }, functionName, profileResults)
            return refreshedRelay
          } else {
            await this.profiler.flushResults({ requestID, blockchain }, functionName, profileResults)
            return new RpcError(rpcError.code, rpcError.message, undefined, serviceNode.publicKey)
          }
        } else {
          await this.profiler.flushResults({ requestID, blockchain }, functionName, profileResults)
          return new RpcError(rpcError.code, rpcError.message, undefined, serviceNode.publicKey)
        }
      } else if (consensusEnabled && typeGuard(result, RelayResponse)) {
        // Handle consensus
        if (currentSession.sessionNodes.indexOf(serviceNode)) {
          currentSession.sessionNodes[currentSession.sessionNodes.indexOf(serviceNode)].alreadyInConsensus = true
        }
        return new ConsensusNode(serviceNode, false, result)
      } else {
        // Profiler
        profileResult = new ProfileResult("add_new_dispatcher")
        // Add the used session node to the routing table dispatcher's list
        this.sessionManager.addNewDispatcher(serviceNode)
        profileResult.save()
        await this.profiler.flushResults({ requestID, blockchain }, functionName, profileResults)
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
