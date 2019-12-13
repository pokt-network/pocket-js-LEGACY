import { Configuration } from "./configuration";
import { Blockchain, Relay } from "./models";

/**
 *
 *
 * @class Pocket
 */
export class Pocket {
  public readonly configuration: Configuration;
  /**
   * Creates an instance of Pocket.
   * @param {Object} opts - Options for the initializer, devID, networkName, netIDs, maxNodes, requestTimeOut.
   * @memberof Pocket
   */
  constructor(opts: { [key: string]: any } = {}) {
    const blockchains = [];

    if (opts.devID == null || opts.networkName == null || opts.netIDs == null) {
      throw new Error("Invalid number of arguments");
    }

    if (Array.isArray(opts.netIDs)) {
      opts.netIDs.forEach(element => {
        const blockchain = new Blockchain(opts.networkName, element);
        blockchains.push(blockchain.toJSON());
      });
    } else {
      const blockchain = new Blockchain(opts.networkName, opts.netIDs);
      blockchains.push(blockchain.toJSON());
    }

    this.configuration = new Configuration(
      opts.devID,
      blockchains,
      opts.maxNodes || 5,
      opts.requestTimeOut || 10000,
      opts.sslOnly || true
    );
  }
  /**
   *
   * Create a Relay instance
   * @param {Blockchain} blockchain - Blockchain object.
   * @param {String} netID - Network Idenfifier.
   * @param {String} data - String holding the json rpc call.
   * @returns {Relay} - New Relay instance.
   * @memberof Pocket
   */
  public createRelay(
    blockchain: Blockchain,
    netID: string,
    data: string,
    httpMethod = "",
    path = "",
    queryParams = "",
    headers = {}
  ) {
    // Check if data is a json tring
    if (typeof data === "string") {
      return new Relay(
        blockchain,
        netID,
        data,
        this.configuration,
        httpMethod,
        path,
        queryParams,
        headers
      );
    }
    return new Relay(
      blockchain,
      netID,
      JSON.stringify(data),
      this.configuration,
      httpMethod,
      path,
      queryParams,
      headers
    );
  }
  /**
   *
   * Create a Report instance
   * @param {String} ip - Internet protocol address.
   * @param {String} message - Brief description for the report.
   * @returns {Report} - New Report instance.
   * @memberof Pocket
   */
  public createReport(ip: string, message: string) {
    return new Report(ip, message, this.configuration);
  }
  /**
   *
   * Get a Dispatch instance or creates one
   * @returns {Dispatch} - New or existing Dispatch instance.
   * @memberof Pocket
   */
  public getDispatch() {
    if (this.configuration.dispatcher == null) {
      this.configuration.dispatcher = new Dispatch(this.configuration);
    }
    return this.configuration.dispatcher;
  }
  /**
   *
   * Filter nodes by netID and blockchain name
   * @param {String} netID - Network Idenfifier.
   * @param {String} network - Network Name.
   * @returns {Node} - New Node instance.
   * @memberof Pocket
   */
  public async getNode(netID: string, network: string) {
    try {
      const nodes: Node[] = [];

      if (this.configuration.nodesIsEmpty()) {
        const response = await this.retrieveNodes();

        if (response instanceof Error === true) {
          throw response;
        } else {
          // Save the nodes to the configuration.
          this.configuration.setNodes(response);
        }
      }

      this.configuration.nodes.forEach(node => {
        if (node.isEqual(netID, network)) {
          nodes.push(node);
        }
      });

      if (nodes.length <= 0) {
        return null;
      }

      return nodes[Math.floor(Math.random() * nodes.length)];
    } catch (error) {
      return null;
    }
  }
  /**
   *
   * Send a report
   * @param {Report} report - Report instance with the information.
   * @param {callback} callback - callback handler.
   * @returns {String} - A String with the response.
   * @memberof Pocket
   */
  public async sendReport(report, callback) {
    try {
      // Check for report
      if (report == null) {
        throw new Error("Report is null");
      }
      // Verify all report properties are set
      if (!report.isValid()) {
        throw new Error("One or more Report properties are empty.");
      }
      // Send Report
      const response = await report.send();
      // Response
      if (response instanceof Error === false) {
        if (callback) {
          callback(null, response);
          return;
        } else {
          return response;
        }
      } else {
        if (callback) {
          callback(response);
          return;
        } else {
          return response;
        }
      }
    } catch (error) {
      if (callback) {
        callback(error);
        return;
      } else {
        return error;
      }
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
  public async sendRelay(relay, callback) {
    try {
      // Check for relay
      if (relay == null) {
        if (callback) {
          callback(new Error("Relay is null or data field is missing"));
          return;
        } else {
          return new Error("Relay is null or data field is missing");
        }
      }
      // Verify all relay properties are set
      if (!relay.isValid()) {
        if (callback) {
          callback(
            new Error(
              "Relay is missing a property, please verify all properties."
            )
          );
          return;
        } else {
          return new Error(
            "Relay is missing a property, please verify all properties."
          );
        }
      }

      // Filter nodes for specified blockchain
      const node = await this.getNode(relay.netID, relay.blockchain);

      if (node == null) {
        if (callback) {
          callback(new Error("Node is empty."));
          return;
        } else {
          return new Error("Node is empty.");
        }
      }

      // Send relay
      const response = await node.sendRelay(relay);
      // Response
      if (response instanceof Error === false) {
        if (callback) {
          callback(null, response);
          return;
        } else {
          return response;
        }
      } else {
        if (callback) {
          callback(response);
          return;
        } else {
          return response;
        }
      }
    } catch (error) {
      if (callback) {
        callback(new Error("Failed to send relay with error: " + error));
        return;
      } else {
        return new Error("Failed to send relay with error: " + error);
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
      const dispatch = this.getDispatch();
      const nodes: Node[] = [];
      const response = await dispatch.retrieveServiceNodes();

      if (response instanceof Error === false && response.length !== 0) {
        // Save the nodes to the configuration.
        this.configuration.nodes = nodes;
        // Return a list of nodes
        if (callback) {
          callback(this.configuration.nodes);
          return;
        } else {
          return this.configuration.nodes;
        }
      } else {
        // Returns an Error;
        if (callback) {
          callback(null, new Error("Failed to retrieve a list of nodes."));
          return;
        } else {
          return new Error("Failed to retrieve a list of nodes.");
        }
      }
    } catch (error) {
      if (callback) {
        callback(
          null,
          new Error("Failed to retrieve a list of nodes with error: " + error)
        );
        return;
      } else {
        return new Error(
          "Failed to retrieve a list of nodes with error: " + error
        );
      }
    }
  }
}
