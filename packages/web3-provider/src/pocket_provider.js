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
var PocketProvider = function PocketProvider(blockchainName, networkID, devID, options) {
    options = options || {};
    this.blockchainName = blockchainName;
    this.networkID = networkID;
    this.devID = devID;
    this.transactionSigner = opts.transactionSigner;
    this.timeout = options.timeout || 10000;
    this.maxNodes = options.maxNodes || 5;
    this.connected = false;
    // Make sure networkID is a string
    this.networkID = this.networkID.toString();
};
