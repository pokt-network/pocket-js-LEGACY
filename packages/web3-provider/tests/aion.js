/**
 * @author Pabel Nunez Landestoy <pabel@pokt.network>
 * @description Unit test for the Pocket Web3 Provider
 */
// Constants
const expect = require('chai').expect;
const PocketProvider = require('../src/index.js');
const aionAccount = require('aion-web3-eth-accounts');
// Config
var config = require('../../../config.json')
const DEV_ID = config.dev_id;
// Aion data setup for test
const AionTransactionSigner = {
    hasAddress: async function (address) {
        return AionTransactionSigner.accounts.includes(address);
    },
    signTransaction: async function (txParams) {
        // Retrieve the private key
        var pkString = Object.values(AionTransactionSigner.privateKeys)[0];
        // Sign transaction
        var result = await aionAccount.prototype.signTransaction(txParams, pkString);
        var signedTx = result.rawTransaction;
        return signedTx;
    },
    // Needs at least 2 accounts in the node to run all tests
    accounts: ["0xa0510dd236472e90f0ff4f6b7b4f70b1d8c5206cf303839f9a4e8fa6af0dd420", "0xa0d969df9232b45239b577c3790887081b5a22ffd5a46a8d82584ee560485624"],
    // TODO: Improve this
    // Update this object with the address - private keys for each account in the same order they are declared
    privateKeys: {
        "value": "0xd0c6208eb958998dcdac23bedf7d58d863c5abe64e250e4e379a4efd3966cd99e5cab1be5be1655abc987ff7321a438581778919b859370cf1faa22346b201fc"
    }
}
// Network information
var aionOpts = { networkName: "AION", networkID: "32", devID: DEV_ID };

// Aion network tests
describe('Aion PocketProvider', function () {
    var opts = {
        transactionSigner: AionTransactionSigner
    }
    var provider = new PocketProvider(aionOpts.networkName, aionOpts.networkID, aionOpts.devID, opts);

    it('should create a new instance of the PocketProvider', function () {
        var pocketProvider = new PocketProvider(aionOpts.networkName, aionOpts.networkID,
            aionOpts.devID, aionOpts.version, opts);

        expect(pocketProvider).to.not.be.an.instanceof(Error);
        expect(pocketProvider).to.be.an.instanceof(PocketProvider);
        expect(pocketProvider).to.have.property('transactionSigner');
    });

    it('should send a new request', async () => {
        var payload = {
            "jsonrpc": "2.0",
            "method": "eth_getBalance",
            "params": [AionTransactionSigner.accounts[0], "latest"],
            "id": (new Date()).getTime()
        };

        var response = await provider.send(payload);
        expect(response).to.not.be.an.instanceof(Error);
        expect(response).to.be.a('object');
    });

    it('should submit transactions using eth_sendTransaction', async () => {
        // Transfers aion from accounts[0] to accounts[1]
        var tx = {
            "from": AionTransactionSigner.accounts[0],
            "to": AionTransactionSigner.accounts[1],
            "value": "0x2540be400",
            "gas": "0x5208",
            "gasPrice": "0x2540be400"
        }
        
        var payload = {
            "jsonrpc": "2.0",
            "method": "eth_sendTransaction",
            "params": [tx],
            "id": (new Date()).getTime()
        };
        
        var response = await provider.send(payload);
        expect(response).to.not.be.an.instanceof(Error);
        expect(response).to.be.a('object');
    });
});