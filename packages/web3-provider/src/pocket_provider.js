/**
 * @author Pabel Nunez Landestoy <pabel@pokt.network>
 */

//  Dependencies
const Pocket = require("pocket-js-core").Pocket;
const axios = require('axios');

// Constants
const TRANSACTION_METHODS = ['eth_sendTransaction', 'eth_sendRawTransaction'];

/**
 * Pocket Web3 Provider
 *  Sends Relays to a service node in the Pocket Network
 * @constructor
 * @param {string} blockchainName - Short Blockchain name (ETH, AION).
 * @param {string} networkID - Subnetwork ID.
 * @param {string} devID - Unique developer ID.
 * @param {object} options - (optional) Object containing the transactionSigner, maxNodes and requestTimeOut.
 * @param {string} options.transactionSigner - (optional) Object containing the TransactionSigner interface methods.
 * @param {number} options.maxNodes - (optional) Maximun amount of nodes to store in instance, default 5.
 * @param {number} options.requestTimeOut - (optional) Maximun timeout for every request in miliseconds, default 10000.
 */
class PocketProvider {
    constructor(blockchainName, networkID, devID, options) {
        options = options || {};
        this.blockchainName = blockchainName;
        this.networkID = networkID;
        this.devID = devID;
        this.transactionSigner = options.transactionSigner;
        this.maxNodes = options.maxNodes || 5;
        this.timeout = options.timeout || 10000;
        this.connected = false;
        // Make sure networkID is a string
        this.networkID = this.networkID.toString();
    }
}