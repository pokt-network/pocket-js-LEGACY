import { Configuration } from './configuration/configuration';
import { Node } from './models/node'
import { RequestManager } from './request-manager';
import { RelayPayload, RelayHeaders } from './models/input/relay-payload';
import { RelayRequest } from './models/input/relay-request';
import { Proof } from './models/proof';
import { typeGuard } from "./utils/type-guard";
import { RelayResponse } from './models/output/relay-response';
import { SessionManager } from './utils/session-manager';
import { SessionHeader } from './models/input/session-header';
import { QuerySessionBlockResponse } from './models/output/query-session-block-response';
import { RpcErrorResponse } from './models/output/rpc-error-response';
import { Session } from 'inspector';
import { Keybase } from './keybase/keybase';
import { Account } from './models/account';
import { Routing } from './models/routing';

/**
 *
 *
 * @class Pocket
 */
export class Pocket {
  public readonly sessionManager: SessionManager
  public readonly configuration: Configuration
  public readonly routingTable: Routing
  public readonly optionalConfiguration?: Configuration

  /**
   * Creates an instance of Pocket.
   * @param {Object} opts - Options for the initializer, devID, networkName, netIDs, maxNodes, requestTimeOut.
   * @memberof Pocket
   */
  constructor(configuration: Configuration, optionalConfiguration?: Configuration) {
    this.configuration = configuration
    this.optionalConfiguration = optionalConfiguration ?? undefined
    this.sessionManager = new SessionManager()
    this.routingTable = new Routing([], configuration)
  }
  /**
   *
   * Create a Relay
   * @param {String} blockchain - Blockchain hash.
   * @param {String} data - String holding the json rpc call.
   * @param {String} httpMethod - (Optional) HTTP Method.
   * @param {String} path - (Optional) API path.
   * @param {Object} queryParams - (Optional) An object holding the query params.
   * @param {Object} headers - (Optional) An object holding the HTTP Headers.
   * @returns {Relay} - New Relay instance.
   * @memberof Pocket
   */
  public async createRelayRequest(
    data: String,
    blockchain: String,
    headers: RelayHeaders,
    node?: Node,
    useMainConfig = true,
    method = "",
    path = "",
  ): Promise<RelayRequest | RpcErrorResponse> {
    const relayPayload = new RelayPayload(data, method, path, headers)
    let config = this.configuration
    let activeNode

    // Check if using main or optional configuration
    if (!useMainConfig && this.optionalConfiguration != undefined) {
      config = this.optionalConfiguration
    }
    // Check if node is provided or retrieve one
    if (node == undefined) {
      activeNode = this.routingTable.readNodeBy(blockchain)
      if (!typeGuard(activeNode, Node)) {
        return activeNode 
      }
    }
    if (activeNode == undefined) {
      return new RpcErrorResponse("101","Failed to retrieve a node for the relay request.") 
    }
    // Get session block height
    const sessionBlockHeightResponse = await RequestManager.getSessionBlockHeight(activeNode, config)
    if (!typeGuard(sessionBlockHeightResponse, QuerySessionBlockResponse)) {
      return sessionBlockHeightResponse 
    }
    
    // TODO: Add toJSON method to the pocket-aat lib
    // TODO: Proof 1st parameter index value origin pending
    // Create a proof object
    const relayProof = new Proof(BigInt(0), sessionBlockHeightResponse.sessionBlock, activeNode?.address,
      blockchain, JSON.parse(JSON.stringify(config.pocketAAT)), config.pocketAAT.signature)
    // Create relay Request
    const relayRequest = new RelayRequest(relayPayload, relayProof)

    // Check if the relay request is valid
    if (relayRequest.isValid()) {
      return relayRequest
    } else {
      return new RpcErrorResponse("101","Failed to create a Relay: One or more properties are invalid")
    }
  }
  /**
   *
   * Sends a Relay Request
   * @param {RelayRequest} relay - Relay instance with the information.
   * @param {callback} callback - callback handler.
   * @returns {String} - A String with the response.
   * @memberof Pocket
   */
  async sendRelay(relay: RelayRequest, configuration = this.configuration): Promise<RelayResponse | RpcErrorResponse> {
    // Retrieves a session
    const currentSession = await this.retrieveSession(relay.proof.blockchain)
    if (!typeGuard(currentSession, Session)) {
      return currentSession
    }
    const nodes = this.routingTable.filterNodes(relay.proof.blockchain, currentSession.sessionNodes)
    const node = nodes[Math.floor(Math.random() * nodes.length)]
    // Send relay
    const relayResponse = await RequestManager.relay(relay, node, configuration);
    // Return response
    return relayResponse
  }
  //
  // Account management
  //
  /**
   * Import account from the keybase using a passphrase.
   * @param {string} passphrase - Account passphrase.
   * @param {string} privateKey - Account privateKey.
   * @returns {Account} - Account.
   * @memberof Pocket
   */
  public async importAccount(passphrase: string, privateKey: string): Promise<Account | Error> {
    const keybase = new Keybase()
    const importedAccountOrError = await keybase.importAccount(
        Buffer.from(
            privateKey,
            "hex"
        ),
        passphrase
    )
    return importedAccountOrError
  }
  /**
   * Export account to retrieve the private key.
   * @param {Account} blockchain - Account object.
   * @param {string} passphrase - Account passphrase.
   * @returns {Buffer} - Private Key buffer.
   * @memberof Pocket
   */
  public async exportAccount(account: Account, passphrase: string): Promise<Buffer | Error> {
    const keybase = new Keybase()

    // Export the private key
    const privateKey = await keybase.exportAccount(
        account.addressHex,
        passphrase
    )
    // Check if is type Buffer
    if (!typeGuard(privateKey, Buffer)) {
      return privateKey
    }
    // Check private key length
    if (privateKey.length == 64) {
      return privateKey
    } else {
      return new Error("Failed to export account")
    }
  }
  /**
   * Creates a new session.
   * @param {String} blockchain - Blockchain hash
   * @returns {Relay} - New Relay instance.
   * @memberof Pocket
   */
  private async createSession(blockchain: String): Promise< Session | RpcErrorResponse> {
    let node: Node | RpcErrorResponse

    if (this.routingTable.nodes.length !== 0) {
      // Load and initial node list to create session
      node = this.routingTable.readNodeBy(blockchain)
    } else {
      return new RpcErrorResponse("101", "Failed to load the initial local node list")
    }
    // If failed to read a node return error
    if (typeGuard(node, RpcErrorResponse)) {
      return node
    }
    // Retrieve the session block height
    const sessionBlockHeightResponse = await RequestManager.getSessionBlockHeight(node, this.configuration)
    if (!typeGuard(sessionBlockHeightResponse, QuerySessionBlockResponse)) {
      return sessionBlockHeightResponse 
    }
    // Create session header
    const header = new SessionHeader(this.configuration.pocketAAT.applicationPublicKey, blockchain, 
      sessionBlockHeightResponse.sessionBlock)
    // Create the session
    const session = await this.sessionManager.createSession(header, node, this.configuration)
    if (!typeGuard(session, Session)) {
      return session
    } else {
      return new RpcErrorResponse("101", session)
    }
  }
  /**
   * Retrieves a current session or creates a new one
   * @param {String} blockchain - Blockchain hash.
   * @returns {Session} - Current or new session.
   * @memberof Pocket
   */
  private async retrieveSession(blockchain: String): Promise< Session | RpcErrorResponse>{
    let currentSession = SessionManager.getSession()
    if (!typeGuard(currentSession, Session)) {
      currentSession = await this.createSession(blockchain)
      return currentSession
    }
    return currentSession
  }
}
