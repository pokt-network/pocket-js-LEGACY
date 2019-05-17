/**
 * @author Pabel Nunez Landestoy <pabel@pokt.network>
 * @description Unit test for the Pocket Web3 Provider
 */
// Constants
const expect = require('chai').expect;
const PocketProvider = require('../src/index.js');
const EthereumTx = require('ethereumjs-tx');
const web3Utils = require('web3-utils');
// Config
var config = require('../../../config.json')
const DEV_ID = config.dev_id;
// Ethereum data setup for test
const EthTransactionSigner = {
    hasAddress: async function (address) {
        return EthTransactionSigner.accounts.includes(address);
    },
    signTransaction: async function (txParams) {
        var pkString = Object.values(EthTransactionSigner.privateKeys)[0];
        var privateKeyBuffer = Buffer.from(pkString, 'hex');
        var tx = new EthereumTx(txParams);
        tx.sign(privateKeyBuffer);
        return '0x' + tx.serialize().toString('hex');
    },
    // Needs at least 2 accounts in the node to run all tests
    accounts: ["0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f", "0xF0BE394Fb2Def90824D11C7Ea189E75a8e868fA6"],
    // TODO: Improve this
    // Update this object with the address - private keys for each account in the same order they are declared
    privateKeys: {
        "value": "330D1AD67A9E44E15F5B7EBD20514865CBCE363B2E95FFC9D9C95198EF2893F3"
    }
}
// Network information
var ethOpts = { networkName: "ETH", networkID: "4", devID: DEV_ID };

describe('Ethereum PocketProvider', function () {
    var opts = {
        transactionSigner: EthTransactionSigner
    }
    var provider = new PocketProvider(ethOpts.networkName, ethOpts.networkID, ethOpts.devID, opts);

    it('should create a new instance of the PocketProvider', function () {
        var pocketProvider = new PocketProvider(ethOpts.networkName, ethOpts.networkID,
            ethOpts.devID, ethOpts.version, opts);

        expect(pocketProvider).to.not.be.an.instanceof(Error);
        expect(pocketProvider).to.be.an.instanceof(PocketProvider);
        expect(pocketProvider).to.have.property('transactionSigner');

    });

    it('should send a new request', async () => {
        var payload = {
            "jsonrpc": "2.0",
            "method": "eth_getBalance",
            "params": [EthTransactionSigner.accounts[0], "latest"],
            "id": (new Date()).getTime()
        };
        var response = await provider.send(payload);
        expect(response).to.not.be.an.instanceof(Error);
        expect(response).to.be.a('object');
    });

    it('should submit transactions using eth_sendTransaction', async () => {
        // Transfers eth from accounts[0] to accounts[1]
        var tx = {
            "from": EthTransactionSigner.accounts[0],
            "to": EthTransactionSigner.accounts[1],
            "value": web3Utils.numberToHex(10000), // Change value for the amount being sent
            "gas": "0x5208",
            "gasPrice": "0x3B9ACA00"
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