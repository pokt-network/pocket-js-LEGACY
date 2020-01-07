import { Configuration } from './configuration/configuration';
import { Blockchain, Node, Relay, Wallet } from './models'
import { RequestManager } from './request_manager';
import paths = require("./utils/enums");

/**
 *
 *
 * @class Pocket
 */
export class Pocket {
  public readonly configuration: Configuration
  /**
   * Creates an instance of Pocket.
   * @param {Object} opts - Options for the initializer, devID, networkName, netIDs, maxNodes, requestTimeOut.
   * @memberof Pocket
   */
  constructor(opts: { [key: string]: any } = {}) {
    const blockchains = []

    if (opts.devID == null || opts.networkName == null || opts.netIDs == null) {
      throw new Error("Invalid number of arguments")
    }

    if (Array.isArray(opts.netIDs)) {
      opts.netIDs.forEach(element => {
        const blockchain = new Blockchain(opts.networkName, element)
        blockchains.push(blockchain.toJSON())
      })
    } else {
      const blockchain = new Blockchain(opts.networkName, opts.netIDs)
      blockchains.push(blockchain.toJSON())
    }

    this.configuration = new Configuration(
      opts.devID,
      blockchains,
      opts.maxNodes || 5,
      opts.requestTimeOut || 10000,
      opts.sslOnly || true
    )
  }
  /**
   *
   * Create a Relay instance
   * @param {Blockchain} blockchain - Blockchain object.
   * @param {String} data - String holding the json rpc call.
   * @param {string} httpMethod - (Optional) HTTP Method.
   * @param {string} path - (Optional) API path.
   * @param {Object} queryParams - (Optional) An object holding the query params.
   * @param {Object} headers - (Optional) An object holding the HTTP Headers.
   * @returns {Relay} - New Relay instance.
   * @memberof Pocket
   */
  public createRelay(
    blockchain: Blockchain,
    data: string,
    httpMethod = "",
    path = "",
    queryParams = "",
    headers = {}
  ) {
    // Check if data is a json tring
    if (typeof data == 'string') {
      return new Relay(blockchain, data, this.configuration, httpMethod, path, queryParams, headers);
    }
    return new Relay(
      blockchain,
      JSON.stringify(data),
      this.configuration,
      httpMethod,
      path,
      queryParams,
      headers
    )
  }
  /**
   *
   * Filter nodes by Blockchain
   * @param {Blockchain} blockchain - Blockchain.
   * @returns {Node} - New Node object.
   * @memberof Pocket
   */
  public async getNode(blockchain: Blockchain) {
    try {
      const nodes: Node[] = []

      if (this.configuration.nodesIsEmpty()) {
        const response = await this.retrieveNodes()

        if (response instanceof Error === true) {
          throw response
        } else {
          // Save the nodes to the configuration.
          this.configuration.setNodes(response as Node[])
        }
      }

      this.configuration.nodes.forEach(function (node: Node) {
        if (node.isEqual(blockchain)) {
          nodes.push(node);
        }
      })

      if (nodes.length <= 0) {
        return null
      }

      return nodes[Math.floor(Math.random() * nodes.length)]
    } catch (error) {
      return null
    }
  }
  /**
   *
   * Send an already created Relay
   * @param {Relay} relay - Relay instance with the information.
   * @param {callback} callback - callback handler.
   * @returns {String} - A String with the response.
   * @memberof Pocket
   */
  async sendRelay(relay: Relay, configuration = this.configuration, callback?: (result?: any[], error?: Error) => any) {
    // Verify all relay properties are set
    if (!relay.isValid()) {
      if (callback) {
        callback(undefined, new Error("Relay is missing a property, please verify all properties."));
        return;
      } else {
        return new Error(
          "Relay is missing a property, please verify all properties."
        );
      }
    }
    try {
      // Retrieve a node for specified blockchain
      var node = await this.getNode(relay.blockchain);

      if (node == null) {
        if (callback) {
          callback(undefined, new Error("Unable to retrieve a Node."));
          return;
        } else {
          return new Error("Unable to retrieve a Node.");
        }
      }
      // Send relay
      const response = await RequestManager.relay(paths.Routes.RELAY, node, configuration);
      
      // Response
      if (response instanceof Error === false) {
        if (callback) {
          callback(response as any);
          return;
        } else {
          return response
        }
      } else {
        if (callback) {
          callback(undefined, response as Error);
          return;
        } else {
          return response
        }
      }
    } catch (error) {
      if (callback) {
        callback(
          undefined,
          new Error("Failed to send relay with error: " + error)
        )
        return
      } else {
        return new Error("Failed to send relay with error: " + error)
      }
    }
  }
  /**
   *
   * Retrieve a list of service nodes from the Node Dispatcher
   * @param {callback} callback
   * @returns {Node} - A list of Nodes.
   * @memberof Pocket
   */
  public async retrieveNodes(callback?: (result?: any, error?: Error) => any) {
    try {
      var dispatch = this.getDispatch();
      var nodes: Node[] = [];
      var response = await dispatch.retrieveServiceNodes();

      if (!(response instanceof Error) && response !== undefined && response.length != 0) {
        // Save the nodes to the configuration.
        this.configuration.nodes = nodes
        // Return a list of nodes
        if (callback) {
          callback(this.configuration.nodes)
          return
        } else {
          return this.configuration.nodes
        }
      } else {
        // Returns an Error
        if (callback) {
          callback(null, new Error("Failed to retrieve a list of nodes."))
          return
        } else {
          return new Error("Failed to retrieve a list of nodes.")
        }
      }
    } catch (error) {
      if (callback) {
        callback(
          null,
          new Error("Failed to retrieve a list of nodes with error: " + error)
        )
        return
      } else {
        return new Error(
          "Failed to retrieve a list of nodes with error: " + error
        )
      }
    }
  }
}
