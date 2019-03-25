/**
 * @author Pabel Nunez Landestoy <pabel@pokt.network>
 * @description Pocket javascript plugin to interact with the Aion network.
 */
// Dependencies
const PocketJSCore = require('pocket-js-core');
const Pocket = PocketJSCore.Pocket;
const Wallet = PocketJSCore.Wallet;
const AionWeb3 = require('aion-web3');

// Constants
const NETWORK_NAME = "AION";
const Networks = Object.freeze({"MAINNET":"256", "MASTERY":"32"})

class PocketAion extends Pocket {
    constructor(devID, netIDs, maxNodes = 5, requestTimeOut = 10000, defaultNet = Networks.MASTERY) {
        if (devID == null || netIDs == null) {
            throw new Error("Invalid number of arguments");
        }
        // Options object
        var opts = {
            "devID": devID,
            "networkName": NETWORK_NAME,
            "netIDs": netIDs,
            "requestTimeOut": requestTimeOut,
            "maxNodes": maxNodes
        }
        // Call super with the options object
        super(opts);
        // Create Aion instance
        this.aionInstance = new AionWeb3();
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
    createWallet(netID) {
        // Check for the aion instance
        if (netID != null) {
            var account = this.aionInstance.eth.accounts.create();
            return new Wallet(account.address, account.privateKey, NETWORK_NAME, netID, null);
        }else{
            throw new Error("Failed to create Wallet, netID param is missing.")
        }
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
    PocketAion,
    Networks
}