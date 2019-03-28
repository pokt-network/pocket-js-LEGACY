/**
 * @author Pabel Nunez Landestoy <pabel@pokt.network>
 * @description Unit test for the Pocket Aion plugin
 */
var expect = require('chai').expect;
var should = require('chai').should();
const PocketAion = require("../src/aion.js").PocketAion;
const PocketJSCore = require('pocket-js-core');
const Wallet = PocketJSCore.Wallet;

// Test data
const DEV_ID = "DEVID1";
const MASTERY_NETWORK = 32;
const MAX_NODES = 10;
const TIMEOUT = 10000;
const ADDRESS = "0xa0510dd236472e90f0ff4f6b7b4f70b1d8c5206cf303839f9a4e8fa6af0dd420";
const STORAGE_ADDRESS = "0xa061d41a9de8b2f317073cc331e616276c7fc37a80b0e05a7d0774c9cf956107";
const BLOCK_HASH = "0xa9316ee7207cf2ac1fd886673d5c14835a86cda97eae8f0d382b95678932c8d0";
const BLOCK_NUMBER = 1329667;
const CODE_ADDRESS = "0xA0707404B9BE7a5F630fCed3763d28FA5C988964fDC25Aa621161657a7Bf4b89";
const CALL_TO = "0xA0707404B9BE7a5F630fCed3763d28FA5C988964fDC25Aa621161657a7Bf4b89";
const CALL_DATA = "0xbbaa08200000000000000000000000000000014c00000000000000000000000000000154";
const ESTIMATE_GAS_TO = "0xA0707404B9BE7a5F630fCed3763d28FA5C988964fDC25Aa621161657a7Bf4b89";
const ESTIMATE_GAS_DATA = "0xbbaa0820000000000000000000000000000000020000000000000000000000000000000a";
const TX_HASH = "0x123075c535309a3b0dbbe5c97a7a5298ec7f1bd3ae1b684ec529df3ce16cab2e";
const BLOCK_HASH_LOGS = "0xa9316ee7207cf2ac1fd886673d5c14835a86cda97eae8f0d382b95678932c8d0";
// Setup
var pocketAion = new PocketAion(DEV_ID, [MASTERY_NETWORK], MAX_NODES, TIMEOUT);
var walletToImport = pocketAion.createWallet(MASTERY_NETWORK);

describe('Pocket Aion Class tests', function () {

    it('should instantiate a Pocket Aion instance', function () {
        // New Pocket Aion instance
        var instance = new PocketAion(DEV_ID, [MASTERY_NETWORK], MAX_NODES, TIMEOUT);

        expect(instance).to.not.be.an.instanceof(Error);
        expect(instance).to.be.an.instanceof(PocketAion);
    });

    it('should fail to instantiate a Pocket Aion instance', function () {
        (function () {
            // New Pocket Aion instance
            new PocketAion(null, [MASTERY_NETWORK], MAX_NODES, TIMEOUT);
        }).should.throw(Error);
    });

    it('should create a new Aion wallet', function () {
        // New Wallet
        var wallet = pocketAion.createWallet(MASTERY_NETWORK);

        expect(wallet).to.not.be.an.instanceof(Error);
        expect(wallet).to.be.an.instanceof(Wallet);
    });

    it('should fail to create a new Aion wallet', function () {
        (function () {
            // New Wallet
            var wallet = pocketAion.createWallet();
        }).should.throw(Error);
    });

    it('should import a wallet', function () {
        // Import Wallet
        var importedWallet = pocketAion.importWallet(walletToImport.privateKey, MASTERY_NETWORK);

        expect(importedWallet).to.not.be.an.instanceof(Error);
        expect(importedWallet).to.be.an.instanceof(Wallet);
    });

    it('should fail to import a wallet', function () {
        (function () {
            // Import Wallet
            var importedWallet = pocketAion.importWallet(null, MASTERY_NETWORK);
        }).should.throw(Error);
    });
});

describe('PocketAion ETH Namespace RPC Calls', function () {

    it('should retrieve an account balance', async () => {
        var balance = await pocketAion.mastery.eth.getBalance(ADDRESS,"latest");

        expect(balance).to.not.be.an.instanceof(Error);
        expect(balance).to.be.a('string');
    });

    it('should fail to retrieve account balance', async () => {
        var balance = await pocketAion.mastery.eth.getBalance(null,"latest");
        
        expect(balance).to.be.an.instanceof(Error);
    });

    it('should retrieve an account transaction count', async () => {
        var balance = await pocketAion.mastery.eth.getTransactionCount(ADDRESS,"latest");

        expect(balance).to.not.be.an.instanceof(Error);
        expect(balance).to.be.a('number');
    });

    it('should fail to retrieve an account transaction count', async () => {
        var balance = await pocketAion.mastery.eth.getTransactionCount(null,"latest");
        
        expect(balance).to.be.an.instanceof(Error);
    });

    it('should retrieve storage information', async () => {
        var balance = await pocketAion.mastery.eth.getStorageAt(STORAGE_ADDRESS, 0,"latest");

        expect(balance).to.not.be.an.instanceof(Error);
        expect(balance).to.be.a('string');
    });

    it('should fail to retrieve storage information', async () => {
        var balance = await pocketAion.mastery.eth.getStorageAt(null, 0,"latest");
        
        expect(balance).to.be.an.instanceof(Error);
    });

    it('should retrieve a Block transaction count using the block hash', async () => {
        var txCount = await pocketAion.mastery.eth.getBlockTransactionCountByHash(BLOCK_HASH);

        expect(txCount).to.not.be.an.instanceof(Error);
        expect(txCount).to.be.a('number');
    });

    it('should fail to retrieve a Block transaction count using the block hash', async () => {
        var txCount = await pocketAion.mastery.eth.getBlockTransactionCountByHash(null);
        
        expect(txCount).to.be.an.instanceof(Error);
    });

    it('should retrieve a Block transaction count using the block number', async () => {
        var txCount = await pocketAion.mastery.eth.getBlockTransactionCountByNumber(BLOCK_NUMBER);

        expect(txCount).to.not.be.an.instanceof(Error);
        expect(txCount).to.be.a('number');
    });

    it('should fail to retrieve a Block transaction count using the block number', async () => {
        var txCount = await pocketAion.mastery.eth.getBlockTransactionCountByNumber(null);
        
        expect(txCount).to.be.an.instanceof(Error);
    });

    it('should retrieve code at the given address', async () => {
        var code = await pocketAion.mastery.eth.getCode(CODE_ADDRESS,"latest");

        expect(code).to.not.be.an.instanceof(Error);
        expect(code).to.be.a('string');
    });

    it('should fail to retrieve code at the given address', async () => {
        var code = await pocketAion.mastery.eth.getCode(null,null);
        
        expect(code).to.be.an.instanceof(Error);
    });

    it('should execute a new message call', async () => {
        var code = await pocketAion.mastery.eth.call(null,CALL_TO,50000,20000000000,20000000000,CALL_DATA,"latest");

        expect(code).to.not.be.an.instanceof(Error);
        expect(code).to.be.a('string');
    });

    it('should fail to execute a new message call', async () => {
        var code = await pocketAion.mastery.eth.call(null,null,50000,20000000000,20000000000,CALL_DATA,"latest");
        
        expect(code).to.be.an.instanceof(Error);
    });

    it('should retrieve the block information with the block hash', async () => {
        var code = await pocketAion.mastery.eth.getBlockByHash(BLOCK_HASH, true);

        expect(code).to.not.be.an.instanceof(Error);
        expect(code).to.be.a('object');
    });

    it('should fail to retrieve the block information with the block hash', async () => {
        var code = await pocketAion.mastery.eth.getBlockByHash(null,null);
        
        expect(code).to.be.an.instanceof(Error);
    });

    it('should retrieve the block information with the block number', async () => {
        var code = await pocketAion.mastery.eth.getBlockByNumber(BLOCK_NUMBER, true);

        expect(code).to.not.be.an.instanceof(Error);
        expect(code).to.be.a('object');
    });

    it('should fail to retrieve the block information with the block number', async () => {
        var code = await pocketAion.mastery.eth.getBlockByNumber(null,null);
        
        expect(code).to.be.an.instanceof(Error);
    });

    it('should retrieve a transaction information with the transaction hash', async () => {
        var code = await pocketAion.mastery.eth.getTransactionByHash(TX_HASH);

        expect(code).to.not.be.an.instanceof(Error);
        expect(code).to.be.a('object');
    });

    it('should fail to retrieve a transaction information with the transaction hash', async () => {
        var code = await pocketAion.mastery.eth.getTransactionByHash(null);
        
        expect(code).to.be.an.instanceof(Error);
    });

    it('should retrieve a transaction information with the block hash and index', async () => {
        var code = await pocketAion.mastery.eth.getTransactionByBlockHashAndIndex(BLOCK_HASH, 0);

        expect(code).to.not.be.an.instanceof(Error);
        expect(code).to.be.a('object');
    });

    it('should fail to retrieve a transaction information with the block hash and index', async () => {
        var code = await pocketAion.mastery.eth.getTransactionByBlockHashAndIndex(null, null);
        
        expect(code).to.be.an.instanceof(Error);
    });

    it('should retrieve a transaction information with the block number and index', async () => {
        var code = await pocketAion.mastery.eth.getTransactionByBlockNumberAndIndex(BLOCK_NUMBER, 0);

        expect(code).to.not.be.an.instanceof(Error);
        expect(code).to.be.a('object');
    });

    it('should fail to retrieve a transaction information with the block number and index', async () => {
        var code = await pocketAion.mastery.eth.getTransactionByBlockNumberAndIndex(null, null);
        
        expect(code).to.be.an.instanceof(Error);
    });

    it('should retrieve a transaction receipt using the transaction hash', async () => {
        var code = await pocketAion.mastery.eth.getTransactionReceipt(TX_HASH);

        expect(code).to.not.be.an.instanceof(Error);
        expect(code).to.be.a('object');
    });

    it('should retrieve a transaction receipt using the transaction hash', async () => {
        var code = await pocketAion.mastery.eth.getTransactionReceipt(null);
        
        expect(code).to.be.an.instanceof(Error);
    });

    it('should retrieve the logs with the block hash', async () => {
        var code = await pocketAion.mastery.eth.getLogs(null, null, null, null, BLOCK_HASH_LOGS);

        expect(code).to.not.be.an.instanceof(Error);
        expect(code).to.be.a('array');
    });

    it('should retrieve the estimate gas value for a transaction', async () => {
        var code = await pocketAion.mastery.eth.estimateGas(null,ESTIMATE_GAS_TO,null,null,null,ESTIMATE_GAS_DATA,"latest");

        expect(code).to.not.be.an.instanceof(Error);
        expect(code).to.be.a('number');
    });

    it('should fail to retrieve the estimate gas value for a transaction', async () => {
        var code = await pocketAion.mastery.eth.estimateGas(null,null,null,null,null,ESTIMATE_GAS_DATA,"latest");
        
        expect(code).to.be.an.instanceof(Error);
    });

});