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
 * Sends Relays to a service node in the Pocket Network
 */
var PocketProvider = function PocketProvider(networkID, devID, transactionSigner, options) {
    options = options || {};
    this.setTransactionSigner(transactionSigner);
    this.timeout = options.timeout || 10000;
    this.maxNodes = options.maxNodes || 5;
    this.connected = false;
    this.networkID = networkID;
    this.devID = devID;
    // Make sure networkID is a string
    this.networkID = this.networkID.toString();
};
