/**
 * @author Pabel Nunez Landestoy <pabel@pokt.network>
 * @description Ethereum Network Smart Contract interaction logic.
 */
const AbiCoder = require('web3-eth-abi').AbiCoder;

// Variables
var functions = {};
// Constants
const abiCoder = new AbiCoder();

class EthContract {
    constructor(network, contractAddress, abiDefinition) {
        this.ethNetwork = network;
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
    async executeConstantFunction(functionName, functionParams, fromAddress, gas, gasPrice, value, callback) {
        // Retrieve function from the functions array
        var functionJSON = functions[functionName];

        if (functionJSON == null || !functionJSON.constant) {
            throw new Error("Invalid function name or function is not constant");
        }

        var _functionParams = functionParams || [];
        // Encode function call
        var data = this._encodeFunctionCall(functionJSON, _functionParams);
        // Send request
        var result = await this.ethNetwork.eth.call(fromAddress, this.contractAddress, gas, gasPrice, value, data, "latest", callback);
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

    async executeFunction(functionName, wallet, functionParams, nonce, gas, gasPrice, value, callback) {
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
            var result = await this.ethNetwork.eth.sendTransaction(wallet, nonce, this.contractAddress, gas, gasPrice, value, data);
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
            var txCount = await this.ethNetwork.eth.getTransactionCount(wallet.address);
            if (txCount instanceof Error) {
                if (callback) {
                    callback(txCount);
                }
                return txCount;
            }
            // Send transaction
            var result = await this.ethNetwork.eth.sendTransaction(wallet, txCount, this.contractAddress, gas, gasPrice, value, data);
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
        // Function JSON
        var functionJSONStr = JSON.stringify(functionJSON);
        // Encode function call
        var encodedFunction = abiCoder.encodeFunctionCall(functionJSON, params)

        return encodedFunction;
    }

    _decodeCallResponse(functionJSON, hexString) {
        var decodedResponse = abiCoder.decodeParameters(functionJSON.outputs, hexString);
        return decodedResponse;
    }
}

module.exports = {
    EthContract
}