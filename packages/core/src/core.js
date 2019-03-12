const Blockchain = require("./models/blockchain.js").Blockchain;
const Dispatch = require("./models/dispatch.js").Dispatch;
const Wallet = require("./models/wallet.js").Wallet;
const Relay = require("./models/relay.js").Relay;

class Configuration {
  constructor(devID, blockchains, maxNodes, requestTimeOut) {
    // Url's and Paths
    this.dispatchNodeURL = "http://dispatch.staging.pokt.network";
    this.dispatchPath = "/v1/dispatch";
    this.reportPath = "/v1/report";
    this.relayPath = "/v1/relay";
    // Settings and variables
    this.devID = devID;
    this.blockchains = blockchains;
    this.maxNodes = maxNodes || 5;
    this.nodes = [];
    this.requestTimeOut = requestTimeOut;
    this.dispatch = null;
    this.relay = null;
  }
}

class Pocket {

  constructor(opts) {
    var blockchains = [];

    if (opts["devID"] == null || opts["networkName"] == null || opts["netIDs"] == null || opts["version"] == null) {
      throw new Error("Invalid number of arguments");
    }

    if (Array.isArray(opts["netIDs"])) {
      opts["netIDs"].forEach(element => {
        var blockchain = new Blockchain(opts["networkName"], element, opts["version"]);
        blockchains.push(blockchain.toJSON());
      });
    } else {
      var blockchain = new Blockchain(opts["networkName"], opts["netIDs"], opts["version"]);
      blockchains.push(blockchain.toJSON());
    }

    this.configuration = new Configuration(opts["devID"], blockchains, opts["maxNodes"] || 5, opts["requestTimeOut"] || 10000);

  }

  createWallet(subnetwork, data) {
    throw new Error("Must implement Create Wallet")
  }
  importWallet(address, privateKey, subnetwork, data) {
    throw new Error("Must implement Import Wallet")
  }

  // Create a Relay instance
  createRelay(blockchain, netID, version, data, devID) {
    try {
      this.configuration.relay = new Relay(blockchain, netID, version, data, devID, this.configuration);
    } catch (error) {
      throw error;
    }
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
      if (this.configuration.nodes == null || this.configuration.nodes.length == 0) {
        throw new Error("Failed to filter nodes. List is empty or null ");
      }
      var nodes = []
      this.configuration.nodes.forEach(element => {
        if (element.netID == netID && element.network == network && element.version == version) {
          nodes.push(element);
        }
      });
      if (nodes.length <= 0) {
        throw new Error("No nodes are available for required specifications: " +
            this.relay.blockchain + ", " +
            this.relay.netID + ", " +
            this.relay.version) + " " +
          nodes;
      }
      return nodes[Math.floor(Math.random() * nodes.length)];
    } catch (error) {
      throw new Error("Failed to filter nodes with error: " + error);
    }
  }

  // Send an already created Relay
  async sendRelay(callback) {
    try {
      // Check for relay
      if (this.configuration.relay == null) {
        return new Error("Relay is null or data field is missing");
      }
      // Verify all relay properties are set
      for (var property in this.configuration.relay) {
        if (!this.configuration.relay.hasOwnProperty(property)) {
          return new Error("Relay is missing a property: " + property);
        }
      }
      // Filter nodes for specified blockchain
      var node = this.getNode(this.configuration.relay.netID, 
        this.configuration.relay.blockchain, 
        this.configuration.relay.version);
      // Set node relay property
      node.relay = this.configuration.relay;
      // Send relay
      var response = await node.sendRelay();

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
      return new Error("Failed to send relay with error: " + error)
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
          callback(false);
        } else {
          return false;
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