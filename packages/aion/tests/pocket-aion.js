/**
 * @author Pabel Nunez Landestoy <pabel@pokt.network>
 * @description Unit test for the Pocket Aion plugin
 */
// Config
var config = require('../../../config.json')
var expect = require('chai').expect;
// Constants
const PocketJSCore = require('pocket-js-core');
const Wallet = PocketJSCore.Wallet;
const PocketJSAion = require('../src/index');
const PocketAion = PocketJSAion.PocketAion;
const AionContract = PocketJSAion.AionContract;
// Test data
const DEV_ID = config.dev_id;
const MASTERY_NETWORK = 32;
const MAX_NODES = 10;
const TIMEOUT = 20000;
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
const CONTRACT_ADDRESS = "0xA0707404B9BE7a5F630fCed3763d28FA5C988964fDC25Aa621161657a7Bf4b89";
const CONTRACT_ABI = [{"outputs":[{"name":"","type":"uint128"},{"name":"","type":"bool"},{"name":"","type":"address"},{"name":"","type":"string"},{"name":"","type":"bytes32"}],"constant":true,"payable":false,"inputs":[{"name":"a","type":"uint128"},{"name":"b","type":"bool"},{"name":"c","type":"address"},{"name":"d","type":"string"},{"name":"e","type":"bytes32"}],"name":"echo","type":"function"},{"outputs":[{"name":"","type":"uint128"}],"constant":true,"payable":false,"inputs":[],"name":"pocketTestState","type":"function"},{"outputs":[],"constant":false,"payable":false,"inputs":[{"name":"a","type":"uint128"}],"name":"addToState","type":"function"},{"outputs":[{"name":"","type":"uint128"}],"constant":true,"payable":false,"inputs":[{"name":"a","type":"uint128"},{"name":"b","type":"uint128"}],"name":"multiply","type":"function"}];
const FUNCTION_NAME = "multiply";
const FUNCTION_PARAMS = [2, 10];
const PRIVATE_KEY = "0x2b5d6fd899ccc148b5f85b4ea20961678c04d70055b09dac7857ea430757e6badb4cfe129e670e2fef1b632ed0eab9572954feebbea9cb32134b284763acd34e";
const ADDRESS = "0xa05b88ac239f20ba0a4d2f0edac8c44293e9b36fa937fb55bf7a1cd61a60f036";
const ADDRESS_TO = "0xa07743f4170ded07da3ccd2ad926f9e684a5f61e90d018a3c5d8ea60a8b3406a";
// Execute Function
const FUNCTION_PARAMS2 = [1];
const FUNCTION_NAME2 = "addToState";
const PRIVATE_KEY2 = "ab6f38ace08e94d29dd50eccdeedee39d468de42890564d63eb39b8e31450207257602da2f0d5318e811794500b144af16fb71d3978bdc05f16c94036da0ead2";
// Setup
const pocketAion = new PocketAion(DEV_ID, [MASTERY_NETWORK], MAX_NODES, TIMEOUT);
const aionContract = new AionContract(pocketAion.mastery, CONTRACT_ADDRESS, CONTRACT_ABI);
const walletToImport = pocketAion.mastery.createWallet();
const importedWallet = pocketAion.mastery.importWallet(PRIVATE_KEY);
const importedWallet2 = pocketAion.mastery.importWallet(PRIVATE_KEY2);

describe('Pocket Aion Class tests', function () {

    it('should instantiate a Pocket Aion instance', function () {
        // New Pocket Aion instance
        var instance = new PocketAion(DEV_ID, [MASTERY_NETWORK], MAX_NODES, TIMEOUT);

        expect(instance).to.not.be.an.instanceof(Error);
        expect(instance).to.be.an.instanceof(PocketAion);
    });

    it('should fail to instantiate a Pocket Aion instance', function () {
        expect(function(){
            new PocketAion(null, [MASTERY_NETWORK], MAX_NODES, TIMEOUT);
        }).to.throw(Error);
    });

    it('should create a new Aion wallet', function () {
        // New Wallet
        var wallet = pocketAion.mastery.createWallet();

        expect(wallet).to.not.be.an.instanceof(Error);
        expect(wallet).to.be.an.instanceof(Wallet);
    });

    it('should import a wallet', function () {
        // Import Wallet
        var importedWallet = pocketAion.mastery.importWallet(walletToImport.privateKey, MASTERY_NETWORK);

        expect(importedWallet).to.not.be.an.instanceof(Error);
        expect(importedWallet).to.be.an.instanceof(Wallet);
    });

    it('should fail to import a wallet', function () {
        var importedWallet = pocketAion.mastery.importWallet(null);
        expect(importedWallet).to.be.an.instanceof(Error);
    });
});

describe('PocketAion ETH Namespace RPC Calls', function () {

    it('should retrieve an account balance', async () => {
        var balance = await pocketAion.mastery.eth.getBalance(ADDRESS, "latest");

        expect(balance).to.not.be.an.instanceof(Error);
        expect(balance).to.be.a('string');
    });

    it('should fail to retrieve account balance', async () => {
        var balance = await pocketAion.mastery.eth.getBalance(null, "latest");

        expect(balance).to.be.an.instanceof(Error);
    });

    it('should retrieve an account transaction count', async () => {
        var balance = await pocketAion.mastery.eth.getTransactionCount(ADDRESS, "latest");

        expect(balance).to.not.be.an.instanceof(Error);
        expect(balance).to.be.a('number');
    });

    it('should fail to retrieve an account transaction count', async () => {
        var balance = await pocketAion.mastery.eth.getTransactionCount(null, "latest");

        expect(balance).to.be.an.instanceof(Error);
    });

    it('should retrieve storage information', async () => {
        var balance = await pocketAion.mastery.eth.getStorageAt(STORAGE_ADDRESS, 0, "latest");

        expect(balance).to.not.be.an.instanceof(Error);
        expect(balance).to.be.a('string');
    });

    it('should fail to retrieve storage information', async () => {
        var balance = await pocketAion.mastery.eth.getStorageAt(null, 0, "latest");

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
        var code = await pocketAion.mastery.eth.getCode(CODE_ADDRESS, "latest");

        expect(code).to.not.be.an.instanceof(Error);
        expect(code).to.be.a('string');
    });

    it('should fail to retrieve code at the given address', async () => {
        var code = await pocketAion.mastery.eth.getCode(null, null);

        expect(code).to.be.an.instanceof(Error);
    });

    it('should execute a new message call', async () => {
        var code = await pocketAion.mastery.eth.call(null, CALL_TO, 50000, 20000000000, 20000000000, CALL_DATA, "latest");

        expect(code).to.not.be.an.instanceof(Error);
        expect(code).to.be.a('string');
    });

    it('should fail to execute a new message call', async () => {
        var code = await pocketAion.mastery.eth.call(null, null, 50000, 20000000000, 20000000000, CALL_DATA, "latest");

        expect(code).to.be.an.instanceof(Error);
    });

    it('should retrieve the block information with the block hash', async () => {
        var code = await pocketAion.mastery.eth.getBlockByHash(BLOCK_HASH, true);

        expect(code).to.not.be.an.instanceof(Error);
        expect(code).to.be.a('object');
    });

    it('should fail to retrieve the block information with the block hash', async () => {
        var code = await pocketAion.mastery.eth.getBlockByHash(null, null);

        expect(code).to.be.an.instanceof(Error);
    });

    it('should retrieve the block information with the block number', async () => {
        var code = await pocketAion.mastery.eth.getBlockByNumber(BLOCK_NUMBER, true);

        expect(code).to.not.be.an.instanceof(Error);
        expect(code).to.be.a('object');
    });

    it('should fail to retrieve the block information with the block number', async () => {
        var code = await pocketAion.mastery.eth.getBlockByNumber(null, null);

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
        var code = await pocketAion.mastery.eth.estimateGas(null, ESTIMATE_GAS_TO, null, null, null, ESTIMATE_GAS_DATA);

        expect(code).to.not.be.an.instanceof(Error);
        expect(code).to.be.a('number');
    });

    it('should fail to retrieve the estimate gas value for a transaction', async () => {
        var code = await pocketAion.mastery.eth.estimateGas(null, null, null, null, null, ESTIMATE_GAS_DATA);

        expect(code).to.be.an.instanceof(Error);
    });

    it('should send a transaction getting the nonce using getTransactionCount', async () => {
        var nonce = await pocketAion.mastery.eth.getTransactionCount(ADDRESS);
        var result = await pocketAion.mastery.eth.sendTransaction(importedWallet, nonce, ADDRESS_TO, 50000, 20000000000, 20000000000, null)

        expect(result).to.not.be.an.instanceof(Error);
        expect(result).to.be.a('string');
    });

    it('should fail to send a transaction without nonce', async () => {
        var result = await pocketAion.mastery.eth.sendTransaction(importedWallet, null, ADDRESS_TO, 50000, 20000000000, 20000000000, null)

        expect(result).to.be.an.instanceof(Error);
    });
});
describe('PocketAion NET Namespace RPC Calls', function () {
    it('should retrieve the current network id', async () => {
        var result = await pocketAion.mastery.net.version();

        expect(result).to.not.be.an.instanceof(Error);
        expect(result).to.be.a('string');
    });
    it('should retrieve the listening status of the node', async () => {
        var result = await pocketAion.mastery.net.listening();

        expect(result).to.not.be.an.instanceof(Error);
        expect(result).to.be.a('boolean');
    });
    it('should retrieve the number of peers currently connected', async () => {
        var result = await pocketAion.mastery.net.peerCount();

        expect(result).to.not.be.an.instanceof(Error);
        expect(result).to.be.a('number');
    });
});

describe('PocketAion smart contract interface', function () {
    it('should return the result of multiply 2 by 10', async () => {
        var result = await aionContract.executeConstantFunction(FUNCTION_NAME,FUNCTION_PARAMS,null, 50000,20000000000, null)

        expect(result).to.not.be.an.instanceof(Error);
        expect(result).to.be.a('object');
    });

    it('should add 1 value to the test smart contract state', async () => {
        var result = await aionContract.executeFunction(FUNCTION_NAME2, importedWallet2, FUNCTION_PARAMS2, null, 50000, 20000000000, 0);
        
        expect(result).to.not.be.an.instanceof(Error);
        expect(result).to.be.a('string');
    });
});