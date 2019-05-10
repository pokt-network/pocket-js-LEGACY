/**
 * @author Pabel Nunez Landestoy <pabel@pokt.network>
 * @description Aion Network Smart Contract interaction logic.
 */
// Constants
const Abi = require('aion-web3-eth-abi');
// Variables
var functions = {};
/**
 *
 *
 * @class AionContract
 */
class AionContract {
    /**
     * Creates an instance of AionContract.
     * @param {Network} network - Network instance.
     * @param {String} contractAddress - Smart contract address in the blockchain.
     * @param {Object} abiDefinition - ABI Definition.
     * @memberof AionContract
     */
    constructor(network, contractAddress, abiDefinition) {
        this.aionNetwork = network;
        this.contractAddress = contractAddress;
        // Check if the abiDefinition is a json string
        if (typeof abiDefinition == "string") {
            this.abiDefinition = JSON.parse(abiDefinition);
        } else {
            this.abiDefinition = abiDefinition;
        }
        // Parse functions from ABI
        this._parseContractFunctions();
    }
    /**
     *
     * Executes calls to a constant function.
     * @param {String} functionName - Function name.
     * @param {Array} functionParams - Function parameters.
     * @param {String} fromAddress - Recipient address.
     * @param {Number} nrg - NRG Value.
     * @param {Number} nrgPrice - NRG Price value.
     * @param {Number} value - Value to send.
     * @param {callback} callback - callback handler.
     * @returns {Object} - Response object.
     * @memberof AionContract
     */
    async executeConstantFunction(functionName, functionParams, fromAddress, nrg, nrgPrice, value, callback) {
        // Retrieve function from the functions array
        var functionJSON = functions[functionName];

        if (functionJSON == null || !functionJSON.constant) {
            throw new Error("Invalid function name or function is not constant");
        }

        var _functionParams = functionParams || [];
        // Encode function call
        var data = this._encodeFunctionCall(functionJSON, _functionParams);
        // Send request
        var result = await this.aionNetwork.eth.call(fromAddress, this.contractAddress, nrg, nrgPrice, value, data, "latest", callback);
        // Check for errors
        if (result instanceof Error) {
            if (callback) {
                callback(result);
            }
            return result;
        }
        // Decode the response
        var decodedResult = this._decodeCallResponse(functionJSON, result);
        if (decodedResult instanceof Error) {
            if (callback) {
                callback(decodedResult);
            }
            return decodedResult;
        }
        if (callback) {
            callback(null, decodedResult);
        }
        return decodedResult;
    }
    _parseContractFunctions() {
        this.abiDefinition.forEach(abiElement => {
            if (abiElement["type"] == "function") {
                var functionName = abiElement["name"];
                // Create new key value for the function
                functions[functionName] = abiElement;
            }
        });
    }

    /**
     *
     * Executes a non-constant function.
     * @param {String} functionName - Function name.
     * @param {Wallet} wallet - Recipient's wallet.
     * @param {Array} functionParams - Function parameters.
     * @param {Number} nonce - Recipient's Transaction count.
     * @param {Number} nrg - NRG Value.
     * @param {Number} nrgPrice - NRG Price.
     * @param {Number} value - Value to send.
     * @param {callback} callback
     * @returns {String} - Transaction hash.
     * @memberof AionContract
     */
    async executeFunction(functionName, wallet, functionParams, nonce, nrg, nrgPrice, value, callback) {
        // Retrieve function from the functions array
        var functionJSON = functions[functionName];

        if (functionJSON == null) {
            throw new Error("Invalid function name or function is not constant");
        }

        var _functionParams = functionParams || [];
        // Encode function call
        var data = this._encodeFunctionCall(functionJSON, _functionParams);
        // If nonce is not null proceed with sendTransation
        if (nonce != null) {
            var result = await this.aionNetwork.eth.sendTransaction(wallet, nonce, this.contractAddress, nrg, nrgPrice, value, data);
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
        } else { 
            // Retrieve the transaction count
            var txCount = await this.aionNetwork.eth.getTransactionCount(wallet.address);
            if (txCount instanceof Error) {
                if (callback) {
                    callback(txCount);
                }
                return txCount;
            }
            // Send transaction
            var result = await this.aionNetwork.eth.sendTransaction(wallet, txCount, this.contractAddress, nrg, nrgPrice, value, data);
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
    }

    _encodeFunctionCall(functionJSON, params) {
        // Encode function call
        var encodedFunction = Abi.encodeFunctionCall(functionJSON, params)
        return encodedFunction;
    }

    _decodeCallResponse(functionJSON, hexString) {
        var decodedResponse = Abi.decodeParameters(functionJSON.outputs, hexString);
        return decodedResponse;
    }
}

module.exports = {
    AionContract
}