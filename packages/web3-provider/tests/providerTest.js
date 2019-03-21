/**
 * @author Pabel Nunez Landestoy <pabel@pokt.network>
 * @description Unit test for the Pocket Web3 Provider
 */
var assert = require('assert');
var PocketProvider = require('../src/pocket_provider.js').PocketProvider;
var EthereumTx = require('ethereumjs-tx');

var TestOptions = {
    networkName: "ETH",
    networkID: "4",
    devID: "DEVID1",
    version: "0"
}

var TestTransactionSigner = {
    hasAddress: function (address, callback) {
        console.log(TestTransactionSigner.accounts);
        callback(null, TestTransactionSigner.accounts.includes(address));
    },
    signTransaction: function (txParams, callback) {
        var pkString = Object.values(TestTransactionSigner.privateKeys)[0];
        var privateKeyBuffer = Buffer.from(pkString, 'hex');
        var tx = new EthereumTx(txParams);
        tx.sign(privateKeyBuffer);
        callback(null, '0x' + tx.serialize().toString('hex'));
    },
    // Needs at least 2 accounts in the node to run all tests
    accounts: ["0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f"],
    // TODO: Improve this
    // Update this object with the address - private keys for each account in the same order they are declared
    privateKeys: {
        "value": "330D1AD67A9E44E15F5B7EBD20514865CBCE363B2E95FFC9D9C95198EF2893F3"
    }
}

describe('PocketProvider', function () {
    var opts = {
        transactionSigner: TestTransactionSigner
    }
    var provider = new PocketProvider(TestOptions.networkName, TestOptions.networkID, TestOptions.devID, TestOptions.version, opts)

    describe('#send', function () {
        // Fetch accounts from the service node if the accounts array is empty
        before(function (done) {
            if(TestTransactionSigner.accounts.length === 0) {
                var payload = {
                    "jsonrpc": "2.0",
                    "method": "eth_accounts",
                    "params": [],
                    "id": 1
                };
                provider.send(payload, function (err, result) {
                    if (err != null) {
                        throw err;
                    }
                    TestTransactionSigner.accounts = result;
                    done();
                });
            }else {
                done();
            }
        });
    });
});