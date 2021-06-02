import { expect } from 'chai'
import { typeGuard, RpcError } from "@pokt-network/pocket-js-utils"
import { Account, Keybase, UnlockedAccount } from "@pokt-network/pocket-js-keybase"
import { HttpRpcProvider } from "@pokt-network/pocket-js-http-provider"
import { TransactionSender, CoinDenom} from "../../../src"
import { RawTxResponse } from "@pokt-network/pocket-js-rpc-models"
import { EnvironmentHelper } from "@pokt-network/pocket-js-test-utils"
import { publicKeyFromPrivate } from "@pokt-network/pocket-js-utils"
import * as dotenv from "dotenv"
import 'mocha';

/** Specify the environment using using EnvironmentHelper.getLocalNet()
 * LocalNet will run the tests againt's a local network which can be setup in the .env file = localhost_env_url="http://35.245.7.53"
 * TestNet will run the tests with the TestNet Network.
 * MainNet will run the tests with the MainNet Network (not available yet).
 * 
 * Note: Can be done also using the Network enum (LocalNet,TestNet and MainNet)
 * EnvironmentHelper.get(Network.LocalNet)
 * Note: process.env.localhost_env_url is set in the .env file, add if it doesn't exist in the root directory of the project
 * To use unit tests run "npm run test:unit" or "npmtest", for integration run "npm run test:integration"
 */
dotenv.config()
const env = EnvironmentHelper.getLocalNet()
const dispatcher = new URL("http://localhost:8081")
const keybase = new Keybase()
const privKey = "49c249b58e8b6d240858c9c52755c1acf01d3f7b7df251e990fbd1879bd386275bdbfdad5ab2f7fdd0b815cc0fee2e263242bcdb8db19db23765c3cc67815e12"
const chainID = "pocket-testet-playground"
const msgFixtures = {
    send: {
        fromPK: "49c249b58e8b6d240858c9c52755c1acf01d3f7b7df251e990fbd1879bd386275bdbfdad5ab2f7fdd0b815cc0fee2e263242bcdb8db19db23765c3cc67815e12"
    },
    appStake: {
        fromPK: "8008e429fc8cf42fc319be13d94ac9f1157442ef7f268a242f71653ceff43eb3b9f637bc47a0b106d691e15f1fdc5b3bbcf4487258006d87ac56537359f3b471"
    },
    appUnstake: {
        fromPK: "8008e429fc8cf42fc319be13d94ac9f1157442ef7f268a242f71653ceff43eb3b9f637bc47a0b106d691e15f1fdc5b3bbcf4487258006d87ac56537359f3b471"
    },
    appUnjail: {
        fromPK: "46408bd84dd5894986d363929fecfdc22fb6f6a0a5a2460a51b223604b1b3a83d07472ff9c73d770d976c468f0b82e665780721887fc0c9db95bb3c2210bd778"
    },
    nodeStake: {
        fromPK: "d7a4219676b5e24690f61917fa97525d6b797eda65c3e87c4d043d8df97a42ce7f7e2d6e3082583d17464b33ab9a341318c8cd7f05164972c104d45fc80c8583"
    },
    nodeUnstake: {
        fromPK: "d7a4219676b5e24690f61917fa97525d6b797eda65c3e87c4d043d8df97a42ce7f7e2d6e3082583d17464b33ab9a341318c8cd7f05164972c104d45fc80c8583"
    },
    nodeUnjail: {
        fromPK: "d7a4219676b5e24690f61917fa97525d6b797eda65c3e87c4d043d8df97a42ce7f7e2d6e3082583d17464b33ab9a341318c8cd7f05164972c104d45fc80c8583"
    }
}

describe("Using ITransactionSender", function () {
    describe("Creating a transaction sender", function () {
        describe("With a private key", function () {
            describe("Success scenarios", function () {
                it("Should create a ITransactionSender given a private key buffer", async () => {
                    // Account Private Key Buffer and Public Key
                    const privKeyBuffer = Buffer.from(privKey, "hex")
                    const pubKey = publicKeyFromPrivate(privKeyBuffer)
                    // RPC Provider
                    const rpcProvider = new HttpRpcProvider(dispatcher)
                    // Unlocked Account
                    const unlockedAccount = new UnlockedAccount(new Account(pubKey, ''), privKeyBuffer)
                    expect(new TransactionSender(rpcProvider, unlockedAccount)).to.not.throw
                }) 
            })
        })

        describe("With an imported account", function () {
            describe("Success scenarios", function () {
                it("should create a ITransactionSender with an already created account and correct passphrase", async () => {
                    // RPC Provider
                    const rpcProvider = new HttpRpcProvider(dispatcher)

                    // Create the account
                    const passphrase = "1234"
                    const accountOrError = await keybase.createAccount(passphrase)
                    expect(accountOrError).not.to.be.a("error")
                    const account = accountOrError as Account

                    // Unlock the account
                    const unlockedAccountOrError = await keybase.getUnlockedAccount(account.addressHex, passphrase)
                    expect(unlockedAccountOrError).not.to.be.a("error")
                    const unlockedAccount = unlockedAccountOrError as UnlockedAccount
                    // Create the transaction sender
                    expect(new TransactionSender(rpcProvider, unlockedAccount)).to.not.throw
                })

                it("should create a ITransactionSender with an already imported account and correct passphrase", async () => {
                    // RPC Provider
                    const rpcProvider = new HttpRpcProvider(dispatcher)

                    // Import the account
                    const passphrase = "1234"
                    const accountOrError = await keybase.importAccount(Buffer.from(privKey, "hex"), passphrase)
                    expect(accountOrError).not.to.be.a("error")
                    const account = accountOrError as Account

                    // Unlock the account
                    const unlockedAccountOrError = await keybase.getUnlockedAccount(account.addressHex, passphrase)
                    expect(unlockedAccountOrError).not.to.be.a("error")
                    const unlockedAccount = unlockedAccountOrError as UnlockedAccount
                    // Create the transaction sender
                    expect(new TransactionSender(rpcProvider, unlockedAccount)).to.not.throw
                })
            })

            describe("Error scenarios", function () {
                it("should fail to create a ITransactionSender due to missing unlocked account and transaction signer", async () => {
                    // RPC Provider
                    const rpcProvider = new HttpRpcProvider(dispatcher)

                    // Create the transaction sender
                    expect(function(){
                        new TransactionSender(rpcProvider)
                    }).to.throw
                })
            })
        })
    })

    describe("Submit transaction", function () {
        describe("Message submission", function () {

            describe("Send message", function () {
                describe("Success scenarios", function () {
                    it("should succesfully submit a send message given the correct parameters using the new ProtoBuf tx signer", async () => {
                        // RPC Provider
                        const rpcProvider = new HttpRpcProvider(dispatcher)

                        // Create the recipient account
                        const passphrase = "1234"
                        const recipientAccountOrError = await keybase.createAccount(passphrase)
                        expect(recipientAccountOrError).not.to.be.a("error")
                        const recipientAccount = recipientAccountOrError as Account

                        // Import and Unlock the sender's account
                        const unlockedAccountOrError = await keybase.importAndUnlockAccount(Buffer.from(msgFixtures.send.fromPK, "hex"), passphrase)
                        expect(unlockedAccountOrError).not.to.be.a("error")
                        const unlockedAccount = unlockedAccountOrError as UnlockedAccount

                        // Create the transaction sender
                        const transactionSender = new TransactionSender(rpcProvider, unlockedAccount)

                        let rawTxResponse = await transactionSender
                            .send(unlockedAccount.addressHex, recipientAccount.addressHex, "100000")
                            .submit(chainID, "10000", CoinDenom.Upokt, "This is a test!")
                        expect(typeGuard(rawTxResponse, RpcError)).to.be.false
                        rawTxResponse = rawTxResponse as RawTxResponse
                        expect(rawTxResponse.height).to.equal(BigInt(0))
                        expect(rawTxResponse.hash).not.to.be.empty
                    })
                })

                describe("Error scenarios", function () {
                    it("should error to submit a send message with an empty amount", async () => {
                        // RPC Provider
                        const rpcProvider = new HttpRpcProvider(dispatcher)

                        // Create the recipient account
                        const passphrase = "1234"
                        const recipientAccountOrError = await keybase.createAccount(passphrase)
                        expect(recipientAccountOrError).not.to.be.a("error")
                        const recipientAccount = recipientAccountOrError as Account

                        // Import and Unlock the sender's account
                        const sendersAccountOrError = await keybase.importAccount(Buffer.from(msgFixtures.send.fromPK, "hex"), passphrase)
                        expect(sendersAccountOrError).not.to.be.a("error")
                        const sendersAccount = sendersAccountOrError as Account
                        const unlockedAccountOrError = await keybase.getUnlockedAccount(sendersAccount.addressHex, passphrase)
                        expect(unlockedAccountOrError).not.to.be.a("error")
                        const unlockedAccount = unlockedAccountOrError as UnlockedAccount

                        // Create the transaction sender
                        const transactionSender = new TransactionSender(rpcProvider, unlockedAccount)
                        
                        let rawTxResponse = await transactionSender
                            .send(unlockedAccount.addressHex, recipientAccount.addressHex, "")
                            .submit(chainID, "10000", CoinDenom.Upokt, "This is a test!")
                        rawTxResponse = rawTxResponse as RawTxResponse
                        expect(typeGuard(rawTxResponse, RpcError)).to.be.true
                    })

                    it("should error to submit a send message with an non-numerical amount", async () => {
                        // RPC Provider
                        const rpcProvider = new HttpRpcProvider(dispatcher)

                        // Create the recipient account
                        const passphrase = "1234"
                        const recipientAccountOrError = await keybase.createAccount(passphrase)
                        expect(recipientAccountOrError).not.to.be.a("error")
                        const recipientAccount = recipientAccountOrError as Account

                        // Import and Unlock the sender's account
                        const unlockedAccountOrError = await keybase.importAndUnlockAccount(Buffer.from(msgFixtures.send.fromPK, "hex"), passphrase)
                        expect(unlockedAccountOrError).not.to.be.a("error")
                        const unlockedAccount = unlockedAccountOrError as UnlockedAccount

                        // Create the transaction sender
                        const transactionSender = new TransactionSender(rpcProvider, unlockedAccount)

                        let rawTxResponse = await transactionSender
                            .send(unlockedAccount.addressHex, recipientAccount.addressHex, "NotANumber")
                            .submit(chainID, "10000", CoinDenom.Upokt, "This is a test!")
                        rawTxResponse = rawTxResponse as RawTxResponse
                        expect(typeGuard(rawTxResponse, RpcError)).to.be.true
                    })
                })
            })

            describe("App stake message", function () {
                describe("Success scenarios", function () {
                    it("should succesfully submit an app stake message given the correct parameters using ProtoBuf tx signer", async () => {
                        // RPC Provider
                        const rpcProvider = new HttpRpcProvider(dispatcher)

                        // Import and Unlock the sender's account
                        const unlockedAccountOrError = await keybase.importAndUnlockAccount(Buffer.from(msgFixtures.appStake.fromPK, "hex"), "test123")
                        expect(unlockedAccountOrError).not.to.be.a("error")
                        const unlockedAccount = unlockedAccountOrError as UnlockedAccount
                        
                        // Create the transaction sender
                        const transactionSender = new TransactionSender(rpcProvider, unlockedAccount)
                        let rawTxResponse = await transactionSender
                            .appStake(unlockedAccount.publicKey.toString("hex"), ["0001"], "15000000")
                            .submit(chainID, "100000", CoinDenom.Upokt)
                        expect(typeGuard(rawTxResponse, RpcError)).to.be.false
                        rawTxResponse = rawTxResponse as RawTxResponse
                        expect(rawTxResponse.height).to.equal(BigInt(0))
                        expect(rawTxResponse.hash).not.to.be.empty
                    })
                })

                describe("Error scenarios", function () {
                    it("should error to submit an app stake message with an empty amount", async () => {
                        // RPC Provider
                        const rpcProvider = new HttpRpcProvider(dispatcher)

                        // Create the account
                        const passphrase = "1234"
                        const accountOrError = await keybase.createAccount(passphrase)
                        const account = accountOrError as Account

                        // Import and Unlock the sender's account
                        const unlockedAccountOrError = await keybase.importAndUnlockAccount(Buffer.from(msgFixtures.appStake.fromPK, "hex"), passphrase)
                        expect(unlockedAccountOrError).not.to.be.a("error")
                        const unlockedAccount = unlockedAccountOrError as UnlockedAccount

                        // Create the transaction sender
                        const transactionSender = new TransactionSender(rpcProvider, unlockedAccount)
                        
                        const rawTxResponse = await transactionSender
                            .appStake(account.publicKey.toString("hex"), ["CHAIN1"], "")
                            .submit(chainID, "100000", CoinDenom.Upokt, "This is a test!")
                        expect(typeGuard(rawTxResponse, RpcError)).to.be.true
                    })

                    it("should error to submit an app stake message with a non-numerical amount", async () => {
                        // RPC Provider
                        const rpcProvider = new HttpRpcProvider(dispatcher)

                        // Create the account
                        const passphrase = "1234"
                        const accountOrError = await keybase.createAccount(passphrase)
                        const account = accountOrError as Account

                        // Import and Unlock the sender's account
                        const unlockedAccountOrError = await keybase.importAndUnlockAccount(Buffer.from(msgFixtures.appStake.fromPK, "hex"), passphrase)
                        expect(unlockedAccountOrError).not.to.be.a("error")
                        const unlockedAccount = unlockedAccountOrError as UnlockedAccount

                        // Create the transaction sender
                        const transactionSender = new TransactionSender(rpcProvider, unlockedAccount)
                        
                        const rawTxResponse = await transactionSender
                            .appStake(account.addressHex, ["CHAIN1"], "NotANumber")
                            .submit(chainID, "100000", CoinDenom.Upokt, "This is a test!")
                        expect(typeGuard(rawTxResponse, RpcError)).to.be.true
                    })

                    it("should error to submit an app stake message with an empty chains list", async () => {
                        // RPC Provider
                        const rpcProvider = new HttpRpcProvider(dispatcher)

                        // Create the account
                        const passphrase = "1234"
                        const accountOrError = await keybase.createAccount(passphrase)
                        const account = accountOrError as Account

                        // Import and Unlock the sender's account
                        const unlockedAccountOrError = await keybase.importAndUnlockAccount(Buffer.from(msgFixtures.appStake.fromPK, "hex"), passphrase)
                        expect(unlockedAccountOrError).not.to.be.a("error")
                        const unlockedAccount = unlockedAccountOrError as UnlockedAccount

                        // Create the transaction sender
                        const transactionSender = new TransactionSender(rpcProvider, unlockedAccount)
                        const rawTxResponse = await transactionSender
                            .appStake(account.addressHex, [], "NotANumber")
                            .submit(chainID, "100000", CoinDenom.Upokt, "This is a test!")
                        expect(typeGuard(rawTxResponse, RpcError)).to.be.true
                    })
                })
            })

            describe("App unstake message", function () {
                describe("Success scenarios", function () {
                    it("should succesfully submit an app unstake message given the correct parameters using ProtoBuf tx signer", async () => {
                        // RPC Provider
                        const rpcProvider = new HttpRpcProvider(dispatcher)

                        // Import and Unlock the sender's account
                        const unlockedAccountOrError = await keybase.importAndUnlockAccount(Buffer.from(msgFixtures.appUnstake.fromPK, "hex"), "test123")
                        expect(unlockedAccountOrError).not.to.be.a("error")
                        const unlockedAccount = unlockedAccountOrError as UnlockedAccount

                        // Create the transaction sender
                        const transactionSender = new TransactionSender(rpcProvider, unlockedAccount)
                        let rawTxResponse = await transactionSender
                            .appUnstake(unlockedAccount.addressHex)
                            .submit(chainID, "1000000", CoinDenom.Upokt, "This is a test!")
                        expect(typeGuard(rawTxResponse, RpcError)).to.be.false
                        rawTxResponse = rawTxResponse as RawTxResponse
                        expect(rawTxResponse.height).to.equal(BigInt(0))
                        expect(rawTxResponse.hash).not.to.be.empty
                    })
                })

                describe("Error scenarios", function () {
                    it("should error to submit an app unstake message given an empty address", async () => {
                        // RPC Provider
                        const rpcProvider = new HttpRpcProvider(dispatcher)

                        // Import and Unlock the sender's account
                        const unlockedAccountOrError = await keybase.importAndUnlockAccount(Buffer.from(msgFixtures.appUnstake.fromPK, "hex"), "test123")
                        expect(unlockedAccountOrError).not.to.be.a("error")
                        const unlockedAccount = unlockedAccountOrError as UnlockedAccount

                        // Create the transaction sender
                        const transactionSender = new TransactionSender(rpcProvider, unlockedAccount)
                        const rawTxResponse = await transactionSender
                            .appUnstake("")
                            .submit(chainID, "100000", CoinDenom.Upokt, "This is a test!")
                        expect(typeGuard(rawTxResponse, RpcError)).to.be.true
                    })

                    it("should error to submit an app unstake message given an invalid address", async () => {
                        // RPC Provider
                        const rpcProvider = new HttpRpcProvider(dispatcher)

                        // Import and Unlock the sender's account
                        const unlockedAccountOrError = await keybase.importAndUnlockAccount(Buffer.from(msgFixtures.appUnstake.fromPK, "hex"), "test123")
                        expect(unlockedAccountOrError).not.to.be.a("error")
                        const unlockedAccount = unlockedAccountOrError as UnlockedAccount

                        // Create the transaction sender
                        const transactionSender = new TransactionSender(rpcProvider, unlockedAccount)
                        const rawTxResponse = await transactionSender
                            .appUnstake("9E8E373FF27EC202")
                            .submit(chainID, "100000", CoinDenom.Upokt, "This is a test!")
                        expect(typeGuard(rawTxResponse, RpcError)).to.be.true
                    })
                })
            })

            describe("Node stake message", function () {
                describe("Success scenarios", function () {
                    it("should succesfully submit an node stake message given the correct parameters using ProtoBuf tx signer", async () => {
                        // RPC Provider
                        const rpcProvider = new HttpRpcProvider(dispatcher)

                        // Import and Unlock the sender's account
                        const unlockedAccountOrError = await keybase.importAndUnlockAccount(Buffer.from(msgFixtures.send.fromPK, "hex"), "test123")
                        expect(unlockedAccountOrError).not.to.be.a("error")
                        const unlockedAccount = unlockedAccountOrError as UnlockedAccount

                        // Create the transaction sender
                        const transactionSender = new TransactionSender(rpcProvider, unlockedAccount)
                        let rawTxResponse = await transactionSender
                            .nodeStake(unlockedAccount.publicKey.toString("hex"), ["0001"], "150000000", new URL("https://myawesomenode.network:443"))
                            .submit(chainID, "100000", CoinDenom.Upokt, "This is a test!")
                        expect(typeGuard(rawTxResponse, RpcError)).to.be.false
                        rawTxResponse = rawTxResponse as RawTxResponse
                        expect(rawTxResponse.height).to.equal(BigInt(0))
                        expect(rawTxResponse.hash).not.to.be.empty
                    })
                })

                describe("Error scenarios", function () {
                    it("should error to submit an node stake message with an empty amount", async () => {
                        // RPC Provider
                        const rpcProvider = new HttpRpcProvider(dispatcher)

                        // Import and Unlock the sender's account
                        const unlockedAccountOrError = await keybase.importAndUnlockAccount(Buffer.from(msgFixtures.send.fromPK, "hex"), "test123")
                        expect(unlockedAccountOrError).not.to.be.a("error")
                        const unlockedAccount = unlockedAccountOrError as UnlockedAccount

                        // Create the transaction sender
                        const transactionSender = new TransactionSender(rpcProvider, unlockedAccount)
                        const rawTxResponse = await transactionSender
                            .nodeStake(unlockedAccount.publicKey.toString("hex"), ["CHAIN1"], "", new URL("https://myawesomenode.network:443"))
                            .submit(chainID, "100000", CoinDenom.Upokt, "This is a test!")
                        expect(typeGuard(rawTxResponse, RpcError)).to.be.true
                    })

                    it("should error to submit an node stake message with a non-numerical amount", async () => {
                        // RPC Provider
                        const rpcProvider = new HttpRpcProvider(dispatcher)

                        // Import and Unlock the sender's account
                        const unlockedAccountOrError = await keybase.importAndUnlockAccount(Buffer.from(msgFixtures.send.fromPK, "hex"), "test123")
                        expect(unlockedAccountOrError).not.to.be.a("error")
                        const unlockedAccount = unlockedAccountOrError as UnlockedAccount

                        // Create the transaction sender
                        const transactionSender = new TransactionSender(rpcProvider, unlockedAccount)
                        const rawTxResponse = await transactionSender
                            .nodeStake(unlockedAccount.publicKey.toString("hex"), ["CHAIN1"], "NotANumber", new URL("https://myawesomenode.network:443"))
                            .submit(chainID, "10000000", CoinDenom.Upokt, "This is a test!")
                        expect(typeGuard(rawTxResponse, RpcError)).to.be.true
                    })

                    it("should error to submit an node stake message with an empty chains list", async () => {
                        // RPC Provider
                        const rpcProvider = new HttpRpcProvider(dispatcher)

                        // Import and Unlock the sender's account
                        const unlockedAccountOrError = await keybase.importAndUnlockAccount(Buffer.from(msgFixtures.send.fromPK, "hex"), "test123")
                        expect(unlockedAccountOrError).not.to.be.a("error")
                        const unlockedAccount = unlockedAccountOrError as UnlockedAccount

                        // Create the transaction sender
                        const transactionSender = new TransactionSender(rpcProvider, unlockedAccount)
                        const rawTxResponse = await transactionSender
                            .nodeStake(unlockedAccount.publicKey.toString("hex"), [], "NotANumber", new URL("https://myawesomenode.network:443"))
                            .submit(chainID, "100000", CoinDenom.Upokt, "This is a test!")
                        expect(typeGuard(rawTxResponse, RpcError)).to.be.true
                    })

                    it("should error to submit an node stake message with a non-https URL", async () => {
                        // RPC Provider
                        const rpcProvider = new HttpRpcProvider(dispatcher)

                        // Import and Unlock the sender's account
                        const unlockedAccountOrError = await keybase.importAndUnlockAccount(Buffer.from(msgFixtures.send.fromPK, "hex"), "test123")
                        expect(unlockedAccountOrError).not.to.be.a("error")
                        const unlockedAccount = unlockedAccountOrError as UnlockedAccount

                        // Create the transaction sender
                        const transactionSender = new TransactionSender(rpcProvider, unlockedAccount)
                        const rawTxResponse = await transactionSender
                            .nodeStake(unlockedAccount.publicKey.toString("hex"), [], "NotANumber", new URL("http://myawesomenode.network:443"))
                            .submit(chainID, "100000", CoinDenom.Upokt, "This is a test!")
                        expect(typeGuard(rawTxResponse, RpcError)).to.be.true
                    })
                })
            })

            describe("Node unstake message", function () {
                describe("Success scenarios", function () {
                    it("should succesfully submit an node unstake message given the correct parameters using ProtoBuf tx signer", async () => {
                        // RPC Provider
                        const rpcProvider = new HttpRpcProvider(dispatcher)

                        // Import and Unlock the sender's account
                        const unlockedAccountOrError = await keybase.importAndUnlockAccount(Buffer.from(msgFixtures.nodeUnstake.fromPK, "hex"), "test123")
                        expect(unlockedAccountOrError).not.to.be.a("error")
                        const unlockedAccount = unlockedAccountOrError as UnlockedAccount

                        // Create the transaction sender
                        const transactionSender = new TransactionSender(rpcProvider, unlockedAccount)
                        let rawTxResponse = await transactionSender
                            .nodeUnstake(unlockedAccount.addressHex)
                            .submit(chainID, "100000", CoinDenom.Upokt, "This is a test!")
                        expect(typeGuard(rawTxResponse, RpcError)).to.be.false
                        rawTxResponse = rawTxResponse as RawTxResponse
                        expect(rawTxResponse.height).to.equal(BigInt(0))
                        expect(rawTxResponse.hash).not.to.be.empty
                    })
                })

                describe("Error scenarios", function () {
                    it("should error to submit an node unstake message given an empty address", async () => {
                        // RPC Provider
                        const rpcProvider = new HttpRpcProvider(dispatcher)

                        // Import and Unlock the sender's account
                        const unlockedAccountOrError = await keybase.importAndUnlockAccount(Buffer.from(msgFixtures.send.fromPK, "hex"), "test123")
                        expect(unlockedAccountOrError).not.to.be.a("error")
                        const unlockedAccount = unlockedAccountOrError as UnlockedAccount

                        // Create the transaction sender
                        const transactionSender = new TransactionSender(rpcProvider, unlockedAccount)
                        const rawTxResponse = await transactionSender
                            .nodeUnstake("")
                            .submit(chainID, "100000", CoinDenom.Upokt, "This is a test!")
                        expect(typeGuard(rawTxResponse, RpcError)).to.be.true
                    })

                    it("should error to submit an node unstake message given an invalid address", async () => {
                        // RPC Provider
                        const rpcProvider = new HttpRpcProvider(dispatcher)

                        // Import and Unlock the sender's account
                        const unlockedAccountOrError = await keybase.importAndUnlockAccount(Buffer.from(msgFixtures.send.fromPK, "hex"), "test123")
                        expect(unlockedAccountOrError).not.to.be.a("error")
                        const unlockedAccount = unlockedAccountOrError as UnlockedAccount

                        // Create the transaction sender
                        const transactionSender = new TransactionSender(rpcProvider, unlockedAccount)
                        const rawTxResponse = await transactionSender
                            .nodeUnstake("9E8E373FF27EC202")
                            .submit(chainID, "100000", CoinDenom.Upokt, "This is a test!")
                        expect(typeGuard(rawTxResponse, RpcError)).to.be.true
                    })
                })
            })

            describe("Node unjail message", function () {
                describe("Success scenarios", function () {
                    it("should succesfully submit an node unjail message given the correct parameters using ProtoBuf tx signer", async () => {
                        // RPC Provider
                        const rpcProvider = new HttpRpcProvider(dispatcher)

                        // Import and Unlock the sender's account
                        const unlockedAccountOrError = await keybase.importAndUnlockAccount(Buffer.from(msgFixtures.nodeUnjail.fromPK, "hex"), "test123")
                        expect(unlockedAccountOrError).not.to.be.a("error")
                        const unlockedAccount = unlockedAccountOrError as UnlockedAccount

                        // Create the transaction sender
                        const transactionSender = new TransactionSender(rpcProvider, unlockedAccount)
                        let rawTxResponse = await transactionSender
                            .nodeUnjail(unlockedAccount.addressHex)
                            .submit(chainID, "100000", CoinDenom.Upokt, "This is a test!")
                        expect(typeGuard(rawTxResponse, RpcError)).to.be.false
                        rawTxResponse = rawTxResponse as RawTxResponse
                        expect(rawTxResponse.height).to.equal(BigInt(0))
                        expect(rawTxResponse.hash).not.to.be.empty
                    })
                })

                describe("Error scenarios", function () {
                    it("should error to submit an node unjail message given an empty address", async () => {
                        // RPC Provider
                        const rpcProvider = new HttpRpcProvider(dispatcher)

                        // Import and Unlock the sender's account
                        const unlockedAccountOrError = await keybase.importAndUnlockAccount(Buffer.from(msgFixtures.nodeUnjail.fromPK, "hex"), "test123")
                        expect(unlockedAccountOrError).not.to.be.a("error")
                        const unlockedAccount = unlockedAccountOrError as UnlockedAccount

                        // Create the transaction sender
                        const transactionSender = new TransactionSender(rpcProvider, unlockedAccount)
                        const rawTxResponse = await transactionSender
                            .nodeUnjail("")
                            .submit(chainID, "100000", CoinDenom.Upokt, "This is a test!")
                        expect(typeGuard(rawTxResponse, RpcError)).to.be.true
                    })

                    it("should error to submit an node unjail message given an invalid address", async () => {
                        // RPC Provider
                        const rpcProvider = new HttpRpcProvider(dispatcher)

                        // Import and Unlock the sender's account
                        const unlockedAccountOrError = await keybase.importAndUnlockAccount(Buffer.from(msgFixtures.nodeUnjail.fromPK, "hex"), "test123")
                        expect(unlockedAccountOrError).not.to.be.a("error")
                        const unlockedAccount = unlockedAccountOrError as UnlockedAccount

                        // Create the transaction sender
                        const transactionSender = new TransactionSender(rpcProvider, unlockedAccount)
                        const rawTxResponse = await transactionSender
                            .nodeUnjail("9E8E373FF27EC202")
                            .submit(chainID, "100000", CoinDenom.Upokt, "This is a test!")
                        expect(typeGuard(rawTxResponse, RpcError)).to.be.true
                    })
                })
            })
        })
    })
})