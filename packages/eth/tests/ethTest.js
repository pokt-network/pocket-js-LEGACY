/**
 * @author Pabel Nunez Landestoy <pabel@pokt.network>
 * @description Unit test for the Pocket Eth plugin
 */
var expect = require('chai').expect;
var should = require('chai').should();
const PocketEth = require("../src/eth.js").PocketEth;
const PocketJSCore = require('pocket-js-core');
const Wallet = PocketJSCore.Wallet;

// Test data
const DEV_ID = "DEVID1";
const RINKEBY_NETWORK = 4;
const MAX_NODES = 10;
const TIMEOUT = 10000;
const ADDRESS = "0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f";
const STORAGE_ADDRESS = "0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f"; // pending
const BLOCK_HASH = "0x1f90713d979a8265ba95775025c6fb4b89680ee402915accf334a97cb2e14734";
const BLOCK_NUMBER = 4107859;
const CODE_ADDRESS = "0xd480083db34e8c87987652ee90f41ddb311f37ff";
const CALL_TO = "0xd480083db34e8c87987652ee90f41ddb311f37ff";
const CALL_DATA = "0xc9be04d500000000000000000000000075ff16d15dfe4c3a92c97f11ff41644d790035a2000000000000000000000000000000000000000000000000000000000000008a";
const ESTIMATE_GAS_TO = "0xd480083db34e8c87987652ee90f41ddb311f37ff";
const ESTIMATE_GAS_DATA = "0xc9be04d500000000000000000000000075ff16d15dfe4c3a92c97f11ff41644d790035a2000000000000000000000000000000000000000000000000000000000000008a";
const TX_HASH = "0x2f56ad1e1e62a07aded5ed60d0a475fe74d55bf6fb79b7014b9b436598083c7e";
const BLOCK_HASH_LOGS = "0x4eeb0bff9670c8b7ffc08e8380b164ef835e1496844adeaf2c5fb4f5cfa36d67";
// Setup
var pocketEth = new PocketEth(DEV_ID, [RINKEBY_NETWORK], MAX_NODES, TIMEOUT);
var walletToImport = pocketEth.createWallet(RINKEBY_NETWORK);

describe('Pocket Eth Class tests', function () {

    it('should instantiate a Pocket Eth instance', function () {
        // New Pocket Eth instance
        var instance = new PocketEth(DEV_ID, [RINKEBY_NETWORK], MAX_NODES, TIMEOUT);

        expect(instance).to.not.be.an.instanceof(Error);
        expect(instance).to.be.an.instanceof(PocketEth);
    });

    it('should fail to instantiate a Pocket Eth instance', function () {
        (function () {
            // New Pocket Eth instance
            new PocketEth(null, [RINKEBY_NETWORK], MAX_NODES, TIMEOUT);
        }).should.throw(Error);
    });

    it('should create a new Eth wallet', function () {
        // New Wallet
        var wallet = pocketEth.createWallet(RINKEBY_NETWORK);

        expect(wallet).to.not.be.an.instanceof(Error);
        expect(wallet).to.be.an.instanceof(Wallet);
    });

    it('should fail to create a new Eth wallet', function () {
        (function () {
            // New Wallet
            var wallet = pocketEth.createWallet();
        }).should.throw(Error);
    });

    it('should import a wallet', function () {
        // Import Wallet
        var importedWallet = pocketEth.importWallet(walletToImport.privateKey, RINKEBY_NETWORK);

        expect(importedWallet).to.not.be.an.instanceof(Error);
        expect(importedWallet).to.be.an.instanceof(Wallet);
    });

    it('should fail to import a wallet', function () {
        (function () {
            // Import Wallet
            var importedWallet = pocketEth.importWallet(null, RINKEBY_NETWORK);
        }).should.throw(Error);
    });
});

describe('PocketEth ETH Namespace RPC Calls', function () {

    it('should retrieve an account balance', async () => {
        var balance = await pocketEth.rinkeby.eth.getBalance(ADDRESS, "latest");

        expect(balance).to.not.be.an.instanceof(Error);
        expect(balance).to.be.a('string');
    });

    it('should fail to retrieve account balance', async () => {
        var balance = await pocketEth.rinkeby.eth.getBalance(null, "latest");

        expect(balance).to.be.an.instanceof(Error);
    });

    it('should retrieve an account transaction count', async () => {
        var balance = await pocketEth.rinkeby.eth.getTransactionCount(ADDRESS, "latest");

        expect(balance).to.not.be.an.instanceof(Error);
        expect(balance).to.be.a('number');
    });

    it('should fail to retrieve an account transaction count', async () => {
        var balance = await pocketEth.rinkeby.eth.getTransactionCount(null, "latest");

        expect(balance).to.be.an.instanceof(Error);
    });

    it('should retrieve storage information', async () => {
        var balance = await pocketEth.rinkeby.eth.getStorageAt(STORAGE_ADDRESS, 0, "latest");

        expect(balance).to.not.be.an.instanceof(Error);
        expect(balance).to.be.a('string');
    });

    it('should fail to retrieve storage information', async () => {
        var balance = await pocketEth.rinkeby.eth.getStorageAt(null, 0, "latest");

        expect(balance).to.be.an.instanceof(Error);
    });

    it('should retrieve a Block transaction count using the block hash', async () => {
        var txCount = await pocketEth.rinkeby.eth.getBlockTransactionCountByHash(BLOCK_HASH);

        expect(txCount).to.not.be.an.instanceof(Error);
        expect(txCount).to.be.a('number');
    });

    it('should fail to retrieve a Block transaction count using the block hash', async () => {
        var txCount = await pocketEth.rinkeby.eth.getBlockTransactionCountByHash(null);

        expect(txCount).to.be.an.instanceof(Error);
    });

    it('should retrieve a Block transaction count using the block number', async () => {
        var txCount = await pocketEth.rinkeby.eth.getBlockTransactionCountByNumber(BLOCK_NUMBER);

        expect(txCount).to.not.be.an.instanceof(Error);
        expect(txCount).to.be.a('number');
    });

    it('should fail to retrieve a Block transaction count using the block number', async () => {
        var txCount = await pocketEth.rinkeby.eth.getBlockTransactionCountByNumber(null);

        expect(txCount).to.be.an.instanceof(Error);
    });

    it('should retrieve code at the given address', async () => {
        var code = await pocketEth.rinkeby.eth.getCode(CODE_ADDRESS, "latest");

        expect(code).to.not.be.an.instanceof(Error);
        expect(code).to.be.a('string');
    });

    it('should fail to retrieve code at the given address', async () => {
        var code = await pocketEth.rinkeby.eth.getCode(null, null);

        expect(code).to.be.an.instanceof(Error);
    });

    it('should execute a new message call', async () => {
        var code = await pocketEth.rinkeby.eth.call(null, CALL_TO, null, null, null, CALL_DATA, "latest");

        expect(code).to.not.be.an.instanceof(Error);
        expect(code).to.be.a('string');
    });

    it('should fail to execute a new message call without destination address', async () => {
        var code = await pocketEth.rinkeby.eth.call(null, null, null, null, null, CALL_DATA, "latest");

        expect(code).to.be.an.instanceof(Error);
    });

    it('should retrieve the block information with the block hash', async () => {
        var code = await pocketEth.rinkeby.eth.getBlockByHash(BLOCK_HASH, true);

        expect(code).to.not.be.an.instanceof(Error);
        expect(code).to.be.a('object');
    });

    it('should fail to retrieve the block information with the block hash', async () => {
        var code = await pocketEth.rinkeby.eth.getBlockByHash(null, null);

        expect(code).to.be.an.instanceof(Error);
    });

    it('should retrieve the block information with the block number', async () => {
        var code = await pocketEth.rinkeby.eth.getBlockByNumber(BLOCK_NUMBER, true);

        expect(code).to.not.be.an.instanceof(Error);
        expect(code).to.be.a('object');
    });

    it('should fail to retrieve the block information with the block number', async () => {
        var code = await pocketEth.rinkeby.eth.getBlockByNumber(null, null);

        expect(code).to.be.an.instanceof(Error);
    });

    it('should retrieve a transaction information with the transaction hash', async () => {
        var code = await pocketEth.rinkeby.eth.getTransactionByHash(TX_HASH);

        expect(code).to.not.be.an.instanceof(Error);
        expect(code).to.be.a('object');
    });

    it('should fail to retrieve a transaction information with the transaction hash', async () => {
        var code = await pocketEth.rinkeby.eth.getTransactionByHash(null);

        expect(code).to.be.an.instanceof(Error);
    });

    it('should retrieve a transaction information with the block hash and index', async () => {
        var code = await pocketEth.rinkeby.eth.getTransactionByBlockHashAndIndex(BLOCK_HASH, 0);

        expect(code).to.not.be.an.instanceof(Error);
        expect(code).to.be.a('object');
    });

    it('should fail to retrieve a transaction information with the block hash and index', async () => {
        var code = await pocketEth.rinkeby.eth.getTransactionByBlockHashAndIndex(null, null);

        expect(code).to.be.an.instanceof(Error);
    });

    it('should retrieve a transaction information with the block number and index', async () => {
        var code = await pocketEth.rinkeby.eth.getTransactionByBlockNumberAndIndex(BLOCK_NUMBER, 0);

        expect(code).to.not.be.an.instanceof(Error);
        expect(code).to.be.a('object');
    });

    it('should fail to retrieve a transaction information with the block number and index', async () => {
        var code = await pocketEth.rinkeby.eth.getTransactionByBlockNumberAndIndex(null, null);

        expect(code).to.be.an.instanceof(Error);
    });

    it('should retrieve a transaction receipt using the transaction hash', async () => {
        var code = await pocketEth.rinkeby.eth.getTransactionReceipt(TX_HASH);

        expect(code).to.not.be.an.instanceof(Error);
        expect(code).to.be.a('object');
    });

    it('should retrieve a transaction receipt using the transaction hash', async () => {
        var code = await pocketEth.rinkeby.eth.getTransactionReceipt(null);

        expect(code).to.be.an.instanceof(Error);
    });

    it('should retrieve the logs with the block hash', async () => {
        var code = await pocketEth.rinkeby.eth.getLogs(null, null, null, null, BLOCK_HASH_LOGS);

        expect(code).to.not.be.an.instanceof(Error);
        expect(code).to.be.a('array');
    });

    it('should retrieve the estimate gas value for a transaction', async () => {
        var code = await pocketEth.rinkeby.eth.estimateGas(null, ESTIMATE_GAS_TO, null, null, null, ESTIMATE_GAS_DATA);

        expect(code).to.not.be.an.instanceof(Error);
        expect(code).to.be.a('number');
    });

    it('should fail to retrieve the estimate gas value for a transaction', async () => {
        var code = await pocketEth.rinkeby.eth.estimateGas(null, null, null, null, 1000000000, null);

        expect(code).to.be.an.instanceof(Error);
    });

    describe('PocketEth NET Namespace RPC Calls', function () {
        it('should retrieve the current network id', async () => {
            var result = await pocketEth.rinkeby.net.version();

            expect(result).to.not.be.an.instanceof(Error);
            expect(result).to.be.a('string');
        });
        it('should retrieve the listening status of the node', async () => {
            var result = await pocketEth.rinkeby.net.listening();

            expect(result).to.not.be.an.instanceof(Error);
            expect(result).to.be.a('boolean');
        });
        it('should retrieve the number of peers currently connected', async () => {
            var result = await pocketEth.rinkeby.net.peerCount();

            expect(result).to.not.be.an.instanceof(Error);
            expect(result).to.be.a('number');
        });
    });
});