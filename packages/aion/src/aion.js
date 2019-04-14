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

class PocketAion extends Pocket {
    constructor(devID, netIDs, maxNodes = 5, requestTimeOut = 10000, defaultNet = Networks.MASTERY) {
        if (devID == null || netIDs == null) {
            throw new Error("Invalid number of arguments");
        }
        // Options object
        var opts = {
            "devID": devID,
            "networkName": NETWORK_NAME,
            "netIDs": netIDs.toString(),
            "requestTimeOut": requestTimeOut,
            "maxNodes": maxNodes
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
    network(netID) {
        var result = this.networks[netID];
        if (!result) {
            result = new Network(netID, this);
            this.networks[netID] = result;
        }
        return result;
    }

}

class Network {
    constructor(netID, pocketAion) {
        this.eth = new EthRpc(netID, pocketAion);
        this.net = new NetRpc(netID, pocketAion);
    }
    createWallet() {
        var account = aionAccounts.create();
        return new Wallet(account.address, account.privateKey, NETWORK_NAME, this.eth.netID, null);
    }
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