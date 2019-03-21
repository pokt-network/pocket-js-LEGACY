const Blockchain = require("./models/blockchain.js").Blockchain;
const Dispatch = require("./models/dispatch.js").Dispatch;
const Wallet = require("./models/wallet.js").Wallet;
const Relay = require("./models/relay.js").Relay;
const Report = require("./models/report.js").Report;

class Configuration {
  /**
   * Configuration stores settings.
   * @constructor
   * @param {string} devID - Unique developer ID.
   * @param {string} blockchains - Blockchain class type list.
   * @param {string} maxNodes - (optional) Maximun amount of nodes to store in instance, default 5.
   * @param {string} requestTimeOut - (optional) Maximun timeout for every request in miliseconds, default 10000.
   */
  constructor(devID, blockchains, maxNodes, requestTimeOut) {
    // Settings and variables
    this.devID = devID;
    this.blockchains = blockchains;
    this.maxNodes = maxNodes || 5;
    this.nodes = [];
    this.requestTimeOut = requestTimeOut || 10000;
    this.dispatch = null;
    this.relay = null;
  }

  nodesIsEmpty() {
    if (this.nodes == null || this.nodes.length == 0) {
      return true;
    } else {
      return false;
    }
  }
}

class Pocket {

  constructor(opts) {
    var blockchains = [];

    if (opts.devID == null || opts.networkName == null || opts.netIDs == null) {
      return new Error("Invalid number of arguments");
    }

    if (Array.isArray(opts.netIDs)) {
      opts.netIDs.forEach(element => {
        var blockchain = new Blockchain(opts.networkName, element);
        blockchains.push(blockchain.toJSON());
      });
    } else {
      var blockchain = new Blockchain(opts.networkName, opts.netIDs);
      blockchains.push(blockchain.toJSON());
    }

    this.configuration = new Configuration(opts.devID, blockchains, opts.maxNodes || 5, opts.requestTimeOut || 10000);

  }

  createWallet(subnetwork, data) {
    throw new Error("Must implement Create Wallet")
  }
  importWallet(address, privateKey, subnetwork, data) {
    throw new Error("Must implement Import Wallet")
  }

  // Create a Relay instance
  createRelay(blockchain, netID, data) {
    return new Relay(blockchain, netID, data, this.configuration);
  }

  // Create a Report instance
  createReport(ip, message) {
    return new Report(ip, message, this.configuration);
  }

  // Get a Dispatch instance or create one
  getDispatch() {
    if (this.dispatch == null) {
      this.dispatch = new Dispatch(this.configuration);
    }
    return this.dispatch;
  }

  // Filter nodes by netID and blockchain name
  async getNode(netID, network) {
    try {
      var nodes = [];

      if (this.configuration.nodesIsEmpty()) {
        var response = await this.retrieveNodes();

        if (response instanceof Error == true) {
          throw response;
        }else {
          // Save the nodes to the configuration.
          this.configuration.nodes = response;
        }
      }
      
      this.configuration.nodes.forEach(node => {
        if (node.isEqual(netID, network)) {
          nodes.push(node);
        }
      });

      if (nodes.length <= 0) {
        return null
      }

      return nodes[Math.floor(Math.random() * nodes.length)];
    } catch (error) {
      return null;
    }
  }
  // Send a report
  async sendReport(report, callback) {
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
      var response = await report.send();
      // Response
      if (response instanceof Error == false) {
        if (callback) {
          callback(response, null);
          return;
        } else {
          return response;
        }
      } else {
        if (callback) {
          callback(null, response);
          return;
        } else {
          return response;
        }
      }
    } catch (error) {
      if (callback) {
        callback(null, error);
        return;
      } else {
        return error;
      }
    }
  }
  // Send an already created Relay
  async sendRelay(relay, callback) {
    try {
      // Check for relay
      if (relay == null || relay.data == null) {
        if (callback) {
          callback(null, new Error("Relay is null or data field is missing"));
          return;
        } else {
          return new Error("Relay is null or data field is missing");
        }
      }
      // Verify all relay properties are set
      if (!relay.isValid()) {
        if (callback) {
          callback(null, new Error("Relay is missing a property, please verify all properties."));
          return;
        } else {
          return new Error("Relay is missing a property, please verify all properties.");
        }
      }

      // Filter nodes for specified blockchain
      var node = await this.getNode(relay.netID,
        relay.blockchain);

      if (node == null) {
        if (callback) {
          callback(null, new Error("Node is empty;"));
          return;
        } else {
          return new Error("Node is empty;");
        }
      }

      // Send relay
      var response = await node.sendRelay(relay);
      // Response
      if (response instanceof Error == false) {
        if (callback) {
          callback(response, null);
          return;
        } else {
          return response;
        }
      } else {
        if (callback) {
          callback(null, response);
          return;
        } else {
          return response;
        }
      }

    } catch (error) {
      if (callback) {
        callback(null, response.data);
        return;
      } else {
        return new Error("Failed to send relay with error: " + error);
      }
    }

  }

  // Retrieve a list of service nodes from the Node Dispatcher
  async retrieveNodes(callback) {
    try {
      var dispatch = this.getDispatch();
      var nodes = await dispatch.retrieveServiceNodes();
      
      if (nodes instanceof Error == false && nodes.length != 0) {
        // Save the nodes to the configuration.
        this.configuration.nodes = nodes;
        // Return a list of nodes
        if (callback) {
          callback(null, nodes);
          return;
        } else {
          return nodes;
        }
      } else {
        // Returns an Error;
        if (callback) {
          callback(new Error("Failed to retrieve a list of nodes."), null);
          return;
        } else {
          return new Error("Failed to retrieve a list of nodes.");
        }
      }

    } catch (error) {
      if (callback) {
        callback(new Error("Failed to retrieve a list of nodes with error: "+error), null);
        return;
      } else {
        return new Error("Failed to retrieve a list of nodes with error: "+error);
      }
    }
  }

}

module.exports = {
  Pocket,
  Blockchain,
  Dispatch,
  Wallet,
  Relay
}