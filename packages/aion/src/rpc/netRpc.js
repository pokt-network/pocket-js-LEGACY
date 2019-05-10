/**
 * @author Pabel Nunez Landestoy <pabel@pokt.network>
 * @description NET RPC methods for the Aion Network.
 */
// Constants
const Web3Utils = require('aion-web3-utils');
const RpcUtils = require('./rpcUtils.js');
const NET_RPC_METHODS = Object.freeze({
    "version": "net_version",
    "listening": "net_listening",
    "peerCount": "net_peerCount"
})

/**
 *
 *
 * @class NetRpc
 */
class NetRpc {
    /**
     *Creates an instance of NetRpc.
     * @param {String} netID - Network identifier.
     * @param {PocketAion} pocketAion - PocketAion instance.
     * @memberof NetRpc
     */
    constructor(netID, pocketAion) {
        this.networkName = "AION";
        this.netID = netID;
        this.pocketAion = pocketAion;
    }
    /**
     *
     * Send a relay with the rpc method params
     * @param {Array} params - RPC params.
     * @param {Object} method - RPC Method name.
     * @param {callback} callback - callback handler.
     * @returns {Object} - Response object.
     * @memberof NetRpc
     */
    async send(params, method, callback) {
        var result = await RpcUtils.send(params,method,this.pocketAion,this.netID);
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
    /**
     *
     * Retrieves the current network identifier
     * @param {callback} callback - callback handler.
     * @returns {String} - Network identifier.
     * @memberof NetRpc
     */
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
    /**
     *
     * Returns true if client is actively listening for network connections.
     * @param {callback} callback - callback handler;
     * @returns {boolean} - Listening status.
     * @memberof NetRpc
     */
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
    /**
     *
     * Retrieves the number of peers currently connected to the client.
     * @param {callback} callback - callback handler.
     * @returns {Number} - Peer count.
     * @memberof NetRpc
     */
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