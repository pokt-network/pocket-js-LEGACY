/**
 * @author Pabel Nunez Landestoy <pabel@pokt.network>
 * @description NET RPC methods for the Ethereum Network.
 */
// Constants
const Web3Utils = require('web3-utils');
const RpcUtils = require('./utils');
const NET_RPC_METHODS = Object.freeze({
    "version": "net_version",
    "listening": "net_listening",
    "peerCount": "net_peerCount"
})
class NetRpc {
    constructor(netID, pocketEth) {
        this.networkName = "ETH";
        this.netID = netID;
        this.pocketEth = pocketEth;
    }

    // Send a relay with the rpc method params
    async send(params, method, callback) {
        var result = await RpcUtils.send(params,method,this.pocketEth,this.netID);
        if (result instanceof Error) {
            if (callback) {
                callback(result);
            }
            return result;
        }
        if (callback) {
            callback(null, result);
        }
        return result;
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