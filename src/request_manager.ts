import axios, { AxiosInstance, AxiosResponse } from "axios";
import { Node } from "./models/node";
import { NodeProof } from "./models/input/node_proof";
import { Configuration } from "./configuration/configuration";
import enums = require("./utils/enums");
import { StakingStatus } from "./utils/enums";
import { RelayResponse } from "./models/output/relay_response";
import { DispatchResponse } from "./models/output/dispatch_response";
import { QuerySupplyResponse } from "./models/output/query_supply_response";
import { QueryHeightResponse } from "./models/output/query_height_response";
import { QueryNodesResponse } from "./models/output/query_nodes_response";
import { QueryBlockResponse } from "./models/output/query_block_response";
import { QueryTXResponse } from "./models/output/query_tx_response";
import { QueryBalanceResponse } from "./models/output/query_balance_response";
import { QueryNodeResponse } from "./models/output/query_node_response";
import { QueryNodeParamsResponse } from "./models/output/query_node_params_response";
import { QueryNodeProofsResponse } from "./models/output/query_node_proofs_response";
import { QueryNodeProofResponse } from "./models/output/query_node_proof_response";
import { QueryAppsResponse } from "./models/output/query_apps_response";
import { QueryAppResponse } from "./models/output/query_app_response";
import { QueryAppParamsResponse } from "./models/output/query_app_params_response";
import { QueryPocketParamsResponse } from "./models/output/query_pocket_params_response";
import { QuerySupportedChainsResponse } from "./models/output/query_supported_chains_response";

// Request Manager
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
  public static async relay(payload: {}, node: Node, configuration: Configuration): Promise<RelayResponse | Error> {

    try {
      const response = await RequestManager.send(enums.Routes.RELAY, payload, node, configuration);

      // Check if response is an error
      if (response instanceof Error === false && response) {
        const relayResponse = RelayResponse.fromJSON(response.data as string);
        return relayResponse;
      } else {
        return new Error("Failed to send relay request with error: " + response.data);
      }
    } catch (err) {
      return err
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
  public static async dispatch(payload: {}, node: Node, configuration: Configuration): Promise<DispatchResponse | Error> {
    try {
      const response = await RequestManager.send(enums.Routes.DISPATCH, payload, node, configuration);

      // Check if response is an error
      if (response instanceof Error === false) {
        const dispatchResponse = DispatchResponse.fromJSON(response.data as string);
        return dispatchResponse;
      } else {
        return new Error("Failed to send dispatch request with error: " + response.data);
      }
    } catch (err) {
      return err;
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
  public static async getBlock(blockHeight: BigInt = BigInt(0), node: Node, configuration: Configuration): Promise<QueryBlockResponse | Error> {
    try {
      const payload = JSON.stringify({ "Height": blockHeight });

      const response = await RequestManager.send(enums.RPCRoutes.QueryBlock, payload, node, configuration);
  
      // Check if response is an error
      if (response instanceof Error === false) {
        const queryBlockResponse = QueryBlockResponse.fromJSON(response.data);
        return queryBlockResponse;
      } else {
        return new Error("Failed to retrieve the block information: " + response.data);
      }
    } catch (err) {
      return err;
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
  public static async getTX(txHash: string, node: Node, configuration: Configuration): Promise<QueryTXResponse | Error> {
    try {
      const payload = JSON.stringify({ "Hash": txHash });

      const response = await RequestManager.send(enums.RPCRoutes.QueryTX, payload, node, configuration);
  
      // Check if response is an error
      if (response instanceof Error === false) {
        const queryTXResponse = QueryTXResponse.fromJSON(response.data);
        return queryTXResponse;
      } else {
        return new Error("Failed to retrieve the block information: " + response.data);
      }
    } catch (err) {
      return err;
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
  public static async getHeight(node: Node, configuration: Configuration): Promise<QueryHeightResponse | Error> {
    try {
      const response = await RequestManager.send(enums.RPCRoutes.QueryHeight, {}, node, configuration);

      // Check if response is an error
      if (response instanceof Error === false) {
        const queryHeightResponse = QueryHeightResponse.fromJSON(response.data);
        return queryHeightResponse;
      } else {
        return new Error("Failed to retrieve the network block height: " + response.data);
      }
    } catch (err) {
      return err;
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
  public static async getBalance(address: string, blockHeight: BigInt = BigInt(0), node: Node, configuration: Configuration): Promise<QueryBalanceResponse | Error> {
    try {
      const payload = JSON.stringify({ "Address": address, "Height": blockHeight });

      const response = await RequestManager.send(enums.RPCRoutes.QueryBalance, payload, node, configuration);
  
      // Check if response is an error
      if (response instanceof Error === false) {
        const queryBalanceResponse = QueryBalanceResponse.fromJSON(response.data);
        return queryBalanceResponse;
      } else {
        return new Error("Failed to retrieve current balance: " + response.data);
      }
    } catch (err) {
      return err;
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
  public static async getNodes(stakingStatus: StakingStatus, blockHeight: BigInt = BigInt(0), node: Node, configuration: Configuration): Promise<QueryNodesResponse | Error> {
    try {
      const payload = JSON.stringify({ "StakingStatus": stakingStatus, "Height": blockHeight });

      const response = await RequestManager.send(enums.RPCRoutes.QueryNodes, payload, node, configuration);
  
      // Check if response is an error
      if (response instanceof Error === false) {
        const queryNodesResponse = QueryNodesResponse.fromJSON(response.data);
        return queryNodesResponse;
      } else {
        return new Error("Failed to retrieve a list of nodes: " + response.data);
      }
    } catch (err) {
      return err;
    }
  }
  /**
 *
 * Query a Transaction information
 * @param {string} address - Node address.
 * @param {BigInt} blockHeight - Block's number.
 * @param {Node} node - Node that will receive the relay.
 * @param {Configuration} configuration - Configuration object containing preferences information.
 * @param {callback} callback - (Optional) callback.
 * @memberof RequestManager
 */
  public static async getNode(address: string, blockHeight: BigInt = BigInt(0), node: Node, configuration: Configuration): Promise<QueryNodeResponse | Error> {
    try {
      const payload = JSON.stringify({ "Address": address, "Height": blockHeight });

      const response = await RequestManager.send(enums.RPCRoutes.QueryNode, payload, node, configuration);
  
      // Check if response is an error
      if (response instanceof Error === false) {
        const queryNodeResponse = QueryNodeResponse.fromJSON(response.data);
        return queryNodeResponse;
      } else {
        return new Error("Failed to retrieve the node information: " + response.data);
      }
    } catch (err) {
      return err;
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
  public static async getNodeParams(blockHeight: BigInt = BigInt(0), node: Node, configuration: Configuration): Promise<QueryNodeParamsResponse | Error> {
    try {
      const payload = JSON.stringify({ "Height": blockHeight });

      const response = await RequestManager.send(enums.RPCRoutes.QueryNodeParams, payload, node, configuration);
  
      // Check if response is an error
      if (response instanceof Error === false) {
        const queryNodeParamsResponse = QueryNodeParamsResponse.fromJSON(response.data);
        return queryNodeParamsResponse;
      } else {
        return new Error("Failed to retrieve the node params information: " + response.data);
      }
    } catch (err) {
      return err;
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
  public static async getNodeProofs(address: string, blockHeight: BigInt = BigInt(0), node: Node, configuration: Configuration): Promise<QueryNodeProofsResponse | Error> {
    try {
      const payload = JSON.stringify({ "Address": address, "Height": blockHeight });

      const response = await RequestManager.send(enums.RPCRoutes.QueryNodeProofs, payload, node, configuration);
  
      // Check if response is an error
      if (response instanceof Error === false) {
        const queryNodeProofsResponse = QueryNodeProofsResponse.fromJSON(response.data);
        return queryNodeProofsResponse;
      } else {
        return new Error("Failed to retrieve the node proofs: " + response.data);
      }
    } catch (err) {
      return err;
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
  public static async getNodeProof(nodeProof: NodeProof, node: Node, configuration: Configuration): Promise<QueryNodeProofResponse | Error> {
    try {
      const payload = JSON.stringify(nodeProof.toJSON());

      const response = await RequestManager.send(enums.RPCRoutes.QueryNodeProof, payload, node, configuration);
  
      // Check if response is an error
      if (response instanceof Error === false) {
        const queryNodeProofResponse = QueryNodeProofResponse.fromJSON(response.data);
        return queryNodeProofResponse;
      } else {
        return new Error("Failed to retrieve the node proof: " + response.data);
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
  public static async getApps(stakingStatus: StakingStatus, blockHeight: BigInt = BigInt(0), node: Node, configuration: Configuration): Promise<QueryAppsResponse | Error> {
    try {
      const payload = JSON.stringify({ "StakingStatus": stakingStatus, "Height": blockHeight });

      const response = await RequestManager.send(enums.RPCRoutes.QueryApps, payload, node, configuration);
  
      // Check if response is an error
      if (response instanceof Error === false) {
        const queryAppsResponse = QueryAppsResponse.fromJSON(response.data)
        return queryAppsResponse;
      } else {
        return new Error("Failed to retrieve the list of apps: " + response.data);
      }
    } catch (err) {
      return err;
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
  public static async getApp(address: string, blockHeight: BigInt = BigInt(0), node: Node, configuration: Configuration): Promise<QueryAppResponse | Error> {
    try {
      const payload = JSON.stringify({ "Address": address, "Height": blockHeight });

      const response = await RequestManager.send(enums.RPCRoutes.QueryApp, payload, node, configuration);
  
      // Check if response is an error
      if (response instanceof Error === false) {
        const queryAppResponse = QueryAppResponse.fromJSON(response.data);
        return queryAppResponse;
      } else {
        return new Error("Failed to retrieve the app infromation: " + response.data);
      }
    } catch (err) {
      return err;
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
  public static async getAppParams(blockHeight: BigInt = BigInt(0), node: Node, configuration: Configuration): Promise<QueryAppParamsResponse | Error> {
    try {
      const payload = JSON.stringify({ "Height": blockHeight });

      const response = await RequestManager.send(enums.RPCRoutes.QueryAppParams, payload, node, configuration);
  
      // Check if response is an error
      if (response instanceof Error === false) {
        const queryAppParamsResponse = QueryAppParamsResponse.fromJSON(response.data)
        return queryAppParamsResponse;
      } else {
        return new Error("Failed to retrieve the app params: " + response.data);
      }
    } catch (err) {
      return err;
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
  public static async getPocketParams(blockHeight: BigInt = BigInt(0), node: Node, configuration: Configuration): Promise<QueryPocketParamsResponse | Error> {
    try {
      const payload = JSON.stringify({ "Height": blockHeight });

      const response = await RequestManager.send(enums.RPCRoutes.QueryPocketParams, payload, node, configuration);
  
      // Check if response is an error
      if (response instanceof Error === false) {
        const queryPocketParamsResponse = QueryPocketParamsResponse.fromJSON(response.data);
        return queryPocketParamsResponse;
      } else {
        return new Error("Failed to retrieve the pocket params: " + response.data);
      }
    } catch (err) {
      return err;
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
  public static async getSupportedChains(blockHeight: BigInt = BigInt(0), node: Node, configuration: Configuration): Promise<QuerySupportedChainsResponse | Error> {
    try {
      const payload = JSON.stringify({ "Height": blockHeight });

      const response = await RequestManager.send(enums.RPCRoutes.QuerySupportedChains, payload, node, configuration);
  
      // Check if response is an error
      if (response instanceof Error === false) {
        const querySupportedChainsResponse = QuerySupportedChainsResponse.fromJSON(response.data);
        return querySupportedChainsResponse;
      } else {
        return new Error("Failed to retrieve the supported chains list: " + response.data);
      }
    } catch (err) {
      return err;
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
  public static async getSupply(blockHeight: BigInt = BigInt(0), node: Node, configuration: Configuration): Promise<QuerySupplyResponse | Error> {
    try {
      const payload = JSON.stringify({ "Height": blockHeight });

      const response = await RequestManager.send(enums.RPCRoutes.QuerySupply, payload, node, configuration);
  
      // Check if response is an error
      if (response instanceof Error === false) {
        const querySupplyResponse = QuerySupplyResponse.fromJSON(response.data as string);
  
        return querySupplyResponse;
      } else {
        return new Error("Failed to retrieve the supply information: " + response.data);
      }
    } catch (err) {
      return err;
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
      throw error
    }
  }
}
