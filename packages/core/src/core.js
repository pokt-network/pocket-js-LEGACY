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

    if (opts.devID == null || opts.networkName == null || opts.netIDs == null || opts.version == null) {
      throw new Error("Invalid number of arguments");
    }

    if (Array.isArray(opts.netIDs)) {
      opts.netIDs.forEach(element => {
        var blockchain = new Blockchain(opts.networkName, element, opts.version);
        blockchains.push(blockchain.toJSON());
      });
    } else {
      var blockchain = new Blockchain(opts.networkName, opts.netIDs, opts.version);
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
  createRelay(blockchain, netID, version, data, devID) {
    return new Relay(blockchain, netID, version, data, devID, this.configuration);
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
  getNode(netID, network, version) {
    try {
      if (this.configuration.nodesIsEmpty()) {
        return null;
      }

      var nodes = []
      this.configuration.nodes.forEach(element => {
        if (element.netID == netID && element.network == network && element.version == version) {
          nodes.push(element);
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
        throw new Error("Report is missing a property: " + property);
      }
      // Send Report
      var response = await report.send();
      // Response
      if (response instanceof Error == false) {
        if (callback) {
          callback(response, null);
        } else {
          return response;
        }
      } else {
        if (callback) {
          callback(null, response);
        } else {
          return response;
        }
      }

    } catch (error) {
      throw new Error("Failed to send report with error: " + error);
    }
  }
  // Send an already created Relay
  async sendRelay(relay, callback) {
    try {
      // Check for relay
      if (relay == null || relay.data == null) {
        if (callback) {
          callback(null, new Error("Relay is null or data field is missing"));
        } else {
          return new Error("Relay is null or data field is missing");
        }
      }
      // Verify all relay properties are set
      if (!relay.isValid()) {
        if (callback) {
          callback(null, new Error("Relay is missing a property, please verify all properties."));
        } else {
          return new Error("Relay is missing a property, please verify all properties.");
        }
      }

      // Filter nodes for specified blockchain
      var node = this.getNode(relay.netID,
        relay.blockchain,
        relay.version);

      if (node == null) {
        if (callback) {
          callback(null, new Error("Node is empty;"));
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
        } else {
          return response;
        }
      } else {
        if (callback) {
          callback(null, response);
        } else {
          return response;
        }
      }

    } catch (error) {
      if (callback) {
        callback(null, response.data);
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
      // Return true if the node response is successful
      if (nodes instanceof Error == false) {
        // Store the nodes in the Pocket instance configuration
        this.configuration.nodes = nodes;
        if (callback) {
          callback(true);
        } else {
          return true;
        }
      } else {
        // Return false if the node response is an Error;
        if (callback) {
          callback(new Error("Failed to retrieve Nodes with error: " + nodes));
        } else {
          return new Error("Failed to retrieve Nodes with error: " + nodes);
        }
      }

    } catch (error) {
      return new Error("Failed to retrieve service nodes with error: " + error);
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