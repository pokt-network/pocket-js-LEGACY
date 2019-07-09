/**
 * @author Pabel Nunez Landestoy <pabel@pokt.network>
 * @description Pocket javascript plugin to interact with the Aion network.
 */
// Dependencies
const PocketJSCore = require('pocket-js-core');
const Pocket = PocketJSCore.Pocket;
const Wallet = PocketJSCore.Wallet;
const EthRpc = require('./rpc/ethRpc.js').EthRpc;
const NetRpc = require('./rpc/netRpc.js').NetRpc;
const AionAccounts = require('aion-web3-eth-accounts');
// Constants
const aionAccounts = new AionAccounts();
const NETWORK_NAME = "AION";
const Networks = Object.freeze({
    "MAINNET": "256",
    "MASTERY": "32"
})
/**
 *
 *
 * @class PocketAion
 * @extends {Pocket}
 */
class PocketAion extends Pocket {
    /**
     * Creates an instance of PocketAion.
     * @param {String} devID - Developer Identifier.
     * @param {Array} netIDs - Network identifier list.
     * @param {number} [maxNodes=5] - (Optional) Maximum amount of nodes to store in the instance.
     * @param {number} [requestTimeOut=10000] - (Optional) Request timeout limit.
     * @param {String} [defaultNet=Networks.MASTERY] - (Optional) Default network identifier.
     * @param {string} sslOnly - (Optional) Indicates if you prefer nodes with ssl enabled only, default is true.
     * @memberof PocketAion
     */
    constructor(devID, netIDs, maxNodes = 5, requestTimeOut = 10000, defaultNet = Networks.MASTERY, sslOnly = true) {
        if (devID == null || netIDs == null) {
            throw new Error("Invalid number of arguments");
        }
        // Options object
        var opts = {
            "devID": devID,
            "networkName": NETWORK_NAME,
            "netIDs": netIDs.toString(),
            "requestTimeOut": requestTimeOut,
            "maxNodes": maxNodes,
            "sslOnly": sslOnly
        }
        // Call super with the options object
        super(opts);
        // Network list
        this.networks = {}
        // Check for mainNet and testNet IDs
        if (netIDs.includes(256) || netIDs.includes(Networks.MAINNET)) {
            this.mainnet = new Network(Networks.MAINNET, this);
            this.networks[Networks.MAINNET] = this.mainnet;
        }

        if (netIDs.includes(32) || netIDs.includes(Networks.MASTERY)) {
            this.mastery = new Network(Networks.MASTERY, this);
            this.networks[Networks.MASTERY] = this.mastery;
        }

        // Set default network, use default mastery if not set
        if (this.networks[defaultNet.toString()]) {
            this.default = this.networks[defaultNet];
        } else {
            this.default = new Network(defaultNet, this);
            this.networks[defaultNet] = this.default;
        }
    }
    /**
     *
     * Returns a Network instance with the specified netID
     * @param {String} netID - Network identifier.
     * @returns {Network} - Returns a Network instance.
     * @memberof PocketAion
     */
    network(netID) {
        var result = this.networks[netID];
        if (!result) {
            result = new Network(netID, this);
            this.networks[netID] = result;
        }
        return result;
    }
}
/**
 *
 *
 * @class Network
 */
class Network {
    /**
     * Creates an instance of Network.
     * @param {String} netID - Network identifier.
     * @param {PocketAion} pocketAion - PocketAion instance.
     * @memberof Network
     */
    constructor(netID, pocketAion) {
        this.eth = new EthRpc(netID, pocketAion);
        this.net = new NetRpc(netID, pocketAion);
    }
    /**
     *
     * Creates a new wallet.
     * @returns {Wallet} - New Wallet.
     * @memberof Network
     */
    createWallet() {
        var account = aionAccounts.create();
        return new Wallet(account.address, account.privateKey, NETWORK_NAME, this.eth.netID, null);
    }
    /**
     *
     * Imports an existing wallet using a private key.
     * @param {String} privateKey
     * @returns {Wallet} - Wallet object.
     * @memberof Network
     */
    importWallet(privateKey) {
        // Check mandatory params
        if (privateKey != null) {
            var account = aionAccounts.privateKeyToAccount(privateKey);
            return new Wallet(account.address, account.privateKey, NETWORK_NAME, this.eth.netID, null);
        } else {
            return new Error("Failed to import Wallet, private key is missing.");
        }
    }
}

module.exports = {
    PocketAion,
    Networks
}