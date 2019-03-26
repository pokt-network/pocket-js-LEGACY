/**
 * @author Pabel Nunez Landestoy <pabel@pokt.network>
 * @description ETH RPC methods for the Aion Network.
 */

class EthRpc {
    constructor(netID, pocketAion) {
        this.networkName = "AION";
        this.netID = netID;
        this.pocketAion = pocketAion;
    }

    async getBalance(address, callback) {
        try {
            var data = {
                "jsonrpc": "2.0",
                "method": "eth_getBalance",
                "params": [address, "latest"],
                "id": (new Date()).getTime()
            };
            data = JSON.stringify(data);
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
            var resultJSON = JSON.parse(response).result;
            var value = this.pocketAion.aionInstance.utils.fromNAmp(resultJSON);

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

    async getTransactionCount(address, callback) {
        try {
            var data = {
                "jsonrpc": "2.0",
                "method": "eth_getTransactionCount",
                "params": [address, "latest"],
                "id": (new Date()).getTime()
            };
            data = JSON.stringify(data);
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
            var resultJSON = JSON.parse(response).result;
            var value = this.pocketAion.aionInstance.utils.hexToNumberString(resultJSON)

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
    EthRpc
}