import { Configuration } from "./models/configuration"
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
import { InMemoryKVStore } from "./utils"
import { PocketAAT } from "pocket-aat-js"

/**
 *
 *
 * @class Pocket
 */
export class Pocket {
  public readonly sessionManager: SessionManager
  public readonly configuration: Configuration
  public readonly routingTable: Routing
  public readonly keybase: Keybase = new Keybase(new InMemoryKVStore())

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
    this.routingTable = new Routing([], configuration)
    this.sessionManager = new SessionManager(this.routingTable)
  }
  /**
   *
   * Sends a Relay Request
   * @param {string} data - string holding the json rpc call.
   * @param {string} blockchain - Blockchain hash.
   * @param {RelayHeaders} headers - An object holding the HTTP Headers.
   * @param {PocketAAT} pocketAAT - Pocket Authentication Token.
   * @param {Configuration} configuration - Pocket configuration object.
   * @param {Node} node - (Optional) Session node which will receive the Relay.
   * @param {string} method - (Optional) HTTP method for REST API calls.
   * @param {string} path - (Optional) REST API path.
   * @returns {RelayResponse} - A Relay Response object.
   * @memberof Pocket
   */
  public async sendRelay(
    data: string,
    blockchain: string,
    headers: RelayHeaders,
    pocketAAT: PocketAAT,
    configuration: Configuration = this.configuration,
    node?: Node,
    method = "",
    path = ""
  ): Promise<RelayResponse | Error> {
    // Relay Payload
    const relayPayload = new RelayPayload(data, method, path, headers)
    let sessionNode
    let rpcCallNode = this.routingTable.getNode()

    if (!typeGuard(rpcCallNode, Node)) {
      return new Error(rpcCallNode.message)
    }
    // Get session block height
    const sessionBlockHeightResponse = await RequestManager.getSessionBlockHeight(
      rpcCallNode,
      configuration
    )
    if (!typeGuard(sessionBlockHeightResponse, QuerySessionBlockResponse)) {
      return new Error(sessionBlockHeightResponse.message)
    }
    // Get current session
    const sessionHeader = new SessionHeader(pocketAAT.applicationPublicKey, blockchain, sessionBlockHeightResponse.sessionBlock)
    const currentSession = await this.sessionManager.getCurrentSession(sessionHeader, configuration)
    if (!typeGuard(currentSession, Session)) {
      return new Error(currentSession.message)
    }
    
    // Check if node is provided or retrieve one
    if (node !== undefined) {
      sessionNode = node
    } else {
      // Session Node
      sessionNode = currentSession.getSessionNode()
      if (!typeGuard(sessionNode, Node)) {
        return sessionNode
      }
    }
    // TODO: Add toJSON method to the pocket-aat lib
    // TODO: Proof 1st parameter index value origin pending
    // Create a proof object
    const relayProof = new Proof(
      BigInt(0),
      sessionBlockHeightResponse.sessionBlock,
      sessionNode.address,
      blockchain,
      pocketAAT,
      pocketAAT.applicationSignature
    )
    // Relay Request
    const relay = new RelayRequest(relayPayload, relayProof)
    // Send relay
    const relayResponse = await RequestManager.relay(
      relay,
      sessionNode,
      configuration
    )
    // Return response
    if (!typeGuard(relayResponse, RelayResponse)) {
      return new Error(relayResponse.message)
    }
    return relayResponse
  }

  //
  // RPC Calls
  //

  /**
   *
   * Query a Session Block Height
   * @param {Configuration} configuration - (Optional )Configuration object containing preferences information.
   * @param {Node} node - (Optional) Session node which will receive the Relay.
   * @memberof Pocket
   */
  public async getSessionBlockHeight(
    configuration = this.configuration,
    node?: Node,
  ): Promise<BigInt | Error> {
    let activeNode

    if (node === undefined) {
      activeNode = this.getAnyNode()
    }else{
      activeNode = node
    }
    
    // Check if node is Node.type
    if (!typeGuard(activeNode, Node)) {
      return new Error(activeNode.message)
    }
    // Retrieve the session block height
    const sessionBlockHeightResponse = await RequestManager.getSessionBlockHeight(
      activeNode,
      configuration
    )

    if (!typeGuard(sessionBlockHeightResponse, QuerySessionBlockResponse)) {
      return new Error(sessionBlockHeightResponse.message)
    }
    return sessionBlockHeightResponse.sessionBlock
  }
  /**
   *
   * Query a Block information
   * @param {BigInt} blockHeight - Block's number.
   * @param {Configuration} configuration - (Optional )Configuration object containing preferences information.
   * @param {Node} node - (Optional) Session node which will receive the Relay.
   * @memberof RequestManager
   */
  public async getBlock(
    blockHeight: BigInt,
    configuration = this.configuration,
    node?: Node
  ): Promise<QueryBlockResponse | Error> {
    let activeNode

    if (node === undefined) {
      activeNode = this.getAnyNode()
    }else{
      activeNode = node
    }

    // Check if node is Node.type
    if (!typeGuard(activeNode, Node)) {
      return new Error(activeNode.message)
    }
    // Retrieve the block information
    const blockHeightResponse = await RequestManager.getBlock(
      blockHeight,
      activeNode,
      configuration
    )

    if (!typeGuard(blockHeightResponse, QueryBlockResponse)) {
      return new Error(blockHeightResponse.message)
    }
    return blockHeightResponse
  }
  /**
   *
   * Retrieves a transaction information
   * @param {string} txHash - Transaction hash.
   * @param {Configuration} configuration - (Optional )Configuration object containing preferences information.
   * @param {Node} node - (Optional) Session node which will receive the Relay.
   * @memberof Pocket
   */
  public async getTX(
    txHash: string,
    configuration = this.configuration,
    node?: Node
  ): Promise<QueryTXResponse | Error> {
    let activeNode

    if (node === undefined) {
      activeNode = this.getAnyNode()
    }else{
      activeNode = node
    }

    // Check if node is Node.type
    if (!typeGuard(activeNode, Node)) {
      return new Error(activeNode.message)
    }
    // Retrieve the transaction by hash
    const txResponse = await RequestManager.getTX(txHash, activeNode, configuration)

    if (!typeGuard(txResponse, QueryTXResponse)) {
      return new Error(txResponse.message)
    }
    return txResponse
  }
  /**
   *
   * Get the current network block height
   * @param {Configuration} configuration - (Optional )Configuration object containing preferences information.
   * @param {Node} node - (Optional) Session node which will receive the Relay.
   * @memberof RequestManager
   */
  public async getHeight(
    configuration = this.configuration,
    node?: Node
  ): Promise<QueryHeightResponse | Error> {
    let activeNode

    if (node === undefined) {
      activeNode = this.getAnyNode()
    }else{
      activeNode = node
    }

    // Check if node is Node.type
    if (!typeGuard(activeNode, Node)) {
      return new Error(activeNode.message)
    }
    // Retrieve the current block height
    const queryHeightResponse = await RequestManager.getHeight(activeNode, configuration)

    if (!typeGuard(queryHeightResponse, QueryHeightResponse)) {
      return new Error(queryHeightResponse.message)
    }
    return queryHeightResponse
  }
  /**
   *
   * Retrieves an account balance
   * @param {string} address - Account's address.
   * @param {BigInt} blockHeight - Block's number.
   * @param {Configuration} configuration - (Optional )Configuration object containing preferences information.
   * @param {Node} node - (Optional) Session node which will receive the Relay.
   * @memberof Pocket
   */
  public async getBalance(
    address: string,
    blockHeight: BigInt,
    configuration = this.configuration,
    node?: Node
  ): Promise<QueryBalanceResponse | Error> {
    let activeNode

    if (node === undefined) {
      activeNode = this.getAnyNode()
    }else{
      activeNode = node
    }

    // Check if node is Node.type
    if (!typeGuard(activeNode, Node)) {
      return new Error(activeNode.message)
    }
    // Retrieve the address current balance
    const balanceResponse = await RequestManager.getBalance(
      address,
      blockHeight,
      activeNode,
      configuration
    )

    if (!typeGuard(balanceResponse, QueryBalanceResponse)) {
      return new Error(balanceResponse.message)
    }
    return balanceResponse
  }
  /**
   *
   * Retrieves a list of nodes
   * @param {StakingStatus} stakingStatus - Staking status.
   * @param {BigInt} blockHeight - Block's number.
   * @param {Configuration} configuration - (Optional )Configuration object containing preferences information.
   * @param {Node} node - (Optional) Session node which will receive the Relay.
   * @memberof RequestManager
   */
  public async getNodes(
    stakingStatus: StakingStatus,
    blockHeight: BigInt,
    configuration = this.configuration,
    node?: Node
  ): Promise<QueryNodesResponse | Error> {
    let activeNode

    if (node === undefined) {
      activeNode = this.getAnyNode()
    }else{
      activeNode = node
    }

    // Check if node is Node.type
    if (!typeGuard(activeNode, Node)) {
      return new Error(activeNode.message)
    }
    // Retrieve a list of nodes
    const nodesResponse = await RequestManager.getNodes(
      stakingStatus,
      blockHeight,
      activeNode,
      configuration
    )

    if (!typeGuard(nodesResponse, QueryNodesResponse)) {
      return new Error(nodesResponse.message)
    }
    return nodesResponse
  }
  /**
   *
   * Query a Node information
   * @param {string} address - Node address.
   * @param {BigInt} blockHeight - Block's number.
   * @param {Configuration} configuration - (Optional )Configuration object containing preferences information.
   * @param {Node} node - (Optional) Session node which will receive the Relay.
   * @memberof Pocket
   */
  public async getNode(
    address: string,
    blockHeight: BigInt,
    configuration = this.configuration,
    node?: Node
  ): Promise<QueryNodeResponse | Error> {
    let activeNode

    if (node === undefined) {
      activeNode = this.getAnyNode()
    }else{
      activeNode = node
    }

    // Check if node is Node.type
    if (!typeGuard(activeNode, Node)) {
      return new Error(activeNode.message)
    }
    // Retrieve a node information
    const nodeResponse = await RequestManager.getNode(
      address,
      blockHeight,
      activeNode,
      configuration
    )

    if (!typeGuard(nodeResponse, QueryNodeResponse)) {
      return new Error(nodeResponse.message)
    }
    return nodeResponse
  }
  /**
   *
   * Retrieves the node params
   * @param {BigInt} blockHeight - Block's number.
   * @param {Configuration} configuration - (Optional )Configuration object containing preferences information.
   * @param {Node} node - (Optional) Session node which will receive the Relay.
   * @memberof Pocket
   */
  public async getNodeParams(
    blockHeight: BigInt,
    configuration = this.configuration,
    node?: Node
  ): Promise<QueryNodeParamsResponse | Error> {
    let activeNode

    if (node === undefined) {
      activeNode = this.getAnyNode()
    }else{
      activeNode = node
    }

    // Check if node is Node.type
    if (!typeGuard(activeNode, Node)) {
      return new Error(activeNode.message)
    }
    // Retrieve the node params
    const nodeParamsResponse = await RequestManager.getNodeParams(
      blockHeight,
      activeNode,
      configuration
    )

    if (!typeGuard(nodeParamsResponse, QueryNodeParamsResponse)) {
      return new Error(nodeParamsResponse.message)
    }
    return nodeParamsResponse
  }
  /**
   *
   * Retrieves the node proofs information
   * @param {string} address - Node's address.
   * @param {BigInt} blockHeight - Block's number.
   * @param {Configuration} configuration - (Optional )Configuration object containing preferences information.
   * @param {Node} node - (Optional) Session node which will receive the Relay.
   * @memberof Pocket
   */
  public async getNodeProofs(
    address: string,
    blockHeight: BigInt,
    configuration = this.configuration,
    node?: Node
  ): Promise<QueryNodeProofsResponse | Error> {
    let activeNode

    if (node === undefined) {
      activeNode = this.getAnyNode()
    }else{
      activeNode = node
    }

    // Check if node is Node.type
    if (!typeGuard(activeNode, Node)) {
      return new Error(activeNode.message)
    }
    // Retrieve a node proofs
    const nodeProofsResponse = await RequestManager.getNodeProofs(
      address,
      blockHeight,
      activeNode,
      configuration
    )

    if (!typeGuard(nodeProofsResponse, QueryNodeProofsResponse)) {
      return new Error(nodeProofsResponse.message)
    }
    return nodeProofsResponse
  }
  /**
   *
   * Retrieves the node proof information
   * @param {NodeProof} nodeProof - Node's address.
   * @param {Configuration} configuration - (Optional )Configuration object containing preferences information.
   * @param {Node} node - (Optional) Session node which will receive the Relay.
   * @memberof RequestManager
   */
  public async getNodeProof(
    nodeProof: NodeProof,
    configuration = this.configuration,
    node?: Node
  ): Promise<QueryNodeProofResponse | Error> {
    let activeNode

    if (node === undefined) {
      activeNode = this.getAnyNode()
    }else{
      activeNode = node
    }

    // Check if node is Node.type
    if (!typeGuard(activeNode, Node)) {
      return new Error(activeNode.message)
    }
    // Retrieve a node proof
    const nodeProofResponse = await RequestManager.getNodeProof(
      nodeProof,
      activeNode,
      configuration
    )

    if (!typeGuard(nodeProofResponse, QueryNodeProofResponse)) {
      return new Error(nodeProofResponse.message)
    }
    return nodeProofResponse
  }
  /**
   *
   * Retrieves a list of apps
   * @param {StakingStatus} stakingStatus - Staking status.
   * @param {BigInt} blockHeight - Block's number.
   * @param {Configuration} configuration - (Optional )Configuration object containing preferences information.
   * @param {Node} node - (Optional) Session node which will receive the Relay.
   * @memberof Pocket
   */
  public async getApps(
    stakingStatus: StakingStatus,
    blockHeight: BigInt,
    configuration = this.configuration,
    node?: Node
  ): Promise<QueryAppsResponse | Error> {
    let activeNode

    if (node === undefined) {
      activeNode = this.getAnyNode()
    }else{
      activeNode = node
    }

    // Check if node is Node.type
    if (!typeGuard(activeNode, Node)) {
      return new Error(activeNode.message)
    }
    // Retrieve a list of apps
    const appsResponse = await RequestManager.getApps(
      stakingStatus,
      blockHeight,
      activeNode,
      configuration
    )

    if (!typeGuard(appsResponse, QueryAppsResponse)) {
      return new Error(appsResponse.message)
    }
    return appsResponse
  }
  /**
   *
   * Retrieves an app information
   * @param {string} address - Address of the app.
   * @param {BigInt} blockHeight - Block's number.
   * @param {Configuration} configuration - (Optional )Configuration object containing preferences information.
   * @param {Node} node - (Optional) Session node which will receive the Relay.
   * @memberof Pocket
   */
  public async getApp(
    address: string,
    blockHeight: BigInt,
    configuration = this.configuration,
    node?: Node
  ): Promise<QueryAppResponse | Error> {
    let activeNode

    if (node === undefined) {
      activeNode = this.getAnyNode()
    }else{
      activeNode = node
    }

    // Check if node is Node.type
    if (!typeGuard(activeNode, Node)) {
      return new Error(activeNode.message)
    }
    // Retrieve an app
    const appResponse = await RequestManager.getApp(
      address,
      blockHeight,
      activeNode,
      configuration
    )

    if (!typeGuard(appResponse, QueryAppResponse)) {
      return new Error(appResponse.message)
    }
    return appResponse
  }
  /**
   *
   * Retrieves app params.
   * @param {BigInt} blockHeight - Block's number.
   * @param {Configuration} configuration - (Optional )Configuration object containing preferences information.
   * @param {Node} node - (Optional) Session node which will receive the Relay.
   * @memberof Pocket
   */
  public async getAppParams(
    blockHeight: BigInt,
    configuration = this.configuration,
    node?: Node
  ): Promise<QueryAppParamsResponse | Error> {
    let activeNode

    if (node === undefined) {
      activeNode = this.getAnyNode()
    }else{
      activeNode = node
    }

    // Check if node is Node.type
    if (!typeGuard(activeNode, Node)) {
      return new Error(activeNode.message)
    }
    // Retrieve the app params
    const appParamsResponse = await RequestManager.getAppParams(
      blockHeight,
      activeNode,
      configuration
    )

    if (!typeGuard(appParamsResponse, QueryAppParamsResponse)) {
      return new Error(appParamsResponse.message)
    }
    return appParamsResponse
  }
  /**
   *
   * Retrieves the pocket params.
   * @param {BigInt} blockHeight - Block's number.
   * @param {Configuration} configuration - (Optional )Configuration object containing preferences information.
   * @param {Node} node - (Optional) Session node which will receive the Relay.
   * @memberof Pocket
   */
  public async getPocketParams(
    blockHeight: BigInt,
    configuration = this.configuration,
    node?: Node
  ): Promise<QueryPocketParamsResponse | Error> {
    let activeNode

    if (node === undefined) {
      activeNode = this.getAnyNode()
    }else{
      activeNode = node
    }

    // Check if node is Node.type
    if (!typeGuard(activeNode, Node)) {
      return new Error(activeNode.message)
    }
    // Retrieve the pocket params
    const pocketParamsResponse = await RequestManager.getPocketParams(
      blockHeight,
      activeNode,
      configuration
    )

    if (!typeGuard(pocketParamsResponse, QueryPocketParamsResponse)) {
      return new Error(pocketParamsResponse.message)
    }
    return pocketParamsResponse
  }
  /**
   *
   * Retrieves supported chains
   * @param {BigInt} blockHeight - Block's number.
   * @param {Configuration} configuration - (Optional )Configuration object containing preferences information.
   * @param {Node} node - (Optional) Session node which will receive the Relay.
   * @memberof Pocket
   */
  public async getSupportedChains(
    blockHeight: BigInt,
    configuration = this.configuration,
    node?: Node
  ): Promise<QuerySupportedChainsResponse | Error> {
    let activeNode

    if (node === undefined) {
      activeNode = this.getAnyNode()
    }else{
      activeNode = node
    }

    // Check if node is Node.type
    if (!typeGuard(activeNode, Node)) {
      return new Error(activeNode.message)
    }
    // Retrieve a list of supported chains
    const supportedChainsResponse = await RequestManager.getSupportedChains(
      blockHeight,
      activeNode,
      configuration
    )

    if (!typeGuard(supportedChainsResponse, QuerySupportedChainsResponse)) {
      return new Error(supportedChainsResponse.message)
    }
    return supportedChainsResponse
  }
  /**
   *
   * Retrieves current supply information
   * @param {BigInt} blockHeight - Block's number.
   * @param {Configuration} configuration - (Optional )Configuration object containing preferences information.
   * @param {Node} node - (Optional) Session node which will receive the Relay.
   * @memberof Pocket
   */
  public async getSupply(
    blockHeight: BigInt,
    configuration = this.configuration,
    node?: Node
  ): Promise<QuerySupplyResponse | Error> {
    let activeNode

    if (node === undefined) {
      activeNode = this.getAnyNode()
    }else{
      activeNode = node
    }

    // Check if node is Node.type
    if (!typeGuard(activeNode, Node)) {
      return new Error(activeNode.message)
    }
    // Retrieve a supply information
    const supplyResponse = await RequestManager.getSupply(
      blockHeight,
      activeNode,
      configuration
    )

    if (!typeGuard(supplyResponse, QuerySupplyResponse)) {
      return new Error(supplyResponse.message)
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
    const keybase = new Keybase(new InMemoryKVStore())
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
    const keybase = new Keybase(new InMemoryKVStore())

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
   * Get a node from the routing table.
   * @returns {Node} - New Node.
   * @memberof Pocket
   */
  private getAnyNode(): Node | RpcErrorResponse {
    return this.routingTable.getNode()
  }
}
