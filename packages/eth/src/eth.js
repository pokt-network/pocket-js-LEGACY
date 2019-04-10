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
const EthAccounts = require('web3-eth-accounts').Accounts;
const PocketProvider = require('pocket-js-web3-provider').PocketProvider;

// Constants
const NETWORK_NAME = "ETH";
const Networks = Object.freeze({
    "ROPSTEN": "3",
    "RINKEBY": "4",
    "GOERLI": "5",
    "KOVAN": "42",
    "MAINNET": "1"
})

class PocketEth extends Pocket {
    constructor(devID, netIDs, maxNodes = 5, requestTimeOut = 10000, defaultNet = Networks.RINKEBY) {
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
        // Check for mainnet netID
        if (netIDs.includes(1) || netIDs.includes(Networks.MAINNET)) {
            this.mainnet = new Network(Networks.MAINNET, this);
            this.networks[Networks.MAINNET] = this.mainnet;
        }
        // Check for rinkeby netID
        if (netIDs.includes(4) || netIDs.includes(Networks.RINKEBY)) {
            this.rinkeby = new Network(Networks.RINKEBY, this);
            this.networks[Networks.RINKEBY] = this.rinkeby;
        }
        // Check for ropsten netID
        if (netIDs.includes(3) || netIDs.includes(Networks.ROPSTEN)) {
            this.ropsten = new Network(Networks.ROPSTEN, this);
            this.networks[Networks.ROPSTEN] = this.ropsten;
        }
        // Check for goerli netID
        if (netIDs.includes(5) || netIDs.includes(Networks.GOERLI)) {
            this.goerli = new Network(Networks.GOERLI, this);
            this.networks[Networks.GOERLI] = this.goerli;
        }
        // Check for kovan netID
        if (netIDs.includes(42) || netIDs.includes(Networks.KOVAN)) {
            this.kovan = new Network(Networks.KOVAN, this);
            this.networks[Networks.KOVAN] = this.kovan;
        }

        // Set default network, use default rinkeby if not set
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
    constructor(netID, pocketEth) {
        this.eth = new EthRpc(netID, pocketEth);
        this.net = new NetRpc(netID, pocketEth);
    }

    createWallet() {
        // Instantiate provider
        var pocketProvider = new PocketProvider(NETWORK_NAME, this.eth.netID, this.eth.pocketEth.configuration.devID);
        var ethAccounts = new EthAccounts(pocketProvider);
        var account = ethAccounts.create();
        return new Wallet(account.address, account.privateKey, NETWORK_NAME, this.eth.netID, null);
    }
    importWallet(privateKey) {
        // Check mandatory params
        if (privateKey != null) {
            if (privateKey.substring(0, 2) != "0x") {
                privateKey = "0x" + privateKey;
            }
            // Instantiate provider
            var pocketProvider = new PocketProvider(NETWORK_NAME, this.eth.netID, this.eth.pocketEth.configuration.devID);
            var ethAccounts = new EthAccounts(pocketProvider);
            var account = ethAccounts.privateKeyToAccount(privateKey);
            return new Wallet(account.address, account.privateKey, NETWORK_NAME, this.eth.netID, null);
        } else {
            return new Error("Failed to import Wallet, private key param is missing.");
        }
    }
}

module.exports = {
    PocketEth,
    Networks,
    Network
}