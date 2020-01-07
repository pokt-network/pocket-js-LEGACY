import axios, { AxiosInstance, AxiosResponse } from "axios";
import { Node } from "./models/node";
import { NodeProof } from "./models/input/node_proof";
import { Configuration } from "./configuration/configuration";
import paths = require("./utils/enums");
import { RelayResponse } from "./models/output/relay_response";

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
   * @returns {NodeProof} - NodeProof object.
   * @memberof NodeProof
   */
  public static async relay(payload: {}, node: Node, configuration: Configuration,
    callback?: (response?: RelayResponse, error?: Error) => any) {

    const response = await RequestManager.send(paths.Routes.RELAY, payload, node, configuration);

    // Check if response is an error
    if (response instanceof Error === false) {
      var relayResponse = RelayResponse.fromJSON(response.data as string);
      if (callback) {
        callback(relayResponse);
        return;
      } else {
        return relayResponse;
      }
    } else {
      if (callback) {
        callback(undefined, new Error("Failed to send relay request with error: " + response.data));
        return;
      } else {
        return new Error("Failed to send relay request with error: " + response.data);
      }
    }
  }
  // Send dispatch
  public static async dispatch(payload: {}, node: Node, configuration: Configuration,
    callback?: (response?: any, error?: Error) => any) {

    const response = await RequestManager.send(paths.Routes.DISPATCH, payload, node, configuration);

    // Check if response is an error
    if (response instanceof Error === false) {
      if (callback) {
        callback(response);
        return;
      } else {
        return response;
      }
    } else {
      if (callback) {
        callback(undefined, new Error("Failed to send dispatch request with error: " + response.data));
        return;
      } else {
        return new Error("Failed to send dispatch request with error: " + response.data);
      }
    }
  }


  // RPC calls

  // QueryBlock
  public static async getBlock(block: BigInt = BigInt(0), node: Node, configuration: Configuration, callback?: (response?: any, error?: Error) => any) {

    var payload = JSON.stringify({ "Height": block });

    const response = await RequestManager.send(paths.RPCRoutes.QueryBlock, payload, node, configuration);

    // Check if response is an error
    if (response instanceof Error === false) {
      if (callback) {
        callback(response);
        return;
      } else {
        return response;
      }
    } else {
      if (callback) {
        callback(undefined, new Error("Failed to retrieve the block information: " + response.data));
        return;
      } else {
        return new Error("Failed to retrieve the block information: " + response.data);
      }
    }
  }

  // QueryTX
  public static async getTX(txHash: string, node: Node, configuration: Configuration, callback?: (response?: any, error?: Error) => any) {

    var payload = JSON.stringify({ "Hash": txHash });

    const response = await RequestManager.send(paths.RPCRoutes.QueryTX, payload, node, configuration);

    // Check if response is an error
    if (response instanceof Error === false) {
      if (callback) {
        callback(response);
        return;
      } else {
        return response;
      }
    } else {
      if (callback) {
        callback(undefined, new Error("Failed to retrieve the block information: " + response.data));
        return;
      } else {
        return new Error("Failed to retrieve the block information: " + response.data);
      }
    }
  }

  // QueryTX
  public static async getHeight(node: Node, configuration: Configuration, callback?: (response?: any, error?: Error) => any) {

    var payload = JSON.stringify({ "obj": "" });

    const response = await RequestManager.send(paths.RPCRoutes.QueryHeight, payload, node, configuration);

    // Check if response is an error
    if (response instanceof Error === false) {
      if (callback) {
        callback(response);
        return;
      } else {
        return response;
      }
    } else {
      if (callback) {
        callback(undefined, new Error("Failed to retrieve the block information: " + response.data));
        return;
      } else {
        return new Error("Failed to retrieve the block information: " + response.data);
      }
    }
  }

  // QueryBalance
  public static async getBalance(address: string, blockHeight: BigInt = BigInt(0), node: Node, configuration: Configuration, callback?: (response?: any, error?: Error) => any) {

    var payload = JSON.stringify({ "Address": address, "Height": blockHeight });

    const response = await RequestManager.send(paths.RPCRoutes.QueryBalance, payload, node, configuration);

    // Check if response is an error
    if (response instanceof Error === false) {
      if (callback) {
        callback(response);
        return;
      } else {
        return response;
      }
    } else {
      if (callback) {
        callback(undefined, new Error("Failed to retrieve current balance: " + response.data));
        return;
      } else {
        return new Error("Failed to retrieve current balance: " + response.data);
      }
    }
  }

  // QueryNodes
  public static async getNodes(stakingStatus: string, blockHeight: BigInt = BigInt(0), node: Node, configuration: Configuration, callback?: (response?: any, error?: Error) => any) {

    var payload = JSON.stringify({ "StakingStatus": stakingStatus, "Height": blockHeight});

    const response = await RequestManager.send(paths.RPCRoutes.QueryNodes, payload, node, configuration);

    // Check if response is an error
    if (response instanceof Error === false) {
      if (callback) {
        callback(response);
        return;
      } else {
        return response;
      }
    } else {
      if (callback) {
        callback(undefined, new Error("Failed to retrieve a list of nodes: " + response.data));
        return;
      } else {
        return new Error("Failed to retrieve a list of nodes: " + response.data);
      }
    }
  }

  // QueryNode
  public static async getNode(address: string, blockHeight: BigInt = BigInt(0), node: Node, configuration: Configuration, callback?: (response?: any, error?: Error) => any) {

    var payload = JSON.stringify({ "Address": address, "Height": blockHeight });

    const response = await RequestManager.send(paths.RPCRoutes.QueryNode, payload, node, configuration);

    // Check if response is an error
    if (response instanceof Error === false) {
      if (callback) {
        callback(response);
        return;
      } else {
        return response;
      }
    } else {
      if (callback) {
        callback(undefined, new Error("Failed to retrieve the node information: " + response.data));
        return;
      } else {
        return new Error("Failed to retrieve the node information: " + response.data);
      }
    }
  }

  // QueryNodeParams
  public static async getNodeParams(blockHeight: BigInt = BigInt(0), node: Node, configuration: Configuration, callback?: (response?: any, error?: Error) => any) {

    var payload = JSON.stringify({"Height": blockHeight });

    const response = await RequestManager.send(paths.RPCRoutes.QueryNodeParams, payload, node, configuration);

    // Check if response is an error
    if (response instanceof Error === false) {
      if (callback) {
        callback(response);
        return;
      } else {
        return response;
      }
    } else {
      if (callback) {
        callback(undefined, new Error("Failed to retrieve the node params information: " + response.data));
        return;
      } else {
        return new Error("Failed to retrieve the node params information: " + response.data);
      }
    }
  }

  // QueryNodeProofs
  public static async getNodeProofs(address: string, blockHeight: BigInt = BigInt(0), node: Node, configuration: Configuration, callback?: (response?: any, error?: Error) => any) {

    var payload = JSON.stringify({ "Address": address, "Height": blockHeight });

    const response = await RequestManager.send(paths.RPCRoutes.QueryNodeProofs, payload, node, configuration);

    // Check if response is an error
    if (response instanceof Error === false) {
      if (callback) {
        callback(response);
        return;
      } else {
        return response;
      }
    } else {
      if (callback) {
        callback(undefined, new Error("Failed to retrieve the node proofs: " + response.data));
        return;
      } else {
        return new Error("Failed to retrieve the node proofs: " + response.data);
      }
    }
  }

  // QueryNodeProof
  public static async getNodeProof(nodeProof: NodeProof, node: Node, configuration: Configuration, callback?: (response?: any, error?: Error) => any) {

    var payload = JSON.stringify(nodeProof.toJSON());

    const response = await RequestManager.send(paths.RPCRoutes.QueryNodeProof, payload, node, configuration);

    // Check if response is an error
    if (response instanceof Error === false) {
      if (callback) {
        callback(response);
        return;
      } else {
        return response;
      }
    } else {
      if (callback) {
        callback(undefined, new Error("Failed to retrieve the node proof: " + response.data));
        return;
      } else {
        return new Error("Failed to retrieve the node proof: " + response.data);
      }
    }
  }

  // QueryApps
  public static async getApps(stakingStatus: string, blockHeight: BigInt = BigInt(0), node: Node, configuration: Configuration, callback?: (response?: any, error?: Error) => any) {

    var payload = JSON.stringify({ "StakingStatus": stakingStatus, "Height": blockHeight});

    const response = await RequestManager.send(paths.RPCRoutes.QueryApps, payload, node, configuration);

    // Check if response is an error
    if (response instanceof Error === false) {
      if (callback) {
        callback(response);
        return;
      } else {
        return response;
      }
    } else {
      if (callback) {
        callback(undefined, new Error("Failed to retrieve the list of apps: " + response.data));
        return;
      } else {
        return new Error("Failed to retrieve the list of apps: " + response.data);
      }
    }
  }
  
  // QueryApp
  public static async getApp(address: string, blockHeight: BigInt = BigInt(0), node: Node, configuration: Configuration, callback?: (response?: any, error?: Error) => any) {

    var payload = JSON.stringify({ "Address": address, "Height": blockHeight});

    const response = await RequestManager.send(paths.RPCRoutes.QueryApp, payload, node, configuration);

    // Check if response is an error
    if (response instanceof Error === false) {
      if (callback) {
        callback(response);
        return;
      } else {
        return response;
      }
    } else {
      if (callback) {
        callback(undefined, new Error("Failed to retrieve the app information: " + response.data));
        return;
      } else {
        return new Error("Failed to retrieve the app infromation: " + response.data);
      }
    }
  }

  // QueryAppParams
  public static async getAppParams(blockHeight: BigInt = BigInt(0), node: Node, configuration: Configuration, callback?: (response?: any, error?: Error) => any) {

    var payload = JSON.stringify({"Height": blockHeight});

    const response = await RequestManager.send(paths.RPCRoutes.QueryAppParams, payload, node, configuration);

    // Check if response is an error
    if (response instanceof Error === false) {
      if (callback) {
        callback(response);
        return;
      } else {
        return response;
      }
    } else {
      if (callback) {
        callback(undefined, new Error("Failed to retrieve the app params: " + response.data));
        return;
      } else {
        return new Error("Failed to retrieve the app params: " + response.data);
      }
    }
  }

  // QueryPocketParams
  public static async getPocketParams(blockHeight: BigInt = BigInt(0), node: Node, configuration: Configuration, callback?: (response?: any, error?: Error) => any) {

    var payload = JSON.stringify({"Height": blockHeight});

    const response = await RequestManager.send(paths.RPCRoutes.QueryPocketParams, payload, node, configuration);

    // Check if response is an error
    if (response instanceof Error === false) {
      if (callback) {
        callback(response);
        return;
      } else {
        return response;
      }
    } else {
      if (callback) {
        callback(undefined, new Error("Failed to retrieve the pocket params: " + response.data));
        return;
      } else {
        return new Error("Failed to retrieve the pocket params: " + response.data);
      }
    }
  }

  // QuerySupportedChains
  public static async getSupportedChains(blockHeight: BigInt = BigInt(0), node: Node, configuration: Configuration, callback?: (response?: any, error?: Error) => any) {

    var payload = JSON.stringify({"Height": blockHeight});

    const response = await RequestManager.send(paths.RPCRoutes.QuerySupportedChains, payload, node, configuration);

    // Check if response is an error
    if (response instanceof Error === false) {
      if (callback) {
        callback(response);
        return;
      } else {
        return response;
      }
    } else {
      if (callback) {
        callback(undefined, new Error("Failed to retrieve the supported chains list: " + response.data));
        return;
      } else {
        return new Error("Failed to retrieve the supported chains list: " + response.data);
      }
    }
  }

  // QuerySupply
  public static async getSupply(blockHeight: BigInt = BigInt(0), node: Node, configuration: Configuration, callback?: (response?: any, error?: Error) => any) {

    var payload = JSON.stringify({"Height": blockHeight});

    const response = await RequestManager.send(paths.RPCRoutes.QuerySupply, payload, node, configuration);

    // Check if response is an error
    if (response instanceof Error === false) {
      if (callback) {
        callback(response);
        return;
      } else {
        return response;
      }
    } else {
      if (callback) {
        callback(undefined, new Error("Failed to retrieve the supply information: " + response.data));
        return;
      } else {
        return new Error("Failed to retrieve the supply information: " + response.data);
      }
    }
  }

  // Send
  private static async send(path: string = "", payload: {}, node: Node, configuration: Configuration) {

    const axiosInstance = axios.create({
      headers: {
        "Content-Type": "application/json"
      },
      timeout: configuration.requestTimeOut,
      url: node.ipPort
    });

    var response = await axiosInstance.post(path,
      payload
    );

    return response;
  }
}
