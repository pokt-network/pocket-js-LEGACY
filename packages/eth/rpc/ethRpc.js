/**
 * @author Pabel Nunez Landestoy <pabel@pokt.network>
 * @description ETH RPC methods for the Ethereum Network.
 */
// Constants
const BlockTag = require('../models/blocktag.js').BlockTag;
const Web3Utils = require('web3-utils');
const RpcUtils = require('./rpcUtils.js');
const ETH_RPC_METHODS = Object.freeze({
    "getBalance": "eth_getBalance",
    "getStorageAt": "eth_getStorageAt",
    "getTransactionCount": "eth_getTransactionCount",
    "getBlockTransactionCountByHash": "eth_getBlockTransactionCountByHash",
    "getBlockTransactionCountByNumber": "eth_getBlockTransactionCountByNumber",
    "getCode": "eth_getCode",
    "call": "eth_call",
    "getBlockByHash": "eth_getBlockByHash",
    "getBlockByNumber": "eth_getBlockByNumber",
    "getTransactionByHash": "eth_getTransactionByHash",
    "getTransactionByBlockHashAndIndex": "eth_getTransactionByBlockHashAndIndex",
    "getTransactionByBlockNumberAndIndex": "eth_getTransactionByBlockNumberAndIndex",
    "getTransactionReceipt": "eth_getTransactionReceipt",
    "getLogs": "eth_getLogs",
    "estimateGas": "eth_estimateGas"
})
class EthRpc {
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

    async getBalance(address, block, callback) {
        try {
            if (address == null) {
                var error = Error("Address param is missing");
                if (callback) {
                    callback(error);
                }
                return error;
            }
            // Create BlockTag
            var blocktag = new BlockTag(block);
            // Create params
            var params = [address, blocktag.toString()]
            // Send request
            var response = await this.send(params, ETH_RPC_METHODS.getBalance);
            if (response instanceof Error) {
                if (callback) {
                    callback(response);
                }
                return response;
            }
            // Parse response
            var value = Web3Utils.fromWei(response);
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

    async getTransactionCount(address, block, callback) {
        try {
            if (address == null) {
                var error = Error("Address param is missing");
                if (callback) {
                    callback(error);
                }
                return error;
            }
            // Create BlockTag
            var blocktag = new BlockTag(block);
            // Create params
            var params = [address, blocktag.toString()]
            // Send request
            var response = await this.send(params, ETH_RPC_METHODS.getTransactionCount);
            if (response instanceof Error) {
                if (callback) {
                    callback(response);
                }
                return response;
            }
            // Parse response
            var value = Web3Utils.hexToNumber(response);
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
    async getStorageAt(address, position, block, callback) {
        try {
            if (address == null) {
                var error = Error("Address param is missing");
                if (callback) {
                    callback(error);
                }
                return error;
            }
            // Storage position
            var pos0 = new BlockTag(position).toString();
            // Create BlockTag
            var blocktag = new BlockTag(block).toString();
            // Create params
            var params = [address, pos0, blocktag]
            // Send request
            var response = await this.send(params, ETH_RPC_METHODS.getStorageAt);
            if (response instanceof Error) {
                if (callback) {
                    callback(response);
                }
                return response;
            }
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
    async getBlockTransactionCountByHash(blockHash, callback) {
        try {
            if (blockHash == null) {
                var error = Error("Block hash param is missing");
                if (callback) {
                    callback(error);
                }
                return error;
            }
            // Create params
            var params = [blockHash]
            // Send request
            var response = await this.send(params, ETH_RPC_METHODS.getBlockTransactionCountByHash);
            if (response instanceof Error) {
                if (callback) {
                    callback(response);
                }
                return response;
            }
            // Parse response
            var value = Web3Utils.hexToNumber(response);
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

    async getBlockTransactionCountByNumber(block, callback) {
        try {
            if (block == null) {
                var error = Error("Block number param is missing");
                if (callback) {
                    callback(error);
                }
                return error;
            }
            // Create params
            var blocktag = new BlockTag(block).toString();
            var params = [blocktag];
            // Send request
            var response = await this.send(params, ETH_RPC_METHODS.getBlockTransactionCountByNumber);
            if (response instanceof Error) {
                if (callback) {
                    callback(response);
                }
                return response;
            }
            // Parse response
            var value = Web3Utils.hexToNumber(response);
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

    async getCode(address, block, callback) {
        try {
            if (address == null) {
                var error = Error("Address param is missing");
                if (callback) {
                    callback(error);
                }
                return error;
            }
            // Create params
            var blocktag = new BlockTag(block).toString();
            var params = [address, blocktag];
            // Send request
            var response = await this.send(params, ETH_RPC_METHODS.getCode);
            if (response instanceof Error) {
                if (callback) {
                    callback(response);
                }
                return response;
            }
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

    async call(from, to, gas, gasPrice, value, data, block, callback) {
        try {
            if (to == null || data == null) {
                var error = Error("One or more params are missing");
                if (callback) {
                    callback(error);
                }
                return error;
            }
            // Create params
            var txParams = {to: to, data: data};
            var blocktag = new BlockTag(block).toString();

            if (from) {
                txParams.from = from;
            }
            if (gas) {
                txParams.gas = new BlockTag(gas).toString();
            }
            if (gasPrice) {
                txParams.gasPrice = new BlockTag(gasPrice).toString();
            }
            if (value) {
                txParams.value = new BlockTag(value).toString();
            }
            // Send request
            var response = await this.send([txParams, blocktag], ETH_RPC_METHODS.call);
            if (response instanceof Error) {
                if (callback) {
                    callback(response);
                }
                return response;
            }
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
    async getBlockByHash(blockHash, bool = false, callback) {
        try {
            if (blockHash == null) {
                var error = Error("Block Hash param is missing");
                if (callback) {
                    callback(error);
                }
                return error;
            }
            // Create params
            var params = [blockHash, bool]
            // Send request
            var response = await this.send(params, ETH_RPC_METHODS.getBlockByHash);
            if (response instanceof Error) {
                if (callback) {
                    callback(response);
                }
                return response;
            }
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
    async getBlockByNumber(block, bool = false, callback) {
        try {
            if (block == null) {
                var error = Error("Block number param is missing");
                if (callback) {
                    callback(error);
                }
                return error;
            }
            // Create params
            var blocktag = new BlockTag(block).toString();
            var params = [blocktag, bool];
            // Send request
            var response = await this.send(params, ETH_RPC_METHODS.getBlockByNumber);
            if (response instanceof Error) {
                if (callback) {
                    callback(response);
                }
                return response;
            }
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
    async getTransactionByHash(txHash, callback) {
        try {
            if (txHash == null) {
                var error = Error("Transaction hash param is missing");
                if (callback) {
                    callback(error);
                }
                return error;
            }
            // Create params
            var params = [txHash]
            // Send request
            var response = await this.send(params, ETH_RPC_METHODS.getTransactionByHash);
            if (response instanceof Error) {
                if (callback) {
                    callback(response);
                }
                return response;
            }
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

    async getTransactionByBlockHashAndIndex(blockHash, index, callback) {
        try {
            if (blockHash == null || index == null) {
                var error = Error("One or more params are missing");
                if (callback) {
                    callback(error);
                }
                return error;
            }
            // Create params
            var indexHex = new BlockTag(index).toString();
            var params = [blockHash, indexHex];
            // Send request
            var response = await this.send(params, ETH_RPC_METHODS.getTransactionByBlockHashAndIndex);
            if (response instanceof Error) {
                if (callback) {
                    callback(response);
                }
                return response;
            }
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
    async getTransactionByBlockNumberAndIndex(block, index, callback) {
        try {
            if (block == null || index == null) {
                var error = Error("One or more params are missing");
                if (callback) {
                    callback(error);
                }
                return error;
            }
            // Create params
            var blocktag = new BlockTag(block).toString();
            var indexHex = new BlockTag(index).toString();
            var params = [blocktag, indexHex];
            // Send request
            var response = await this.send(params, ETH_RPC_METHODS.getTransactionByBlockNumberAndIndex);
            if (response instanceof Error) {
                if (callback) {
                    callback(response);
                }
                return response;
            }
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
    // eth_getTransactionReceipt
    async getTransactionReceipt(txHash, callback) {
        try {
            if (txHash == null) {
                var error = Error("Transaction hash param is missing");
                if (callback) {
                    callback(error);
                }
                return error;
            }
            // Create params
            var params = [txHash];
            // Send request
            var response = await this.send(params, ETH_RPC_METHODS.getTransactionReceipt);
            if (response instanceof Error) {
                if (callback) {
                    callback(response);
                }
                return response;
            }
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
    async getLogs(fromBlock, toBlock, addressList, topics, blockHash, callback) {
        try {
            // Create params
            var txParams = {};

            if (addressList) {
                txParams.address = addressList;
            }
            if (topics) {
                txParams.topics = topics;
            }
            if (blockHash) {
                txParams.blockhash = blockHash;
            } else {
                txParams.fromBlock = new BlockTag(fromBlock).toString();
                txParams.toBlock = new BlockTag(toBlock).toString();
            }
            // Send request
            var response = await this.send([txParams], ETH_RPC_METHODS.getLogs);
            if (response instanceof Error) {
                if (callback) {
                    callback(response);
                }
                return response;
            }
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
    async estimateGas(from, to, gas, gasPrice, value, data, callback) {
        try {
            if (to == null || data == null) {
                var error = Error("One or more params are missing");
                if (callback) {
                    callback(error);
                }
                return error;
            }
            // Create params
            var txParams = {to: to, data: data};
            if (from) {
                txParams.from = from;
            }
            if (data) {
                txParams.data = data;
            }
            if (gas) {
                txParams.gas = new BlockTag(gas).toString();
            }
            if (gasPrice) {
                txParams.gasPrice = new BlockTag(gasPrice).toString();
            }
            if (value) {
                txParams.value = new BlockTag(value).toString();
            }

            // Send request
            var response = await this.send([txParams], ETH_RPC_METHODS.estimateGas);
            if (response instanceof Error) {
                if (callback) {
                    callback(response);
                }
                return response;
            }
            // Parse response
            var value = Web3Utils.hexToNumber(response);
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