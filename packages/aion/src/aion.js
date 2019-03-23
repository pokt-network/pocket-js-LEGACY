/**
 * @author Pabel Nunez Landestoy <pabel@pokt.network>
 * @description Pocket javascript plugin to interact with the Aion network.
 */
// Dependencies
const Pocket = require('pocket-js-core').Pocket;
const AionWeb3 = require('aion-web3');

// Constants
const networkName = "AION";
const networks = Object.freeze({"mainnet":"256", "mastery":"32"})

class PocketAion extends Pocket {
    constructor(devID, netIDs, maxNodes = 5, requestTimeOut = 10000, defaultNet = networks.mastery) {
        if (devID == null || netIDs == null) {
            throw new Error("Invalid number of arguments");
        }
        // Options object
        var opts = {
            "devID": devID,
            "networkName": networkName,
            "netIDs": netIDs,
            "requestTimeOut": requestTimeOut,
            "maxNodes": maxNodes
        }
        // Call super with the options object
        super(opts);
        // Create Aion instance
        this.aionInstance = new AionWeb3();
        // Check for mainNet and testNet IDs
        if (netIDs.includes(256) || netIDs.includes(networks.mainnet)) {
            this.mainnet = new Network(networks.mainnet, this);
        }

        if (netIDs.includes(32) || netIDs.includes(networks.mastery)) {
            this.testnet = new Network(networks.mastery, this);
        }
        // Set default network, use default mastery if not set
        this.default = new Network(defaultNet.toString(), this);
    }

    createWallet(netID) {
        throw new Error("Must implement Create Wallet")
    }
    importWallet(address, privateKey, subnetwork, data) {
        throw new Error("Must implement Import Wallet")
    }

}

class Network {
    constructor(netID, pocketAion) {
        this.eth = new EthRpc(netID, pocketAion);
        this.net = new NetRpc(netID, pocketAion);
    }
}

class EthRpc {
    constructor(netID, pocketAion) {
        this.netID = netID;
        this.pocketAion = pocketAion;
    }
}

class NetRpc {
    constructor(netID) {
        this.netID = netID
    }
}

module.exports = {
    PocketAion
}