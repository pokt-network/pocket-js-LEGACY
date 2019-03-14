const axios = require('axios');
const Node = require("./node.js").Node;
const constants = require("../utils/constants.js");

// Dispatch
class Dispatch {
  constructor(configuration) {
    this.configuration = configuration;
    this.axiosInstance = axios.create({
      baseURL: constants.dispatchNodeURL,
      path: constants.dispatchPath,
      timeout: this.configuration.requestTimeOut,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  blockchainsJSON() {
    var blockchainArray = []
    this.configuration.blockchains.forEach(element => {
      blockchainArray.push(element);
    });
    return blockchainArray
  }

  async retrieveServiceNodes(callback) {
    try {
      var dispatch = this;
      var response = null;

      response = await this.axiosInstance.post(constants.dispatchPath, {
        "DevID": dispatch.configuration.devID,
        "Blockchains": dispatch.blockchainsJSON()
      });

      if (response != null && response.status == 200 && response.data != null) {
        var nodes = this.parseDispatchResponse(response.data);

        if (nodes instanceof Error) {
          return nodes;
        }

        if (callback) {
          callback(nodes, null);
        } else {
          return nodes;
        }
      } else {
        if (callback) {
          callback(null, response.data);
        } else {
          return new Error("Failed to retrieve service nodes with error: " + response.data);
        }
      }
    } catch (err) {
      return new Error("Failed to retrieve service nodes with error: " + err);
    }
  }

  parseDispatchResponse(response) {
    try {
      // Variables
      var nodes = [];

      if (Array.isArray(response)) {
        // Iterate through the array for different networks results
        response.forEach(element => {
          var keys = Object.keys(element);
          // Retrieve primary object
          if (keys[0]) {
            // Retrieve network, version and netID
            var dataKey = keys[0];
            var keysArr = dataKey.split("|");

            if (keysArr.length == 3) {
              this.network = keysArr[0];
              this.version = keysArr[1];
              this.netID = keysArr[2];
            }
            // Create a Node object for each item inside the dataKey object, IP:PORT
            element[dataKey].forEach(ipPort => {
              var node = new Node(this.network, this.version, this.netID, ipPort);
              nodes.push(node);
            });
          }
        });
      } else {
        var keys = Object.keys(response);

        // Retrieve primary object
        if (!keys[0]) {
          new Error("Failed to parse Node object")
        }
        // Retrieve network, version and netID
        var dataKey = keys[0];
        var keysArr = dataKey.split("|");

        if (keysArr.length != 3) {
          return new Error("Failed to parsed service nodes with error: Node information is missing 1 or more params: "+ JSON.stringify(keysArr));
        }

        // Create a Node object for each item inside the dataKey object, IP:PORT
        response[dataKey].forEach(ipPort => {
          // We split each element inside the array to retrieve the ip address and port separately
          var ipPortArr = ipPort.split(":");
          var node = new Node(keysArr[0], keysArr[1], keysArr[2], ipPortArr[0], ipPortArr[1], ipPort);
          nodes.push(node);
        });

      }
      return nodes;

    } catch (error) {
      return new Error("Failed to parsed service nodes with error: " + error);
    }

  }

}

module.exports = {
  Dispatch
}