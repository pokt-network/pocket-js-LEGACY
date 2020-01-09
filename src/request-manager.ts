import axios, { AxiosInstance, AxiosResponse } from "axios";
import { Node } from "./models/node";
import { NodeProof } from "./models/input/node-proof";
import { Configuration } from "./configuration/configuration";
import enums = require("./utils/enums");
import { StakingStatus } from "./utils/enums";
import { RelayResponse } from "./models/output/relay-response";
import { DispatchResponse } from "./models/output/dispatch-response";
import { QuerySupplyResponse } from "./models/output/query-supply-response";
import { QueryHeightResponse } from "./models/output/query-height-response";
import { QueryNodesResponse } from "./models/output/query-nodes-response";
import { QueryBlockResponse } from "./models/output/query-block-response";
import { QueryTXResponse } from "./models/output/query-tx-response";
import { QueryBalanceResponse } from "./models/output/query-balance-response";
import { QueryNodeResponse } from "./models/output/query-node-response";
import { QueryNodeParamsResponse } from "./models/output/query-node-params-response";
import { QueryNodeProofsResponse } from "./models/output/query-node-proofs-response";
import { QueryNodeProofResponse } from "./models/output/query-node-proof-response";
import { QueryAppsResponse } from "./models/output/query-apps-response";
import { QueryAppResponse } from "./models/output/query-app-response";
import { QueryAppParamsResponse } from "./models/output/query-app-params-response";
import { QueryPocketParamsResponse } from "./models/output/query-pocket-params-response";
import { QuerySupportedChainsResponse } from "./models/output/query-supported-chains-response";
import { RpcErrorResponse } from "./models/output/rpc-error-response";
import { RelayRequest } from "./models/input/relay-request";
import { DispatchRequest } from "./models/input/dispatch-request";
import { typeGuard } from "./utils/type-guard";

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
 * @param {callback} callback - (Optional) callback.
 * @memberof RequestManager
 */
  public static async relay(request: RelayRequest, node: Node, configuration: Configuration): Promise<RelayResponse | RpcErrorResponse> {

    try {
      const response = await RequestManager.send(enums.Routes.RELAY, request.toJSON(), node, configuration);

      // Check if response is an error
      if (!typeGuard(response, Error)) {
        const error = RpcErrorResponse.fromJSON(JSON.stringify(response.data))
        if (error.isValid()) {
          return error;
        }
        const relayResponse = RelayResponse.fromJSON(response.data as string);
        return relayResponse;
      } else {
        return new RpcErrorResponse(response.status.toString(), "Failed to send relay request with error: " + response.data);
      }
    } catch (err) {
      return new RpcErrorResponse("0",err);
    }
  }
  /**
 *
 * Sends a dispatch request
 * @param {Object} payload - Payload object containing the needed parameters.
 * @param {Node} node - Node that will receive the relay.
 * @param {Configuration} configuration - Configuration object containing preferences information.
 * @param {callback} callback - (Optional) callback.
 * @memberof RequestManager
 */
  public static async dispatch(request: DispatchRequest, node: Node, configuration: Configuration): Promise<DispatchResponse | RpcErrorResponse >{
    try {
      const response = await RequestManager.send(enums.Routes.DISPATCH, request.toJSON(), node, configuration);

      // Check if response is an error
      if (!typeGuard(response, Error)) {
        const error = RpcErrorResponse.fromJSON(JSON.stringify(response.data))
        if (error.isValid()) {
          return error;
        }
        const dispatchResponse = DispatchResponse.fromJSON(response.data);
        return dispatchResponse;
      } else {
        return new RpcErrorResponse(response.status.toString(), "Failed to send dispatch request with error: " + response.data);
      }
    } catch (err) {
      return new RpcErrorResponse("0",err);
    }
  }
  /**
 *
 * Query a Block information
 * @param {BigInt} blockHeight - Block's number.
 * @param {Node} node - Node that will receive the relay.
 * @param {Configuration} configuration - Configuration object containing preferences information.
 * @param {callback} callback - (Optional) callback.
 * @memberof RequestManager
 */
  public static async getBlock(blockHeight: BigInt = BigInt(0), node: Node, configuration: Configuration): Promise<QueryBlockResponse | RpcErrorResponse >{
    try {
      const payload = JSON.stringify({ "Height": blockHeight });

      const response = await RequestManager.send(enums.RPCRoutes.QueryBlock, payload, node, configuration);
  
      // Check if response is an error
      if (!typeGuard(response, Error)) {
        const error = RpcErrorResponse.fromJSON(JSON.stringify(response.data))
        if (error.isValid()) {
          return error;
        }
        const queryBlockResponse = QueryBlockResponse.fromJSON(response.data);
        return queryBlockResponse;
      } else {
        return new RpcErrorResponse(response.status.toString(), "Failed to retrieve the block information: " + response.data);
      }
    } catch (err) {
      return new RpcErrorResponse("0",err);
    }
  }
  /**
 *
 * Retrieves a transaction information
 * @param {string} txHash - Transaction hash.
 * @param {Node} node - Node that will receive the relay.
 * @param {Configuration} configuration - Configuration object containing preferences information.
 * @param {callback} callback - (Optional) callback.
 * @memberof RequestManager
 */
  public static async getTX(txHash: string, node: Node, configuration: Configuration): Promise<QueryTXResponse | RpcErrorResponse >{
    try {
      const payload = JSON.stringify({ "Hash": txHash });

      const response = await RequestManager.send(enums.RPCRoutes.QueryTX, payload, node, configuration);
  
      // Check if response is an error
      if (!typeGuard(response, Error)) {
        const error = RpcErrorResponse.fromJSON(JSON.stringify(response.data))
        if (error.isValid()) {
          return error;
        }
        const queryTXResponse = QueryTXResponse.fromJSON(response.data);
        return queryTXResponse;
      } else {
        return new RpcErrorResponse(response.status.toString(), "Failed to retrieve the block information: " + response.data);
      }
    } catch (err) {
      return new RpcErrorResponse("0",err);
    }
  }
  /**
 *
 * Get the current network block height
 * @param {Node} node - Node that will receive the relay.
 * @param {Configuration} configuration - Configuration object containing preferences information.
 * @param {callback} callback - (Optional) callback.
 * @memberof RequestManager
 */
  public static async getHeight(node: Node, configuration: Configuration): Promise<QueryHeightResponse | RpcErrorResponse >{
    try {
      const response = await RequestManager.send(enums.RPCRoutes.QueryHeight, {}, node, configuration);

      // Check if response is an error
      if (!typeGuard(response, Error)) {
        const error = RpcErrorResponse.fromJSON(JSON.stringify(response.data))
        if (error.isValid()) {
          return error;
        }
        const queryHeightResponse = QueryHeightResponse.fromJSON(response.data);
        return queryHeightResponse;
      } else {
        return new RpcErrorResponse(response.status.toString(), "Failed to retrieve the network block height: " + response.data);
      }
    } catch (err) {
      return new RpcErrorResponse("0",err);
    }
  }
  /**
 *
 * Retrieves an account balance
 * @param {string} address - Account's address.
 * @param {BigInt} blockHeight - Block's number.
 * @param {Node} node - Node that will receive the relay.
 * @param {Configuration} configuration - Configuration object containing preferences information.
 * @param {callback} callback - (Optional) callback.
 * @memberof RequestManager
 */
  public static async getBalance(address: string, blockHeight: BigInt = BigInt(0), node: Node, configuration: Configuration): Promise<QueryBalanceResponse | RpcErrorResponse >{
    try {
      const payload = JSON.stringify({ "Address": address, "Height": blockHeight });

      const response = await RequestManager.send(enums.RPCRoutes.QueryBalance, payload, node, configuration);
  
      // Check if response is an error
      if (!typeGuard(response, Error)) {
        const error = RpcErrorResponse.fromJSON(JSON.stringify(response.data))
        if (error.isValid()) {
          return error;
        }
        const queryBalanceResponse = QueryBalanceResponse.fromJSON(response.data);
        return queryBalanceResponse;
      } else {
        return new RpcErrorResponse(response.status.toString(), "Failed to retrieve current balance: " + response.data);
      }
    } catch (err) {
      return new RpcErrorResponse("0",err);
    }
  }
  /**
 *
 * Retrieves a list of nodes
 * @param {StakingStatus} stakingStatus - Staking status.
 * @param {BigInt} blockHeight - Block's number.
 * @param {Node} node - Node that will receive the relay.
 * @param {Configuration} configuration - Configuration object containing preferences information.
 * @param {callback} callback - (Optional) callback.
 * @memberof RequestManager
 */
  public static async getNodes(stakingStatus: StakingStatus, blockHeight: BigInt = BigInt(0), node: Node, configuration: Configuration): Promise<QueryNodesResponse | RpcErrorResponse >{
    try {
      const payload = JSON.stringify({ "StakingStatus": stakingStatus, "Height": blockHeight });

      const response = await RequestManager.send(enums.RPCRoutes.QueryNodes, payload, node, configuration);
  
      // Check if response is an error
      if (!typeGuard(response, Error)) {
        const error = RpcErrorResponse.fromJSON(JSON.stringify(response.data))
        if (error.isValid()) {
          return error;
        }
        const queryNodesResponse = QueryNodesResponse.fromJSON(response.data);
        return queryNodesResponse;
      } else {
        return new RpcErrorResponse(response.status.toString(), "Failed to retrieve a list of nodes: " + response.data);
      }
    } catch (err) {
      return new RpcErrorResponse("0",err);
    }
  }
  /**
 *
 * Query a Node information
 * @param {string} address - Node address.
 * @param {BigInt} blockHeight - Block's number.
 * @param {Node} node - Node that will receive the relay.
 * @param {Configuration} configuration - Configuration object containing preferences information.
 * @param {callback} callback - (Optional) callback.
 * @memberof RequestManager
 */
  public static async getNode(address: string, blockHeight: BigInt = BigInt(0), node: Node, configuration: Configuration): Promise<QueryNodeResponse | RpcErrorResponse >{
    try {
      const payload = JSON.stringify({ "Address": address, "Height": blockHeight });

      const response = await RequestManager.send(enums.RPCRoutes.QueryNode, payload, node, configuration);
  
      // Check if response is an error
      if (!typeGuard(response, Error)) {
        const error = RpcErrorResponse.fromJSON(JSON.stringify(response.data))
        if (error.isValid()) {
          return error;
        }
        const queryNodeResponse = QueryNodeResponse.fromJSON(response.data);
        return queryNodeResponse;
      } else {
        return new RpcErrorResponse(response.status.toString(), "Failed to retrieve the node information: " + response.data);
      }
    } catch (err) {
      return new RpcErrorResponse("0",err);
    }
  }
  /**
 *
 * Retrieves the node params
 * @param {BigInt} blockHeight - Block's number.
 * @param {Node} node - Node that will receive the relay.
 * @param {Configuration} configuration - Configuration object containing preferences information.
 * @param {callback} callback - (Optional) callback.
 * @memberof RequestManager
 */
  public static async getNodeParams(blockHeight: BigInt = BigInt(0), node: Node, configuration: Configuration): Promise<QueryNodeParamsResponse | RpcErrorResponse >{
    try {
      const payload = JSON.stringify({ "Height": blockHeight });

      const response = await RequestManager.send(enums.RPCRoutes.QueryNodeParams, payload, node, configuration);
  
      // Check if response is an error
      if (!typeGuard(response, Error)) {
        const error = RpcErrorResponse.fromJSON(JSON.stringify(response.data))
        if (error.isValid()) {
          return error;
        }
        const queryNodeParamsResponse = QueryNodeParamsResponse.fromJSON(response.data);
        return queryNodeParamsResponse;
      } else {
        return new RpcErrorResponse(response.status.toString(), "Failed to retrieve the node params information: " + response.data);
      }
    } catch (err) {
      return new RpcErrorResponse("0",err);
    }
  }
  /**
 *
 * Retrieves the node proofs information
 * @param {string} address - Node's address.
 * @param {BigInt} blockHeight - Block's number.
 * @param {Node} node - Node that will receive the relay.
 * @param {Configuration} configuration - Configuration object containing preferences information.
 * @param {callback} callback - (Optional) callback.
 * @memberof RequestManager
 */
  public static async getNodeProofs(address: string, blockHeight: BigInt = BigInt(0), node: Node, configuration: Configuration): Promise<QueryNodeProofsResponse | RpcErrorResponse >{
    try {
      const payload = JSON.stringify({ "Address": address, "Height": blockHeight });

      const response = await RequestManager.send(enums.RPCRoutes.QueryNodeProofs, payload, node, configuration);
  
      // Check if response is an error
      if (!typeGuard(response, Error)) {
        const error = RpcErrorResponse.fromJSON(JSON.stringify(response.data))
        if (error.isValid()) {
          return error;
        }
        const queryNodeProofsResponse = QueryNodeProofsResponse.fromJSON(response.data);
        return queryNodeProofsResponse;
      } else {
        return new RpcErrorResponse(response.status.toString(), "Failed to retrieve the node proofs: " + response.data);
      }
    } catch (err) {
      return new RpcErrorResponse("0",err);
    }
  }
  /**
 *
 * Retrieves the node proof information
 * @param {NodeProof} nodeProof - Node's address.
 * @param {Node} node - Node that will receive the relay.
 * @param {Configuration} configuration - Configuration object containing preferences information.
 * @param {callback} callback - (Optional) callback.
 * @memberof RequestManager
 */
  public static async getNodeProof(nodeProof: NodeProof, node: Node, configuration: Configuration): Promise<QueryNodeProofResponse | RpcErrorResponse >{
    try {
      const payload = JSON.stringify(nodeProof.toJSON());

      const response = await RequestManager.send(enums.RPCRoutes.QueryNodeProof, payload, node, configuration);
  
      // Check if response is an error
      if (!typeGuard(response, Error)) {
        const error = RpcErrorResponse.fromJSON(JSON.stringify(response.data))
        if (error.isValid()) {
          return error;
        }
        const queryNodeProofResponse = QueryNodeProofResponse.fromJSON(response.data);
        return queryNodeProofResponse;
      } else {
        return new RpcErrorResponse(response.status.toString(), "Failed to retrieve the node proof: " + response.data);
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
 * @param {callback} callback - (Optional) callback.
 * @memberof RequestManager
 */
  public static async getApps(stakingStatus: StakingStatus, blockHeight: BigInt = BigInt(0), node: Node, configuration: Configuration): Promise<QueryAppsResponse | RpcErrorResponse >{
    try {
      const payload = JSON.stringify({ "StakingStatus": stakingStatus, "Height": blockHeight });

      const response = await RequestManager.send(enums.RPCRoutes.QueryApps, payload, node, configuration);
  
      // Check if response is an error
      if (!typeGuard(response, Error)) {
        const error = RpcErrorResponse.fromJSON(JSON.stringify(response.data))
        if (error.isValid()) {
          return error;
        }
        const queryAppsResponse = QueryAppsResponse.fromJSON(response.data)
        return queryAppsResponse;
      } else {
        return new RpcErrorResponse(response.status.toString(), "Failed to retrieve the list of apps: " + response.data);
      }
    } catch (err) {
      return new RpcErrorResponse("0",err);
    }
  }
  /**
 *
 * Retrieves an app information
 * @param {string} address - Address of the app.
 * @param {BigInt} blockHeight - Block's number.
 * @param {Node} node - Node that will receive the relay.
 * @param {Configuration} configuration - Configuration object containing preferences information.
 * @param {callback} callback - (Optional) callback.
 * @memberof RequestManager
 */
  public static async getApp(address: string, blockHeight: BigInt = BigInt(0), node: Node, configuration: Configuration): Promise<QueryAppResponse | RpcErrorResponse >{
    try {
      const payload = JSON.stringify({ "Address": address, "Height": blockHeight });

      const response = await RequestManager.send(enums.RPCRoutes.QueryApp, payload, node, configuration);
  
      // Check if response is an error
      if (!typeGuard(response, Error)) {
        const error = RpcErrorResponse.fromJSON(JSON.stringify(response.data))
        if (error.isValid()) {
          return error;
        }
        const queryAppResponse = QueryAppResponse.fromJSON(response.data);
        return queryAppResponse;
      } else {
        return new RpcErrorResponse(response.status.toString(), "Failed to retrieve the app infromation: " + response.data);
      }
    } catch (err) {
      return new RpcErrorResponse("0",err);
    }
  }
  /**
 *
 * Retrieves app params.
 * @param {BigInt} blockHeight - Block's number.
 * @param {Node} node - Node that will receive the relay.
 * @param {Configuration} configuration - Configuration object containing preferences information.
 * @param {callback} callback - (Optional) callback.
 * @memberof RequestManager
 */
  public static async getAppParams(blockHeight: BigInt = BigInt(0), node: Node, configuration: Configuration): Promise<QueryAppParamsResponse | RpcErrorResponse >{
    try {
      const payload = JSON.stringify({ "Height": blockHeight });

      const response = await RequestManager.send(enums.RPCRoutes.QueryAppParams, payload, node, configuration);
  
      // Check if response is an error
      if (!typeGuard(response, Error)) {
        const error = RpcErrorResponse.fromJSON(JSON.stringify(response.data))
        if (error.isValid()) {
          return error;
        }
        const queryAppParamsResponse = QueryAppParamsResponse.fromJSON(response.data)
        return queryAppParamsResponse;
      } else {
        return new RpcErrorResponse(response.status.toString(), "Failed to retrieve the app params: " + response.data);
      }
    } catch (err) {
      return new RpcErrorResponse("0",err);
    }
  }
  /**
 *
 * Retrieves the pocket params.
 * @param {BigInt} blockHeight - Block's number.
 * @param {Node} node - Node that will receive the relay.
 * @param {Configuration} configuration - Configuration object containing preferences information.
 * @param {callback} callback - (Optional) callback.
 * @memberof RequestManager
 */
  public static async getPocketParams(blockHeight: BigInt = BigInt(0), node: Node, configuration: Configuration): Promise<QueryPocketParamsResponse | RpcErrorResponse >{
    try {
      const payload = JSON.stringify({ "Height": blockHeight });

      const response = await RequestManager.send(enums.RPCRoutes.QueryPocketParams, payload, node, configuration);
  
      // Check if response is an error
      if (!typeGuard(response, Error)) {
        const error = RpcErrorResponse.fromJSON(JSON.stringify(response.data))
        if (error.isValid()) {
          return error;
        }
        const queryPocketParamsResponse = QueryPocketParamsResponse.fromJSON(response.data);
        return queryPocketParamsResponse;
      } else {
        return new RpcErrorResponse(response.status.toString(), "Failed to retrieve the pocket params: " + response.data);
      }
    } catch (err) {
      return new RpcErrorResponse("0",err);
    }
  }
  /**
 *
 * Retrieves supported chains
 * @param {BigInt} blockHeight - Block's number.
 * @param {Node} node - Node that will receive the relay.
 * @param {Configuration} configuration - Configuration object containing preferences information.
 * @param {callback} callback - (Optional) callback.
 * @memberof RequestManager
 */
  public static async getSupportedChains(blockHeight: BigInt = BigInt(0), node: Node, configuration: Configuration): Promise<QuerySupportedChainsResponse | RpcErrorResponse >{
    try {
      const payload = JSON.stringify({ "Height": blockHeight });

      const response = await RequestManager.send(enums.RPCRoutes.QuerySupportedChains, payload, node, configuration);
  
      // Check if response is an error
      if (!typeGuard(response, Error)) {
        const error = RpcErrorResponse.fromJSON(JSON.stringify(response.data))
        if (error.isValid()) {
          return error;
        }
        const querySupportedChainsResponse = QuerySupportedChainsResponse.fromJSON(response.data);
        return querySupportedChainsResponse;
      } else {
        return new RpcErrorResponse(response.status.toString(), "Failed to retrieve the supported chains list: " + response.data);
      }
    } catch (err) {
      return new RpcErrorResponse("0",err);
    }
  }
  /**
 *
 * Retrieves current supply information
 * @param {BigInt} blockHeight - Block's number.
 * @param {Node} node - Node that will receive the relay.
 * @param {Configuration} configuration - Configuration object containing preferences information.
 * @param {callback} callback - (Optional) callback.
 * @memberof RequestManager
 */
  public static async getSupply(blockHeight: BigInt = BigInt(0), node: Node, configuration: Configuration): Promise<QuerySupplyResponse | RpcErrorResponse >{
    try {
      const payload = JSON.stringify({ "Height": blockHeight });

      const response = await RequestManager.send(enums.RPCRoutes.QuerySupply, payload, node, configuration);
  
      // Check if response is an error
      if (!typeGuard(response, Error)) {
        const error = RpcErrorResponse.fromJSON(JSON.stringify(response.data))
        if (error.isValid()) {
          return error;
        }
        const querySupplyResponse = QuerySupplyResponse.fromJSON(response.data as string);
  
        return querySupplyResponse;
      } else {
        return new RpcErrorResponse(response.status.toString(), "Failed to retrieve the supply information: " + response.data);
      }
    } catch (err) {
      return new RpcErrorResponse("0",err);
    }
  }
  /**
 *
 * Sends a request
 * @param {string} path - Path.
 * @param {Object} payload - Payload object with the parameters.
 * @param {Node} node - Node that will receive the relay.
 * @param {Configuration} configuration - Configuration object containing preferences information.
 * @param {callback} callback - (Optional) callback.
 * @memberof RequestManager
 */
  private static async send(path: string = "", payload: {}, node: Node, configuration: Configuration) {
    try {
      const axiosInstance = axios.create({
        headers: {
          "Content-Type": "application/json"
        },
        timeout: configuration.requestTimeOut,
        url: node.serviceURL// TODO: ERROR OUT NODE WITHOUT HTTPS: URI and the scheme to https
      });

      const response = await axiosInstance.post(path,
        payload
      );

      return response;
    } catch (error) {
      throw error;
    }
  }
}
