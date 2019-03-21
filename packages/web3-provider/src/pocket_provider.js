/**
 * @author Pabel Nunez Landestoy <pabel@pokt.network>
 */

//  Dependencies
const Pocket = require("pocket-js-core").Pocket;
var web3Utils = require('web3-utils');

// Constants
const TRANSACTION_METHODS = ['eth_sendTransaction', 'eth_sendRawTransaction'];

/**
 * Pocket Web3 Provider
 *  Sends Relays to a service node in the Pocket Network
 * @constructor
 * @param {String} networkName - Short Blockchain name (ETH, AION).
 * @param {String} networkID - Subnetwork ID.
 * @param {String} devID - Unique developer ID.
 * @param {String} version - Client version.
 * @param {Object} options - (optional) Object containing the transactionSigner, maxNodes and requestTimeOut.
 * @param {String} options.transactionSigner - (optional) Object containing the TransactionSigner interface methods.
 * @param {Number} options.maxNodes - (optional) Maximun amount of nodes to store in instance, default 5.
 * @param {Number} options.requestTimeOut - (optional) Maximun timeout for every request in miliseconds, default 10000.
 */
class PocketProvider {
    constructor(networkName, networkID, devID, version, options) {
        options = options || {};
        this.networkName = networkName;
        this.networkID = networkID;
        this.devID = devID;
        this.version = version;
        this.transactionSigner = options.transactionSigner;
        this.maxNodes = options.maxNodes || 5;
        this.timeout = options.timeout || 10000;
        this.connected = false;
        // Make sure networkID is a string
        this.networkID = this.networkID.toString();
        // Pocket Instance
        this.pocket = new Pocket({
            devID: this.devID,
            networkName: this.networkName,
            netIDs: [this.networkID],
            version: this.version,
            maxNodes: this.maxNodes,
            requestTimeOut: this.timeout
        })
    }

    /**
     * Method to get the nonce for a given address
     * @method _getNonce
     * @param {String} sender
     * @param {Function} callback
     */
    async _getNonce(sender, callback) {
        this.send({
            jsonrpc: '2.0',
            method: 'eth_getTransactionCount',
            params: [sender, "latest"],
            id: (new Date()).getTime()
        }, function (err, response) {
            if (err != null) {
                if (callback) {
                    callback(err);
                    return;
                }
                return err;
            } else {
                var nonce = web3Utils.toDecimal(response.result);
                if (callback) {
                    callback(null, nonce);
                    return;
                } else {
                    return nonce;
                }
            }
        });
    }

    /**
     * Method to generate the relay data according to the given JSON-RPC payload
     * @method _generateRelayData
     * @param {Object} payload
     * @param {Function} callback
     */
    async _generateRelayData(payload, callback) {
        var method = payload.method;

        if (method === 'eth_sendTransaction') {
            this._parseRelayParams(payload, callback);
        } else {
            var relayData = {
                "jsonrpc": 2.0,
                "method": method,
                "params": payload.params[0],
                "id": (new Date()).getTime()
            }
            if (callback) {
                callback(null, relayData);
                return;
            }
            return relayData;
        }
    }

    /**
     * @method _parseRelayParams
     * @param {Object} payload
     * @param {Function} callback
     */
    async _parseRelayParams(payload, callback) {
        var txParams = payload.params[0];
        var sender = txParams.from;
        var _this = this;

        // Verify address exists in the TransactionSigner
        _this.transactionSigner.hasAddress(sender, function (err, hasAddress) {
            if (err !== null || hasAddress === false) {
                if (callback) {
                    return callback(err);
                } else {
                    return err;
                }
            }

            // Get the nonce for the sender
            _this._getNonce(sender, function (err, nonce) {
                if (err !== null) {
                    if (callback) {
                        return callback(err);
                    } else {
                        return err;
                    }
                }
                txParams.nonce = web3Utils.toHex(nonce);

                // Signs the transaction with the updated nonce
                _this.transactionSigner.signTransaction(txParams, function (err, rawTx) {
                    if (err !== null) {
                        if (callback) {
                            return callback(err);
                        } else {
                            return err;
                        }
                    }
                    var transactionBody = {
                        "network": ETH_NETWORK,
                        "subnetwork": _this.networkId,
                        "serialized_tx": rawTx,
                        "tx_metadata": {}
                    }
                    if (callback) {
                        callback(null, transactionBody);
                        return;
                    } else {
                        return transactionBody;
                    }
                });
            });
        });
    }

    async send(payload, callback) {

        if (this.pocket instanceof Error) {
            var error = this.pocket;
            throw error;
        }

        var relay = pocket.createRelay(this.networkName, this.networkID, this.version, payload);

        var result = await pocket.sendRelay(relay);
        if (result instanceof Error) {
            if (callback) {
                callback(result);
                return;
            } else {
                return result;
            }
        }else{
            if (callback) {
                callback(null, result);
                return;
            } else {
                return result;
            }
        }
    };
}

module.exports = {
    PocketProvider
}