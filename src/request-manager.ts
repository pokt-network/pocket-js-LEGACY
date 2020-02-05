import axios, { AxiosInstance, AxiosResponse } from "axios"
import { Node } from "./models/node"
import { NodeProof } from "./models/input/node-proof"
import { Configuration } from "./models/configuration"
import enums = require("./utils/enums")
import { StakingStatus } from "./utils/enums"
import { RelayResponse } from "./models/output/relay-response"
import { DispatchResponse } from "./models/output/dispatch-response"
import { QuerySupplyResponse } from "./models/output/query-supply-response"
import { QueryHeightResponse } from "./models/output/query-height-response"
import { QueryNodesResponse } from "./models/output/query-nodes-response"
import { QueryBlockResponse } from "./models/output/query-block-response"
import { QueryTXResponse } from "./models/output/query-tx-response"
import { QueryBalanceResponse } from "./models/output/query-balance-response"
import { QueryNodeResponse } from "./models/output/query-node-response"
import { QueryNodeParamsResponse } from "./models/output/query-node-params-response"
import { QueryNodeProofsResponse } from "./models/output/query-node-proofs-response"
import { QueryNodeProofResponse } from "./models/output/query-node-proof-response"
import { QueryAppsResponse } from "./models/output/query-apps-response"
import { QueryAppResponse } from "./models/output/query-app-response"
import { QueryAppParamsResponse } from "./models/output/query-app-params-response"
import { QueryPocketParamsResponse } from "./models/output/query-pocket-params-response"
import { QuerySupportedChainsResponse } from "./models/output/query-supported-chains-response"
import { RpcErrorResponse } from "./models/output/rpc-error-response"
import { RelayRequest } from "./models/input/relay-request"
import { DispatchRequest } from "./models/input/dispatch-request"
import { typeGuard } from "./utils/type-guard"
import { SendResponse } from "./models/output/send-response"
import { QuerySessionBlockResponse } from "./models/output/query-session-block-response"
import { RawTxRequest } from "./models/input/raw-tx-request"
import { RawTxResponse } from "./models/output/raw-tx-response"
import { type } from "os"

/**
 *
 *
 * @class Request Manager
 */
export abstract class RequestManager {
  /**
   *
   * Sends a relay
   * @param {Object} payload - Payload object containing the needed parameters.
   * @param {Node} node - Node that will receive the relay.
   * @param {Configuration} configuration - Configuration object containing preferences information.
   * @memberof RequestManager
   */
  public static async relay(
    request: RelayRequest,
    node: Node,
    configuration: Configuration
  ): Promise<RelayResponse | RpcErrorResponse> {
    try {
      const response = await RequestManager.send(
        enums.Routes.RELAY.toString(),
        request.toJSON(),
        node,
        configuration
      )

      // Check if response is an error
      if (!typeGuard(response, RpcErrorResponse)) {
        const relayResponse = RelayResponse.fromJSON(
          JSON.stringify(response.data)
        )
        return relayResponse
      } else {
        return new RpcErrorResponse(
          response.code,
          "Failed to send relay request with error: " + response.message
        )
      }
    } catch (err) {
      return new RpcErrorResponse("0", err)
    }
  }
  /**
   *
   * Sends a dispatch request
   * @param {Object} payload - Payload object containing the needed parameters.
   * @param {Node} node - Node that will receive the relay.
   * @param {Configuration} configuration - Configuration object containing preferences information.
   * @memberof RequestManager
   */
  public static async dispatch(
    request: DispatchRequest,
    node: Node,
    configuration: Configuration
  ): Promise<DispatchResponse | RpcErrorResponse> {
    try {
      const response = await RequestManager.send(
        enums.Routes.DISPATCH.toString(),
        request.toJSON(),
        node,
        configuration
      )

      // Check if response is an error
      if (!typeGuard(response, RpcErrorResponse)) {
        const dispatchResponse = DispatchResponse.fromJSON(
          JSON.stringify(response.data)
        )
        return dispatchResponse
      } else {
        return new RpcErrorResponse(
          response.code,
          "Failed to send dispatch request with error: " + response.message
        )
      }
    } catch (err) {
      return new RpcErrorResponse("0", err)
    }
  }
  /**
   *
   * Query a Session Block Height
   * @param {Node} node - Node that will receive the relay.
   * @param {Configuration} configuration - Configuration object containing preferences information.
   * @memberof RequestManager
   */
  public static async getSessionBlockHeight(
    node: Node,
    configuration: Configuration
  ): Promise<QuerySessionBlockResponse | RpcErrorResponse> {
    // Get current block height
    const queryHeightResponse = await RequestManager.getHeight(
      node,
      configuration
    )
    if (!typeGuard(queryHeightResponse, QueryHeightResponse)) {
      return queryHeightResponse
    }
    // Get current session block
    const queryNodeParamsResponse = await RequestManager.getNodeParams(
      queryHeightResponse.height,
      node,
      configuration
    )
    if (!typeGuard(queryNodeParamsResponse, QueryNodeParamsResponse)) {
      return queryNodeParamsResponse
    }
    // Create querySessionBlockResponse
    
    const querySessionBlockResponse = new QuerySessionBlockResponse(
      queryNodeParamsResponse.nodeParams.sessionBlock
    )
    return querySessionBlockResponse
  }
  /**
   *
   * Query a Block information
   * @param {BigInt} blockHeight - Block's number.
   * @param {Node} node - Node that will receive the relay.
   * @param {Configuration} configuration - Configuration object containing preferences information.
   * @memberof RequestManager
   */
  public static async getBlock(
    blockHeight: BigInt = BigInt(0),
    node: Node,
    configuration: Configuration
  ): Promise<QueryBlockResponse | RpcErrorResponse> {
    try {
      if (Number(blockHeight.toString(16)) < 0 ) {
        return new RpcErrorResponse("101", "block height can't be lower than 0")
      }
      const payload = JSON.stringify({ height: blockHeight.toString(16) })

      const response = await RequestManager.send(
        enums.RPCRoutes.QueryBlock.toString(),
        payload,
        node,
        configuration
      )
      // Check if response is an error
      if (!typeGuard(response, RpcErrorResponse)) {
        const queryBlockResponse = QueryBlockResponse.fromJSON(
          JSON.stringify(response.data)
        )
        return queryBlockResponse
      } else {
        return new RpcErrorResponse(
          response.code,
          "Failed to retrieve the block information: " + response.message
        )
      }
    } catch (err) {
      return new RpcErrorResponse("0", err)
    }
  }
  /**
   *
   * Retrieves a transaction information
   * @param {string} txHash - Transaction hash.
   * @param {Node} node - Node that will receive the relay.
   * @param {Configuration} configuration - Configuration object containing preferences information.
   * @memberof RequestManager
   */
  public static async getTX(
    txHash: string,
    node: Node,
    configuration: Configuration
  ): Promise<QueryTXResponse | RpcErrorResponse> {
    try {
      const payload = JSON.stringify({ hash: txHash })

      const response = await RequestManager.send(
        enums.RPCRoutes.QueryTX.toString().toString(),
        payload,
        node,
        configuration
      )

      // Check if response is an error
      if (!typeGuard(response, RpcErrorResponse)) {
        const queryTXResponse = QueryTXResponse.fromJSON(
          JSON.stringify(response.data)
        )
        return queryTXResponse
      } else {
        return new RpcErrorResponse(
          response.code,
          "Failed to retrieve the block information: " + response.message
        )
      }
    } catch (err) {
      return new RpcErrorResponse("0", err)
    }
  }
  /**
   *
   * Get the current network block height
   * @param {Node} node - Node that will receive the relay.
   * @param {Configuration} configuration - Configuration object containing preferences information.
   * @memberof RequestManager
   */
  public static async getHeight(
    node: Node,
    configuration: Configuration
  ): Promise<QueryHeightResponse | RpcErrorResponse> {
    try {   
      const response = await RequestManager.send(
        enums.RPCRoutes.QueryHeight.toString(),
        {},
        node,
        configuration
      )

      // Check if response is an error
      if (!typeGuard(response, RpcErrorResponse)) {
        const queryHeightResponse = QueryHeightResponse.fromJSON(
          JSON.stringify(response.data)
        )
        return queryHeightResponse
      } else {
        return new RpcErrorResponse(
          response.code,
          "Failed to retrieve the network block height: " + response.message
        )
      }
    } catch (err) {
      return new RpcErrorResponse("0", err)
    }
  }
  /**
   *
   * Retrieves an account balance
   * @param {string} address - Account's address.
   * @param {BigInt} blockHeight - Block's number.
   * @param {Node} node - Node that will receive the relay.
   * @param {Configuration} configuration - Configuration object containing preferences information.
   * @memberof RequestManager
   */
  public static async getBalance(
    address: string,
    blockHeight: BigInt = BigInt(0),
    node: Node,
    configuration: Configuration
  ): Promise<QueryBalanceResponse | RpcErrorResponse> {
    try {
      if (Number(blockHeight.toString(16)) < 0 ) {
        return new RpcErrorResponse("101", "block height can't be lower than 0")
      }
      
      const payload = { "address": address, "height": blockHeight.toString(16) }

      const response = await RequestManager.send(
        enums.RPCRoutes.QueryBalance.toString(),
        payload,
        node,
        configuration
      )

      // Check if response is an error
      if (!typeGuard(response, RpcErrorResponse)) {
        const queryBalanceResponse = QueryBalanceResponse.fromJSON(
          JSON.stringify(response.data)
        )
        return queryBalanceResponse
      } else {
        return new RpcErrorResponse(
          response.code,
          "Failed to retrieve current balance: " + response.message
        )
      }
    } catch (err) {
      return new RpcErrorResponse("0", err)
    }
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
  public static async getNodes(
    stakingStatus: StakingStatus,
    blockHeight: BigInt = BigInt(0),
    node: Node,
    configuration: Configuration
  ): Promise<QueryNodesResponse | RpcErrorResponse> {
    try {
      if (Number(blockHeight.toString(16)) < 0 ) {
        return new RpcErrorResponse("101", "block height can't be lower than 0")
      }

      const payload = {
        "height": blockHeight.toString(16),
        "stakingStatus": stakingStatus
      }

      const response = await RequestManager.send(
        enums.RPCRoutes.QueryNodes.toString(),
        payload,
        node,
        configuration
      )

      // Check if response is an error
      if (!typeGuard(response, RpcErrorResponse)) {
        const queryNodesResponse = QueryNodesResponse.fromJSON(
          JSON.stringify(response.data)
        )
        return queryNodesResponse
      } else {
        return new RpcErrorResponse(
          response.code,
          "Failed to retrieve a list of nodes: " + response.message
        )
      }
    } catch (err) {
      return new RpcErrorResponse("0", err)
    }
  }
  /**
   *
   * Query a Node information
   * @param {string} address - Node address.
   * @param {BigInt} blockHeight - Block's number.
   * @param {Node} node - Node that will receive the relay.
   * @param {Configuration} configuration - Configuration object containing preferences information.
   * @memberof RequestManager
   */
  public static async getNode(
    address: string,
    blockHeight: BigInt = BigInt(0),
    node: Node,
    configuration: Configuration
  ): Promise<QueryNodeResponse | RpcErrorResponse> {
    try {
      if (Number(blockHeight.toString(16)) < 0 ) {
        return new RpcErrorResponse("101", "block height can't be lower than 0")
      }
      const payload = JSON.stringify({ 
        address: address, 
        height: blockHeight.toString(16) 
      })

      const response = await RequestManager.send(
        enums.RPCRoutes.QueryNode.toString(),
        payload,
        node,
        configuration
      )

      // Check if response is an error
      if (!typeGuard(response, RpcErrorResponse)) {
        const queryNodeResponse = QueryNodeResponse.fromJSON(
          JSON.stringify(response.data)
        )
        return queryNodeResponse
      } else {
        return new RpcErrorResponse(
          response.code,
          "Failed to retrieve the node information: " + response.message
        )
      }
    } catch (err) {
      return new RpcErrorResponse("0", err)
    }
  }
  /**
   *
   * Retrieves the node params
   * @param {BigInt} blockHeight - Block's number.
   * @param {Node} node - Node that will receive the relay.
   * @param {Configuration} configuration - Configuration object containing preferences information.
   * @memberof RequestManager
   */
  public static async getNodeParams(
    blockHeight: BigInt = BigInt(0),
    node: Node,
    configuration: Configuration
  ): Promise<QueryNodeParamsResponse | RpcErrorResponse> {
    try {
      if (Number(blockHeight.toString(16)) < 0 ) {
        return new RpcErrorResponse("101", "block height can't be lower than 0")
      }

      const payload = JSON.stringify({ height: blockHeight.toString(16) })

      const response = await RequestManager.send(
        enums.RPCRoutes.QueryNodeParams.toString(),
        payload,
        node,
        configuration
      )

      // Check if response is an error
      if (!typeGuard(response, RpcErrorResponse)) {
        const queryNodeParamsResponse = QueryNodeParamsResponse.fromJSON(
          JSON.stringify(response.data)
        )
        return queryNodeParamsResponse
      } else {
        return new RpcErrorResponse(
          response.code,
          "Failed to retrieve the node params information: " + response.message
        )
      }
    } catch (err) {
      return new RpcErrorResponse("0", err)
    }
  }
  /**
   *
   * Retrieves the node proofs information
   * @param {string} address - Node's address.
   * @param {BigInt} blockHeight - Block's number.
   * @param {Node} node - Node that will receive the relay.
   * @param {Configuration} configuration - Configuration object containing preferences information.
   * @memberof RequestManager
   */
  public static async getNodeProofs(
    address: string,
    blockHeight: BigInt = BigInt(0),
    node: Node,
    configuration: Configuration
  ): Promise<QueryNodeProofsResponse | RpcErrorResponse> {
    try {
      if (Number(blockHeight.toString(16)) < 0 ) {
        return new RpcErrorResponse("101", "block height can't be lower than 0")
      }

      const payload = JSON.stringify({ 
        address: address, 
        height: blockHeight.toString(16) 
      })

      const response = await RequestManager.send(
        enums.RPCRoutes.QueryNodeProofs.toString(),
        payload,
        node,
        configuration
      )

      // Check if response is an error
      if (!typeGuard(response, RpcErrorResponse)) {

        const queryNodeProofsResponse = QueryNodeProofsResponse.fromJSON(
          JSON.stringify(response.data)
        )
        return queryNodeProofsResponse
      } else {
        return new RpcErrorResponse(
          response.code,
          "Failed to retrieve the node proofs: " + response.message
        )
      }
    } catch (err) {
      return new RpcErrorResponse("0", err)
    }
  }
  /**
   *
   * Retrieves the node proof information
   * @param {NodeProof} nodeProof - Node's address.
   * @param {Node} node - Node that will receive the relay.
   * @param {Configuration} configuration - Configuration object containing preferences information.
   * @memberof RequestManager
   */
  public static async getNodeProof(
    nodeProof: NodeProof,
    node: Node,
    configuration: Configuration
  ): Promise<QueryNodeProofResponse | RpcErrorResponse> {
    try {
      const payload = JSON.stringify(nodeProof.toJSON())

      const response = await RequestManager.send(
        enums.RPCRoutes.QueryNodeProof.toString(),
        payload,
        node,
        configuration
      )

      // Check if response is an error
      if (!typeGuard(response, RpcErrorResponse)) {

        const queryNodeProofResponse = QueryNodeProofResponse.fromJSON(
          JSON.stringify(response.data)
        )
        return queryNodeProofResponse
      } else {
        return new RpcErrorResponse(
          response.code,
          "Failed to retrieve the node proof: " + response.message
        )
      }
    } catch (err) {
      return err
    }
  }
  /**
   *
   * Retrieves a list of apps
   * @param {StakingStatus} stakingStatus - Staking status.
   * @param {BigInt} blockHeight - Block's number.
   * @param {Node} node - Node that will receive the relay.
   * @param {Configuration} configuration - Configuration object containing preferences information.
   * @memberof RequestManager
   */
  public static async getApps(
    stakingStatus: StakingStatus,
    blockHeight: BigInt = BigInt(0),
    node: Node,
    configuration: Configuration
  ): Promise<QueryAppsResponse | RpcErrorResponse> {
    try {
      if (Number(blockHeight.toString(16)) < 0 ) {
        return new RpcErrorResponse("101", "block height can't be lower than 0")
      }
      
      const payload = JSON.stringify({
        "height": blockHeight.toString(16),
        "stakingStatus": stakingStatus
      })

      const response = await RequestManager.send(
        enums.RPCRoutes.QueryApps.toString(),
        payload,
        node,
        configuration
      )

      // Check if response is an error
      if (!typeGuard(response, RpcErrorResponse)) {

        const queryAppsResponse = QueryAppsResponse.fromJSON(
          JSON.stringify(response.data)
        )
        return queryAppsResponse
      } else {
        return new RpcErrorResponse(
          response.code,
          "Failed to retrieve the list of apps: " + response.message
        )
      }
    } catch (err) {
      return new RpcErrorResponse("0", err)
    }
  }
  /**
   *
   * Retrieves an app information
   * @param {string} address - Address of the app.
   * @param {BigInt} blockHeight - Block's number.
   * @param {Node} node - Node that will receive the relay.
   * @param {Configuration} configuration - Configuration object containing preferences information.
   * @memberof RequestManager
   */
  public static async getApp(
    address: string,
    blockHeight: BigInt = BigInt(0),
    node: Node,
    configuration: Configuration
  ): Promise<QueryAppResponse | RpcErrorResponse> {
    try {
      if (Number(blockHeight.toString(16)) < 0 ) {
        return new RpcErrorResponse("101", "block height can't be lower than 0")
      }

      const payload = JSON.stringify({ 
        address: address, 
        height: blockHeight.toString(16) 
      })

      const response = await RequestManager.send(
        enums.RPCRoutes.QueryApp.toString(),
        payload,
        node,
        configuration
      )

      // Check if response is an error
      if (!typeGuard(response, RpcErrorResponse)) {

        const queryAppResponse = QueryAppResponse.fromJSON(
          JSON.stringify(response.data)
        )
        return queryAppResponse
      } else {
        return new RpcErrorResponse(
          response.code,
          "Failed to retrieve the app infromation: " + response.message
        )
      }
    } catch (err) {
      return new RpcErrorResponse("0", err)
    }
  }
  /**
   *
   * Retrieves app params.
   * @param {BigInt} blockHeight - Block's number.
   * @param {Node} node - Node that will receive the relay.
   * @param {Configuration} configuration - Configuration object containing preferences information.
   * @memberof RequestManager
   */
  public static async getAppParams(
    blockHeight: BigInt = BigInt(0),
    node: Node,
    configuration: Configuration
  ): Promise<QueryAppParamsResponse | RpcErrorResponse> {
    try {
      if (Number(blockHeight.toString(16)) < 0 ) {
        return new RpcErrorResponse("101", "block height can't be lower than 0")
      }

      const payload = JSON.stringify({ height: blockHeight.toString(16) })

      const response = await RequestManager.send(
        enums.RPCRoutes.QueryAppParams.toString(),
        payload,
        node,
        configuration
      )

      // Check if response is an error
      if (!typeGuard(response, RpcErrorResponse)) {

        const queryAppParamsResponse = QueryAppParamsResponse.fromJSON(
          JSON.stringify(response.data)
        )
        return queryAppParamsResponse
      } else {
        return new RpcErrorResponse(
          response.code,
          "Failed to retrieve the app params: " + response.message
        )
      }
    } catch (err) {
      return new RpcErrorResponse("0", err)
    }
  }
  /**
   *
   * Retrieves the pocket params.
   * @param {BigInt} blockHeight - Block's number.
   * @param {Node} node - Node that will receive the relay.
   * @param {Configuration} configuration - Configuration object containing preferences information.
   * @memberof RequestManager
   */
  public static async getPocketParams(
    blockHeight: BigInt = BigInt(0),
    node: Node,
    configuration: Configuration
  ): Promise<QueryPocketParamsResponse | RpcErrorResponse> {
    try {
      if (Number(blockHeight.toString(16)) < 0 ) {
        return new RpcErrorResponse("101", "block height can't be lower than 0")
      }

      const payload = JSON.stringify({ height: blockHeight.toString(16) })

      const response = await RequestManager.send(
        enums.RPCRoutes.QueryPocketParams.toString(),
        payload,
        node,
        configuration
      )

      // Check if response is an error
      if (!typeGuard(response, RpcErrorResponse)) {

        const queryPocketParamsResponse = QueryPocketParamsResponse.fromJSON(
          JSON.stringify(response.data)
        )
        return queryPocketParamsResponse
      } else {
        return new RpcErrorResponse(
          response.code,
          "Failed to retrieve the pocket params: " + response.message
        )
      }
    } catch (err) {
      return new RpcErrorResponse("0", err)
    }
  }
  /**
   *
   * Retrieves supported chains
   * @param {BigInt} blockHeight - Block's number.
   * @param {Node} node - Node that will receive the relay.
   * @param {Configuration} configuration - Configuration object containing preferences information.
   * @memberof RequestManager
   */
  public static async getSupportedChains(
    blockHeight: BigInt = BigInt(0),
    node: Node,
    configuration: Configuration
  ): Promise<QuerySupportedChainsResponse | RpcErrorResponse> {
    try {
      if (Number(blockHeight.toString(16)) < 0 ) {
        return new RpcErrorResponse("101", "block height can't be lower than 0")
      }

      const payload = JSON.stringify({ height: blockHeight.toString(16) })

      const response = await RequestManager.send(
        enums.RPCRoutes.QuerySupportedChains.toString(),
        payload,
        node,
        configuration
      )

      // Check if response is an error
      if (!typeGuard(response, RpcErrorResponse)) {

        const querySupportedChainsResponse = QuerySupportedChainsResponse.fromJSON(
          JSON.stringify(response.data)
        )
        return querySupportedChainsResponse
      } else {
        return new RpcErrorResponse(
          response.code,
          "Failed to retrieve the supported chains list: " + response.message
        )
      }
    } catch (err) {
      return new RpcErrorResponse("0", err)
    }
  }
  /**
   *
   * Retrieves current supply information
   * @param {BigInt} blockHeight - Block's number.
   * @param {Node} node - Node that will receive the relay.
   * @param {Configuration} configuration - Configuration object containing preferences information.
   * @memberof RequestManager
   */
  public static async getSupply(
    blockHeight: BigInt = BigInt(0),
    node: Node,
    configuration: Configuration
  ): Promise<QuerySupplyResponse | RpcErrorResponse> {
    try {
      if (Number(blockHeight.toString(16)) < 0 ) {
        return new RpcErrorResponse("101", "block height can't be lower than 0")
      }

      const payload = JSON.stringify({ height: blockHeight.toString(16) })

      const response = await RequestManager.send(
        enums.RPCRoutes.QuerySupply.toString(),
        payload,
        node,
        configuration
      )

      // Check if response is an error
      if (!typeGuard(response, RpcErrorResponse)) {
        const querySupplyResponse = QuerySupplyResponse.fromJSON(
          JSON.stringify(response.data)
        )
        return querySupplyResponse
      } else {
        return new RpcErrorResponse(
          response.code,
          "Failed to retrieve the supply information: " + response.message
        )
      }
    } catch (err) {
      return new RpcErrorResponse("0", err)
    }
  }
  
  /**
   * Method to call the v1/client/rawtx endpoint of a given node
   * @param fromAddress {Buffer | string} The address of the sender
   * @param tx {Buffer | string} The amino encoded transaction bytes
   * @param node {Node}
   * @param configuration {Configuration}
   */
  public static async sendRawTx(
    fromAddress: Buffer | string,
    tx: Buffer | string,
    node: Node,
    configuration: Configuration
  ): Promise<RawTxResponse | RpcErrorResponse> {
    try {
      const request = new RawTxRequest(fromAddress.toString('hex'), tx.toString('hex'))
      const payload = JSON.stringify(request.toJSON())
      const response = await RequestManager.send(
        enums.RPCRoutes.QuerySupply.toString(),
        payload,
        node,
        configuration
      )

      // Check if response is an error
      if(typeGuard(response, RpcErrorResponse)) {
        return response as RpcErrorResponse
      } else {
        const error = RpcErrorResponse.fromJSON(JSON.stringify(response.data))
        if (error.isValid()) {
          return error
        }

        const rawTxResponse = RawTxResponse.fromJSON(response.data as string)
        if(typeGuard(rawTxResponse, Error)) {
          return RpcErrorResponse.fromError(rawTxResponse as Error)
        } else {
          return rawTxResponse as RawTxResponse
        }
      }
    } catch (err) {
      return RpcErrorResponse.fromError(err)
    }
  }

  /**
   *
   * Sends a request
   * @param {string} path - Path.
   * @param {Object} payload - Payload object with the parameters.
   * @param {Node} node - Node that will receive the relay.
   * @param {Configuration} configuration - Configuration object containing preferences information.
   * @memberof RequestManager
   */
  private static async send(
    path: string = "",
    payload: {},
    node: Node,
    configuration: Configuration
  ): Promise<SendResponse | RpcErrorResponse> {
    try {
      const axiosInstance = axios.create({
        baseURL: node.serviceURL,
        headers: {
          "Content-Type": "application/json"
        },
        timeout: configuration.requestTimeOut
      })
      // Await response
      const response = await axiosInstance.post(path, payload)
      // Create SendResponse object
      const sendResponse = SendResponse.fromJSON(JSON.stringify(response.data))
      // Check for validation
      if (sendResponse.isValid()) {
        // If successs 200
        if (sendResponse.status === 200) {
          return sendResponse
        } else {
          return new RpcErrorResponse(
            sendResponse.statusText,
            JSON.stringify(sendResponse.data)
          )
        }
      }
      // Request failed
      return new RpcErrorResponse(
        "NONE",
        "Failed to send request with error: " + JSON.stringify(response)
      )
    } catch (error) {
      throw error
    }
  }
}
