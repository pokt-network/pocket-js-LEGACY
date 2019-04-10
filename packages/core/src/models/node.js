const axios = require('axios');
const constants = require("../utils/constants.js");
const requestProtocol = "https://";
// Dispatch
class Node {
    constructor(network, netID, ipPort) {
        this.network = network;
        this.netID = netID;
        if (ipPort.includes("http://") || ipPort.includes("https://")) {
            this.ipPort = ipPort;
        } else {
            this.ipPort = requestProtocol + ipPort;
        }
        var ipPortArr = ipPort.split(":");
        this.ip = ipPortArr[0];
        this.port = ipPortArr[1];
    }

    isValid() {
        for (var property in this) {
            if (!this.hasOwnProperty(property) || this[property] == "") {
                return false;
            }
        }
        return true;
    }

    isEqual(netID, network) {
        if (this.netID == netID.toString() && this.network == network.toString()) {
            return true;
        }
        return false;
    }

    async sendRelay(relay, callback) {
        try {
            const axiosInstance = axios.create({
                baseURL: this.ipPort,
                timeout: relay.configuration.requestTimeOut,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            var response = await axiosInstance.post(constants.relayPath,
                relay.toJSON()
            );

            if (response.status == 200 && response.data != null) {
                var result = response.data;

                if (callback) {
                    callback(result, null);
                    return;
                } else {
                    return result;
                }
            } else {
                if (callback) {
                    callback(null, new Error("Failed to send relay with error: " + response.data));
                    return;
                } else {
                    return new Error("Failed to send relay with error: " + response.data);
                }
            }
        } catch (error) {
            if (callback) {
                callback(null, new Error("Failed to send relay with error: " + error));
                return;
            } else {
                return new Error("Failed to send relay with error: " + error);
            }
        }
    }
}

module.exports = {
    Node
}