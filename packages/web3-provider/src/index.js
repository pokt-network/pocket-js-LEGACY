/**
 * @author Pabel Nunez Landestoy <pabel@pokt.network>
 */
//  Dependencies
const Pocket = require("pocket-js-core").Pocket;
/**
 * Pocket Web3 Provider
 *  Sends Relays to a service node in the Pocket Network
 * @constructor
 * @param {String} networkName - Short Blockchain name (ETH, AION).
 * @param {String} networkID - Subnetwork ID.
 * @param {String} devID - Unique developer ID.
 * @param {Object} options - (optional) Object containing the transactionSigner, maxNodes and requestTimeOut.
 * @param {String} options.transactionSigner - (optional) Object containing the TransactionSigner interface methods.
 * @param {Number} options.maxNodes - (optional) Maximum amount of nodes to store in instance, default 5.
 * @param {Number} options.requestTimeOut - (optional) Maximum timeout for every request in milliseconds, default 10000.
 * @param {string} options.sslOnly - (optional) Indicates if you prefer nodes with ssl enabled only, default is true.
 */
class PocketProvider {
    constructor(networkName, networkID, devID, options) {
        options = options || {};
        this.networkName = networkName;
        this.networkID = networkID;
        this.devID = devID;
        this.transactionSigner = options.transactionSigner;
        this.maxNodes = options.maxNodes || 5;
        this.timeout = options.timeout || 10000;
        this.sslOnly = options.sslOnly || true;
        this.connected = false;
        // Make sure networkID is a string
        this.networkID = this.networkID.toString();
        // Pocket Instance
        this.pocket = new Pocket({
            devID: this.devID,
            networkName: this.networkName,
            netIDs: [this.networkID],
            maxNodes: this.maxNodes,
            requestTimeOut: this.timeout,
            sslOnly: this.sslOnly
        })
    }
    /**
     * Method to get the nonce for a given address
     * @method _getNonce
     * @param {String} sender
     * @param {Function} callback
     */
    async _getNonce(sender, callback) {
        var payload = {
            jsonrpc: '2.0',
            method: 'eth_getTransactionCount',
            params: [sender, "latest"],
            id: (new Date()).getTime()
        };
        
        var response = await this.send(payload);
        if (response instanceof Error) {
            if (callback) {
                callback(response);
                return;
            }
            return response;
        } else {

            if (callback) {
                callback(null, response.result);
                return;
            }
            return response.result;
        }
    }

    /**
     * Method to generate the relay data according to the given JSON-RPC payload
     * @method _generateRelayData
     * @param {Object} payload
     * @param {Function} callback
     */
    async _generateRelayData(payload, callback) {
        // Check if payload is a json tring
        if (typeof payload == 'string') {
            payload = JSON.parse(payload);
        }
        // Retrieve method from payload
        var method = payload.method;
        // Check rpc method
        if (method === 'eth_sendTransaction') {
            var relayData = await this._parseRelayParams(payload, callback);
            if (relayData instanceof Error) {
                if (callback) {
                    callback(relayData);
                    return;
                }
                return relayData;
            }
            if (callback) {
                callback(null, relayData);
                return;
            } else {
                return relayData;
            }
        } else {
            payload = JSON.stringify(payload);
            if (callback) {
                callback(null, payload);
                return;
            }
            return payload;
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
        const hasAddress = await _this.transactionSigner.hasAddress(sender);
        // Handle errors
        if (hasAddress === false || hasAddress instanceof Error) {
            if (callback) {
                callback(hasAddress);
                return;
            }
            return hasAddress;
        }
        // Get the nonce for the sender
        const nonce = await _this._getNonce(sender);
        // Handle errors
        if (nonce instanceof Error) {
            if (callback) {
                callback(nonce);
                return;
            }
            return nonce;
        }
        // Assign the nonce value to the tx params
        txParams.nonce = nonce;

        // Signs the transaction with the updated nonce
        const signedTx = await _this.transactionSigner.signTransaction(txParams);
        if (signedTx instanceof Error) {
            if (callback) {
                callback(signedTx);
                return;
            }
            return signedTx;
        }
        // Create relay data object
        var relayData = JSON.stringify({
            "jsonrpc": '2.0',
            "method": 'eth_sendRawTransaction',
            "params": [signedTx],
            "id": (new Date()).getTime()
        })
        if (callback) {
            callback(null, relayData);
            return;
        }
        return relayData;
    }
    /**
     *
     * @method send
     * @param {Object} payload - Object containing the payload.
     * @param {callback} callback - callback handler.
     * @returns {Object} - Reponse object.
     * @memberof PocketProvider
     */
    async send(payload, callback) {
        // Check for the pocket instance
        if (this.pocket instanceof Error) {
            var error = this.pocket;
            throw error;
        }
        var _this = this;
        // Generate relay data using the payload
        var relayData = await _this._generateRelayData(payload);
        // Handle errors
        if (relayData instanceof Error) {
            if (callback) {
                callback(err);
                return;
            } else {
                return err;
            }
        }
        // Continue to the relay creation and sent
        try {
            // Create a relay instance
            var relay = _this.pocket.createRelay(_this.networkName, _this.networkID, relayData);
            // Send relay to the network
            var result = await _this.pocket.sendRelay(relay);
            // Handle the result
            if (result instanceof Error) {
                if (callback) {
                    callback(result);
                    return;
                } else {
                    return result;
                }
            } else {
                result = JSON.parse(result);
                if (callback) {
                    callback(null, result);
                    return;
                } else {
                    return result;
                }
            }

        } catch (error) {
            _this.connected = false;
            if (callback) {
                callback(error);
                return;
            } else {
                return error;
            }
        }
    };
}

module.exports = PocketProvider;