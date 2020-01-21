import { Configuration } from "./configuration/configuration"
import { Node } from "./models/node"
import { RequestManager } from "./request-manager"
import { RelayPayload, RelayHeaders } from "./models/input/relay-payload"
import { RelayRequest } from "./models/input/relay-request"
import { Proof } from "./models/proof"
import { typeGuard } from "./utils/type-guard"
import { RelayResponse } from "./models/output/relay-response"
import { SessionManager } from "./utils/session-manager"
import { SessionHeader } from "./models/input/session-header"
import { QuerySessionBlockResponse } from "./models/output/query-session-block-response"
import { RpcErrorResponse } from "./models/output/rpc-error-response"
import { Session } from "./models/output/session"
import { Keybase } from "./keybase/keybase"
import { Account } from "./models/account"
import { Routing } from "./models/routing"
import { QueryBlockResponse } from "./models/output/query-block-response"
import { QueryTXResponse } from "./models/output/query-tx-response"
import { QueryHeightResponse } from "./models/output/query-height-response"
import { QueryBalanceResponse } from "./models/output/query-balance-response"
import { StakingStatus } from "./utils/enums"
import { QueryNodesResponse } from "./models/output/query-nodes-response"
import { QueryNodeResponse } from "./models/output/query-node-response"
import { QueryNodeParamsResponse } from "./models/output/query-node-params-response"
import { QueryNodeProofsResponse } from "./models/output/query-node-proofs-response"
import { NodeProof } from "./models/input/node-proof"
import { QueryNodeProofResponse } from "./models/output/query-node-proof-response"
import { QueryAppsResponse } from "./models/output/query-apps-response"
import { QueryAppResponse } from "./models/output/query-app-response"
import { QueryAppParamsResponse } from "./models/output/query-app-params-response"
import { QueryPocketParamsResponse } from "./models/output/query-pocket-params-response"
import { QuerySupportedChainsResponse } from "./models/output/query-supported-chains-response"
import { QuerySupplyResponse } from "./models/output/query-supply-response"

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
  constructor(
    configuration: Configuration,
    optionalConfiguration?: Configuration
  ) {
    this.configuration = configuration
    this.optionalConfiguration = optionalConfiguration ?? undefined
    this.routingTable = new Routing([], configuration)
    this.sessionManager = new SessionManager(this.routingTable)
  }
  /**
   *
   * Create a Relay
   * @param {string} blockchain - Blockchain hash.
   * @param {string} data - string holding the json rpc call.
   * @param {string} httpMethod - (Optional) HTTP Method.
   * @param {string} path - (Optional) API path.
   * @param {Object} queryParams - (Optional) An object holding the query params.
   * @param {Object} headers - (Optional) An object holding the HTTP Headers.
   * @returns {Relay} - New Relay instance.
   * @memberof Pocket
   */
  public async createRelayRequest(
    data: string,
    blockchain: string,
    headers: RelayHeaders,
    node?: Node,
    useMainConfig = true,
    method = "",
    path = ""
  ): Promise<RelayRequest | RpcErrorResponse> {
    const relayPayload = new RelayPayload(data, method, path, headers)
    let config = this.configuration
    let activeNode

    // Check if using main or optional configuration
    if (!useMainConfig && this.optionalConfiguration !== undefined) {
      config = this.optionalConfiguration
    }
    // Check if node is provided or retrieve one
    if (node === undefined) {
      activeNode = this.routingTable.readNodeBy(blockchain)
      if (!typeGuard(activeNode, Node)) {
        return activeNode
      }
    }
    if (activeNode === undefined) {
      return new RpcErrorResponse(
        "101",
        "Failed to retrieve a node for the relay request."
      )
    }
    // Get session block height
    const sessionBlockHeightResponse = await RequestManager.getSessionBlockHeight(
      activeNode,
      config
    )
    if (!typeGuard(sessionBlockHeightResponse, QuerySessionBlockResponse)) {
      return sessionBlockHeightResponse
    }

    // TODO: Add toJSON method to the pocket-aat lib
    // TODO: Proof 1st parameter index value origin pending
    // Create a proof object
    const relayProof = new Proof(
      BigInt(0),
      sessionBlockHeightResponse.sessionBlock,
      activeNode?.address,
      blockchain,
      JSON.parse(JSON.stringify(config.pocketAAT)),
      config.pocketAAT.signature
    )
    // Create relay Request
    const relayRequest = new RelayRequest(relayPayload, relayProof)

    // Check if the relay request is valid
    if (relayRequest.isValid()) {
      return relayRequest
    } else {
      return new RpcErrorResponse(
        "101",
        "Failed to create a Relay: One or more properties are invalid"
      )
    }
  }
  /**
   *
   * Sends a Relay Request
   * @param {RelayRequest} relay - Relay instance with the information.
   * @param {callback} callback - callback handler.
   * @returns {string} - A string with the response.
   * @memberof Pocket
   */
  public async sendRelay(
    relay: RelayRequest,
    configuration = this.configuration
  ): Promise<RelayResponse | RpcErrorResponse> {
    // Retrieves a session
    const currentSession = await this.retrieveSession(relay.proof.blockchain)
    if (!typeGuard(currentSession, Session)) {
      return currentSession
    }
    const nodes = this.routingTable.filterNodes(
      relay.proof.blockchain,
      currentSession.sessionNodes
    )
    const node = nodes[Math.floor(Math.random() * nodes.length)]
    // Send relay
    const relayResponse = await RequestManager.relay(
      relay,
      node,
      configuration
    )
    // Return response
    return relayResponse
  }

  //
  // RPC Calls
  //

  /**
   *
   * Query a Session Block Height
   * @param {Node} node - Node that will receive the relay.
   * @param {Configuration} configuration - Configuration object containing preferences information.s
   * @memberof Pocket
   */
  public async getSessionBlockHeight(
    useDefaultConfig = true
  ): Promise<BigInt | RpcErrorResponse> {
    const node = this.getAnyNode()
    let config = this.configuration
    // Check which configuration is being used
    if (!useDefaultConfig && this.optionalConfiguration !== undefined) {
      config = this.optionalConfiguration
    }
    // Check if node is Node.type
    if (!typeGuard(node, Node)) {
      return node
    }
    // Retrieve the session block height
    const sessionBlockHeightResponse = await RequestManager.getSessionBlockHeight(
      node,
      config
    )

    if (!typeGuard(sessionBlockHeightResponse, QuerySessionBlockResponse)) {
      return sessionBlockHeightResponse
    }
    return sessionBlockHeightResponse.sessionBlock
  }
  /**
   *
   * Query a Block information
   * @param {BigInt} blockHeight - Block's number.
   * @param {Node} node - Node that will receive the relay.
   * @param {Configuration} configuration - Configuration object containing preferences information.
   * @memberof RequestManager
   */
  public async getBlock(
    blockHeight: BigInt,
    useDefaultConfig = true
  ): Promise<QueryBlockResponse | RpcErrorResponse> {
    const node = this.getAnyNode()
    let config = this.configuration
    // Check which configuration is being used
    if (!useDefaultConfig && this.optionalConfiguration !== undefined) {
      config = this.optionalConfiguration
    }
    // Check if node is Node.type
    if (!typeGuard(node, Node)) {
      return node
    }
    // Retrieve the block information
    const blockHeightResponse = await RequestManager.getBlock(
      blockHeight,
      node,
      config
    )

    if (!typeGuard(blockHeightResponse, QueryBlockResponse)) {
      return blockHeightResponse
    }
    return blockHeightResponse
  }
  /**
   *
   * Retrieves a transaction information
   * @param {string} txHash - Transaction hash.
   * @param {Node} node - Node that will receive the relay.
   * @param {Configuration} configuration - Configuration object containing preferences information.
   * @memberof Pocket
   */
  public async getTX(
    txHash: string,
    useDefaultConfig = true
  ): Promise<QueryTXResponse | RpcErrorResponse> {
    const node = this.getAnyNode()
    let config = this.configuration
    // Check which configuration is being used
    if (!useDefaultConfig && this.optionalConfiguration !== undefined) {
      config = this.optionalConfiguration
    }
    // Check if node is Node.type
    if (!typeGuard(node, Node)) {
      return node
    }
    // Retrieve the transaction by hash
    const txResponse = await RequestManager.getTX(txHash, node, config)

    if (!typeGuard(txResponse, QueryTXResponse)) {
      return txResponse
    }
    return txResponse
  }
  /**
   *
   * Get the current network block height
   * @param {Node} node - Node that will receive the relay.
   * @param {Configuration} configuration - Configuration object containing preferences information.
   * @memberof RequestManager
   */
  public async getHeight(
    useDefaultConfig = true
  ): Promise<QueryHeightResponse | RpcErrorResponse> {
    const node = this.getAnyNode()
    let config = this.configuration
    // Check which configuration is being used
    if (!useDefaultConfig && this.optionalConfiguration !== undefined) {
      config = this.optionalConfiguration
    }
    // Check if node is Node.type
    if (!typeGuard(node, Node)) {
      return node
    }
    // Retrieve the current block height
    const txResponse = await RequestManager.getHeight(node, config)

    if (!typeGuard(txResponse, QueryTXResponse)) {
      return txResponse
    }
    return txResponse
  }
  /**
   *
   * Retrieves an account balance
   * @param {string} address - Account's address.
   * @param {BigInt} blockHeight - Block's number.
   * @param {Node} node - Node that will receive the relay.
   * @param {Configuration} configuration - Configuration object containing preferences information.
   * @memberof Pocket
   */
  public async getBalance(
    address: string,
    blockHeight: BigInt,
    useDefaultConfig = true
  ): Promise<QueryBalanceResponse | RpcErrorResponse> {
    const node = this.getAnyNode()
    let config = this.configuration
    // Check which configuration is being used
    if (!useDefaultConfig && this.optionalConfiguration !== undefined) {
      config = this.optionalConfiguration
    }
    // Check if node is Node.type
    if (!typeGuard(node, Node)) {
      return node
    }
    // Retrieve the address current balance
    const balanceResponse = await RequestManager.getBalance(
      address,
      blockHeight,
      node,
      config
    )

    if (!typeGuard(balanceResponse, QueryBalanceResponse)) {
      return balanceResponse
    }
    return balanceResponse
  }
  /**
   *
   * Retrieves a list of nodes
   * @param {StakingStatus} stakingStatus - Staking status.
   * @param {BigInt} blockHeight - Block's number.
   * @param {Node} node - Node that will receive the relay.
   * @param {Configuration} configuration - Configuration object containing preferences information.
   * @memberof RequestManager
   */
  public async getNodes(
    stakingStatus: StakingStatus,
    blockHeight: BigInt,
    useDefaultConfig = true
  ): Promise<QueryNodesResponse | RpcErrorResponse> {
    const node = this.getAnyNode()
    let config = this.configuration
    // Check which configuration is being used
    if (!useDefaultConfig && this.optionalConfiguration !== undefined) {
      config = this.optionalConfiguration
    }
    // Check if node is Node.type
    if (!typeGuard(node, Node)) {
      return node
    }
    // Retrieve a list of nodes
    const nodesResponse = await RequestManager.getNodes(
      stakingStatus,
      blockHeight,
      node,
      config
    )

    if (!typeGuard(nodesResponse, QueryNodesResponse)) {
      return nodesResponse
    }
    return nodesResponse
  }
  /**
   *
   * Query a Node information
   * @param {string} address - Node address.
   * @param {BigInt} blockHeight - Block's number.
   * @param {Node} node - Node that will receive the relay.
   * @param {Configuration} configuration - Configuration object containing preferences information.
   * @memberof Pocket
   */
  public async getNode(
    address: string,
    blockHeight: BigInt,
    useDefaultConfig = true
  ): Promise<QueryNodeResponse | RpcErrorResponse> {
    const node = this.getAnyNode()
    let config = this.configuration
    // Check which configuration is being used
    if (!useDefaultConfig && this.optionalConfiguration !== undefined) {
      config = this.optionalConfiguration
    }
    // Check if node is Node.type
    if (!typeGuard(node, Node)) {
      return node
    }
    // Retrieve a node information
    const nodeResponse = await RequestManager.getNode(
      address,
      blockHeight,
      node,
      config
    )

    if (!typeGuard(nodeResponse, QueryNodeResponse)) {
      return nodeResponse
    }
    return nodeResponse
  }
  /**
   *
   * Retrieves the node params
   * @param {BigInt} blockHeight - Block's number.
   * @param {Node} node - Node that will receive the relay.
   * @param {Configuration} configuration - Configuration object containing preferences information.
   * @memberof Pocket
   */
  public async getNodeParams(
    blockHeight: BigInt,
    useDefaultConfig = true
  ): Promise<QueryNodeParamsResponse | RpcErrorResponse> {
    const node = this.getAnyNode()
    let config = this.configuration
    // Check which configuration is being used
    if (!useDefaultConfig && this.optionalConfiguration !== undefined) {
      config = this.optionalConfiguration
    }
    // Check if node is Node.type
    if (!typeGuard(node, Node)) {
      return node
    }
    // Retrieve the node params
    const nodeParamsResponse = await RequestManager.getNodeParams(
      blockHeight,
      node,
      config
    )

    if (!typeGuard(nodeParamsResponse, QueryNodeParamsResponse)) {
      return nodeParamsResponse
    }
    return nodeParamsResponse
  }
  /**
   *
   * Retrieves the node proofs information
   * @param {string} address - Node's address.
   * @param {BigInt} blockHeight - Block's number.
   * @param {Node} node - Node that will receive the relay.
   * @param {Configuration} configuration - Configuration object containing preferences information.
   * @memberof Pocket
   */
  public async getNodeProofs(
    address: string,
    blockHeight: BigInt,
    useDefaultConfig = true
  ): Promise<QueryNodeProofsResponse | RpcErrorResponse> {
    const node = this.getAnyNode()
    let config = this.configuration
    // Check which configuration is being used
    if (!useDefaultConfig && this.optionalConfiguration !== undefined) {
      config = this.optionalConfiguration
    }
    // Check if node is Node.type
    if (!typeGuard(node, Node)) {
      return node
    }
    // Retrieve a node proofs
    const nodeProofsResponse = await RequestManager.getNodeProofs(
      address,
      blockHeight,
      node,
      config
    )

    if (!typeGuard(nodeProofsResponse, QueryNodeProofsResponse)) {
      return nodeProofsResponse
    }
    return nodeProofsResponse
  }
  /**
   *
   * Retrieves the node proof information
   * @param {NodeProof} nodeProof - Node's address.
   * @param {Node} node - Node that will receive the relay.
   * @param {Configuration} configuration - Configuration object containing preferences information.
   * @memberof RequestManager
   */
  public async getNodeProof(
    nodeProof: NodeProof,
    useDefaultConfig = true
  ): Promise<QueryNodeProofResponse | RpcErrorResponse> {
    const node = this.getAnyNode()
    let config = this.configuration
    // Check which configuration is being used
    if (!useDefaultConfig && this.optionalConfiguration !== undefined) {
      config = this.optionalConfiguration
    }
    // Check if node is Node.type
    if (!typeGuard(node, Node)) {
      return node
    }
    // Retrieve a node proof
    const nodeProofResponse = await RequestManager.getNodeProof(
      nodeProof,
      node,
      config
    )

    if (!typeGuard(nodeProofResponse, QueryNodeProofResponse)) {
      return nodeProofResponse
    }
    return nodeProofResponse
  }
  /**
   *
   * Retrieves a list of apps
   * @param {StakingStatus} stakingStatus - Staking status.
   * @param {BigInt} blockHeight - Block's number.
   * @param {Node} node - Node that will receive the relay.
   * @param {Configuration} configuration - Configuration object containing preferences information.
   * @memberof Pocket
   */
  public async getApps(
    stakingStatus: StakingStatus,
    blockHeight: BigInt,
    useDefaultConfig = true
  ): Promise<QueryAppsResponse | RpcErrorResponse> {
    const node = this.getAnyNode()
    let config = this.configuration
    // Check which configuration is being used
    if (!useDefaultConfig && this.optionalConfiguration !== undefined) {
      config = this.optionalConfiguration
    }
    // Check if node is Node.type
    if (!typeGuard(node, Node)) {
      return node
    }
    // Retrieve a list of apps
    const appsResponse = await RequestManager.getApps(
      stakingStatus,
      blockHeight,
      node,
      config
    )

    if (!typeGuard(appsResponse, QueryAppsResponse)) {
      return appsResponse
    }
    return appsResponse
  }
  /**
   *
   * Retrieves an app information
   * @param {string} address - Address of the app.
   * @param {BigInt} blockHeight - Block's number.
   * @param {Node} node - Node that will receive the relay.
   * @param {Configuration} configuration - Configuration object containing preferences information.
   * @memberof Pocket
   */
  public async getApp(
    address: string,
    blockHeight: BigInt,
    useDefaultConfig = true
  ): Promise<QueryAppResponse | RpcErrorResponse> {
    const node = this.getAnyNode()
    let config = this.configuration
    // Check which configuration is being used
    if (!useDefaultConfig && this.optionalConfiguration !== undefined) {
      config = this.optionalConfiguration
    }
    // Check if node is Node.type
    if (!typeGuard(node, Node)) {
      return node
    }
    // Retrieve an app
    const appResponse = await RequestManager.getApp(
      address,
      blockHeight,
      node,
      config
    )

    if (!typeGuard(appResponse, QueryAppResponse)) {
      return appResponse
    }
    return appResponse
  }
  /**
   *
   * Retrieves app params.
   * @param {BigInt} blockHeight - Block's number.
   * @param {Node} node - Node that will receive the relay.
   * @param {Configuration} configuration - Configuration object containing preferences information.
   * @memberof Pocket
   */
  public async getAppParams(
    blockHeight: BigInt,
    useDefaultConfig = true
  ): Promise<QueryAppParamsResponse | RpcErrorResponse> {
    const node = this.getAnyNode()
    let config = this.configuration
    // Check which configuration is being used
    if (!useDefaultConfig && this.optionalConfiguration !== undefined) {
      config = this.optionalConfiguration
    }
    // Check if node is Node.type
    if (!typeGuard(node, Node)) {
      return node
    }
    // Retrieve the app params
    const appParamsResponse = await RequestManager.getAppParams(
      blockHeight,
      node,
      config
    )

    if (!typeGuard(appParamsResponse, QueryAppParamsResponse)) {
      return appParamsResponse
    }
    return appParamsResponse
  }
  /**
   *
   * Retrieves the pocket params.
   * @param {BigInt} blockHeight - Block's number.
   * @param {Node} node - Node that will receive the relay.
   * @param {Configuration} configuration - Configuration object containing preferences information.
   * @memberof Pocket
   */
  public async getPocketParams(
    blockHeight: BigInt,
    useDefaultConfig = true
  ): Promise<QueryPocketParamsResponse | RpcErrorResponse> {
    const node = this.getAnyNode()
    let config = this.configuration
    // Check which configuration is being used
    if (!useDefaultConfig && this.optionalConfiguration !== undefined) {
      config = this.optionalConfiguration
    }
    // Check if node is Node.type
    if (!typeGuard(node, Node)) {
      return node
    }
    // Retrieve the pocket params
    const pocketParamsResponse = await RequestManager.getPocketParams(
      blockHeight,
      node,
      config
    )

    if (!typeGuard(pocketParamsResponse, QueryPocketParamsResponse)) {
      return pocketParamsResponse
    }
    return pocketParamsResponse
  }
  /**
   *
   * Retrieves supported chains
   * @param {BigInt} blockHeight - Block's number.
   * @param {Node} node - Node that will receive the relay.
   * @param {Configuration} configuration - Configuration object containing preferences information.
   * @memberof Pocket
   */
  public async getSupportedChains(
    blockHeight: BigInt,
    useDefaultConfig = true
  ): Promise<QuerySupportedChainsResponse | RpcErrorResponse> {
    const node = this.getAnyNode()
    let config = this.configuration
    // Check which configuration is being used
    if (!useDefaultConfig && this.optionalConfiguration !== undefined) {
      config = this.optionalConfiguration
    }
    // Check if node is Node.type
    if (!typeGuard(node, Node)) {
      return node
    }
    // Retrieve a list of supported chains
    const supportedChainsResponse = await RequestManager.getSupportedChains(
      blockHeight,
      node,
      config
    )

    if (!typeGuard(supportedChainsResponse, QuerySupportedChainsResponse)) {
      return supportedChainsResponse
    }
    return supportedChainsResponse
  }
  /**
   *
   * Retrieves current supply information
   * @param {BigInt} blockHeight - Block's number.
   * @param {Node} node - Node that will receive the relay.
   * @param {Configuration} configuration - Configuration object containing preferences information.
   * @memberof Pocket
   */
  public async getSupply(
    blockHeight: BigInt,
    useDefaultConfig = true
  ): Promise<QuerySupplyResponse | RpcErrorResponse> {
    const node = this.getAnyNode()
    let config = this.configuration
    // Check which configuration is being used
    if (!useDefaultConfig && this.optionalConfiguration !== undefined) {
      config = this.optionalConfiguration
    }
    // Check if node is Node.type
    if (!typeGuard(node, Node)) {
      return node
    }
    // Retrieve a supply information
    const supplyResponse = await RequestManager.getSupply(
      blockHeight,
      node,
      config
    )

    if (!typeGuard(supplyResponse, QuerySupplyResponse)) {
      return supplyResponse
    }
    return supplyResponse
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
  public async importAccount(
    passphrase: string,
    privateKey: string
  ): Promise<Account | Error> {
    const keybase = new Keybase()
    const importedAccountOrError = await keybase.importAccount(
      Buffer.from(privateKey, "hex"),
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
  public async exportAccount(
    account: Account,
    passphrase: string
  ): Promise<Buffer | Error> {
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
    if (privateKey.length === 64) {
      return privateKey
    } else {
      return new Error("Failed to export account")
    }
  }
  /**
   * Creates a new session.
   * @param {string} blockchain - Blockchain hash
   * @returns {Relay} - New Relay instance.
   * @memberof Pocket
   */
  private async createSession(
    blockchain: string
  ): Promise<Session | RpcErrorResponse> {
    let node: Node | RpcErrorResponse

    if (this.routingTable.nodes.length !== 0) {
      // Load and initial node list to create session
      node = this.routingTable.readNodeBy(blockchain)
    } else {
      return new RpcErrorResponse(
        "101",
        "Failed to load the initial local node list"
      )
    }
    // If failed to read a node return error
    if (typeGuard(node, RpcErrorResponse)) {
      return node
    }
    // Retrieve the session block height
    const sessionBlockHeightResponse = await RequestManager.getSessionBlockHeight(
      node,
      this.configuration
    )
    if (!typeGuard(sessionBlockHeightResponse, QuerySessionBlockResponse)) {
      return sessionBlockHeightResponse
    }
    // Create session header
    const header = new SessionHeader(
      this.configuration.pocketAAT.applicationPublicKey,
      blockchain,
      sessionBlockHeightResponse.sessionBlock
    )
    // Create the session
    const session = await this.sessionManager.createSession(
      header,
      node,
      this.configuration
    )
    if (typeGuard(session, Session)) {
      return session
    } else {
      return session
    }
  }
  /**
   * Retrieves a current session or creates a new one
   * @param {string} blockchain - Blockchain hash.
   * @returns {Session} - Current or new session.
   * @memberof Pocket
   */
  private async retrieveSession(
    blockchain: string
  ): Promise<Session | RpcErrorResponse> {
    let currentSession = this.sessionManager.getSession()
    if (!typeGuard(currentSession, Session)) {
      currentSession = await this.createSession(blockchain)
      return currentSession
    }
    return currentSession
  }
  /**
   * Get a node from the routing table by using a blockchain hash.
   * @param {string} blockchain - Blockchain hash.
   * @returns {Node} - New Node.
   * @memberof Pocket
   */
  private getNodeFrom(blockchain: string): Node | RpcErrorResponse {
    return this.routingTable.readNodeBy(blockchain)
  }
  /**
   * Get a node from the routing table.
   * @returns {Node} - New Node.
   * @memberof Pocket
   */
  private getAnyNode(): Node | RpcErrorResponse {
    return this.routingTable.getNode()
  }
}
