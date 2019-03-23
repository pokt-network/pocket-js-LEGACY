/**
 * @author Pabel Nunez Landestoy <pabel@pokt.network>
 * @description Pocket javascript plugin to interact with the Aion network.
 */
// Dependencies
const Pocket = require('pocket-js-core').Pocket;
const AionWeb3 = require('aion-web3').AionWeb3;

// Constants
const networkName = "AION";

class PocketAion extends Pocket {
    constructor(devID, netIDs, maxNodes = 5, requestTimeOut = 10000, defaultNet = 32) {
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
        if (netIDs.includes(256) || netIDs.includes("256")) {
            this.mainnet = new RPCMethod("256", this);
            defaultNet = new RPCMethod("256", this);
        }

        if (netIDs.includes(32) || netIDs.includes("32")) {
            this.testnet = new RPCMethod("32", this);
            defaultNet = new RPCMethod("32", this);
        }

        if (defaultNet) {
            this.eth = defaultNet.eth;
            this.net = defaultNet.net;
        }
    }

    createWallet(netID) {
        throw new Error("Must implement Create Wallet")
    }
    importWallet(address, privateKey, subnetwork, data) {
        throw new Error("Must implement Import Wallet")
    }

}

class RPCMethod {
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