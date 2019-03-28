/**
 * @author Pabel Nunez Landestoy <pabel@pokt.network>
 * @description NET RPC methods for the Aion Network.
 */
// Constants
const Web3Utils = require('aion-web3-utils');
const NET_RPC_METHODS = Object.freeze({
    "version": "net_version",
    "listening": "net_listening",
    "peerCount": "net_peerCount"
})

class NetRpc {
    constructor(netID, pocketAion) {
        this.networkName = "AION";
        this.netID = netID;
        this.pocketAion = pocketAion;
    }

    // Send a relay with the rpc method params
    async send(params, method, callback) {
        try {
            // Create data
            var data = {
                "jsonrpc": "2.0",
                "method": method,
                "params": params,
                "id": (new Date()).getTime()
            };

            data = JSON.stringify(data);
            // Create relay
            var relay = this.pocketAion.createRelay(this.networkName, this.netID, data);
            // Check for errors after creating the relay
            if (relay instanceof Error) {
                if (callback) {
                    callback(relay);
                }
                return relay;
            }
            var response = await this.pocketAion.sendRelay(relay);
            // Check for errors after sending the relay
            if (response instanceof Error) {
                if (callback) {
                    callback(response);
                }
                return response;
            }
            // Parse response
            var responseJSON = JSON.parse(response);
            if (responseJSON.error) {
                var error = new Error("Failed to send request with message: " + responseJSON.error);
                if (callback) {
                    callback(error);
                }
                return error;
            } else {
                if (callback) {
                    callback(null, responseJSON.result);
                }
                return responseJSON.result;
            }
        } catch (error) {
            if (callback) {
                callback(error);
            }
            return error;
        }
    }
    async version(callback) {
        try {
            // Send request
            var response = await this.send([], NET_RPC_METHODS.version);
            if (response instanceof Error) {
                if (callback) {
                    callback(response);
                }
                return response;
            }
            // Return balance
            if (callback) {
                callback(null, response);
            }
            return response;
        } catch (error) {
            if (callback) {
                callback(error);
            }
            return error;
        }
    }
    async listening(callback) {
        try {
            // Send request
            var response = await this.send([], NET_RPC_METHODS.listening);
            if (response instanceof Error) {
                if (callback) {
                    callback(response);
                }
                return response;
            }
            // Return balance
            if (callback) {
                callback(null, response);
            }
            return response;
        } catch (error) {
            if (callback) {
                callback(error);
            }
            return error;
        }
    }

    async peerCount(callback) {
        try {
            // Send request
            var response = await this.send([], NET_RPC_METHODS.peerCount);
            if (response instanceof Error) {
                if (callback) {
                    callback(response);
                }
                return response;
            }
            // Parse response
            var value = Web3Utils.hexToNumber(response);
            // Return balance
            if (callback) {
                callback(null, value);
            }
            return value;
        } catch (error) {
            if (callback) {
                callback(error);
            }
            return error;
        }
    }
}

module.exports = {
    NetRpc
}