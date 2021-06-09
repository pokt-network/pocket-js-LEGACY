import { typeGuard, addressFromPublickey, RpcError } from "@pokt-network/pocket-js-utils";
import { Configuration } from "@pokt-network/pocket-js-configuration";
import { PocketAAT } from "@pokt-network/aat-js";
import {
  RelayHeaders,
  RelayResponse,
  RelayPayload,
  RelayMeta,
  RequestHash,
  RelayProof,
  RelayRequest
} from "@pokt-network/pocket-js-relay-models";
import { ConsensusNode, Session, Node, ConsensusRelayResponse, ChallengeResponse, ChallengeRequest, V1RPCRoutes } from "@pokt-network/pocket-js-rpc-models";
import { HTTPMethod } from "./utils/http-method";
import { SessionManager } from "@pokt-network/pocket-js-session-manager";
import { Keybase } from "@pokt-network/pocket-js-keybase";
import { IKVStore, InMemoryKVStore } from "@pokt-network/pocket-js-storage";
import { Client } from "@pokt-network/pocket-js-rpc-client"
import { HttpRpcProvider } from "@pokt-network/pocket-js-http-provider"

/**
 * @author Pabel Nunez <pabel@pokt.network>
 * @description The Relayer class focuses on sending relays to the network.
 */
export class Relayer {
  public readonly configuration: Configuration;
  public readonly keybase: Keybase;
  public readonly sessionManager: SessionManager;

  /**
   * @description Constructor for the Relayer class
   * @param {Configuration} configuration - Configuration object for the relayer.
   * @memberof Relayer
   */
  constructor(
    dispatchers: URL[],
    configuration: Configuration = new Configuration(),
    store: IKVStore = new InMemoryKVStore()
  ) {
    if (dispatchers.length <= 0) {
      throw new Error("Failed to instantiate the Relayer due to no dispatcher provided.")
    }
    this.configuration = configuration;
    this.sessionManager = new SessionManager(dispatchers, configuration, store);
    this.keybase = new Keybase(store);
  }

  /**
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
   * @memberof Relayer
   */
  public async send(
    data: string,
    blockchain: string,
    pocketAAT: PocketAAT,
    headers?: RelayHeaders,
    method: HTTPMethod = HTTPMethod.NA,
    path = "",
    node?: Node,
    consensusEnabled: boolean = false
  ): Promise<RelayResponse | ConsensusNode | RpcError> {
    try {
      // Get the current session
      const currentSessionOrError = await this.sessionManager.getCurrentSession(
        pocketAAT,
        blockchain,
        this.configuration
      );

      if (typeGuard(currentSessionOrError, Error)) {
        return RpcError.fromError(currentSessionOrError);
      }

      // Set the currentSession; may be refreshed below if the block height is stale
      let currentSession = currentSessionOrError as Session;

      // Determine the service node
      const serviceNodeOrError = this.resolveRelayNode(
        currentSession,
        consensusEnabled,
        this.configuration,
        node
      );

      if (typeGuard(serviceNodeOrError, Error)) {
        return RpcError.fromError(serviceNodeOrError);
      }

      const serviceNode = serviceNodeOrError as Node;

      // Final Service Node check
      if (serviceNode === undefined) {
        return new RpcError("NA", "Could not determine a Service Node to submit this relay")
      }

      // Assign session service node to the rpc instance
      const client = new Client(serviceNode.serviceURL);

      // Create Relay Payload
      const relayPayload = new RelayPayload(
        data,
        method,
        path,
        headers || null
      );

      // Check if account is available for signing
      const clientAddressHex = addressFromPublickey(Buffer.from(pocketAAT.clientPublicKey, 'hex')).toString("hex")
      const isUnlocked = await this.keybase.isUnlocked(clientAddressHex);

      if (!isUnlocked) {
        return new RpcError("NA", "Client account " + clientAddressHex + " for this AAT is not unlocked")
      }

      // Produce signature payload
      const relayMeta = new RelayMeta(
        BigInt(currentSession.sessionHeader.sessionBlockHeight)
      );
      const requestHash = new RequestHash(relayPayload, relayMeta);
      const entropy = BigInt(Math.floor(Math.random() * 99999999999999999));
      
      const proofBytes = RelayProof.bytes(
        entropy,
        currentSession.sessionHeader.sessionBlockHeight,
        serviceNode.publicKey,
        blockchain,
        pocketAAT,
        requestHash
      );

      // Sign the proof bytes with an unlocked account
      const signatureOrError = await this.keybase.signWithUnlockedAccount(
        clientAddressHex,
        proofBytes
      );

      if (typeGuard(signatureOrError, Error)) {
        return new RpcError("NA", "Error signing Relay proof: "+signatureOrError.message)
      }

      const signature = signatureOrError as Buffer;
      const signatureHex = signature.toString("hex");

      // Produce RelayProof
      const relayProof = new RelayProof(
        entropy,
        currentSession.sessionHeader.sessionBlockHeight,
        serviceNode.publicKey,
        blockchain,
        pocketAAT,
        signatureHex,
        requestHash
      );

      // Relay to be sent
      const relay = new RelayRequest(relayPayload, relayMeta, relayProof);

      // Send relay
      const result = await client.relay(
        relay,
        this.configuration.validateRelayResponses,
        this.configuration.requestTimeOut,
        this.configuration.rejectSelfSignedCertificates
      );

      // The following object holds the same information needed to create a relay
      // We pass it into the resolveSendRelayResult for the scenario in which the sendRelay is called again
      const relayData = {
        aat: pocketAAT,
        blockchain,
        configuration: this.configuration,
        currentSession,
        data,
        headers,
        method,
        path,
        serviceNode,
        consensusEnabled,
      };

      return await this.resolveSendRelayResult(result, relayData);
    } catch (error) {
      return error;
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
        const consensusNodeResponse = await this.send(data, blockchain, pocketAAT, headers || undefined, method, path, node, true)
        // Check if ConsensusNode type
        if (typeGuard(consensusNodeResponse, ConsensusNode)) {
          // Save the first response
          if (index === 0) {
            firstResponse = consensusNodeResponse.relayResponse
          }
          consensusNodes.push(consensusNodeResponse)
        } else if (typeGuard(consensusNodeResponse, Error)) {
          return RpcError.fromError(consensusNodeResponse)
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
        
        // Use one node from relay response to send the request challenge
        const consensusNode = consensusRelayResponse.consensusNodes[Math.floor(Math.random() * consensusRelayResponse.consensusNodes.length)]
        // Send the challenge request
        const challengeResponseOrError = await this.requestChallenge(challengeRequest, consensusNode.node)
        // Return a challenge response
        return challengeResponseOrError;
      } else {
        return new RpcError("NA", "Failed to send a consensus relay due to false consensus result, not acepting disputed responses without proper majority and minority responses.")
      }
    } catch (err) {
      return RpcError.fromError(err);
    }
  }
  
  /**
   *
   * Retrieves a ChallengeResponse object.
   * @param {ChallengeRequest} request - The ChallengeRequest
   * @param {Node} node - Service node that will receive the challenge request
   * @param {number} timeout - (Optional) Request timeout, default should be 60000.
   * @param {boolean} rejectSelfSignedCertificates - (Optional) Force certificates to come from CAs, default should be true.
   * @returns {Promise<ChallengeResponse | RpcError>} - A QueryBlockResponse object or Rpc error
   * @memberof Relayer
   */
   public async requestChallenge(
    request: ChallengeRequest,
    node: Node,
    timeout: number = 60000, 
    rejectSelfSignedCertificates: boolean = true
  ): Promise<ChallengeResponse | RpcError> {
    try {
        const payload = JSON.stringify(request.toJSON())
        const provider = new HttpRpcProvider(node.serviceURL)

        const response = await provider.send(
            V1RPCRoutes.ClientChallenge.toString(),
            payload,
            timeout, 
            rejectSelfSignedCertificates
        )

        // Check if response is an error
        if (!typeGuard(response, RpcError)) {
            const challengeResponse = ChallengeResponse.fromJSON(
                response
            )
            return challengeResponse
        } else {
            return new RpcError(
                response.code,
                "Failed to send the request challenge: " + response.message
            )
        }
    } catch (err) {
        return new RpcError("0", err)
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
    }else {
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
   * @returns {RelayResponse | ConsensusNode | RpcError} - A Relay Response, Consensus Node for Consensus Relay or an RpcError.
   * @memberof Pocket
   */
  private async resolveSendRelayResult(
    result: RelayResponse | RpcError,
    relayData: any
  ): Promise<RelayResponse | ConsensusNode | RpcError> {
    // Check session out of sync error
    if (typeGuard(result, RpcError)) {
      const rpcError = result as RpcError;
      // Refresh the current session if we get this error code
      if (
        rpcError.code === "60" || // InvalidBlockHeightError = errors.New("the block height passed is invalid")
        rpcError.code === "75" ||
        rpcError.code === "14" // OutOfSyncRequestError = errors.New("the request block height is out of sync with the current block height")
      ) {
        // Remove outdated session
        this.sessionManager.destroySession(
          relayData.aat,
          relayData.blockchain
        );
        let sessionRefreshed = false;
        for (
          let retryIndex = 0;
          retryIndex < relayData.configuration.maxSessionRefreshRetries;
          retryIndex++
        ) {
          // Update the current session if is available from the network error response
          if ( rpcError.session !== undefined) {
            // Profiler
            const newSessionOrError = await this.sessionManager.updateCurrentSession(
              rpcError.session,
              relayData.aat,
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
          } else {
            const newSessionOrError = await this.sessionManager.requestNewSession(
              relayData.aat,
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
        }

        if (sessionRefreshed) {
          // If a new session is succesfully obtained retry the relay
          // This won't cause an endless loop because the relay will only be retried only if the session was refreshed
          const refreshedRelay = await this.send(
            relayData.data,
            relayData.blockchain,
            relayData.aat,
            relayData.headers,
            relayData.method,
            relayData.path,
            relayData.serviceNode,
            relayData.consensusEnabled
          );

          return refreshedRelay;
        } else {
          return new RpcError(rpcError.code, rpcError.message, undefined, relayData.serviceNode.publicKey);
        }
      } else {
        return new RpcError(rpcError.code, rpcError.message, undefined, relayData.serviceNode.publicKey);
      }
    } else if (relayData.consensusEnabled && typeGuard(result, RelayResponse)) {
      // Handle consensus
      if (
        relayData.currentSession.sessionNodes.indexOf(relayData.serviceNode)
      ) {
        relayData.currentSession.sessionNodes[
          relayData.currentSession.sessionNodes.indexOf(relayData.serviceNode)
        ].alreadyInConsensus = true;
      }
      return new ConsensusNode(relayData.serviceNode, false, result);
    } else {
      // Add the used session node to the routing table dispatcher's list
      this.sessionManager.addNewDispatcher(relayData.serviceNode);

      return result;
    }
  }
}
