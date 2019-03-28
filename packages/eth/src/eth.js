/**
 * @author Pabel Nunez Landestoy <pabel@pokt.network>
 * @description Pocket javascript plugin to interact with the Ethereum network.
 */
// Dependencies
const PocketJSCore = require('pocket-js-core');
const Pocket = PocketJSCore.Pocket;
const Wallet = PocketJSCore.Wallet;
const EthRpc = require('../rpc/ethRpc.js').EthRpc;
const NetRpc = require('../rpc/netRpc.js').NetRpc;
const EthAccounts = require('web3-eth-accounts');

// Constants
const ethAccounts = new EthAccounts();
const NETWORK_NAME = "ETH";
const Networks = Object.freeze({
    "MAINNET": "1",
    "TESTNET": "4"
})

class PocketEth extends Pocket {
    constructor(devID, netIDs, maxNodes = 5, requestTimeOut = 10000, defaultNet = Networks.TESTNET) {
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
        if (netIDs.includes(1) || netIDs.includes(Networks.MAINNET)) {
            this.mainnet = new Network(Networks.MAINNET, this);
            this.networks[Networks.MAINNET] = this.mainnet;
        }

        if (netIDs.includes(4) || netIDs.includes(Networks.TESTNET)) {
            this.testnet = new Network(Networks.TESTNET, this);
            this.networks[Networks.TESTNET] = this.testnet;
        }

        // Set default network, use default testnet if not set
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
    createWallet(netID) {
        if (netID != null) {
            var account = ethAccounts.create();
            return new Wallet(account.address, account.privateKey, NETWORK_NAME, netID, null);
        } else {
            throw new Error("Failed to create Wallet, netID param is missing.")
        }
    }
    importWallet(privateKey, netID) {
        try {
            // Check mandatory params
            if (privateKey != null || netID != null) {
                var account = ethAccounts.privateKeyToAccount(privateKey);
                return new Wallet(account.address, account.privateKey, NETWORK_NAME, netID, null);
            } else {
                throw new Error("Failed to import Wallet, some params are missing.");
            }
        } catch (error) {
            throw new Error("Failed to import Wallet: " + error);
        }
    }

}

class Network {
    constructor(netID, pocketEth) {
        this.eth = new EthRpc(netID, pocketEth);
        this.net = new NetRpc(netID, pocketEth);
    }
}

module.exports = {
    PocketEth,
    Networks
}