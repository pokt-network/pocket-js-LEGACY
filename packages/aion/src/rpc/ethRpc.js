/**
 * @author Pabel Nunez Landestoy <pabel@pokt.network>
 * @description ETH RPC methods for the Aion Network.
 */
// Constants
const BlockTag = require('../models/blocktag.js').BlockTag;
const Web3Utils = require('aion-web3-utils');
const RpcUtils = require('./rpcUtils.js');
const AionAccounts = require('aion-web3-eth-accounts');
const ETH_RPC_METHODS = Object.freeze({
    "getBalance": "eth_getBalance",
    "getStorageAt": "eth_getStorageAt",
    "getTransactionCount": "eth_getTransactionCount",
    "getBlockTransactionCountByHash": "eth_getBlockTransactionCountByHash",
    "getBlockTransactionCountByNumber": "eth_getBlockTransactionCountByNumber",
    "getCode": "eth_getCode",
    "call": "eth_call",
    "sendRawTransaction": "eth_sendRawTransaction",
    "getBlockByHash": "eth_getBlockByHash",
    "getBlockByNumber": "eth_getBlockByNumber",
    "getTransactionByHash": "eth_getTransactionByHash",
    "getTransactionByBlockHashAndIndex": "eth_getTransactionByBlockHashAndIndex",
    "getTransactionByBlockNumberAndIndex": "eth_getTransactionByBlockNumberAndIndex",
    "getTransactionReceipt": "eth_getTransactionReceipt",
    "getLogs": "eth_getLogs",
    "estimateGas": "eth_estimateGas"
})
const aionAccounts = new AionAccounts();
/**
 *
 *
 * @class EthRpc
 */
class EthRpc {
    /**
     * Creates an instance of EthRpc.
     * @param {String} netID - Network identifier.
     * @param {PocketAion} pocketAion - PocketAion instance.
     * @memberof EthRpc
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
     * @param {String} method - RPC Method name.
     * @param {callback} callback - callback handler.
     * @returns {Object} - Response object.
     * @memberof EthRpc
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
     * Retrieves address balance.
     * @param {String} address - Wallet address.
     * @param {BlockTag} block - BlockTag or block number.
     * @param {callback} callback - callback handler.
     * @returns {String} - Returns the wallet balance.
     * @memberof EthRpc
     */
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
            var value = Web3Utils.fromNAmp(response);
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
    /**
     *
     * Retrieves an address transaction count.
     * @param {String} address - Address String.
     * @param {BlockTag} block - BlockTag or block number.
     * @param {callback} callback - callback handler.
     * @returns {Number} - Returns the transaction count.
     * @memberof EthRpc
     */
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
    /**
     *
     * Returns the storage data at an address.
     * @param {String} address - Storage address.
     * @param {Number} position - Position in the storage 
     * @param {BlockTag} block - BlockTag or block number.
     * @param {callback} callback - callback handler.
     * @returns {String} - The string value at this storage position.
     * @memberof EthRpc
     */
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
    /**
     *
     * Retrieve the block transaction count using the block hash.
     * @param {String} blockHash - Block hash.
     * @param {callback} callback - callback handler.
     * @returns {Number} - Block transaction count.
     * @memberof EthRpc
     */
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
    /**
     *
     * Retrieve the block transaction count using the block number.
     * @param {BlockTag} block - BlockTag or block number.
     * @param {callback} callback - callback handler.
     * @returns {Number} - Block transaction count.
     * @memberof EthRpc
     */
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
    /**
     *
     * Retrieves the code at a given address.
     * @param {String} address - Address string.
     * @param {BlockTag} block - BlockTag or block number.
     * @param {callback} callback - callback handler.
     * @returns {String} - Code from the given address.
     * @memberof EthRpc
     */
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
    /**
     *
     * Executes a new message call immediately without creating a transaction on the blockchain.
     * @param {String} from - Recipient address.
     * @param {String} to - Destination address.
     * @param {Number} nrg - NRG Value.
     * @param {Number} nrgPrice - NRG Price.
     * @param {Number} value - Value.
     * @param {String} data - Serialized data string.
     * @param {BlockTag} block - BlockTag or block number.
     * @param {callback} callback - callback handler.
     * @returns {String} - Value of executed contract.
     * @memberof EthRpc
     */
    async call(from, to, nrg, nrgPrice, value, data, block, callback) {
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
            if (nrg) {
                txParams.nrg = new BlockTag(nrg).toString();
            }
            if (nrgPrice) {
                txParams.nrgPrice = new BlockTag(nrgPrice).toString();
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
    /**
     *
     * Sends a transaction to the blockchain.
     * @param {Wallet} wallet - Wallet object of the recipient.
     * @param {String} nonce - Nonce value, can be String or Number.
     * @param {String} to - Destination address.
     * @param {Number} nrg - NRG Value.
     * @param {Number} nrgPrice - NRG Price.
     * @param {Number} value - Value.
     * @param {String} data - Serialized data string.
     * @param {callback} callback - callback handler.
     * @returns {String} - Transaction hash.
     * @memberof EthRpc
     */
    async sendTransaction(wallet, nonce, to, nrg, nrgPrice, value, data, callback) {
        try {
            if (to == null || wallet == null || nonce == null) {
                var error = Error("One or more params are missing");
                if (callback) {
                    callback(error);
                }
                return error;
            }
            // Mandatory params
            var txParams = {to: to, from: wallet.address, nonce: new BlockTag(nonce).toString()};
            // Optional params
            if (nrg) {
                txParams.gas = new BlockTag(nrg).toString();
            }
            if (nrgPrice) {
                txParams.gasPrice = new BlockTag(nrgPrice).toString();
            }
            if (value) {
                txParams.value = new BlockTag(value).toString();
            }
            // Transaction Data
            txParams.data = data;

            // Sign transaction
            var signedTx = await aionAccounts.signTransaction(txParams,wallet.privateKey);
            var txData = signedTx.rawTransaction;

            // Send request
            var response = await this.send([txData], ETH_RPC_METHODS.sendRawTransaction);
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
    /**
     *
     * Retrieves the block information using the block hash.
     * @param {String} blockHash - Block hash.
     * @param {boolean} [bool=false] - If true it returns the full transaction objects, if false only the hashes of the transactions.
     * @param {callback} callback - callback handler.
     * @returns {Object} - Block information.
     * @memberof EthRpc
     */
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
    /**
     *
     * Retrieves the block information using the block number.
     * @param {BlockTag} block - BlockTag or block number.
     * @param {boolean} [bool=false] - If true it returns the full transaction objects, if false only the hashes of the transactions.
     * @param {callback} callback - callback handler.
     * @returns {Object} - Block information.
     * @memberof EthRpc
     */
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
    /**
     *
     * Retrieves a transaction using the tx hash.
     * @param {String} txHash - Transaction hash.
     * @param {callback} callback - callback handler.
     * @returns {Object} - Returns the transaction information.
     * @memberof EthRpc
     */
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
    /**
     *
     * Retrieves the transaction by block hash and transaction index.
     * @param {String} blockHash - Block hash.
     * @param {Number} index - Index of the transaction in the block.
     * @param {callback} callback - callback handler.
     * @returns {Object} - Returns the transaction information.
     * @memberof EthRpc
     */
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
    /**
     *
     * Retrieves the transaction by block number and transaction index.
     * @param {BlockTag} block - BlockTag or block number.
     * @param {Number} index - Index of the transaction in the block.
     * @param {callback} callback - callback handler.
     * @returns {Object} - Returns the transaction information.
     * @memberof EthRpc
     */
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
    /**
     *
     * Checks the status of a transaction in the blockchain.
     * @param {String} txHash - Transaction hash.
     * @param {callback} callback - callback handler.
     * @returns {Object} - A transaction receipt object.
     * @memberof EthRpc
     */
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
    /**
     *
     * Retrieves an array of all logs matching a given filter object
     * @param {BlockTag} fromBlock - BlockTag or block number.
     * @param {BlockTag} toBlock - BlockTag or block number.
     * @param {Array} addressList - List of addresses.
     * @param {Array} topics - Array DATA topics.
     * @param {String} blockHash - Block hash.
     * @param {callback} callback - callback handler.
     * @returns {Array} - List of topics.
     * @memberof EthRpc
     */
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
    /**
     *
     * Generates and returns an estimate of how much gas is necessary to allow the transaction to complete.
     * @param {String} from - Recipient address.
     * @param {String} to - Destination address.
     * @param {Number} nrg - NRG Value.
     * @param {Number} nrgPrice - NRG Price.
     * @param {Number} value - Value.
     * @param {String} data - Serialized data string.
     * @param {callback} callback - callback handler.
     * @returns {Number} - Returns gas estimate value;
     * @memberof EthRpc
     */
    async estimateGas(from, to, nrg, nrgPrice, value, data, callback) {
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
            if (nrg) {
                txParams.nrg = new BlockTag(nrg).toString();
            }
            if (nrgPrice) {
                txParams.nrgPrice = new BlockTag(nrgPrice).toString();
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