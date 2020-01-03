import axios, { AxiosInstance } from "axios";
import { Node } from "./node";
import { Blockchain } from "./blockchain";
import constants = require("../utils/constants");
import { Configuration } from "../configuration/configuration";

// Dispatch
/**
 *
 *
 * @class Dispatch
 */
export class Dispatch {
  public readonly configuration: Configuration;
  public readonly axiosInstance: AxiosInstance;
  /**
   * Creates an instance of Dispatch.
   * @param {Configuration} configuration - Configuration object.
   * @memberof Dispatch
   */
  constructor(configuration: Configuration) {
    this.configuration = configuration;
    this.axiosInstance = axios.create({
      headers: {
        "Content-Type": "application/json"
      },
      timeout: this.configuration.requestTimeOut,
      url: constants.dispatchNodeURL + constants.dispatchPath
    });
  }
  /**
   *
   * blockchain object to JSON
   * @returns {JSON} - JSON Array with the blockchain list.
   * @memberof Dispatch
   */
  public blockchainsJSON() {
    const blockchainArray: Blockchain[] = [];
    this.configuration.blockchains.forEach(element => {
      blockchainArray.push(element);
    });
    return blockchainArray;
  }

  /**
   *
   * Retrieves a list of service nodes
   * @param {callback} callback
   * @returns {Node} - A Node object list.
   * @memberof Dispatch
   */
  public async retrieveServiceNodes(
    callback?: (result?: Node[], error?: Error) => any
  ) {
    try {
      const dispatch = this;
      let response = null;

      response = await this.axiosInstance.post(constants.dispatchPath, {
        Blockchains: dispatch.blockchainsJSON(),
        DevID: dispatch.configuration.devID
      });

      if (
        response !== null &&
        response.status === 200 &&
        response.data !== null
      ) {
        const nodes = this.parseDispatchResponse(response.data);

        let filteredNodes = nodes;
        // Check if SSL only nodes are requested
        if (this.configuration.sslOnly) {
          filteredNodes = this.sslOnlyNodes(nodes as Node[]);
        }
        // Check if filteredNodes is an error
        if (filteredNodes instanceof Error === false) {
          if (callback) {
            callback(filteredNodes as Node[]);
            return;
          } else {
            return filteredNodes;
          }
        } else {
          if (callback) {
            callback(undefined, filteredNodes as Error);
            return;
          } else {
            return filteredNodes;
          }
        }
      } else {
        if (callback) {
          callback(
            undefined,
            new Error(
              "Failed to retrieve service nodes with error: " + response.data
            )
          );
          return;
        } else {
          return new Error(
            "Failed to retrieve service nodes with error: " + response.data
          );
        }
      }
    } catch (err) {
      if (callback) {
        callback(
          undefined,
          new Error("Failed to retrieve service nodes with error: " + err)
        );
        return;
      } else {
        return new Error("Failed to retrieve service nodes with error: " + err);
      }
    }
  }

  /**
   *
   * Parse the response from the dispatcher
   * @param {Object} response
   * @returns {Node} - A Node object list.
   * @memberof Dispatch
   */
  private parseDispatchResponse(response: { [key: string]: any[] } = {}) {
    try {
      // Variables
      const nodes: Node[] = [];

      if (Array.isArray(response)) {
        // Iterate through the array for different networks results
        response.forEach(element => {
          const blockchain = new Blockchain(element.name, element.netID);

          if (element.ips) {
            // Create a Node object for each item inside the dataKey object, IP:PORT
            element.ips.forEach((ipPort: string) => {
              const node = new Node(blockchain, ipPort, ""); // Empty var added for publicKey
              nodes.push(node);
            });
          }
        });
      }

      return nodes;
    } catch (error) {
      return new Error("Failed to parsed service nodes with error: " + error);
    }
  }

  /**
   *
   * Filters a list of service nodes that supports SSL Only
   * @param {Node} node - A list of Nodes from the Dispatcher
   * @returns {Node} - A list of nodes with SSL Support
   * @memberof Dispatch
   */
  private sslOnlyNodes(nodes: Node[]) {
    const result: Node[] = [];
    nodes.forEach(node => {
      if (node.port === "443") {
        result.push(node);
      }
    });
    if (result.length === 0) {
      return new Error("Failed to retrieve a list of nodes with SSL Support.");
    }
    return result;
  }
}
