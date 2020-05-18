import { expect } from 'chai'
import { Account, Configuration, Pocket, HttpRpcProvider, ITransactionSender, CoinDenom, typeGuard, RpcError, RawTxResponse, TransactionSender } from '../../../../src'
import { EnvironmentHelper } from '../../../utils/env/helper'
import * as dotenv from "dotenv"

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
const dispatcher = new URL(env.getPOKTRPC())
const configuration = new Configuration(5, 2000, undefined, 100000)
const privKey = "33a15ccfc7a5632f759dfdc273b20175bedf79b0eef560af5b26d9f16eb32a8b55d8172bd03ca3c9602c973e474806f4b77758048946acc967baebb72ec0b122"
const chainID = "localnet"
const msgFixtures = {
    send: {
        fromPK: "33a15ccfc7a5632f759dfdc273b20175bedf79b0eef560af5b26d9f16eb32a8b55d8172bd03ca3c9602c973e474806f4b77758048946acc967baebb72ec0b122"
    },
    appStake: {
        fromPK: "33a15ccfc7a5632f759dfdc273b20175bedf79b0eef560af5b26d9f16eb32a8b55d8172bd03ca3c9602c973e474806f4b77758048946acc967baebb72ec0b122"
    },
    appUnstake: {
        fromPK: "ad73ea70255d140ca0a654fe40eb1b8bb6aaf43cbe037dc6e58594db311cba6fda121ff5477ffcc130d1eaa475f02ecefabce0b664c7216c8d67b34962ecb065"
    },
    appUnjail: {
        fromPK: "46408bd84dd5894986d363929fecfdc22fb6f6a0a5a2460a51b223604b1b3a83d07472ff9c73d770d976c468f0b82e665780721887fc0c9db95bb3c2210bd778"
    },
    nodeStake: {
        fromPK: "4620213b87d3a56894dbea6774a1c100f292fcee0205c816152143830d8a293011c892f63c73c6d1a2444f11fd1b9637c2b989a048ce8c6bca2af1d8e416fa6b"
    },
    nodeUnstake: {
        fromPK: "b15cf89724b80eb00bbfce5ec45e6f493be182445ad89600ce14066b0fd8687a4e9a5b1d9cf13abcdf32e57e5b660909ade9abc0b16c152358fb14f86a5eb097"
    },
    nodeUnjail: {
        fromPK: "60506d180631d0827b5320adcb47a1e20f36e5513db8e6957257fb57edebbc86c8a4f393ec28fc040c5ce12b6752fc7edb7b874e98cc21cd3fa39fe6a45d9386"
    }
}

function defaultConfiguration(): Configuration {
    return configuration
}

function createPocketInstance(configuration?: Configuration): Pocket {
    if (configuration === undefined) {
        const rpcProvider = new HttpRpcProvider(dispatcher)
        return new Pocket([dispatcher], rpcProvider, defaultConfiguration())
    } else {
        const baseURL = dispatcher
        const rpcProvider = new HttpRpcProvider(baseURL)
        return new Pocket([dispatcher], rpcProvider, configuration)
    }
}

describe("Using ITransactionSender", function () {
    describe("Creating a transaction sender", function () {
        describe("With a private key", function () {
            describe("Success scenarios", function () {
                it("Should create a ITransactionSender given a private key string", async () => {
                    const pocket = createPocketInstance()
                    expect(pocket.withPrivateKey(privKey)).to.not.throw
                })

                it("Should create a ITransactionSender given a private key buffer", async () => {
                    const pocket = createPocketInstance()
                    expect(pocket.withPrivateKey(Buffer.from(privKey, "hex"))).to.not.throw
                })
            })

            describe("Error scenarios", function () {
                it("Should fail to create with an empty or invalid private key string", async () => {
                    // Invalid private key
                    const pocket = createPocketInstance()
                    expect(pocket.withPrivateKey(privKey)).to.not.throw

                    // Empty private key
                    expect(pocket.withPrivateKey("")).to.not.throw
                })

                it("Should fail to create with an empty or invalid private key buffer", async () => {
                    // Invalid private key
                    const pocket = createPocketInstance()
                    expect(pocket.withPrivateKey(Buffer.from(privKey, "hex"))).to.not.throw

                    // Empty private key
                    expect(pocket.withPrivateKey(Buffer.from("", "hex"))).to.not.throw
                })
            })
        })

        describe("With an imported account", function () {
            describe("Success scenarios", function () {
                it("should create a ITransactionSender with an already imported account and correct passphrase", async () => {
                    const pocket = createPocketInstance()

                    // Create the account
                    const passphrase = "1234"
                    const accountOrError = await pocket.keybase.createAccount(passphrase)
                    const account = accountOrError as Account

                    // Create the transaction sender
                    const transactionSender = await pocket.withImportedAccount(account.address, passphrase)
                    expect(transactionSender).not.to.be.a('error')
                })
            })

            describe("Error scenarios", function () {
                it("should fail to create a ITransactionSender with an account not yet imported to the keybase", async () => {
                    const pocket = createPocketInstance()

                    // Create the transaction sender with an address not imported first
                    const transactionSender = await pocket.withImportedAccount("11AD05777C30F529C3FD3753AD5D0EA97192716E", "1234")
                    expect(transactionSender).to.be.a('error')
                })

                it("should fail to create a ITransactionSender with the wrong account passphrase", async () => {
                    const pocket = createPocketInstance()

                    // Create the account
                    const passphrase = "1234"
                    const wrongPassphrase = "12345678"
                    const accountOrError = await pocket.keybase.createAccount(passphrase)
                    const account = accountOrError as Account

                    // Create the transaction sender
                    const transactionSender = await pocket.withImportedAccount(account.address, wrongPassphrase)
                    expect(transactionSender).to.be.a('error')
                })

                it("should fail to create a ITransactionSender with an incorrect or empty account address", async () => {
                    const pocket = createPocketInstance()

                    // Wrong address scenario
                    // Create the account
                    const passphrase = "1234"
                    await pocket.keybase.createAccount(passphrase)
                    const wrongAddress = "wrong"

                    // Create the transaction sender
                    let transactionSender = await pocket.withImportedAccount(wrongAddress, passphrase)
                    expect(transactionSender).to.be.a('error')

                    // Empty address scenario
                    transactionSender = await pocket.withImportedAccount("", passphrase)
                    expect(transactionSender).to.be.a('error')
                })
            })
        })
    })

    describe("Submit transaction", function () {
        describe("Message submission", function () {

            describe("Send message", function () {
                describe("Success scenarios", function () {
                    it("should succesfully submit a send message given the correct parameters", async () => {
                        const pocket = createPocketInstance()

                        // Create the transaction sender
                        let passphrase = "test"
                        let recipient = await pocket.keybase.createAccount(passphrase) as Account
                        let toAddress = recipient.addressHex

                        let account = await pocket.keybase.importAccount(Buffer.from(msgFixtures.send.fromPK, "hex"), passphrase) as Account
                        let transactionSender = await pocket.withImportedAccount(account.addressHex, passphrase)
                        transactionSender = transactionSender as TransactionSender

                        let rawTxResponse = await transactionSender
                            .send(account.addressHex, toAddress, "100000")
                            .submit(chainID, "100000", CoinDenom.Upokt, "This is a test!")
                        expect(typeGuard(rawTxResponse, RpcError)).to.be.false
                        rawTxResponse = rawTxResponse as RawTxResponse
                        expect(rawTxResponse.height).to.equal(BigInt(0))
                        expect(rawTxResponse.hash).not.to.be.empty
                    })
                })

                describe("Error scenarios", function () {
                    it("should error to submit a send message with an empty amount", async () => {
                        const pocket = createPocketInstance()

                        // Create the account
                        const passphrase = "1234"
                        const accountOrError = await pocket.keybase.createAccount(passphrase)
                        const account = accountOrError as Account

                        // Create the transaction sender
                        const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                        const rawTxResponse = await transactionSender
                            .send("11AD05777C30F529C3FD3753AD5D0EA97192716E", "9E8E373FF27EC202F82D07DF64F388FF42F9516D", "")
                            .submit(chainID, "100000", CoinDenom.Upokt, "This is a test!")
                        expect(typeGuard(rawTxResponse, RpcError)).to.be.true
                    })

                    it("should error to submit a send message with an non-numerical amount", async () => {
                        const pocket = createPocketInstance()

                        // Create the account
                        const passphrase = "1234"
                        const accountOrError = await pocket.keybase.createAccount(passphrase)
                        const account = accountOrError as Account

                        // Create the transaction sender
                        const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                        const rawTxResponse = await transactionSender
                            .send("11AD05777C30F529C3FD3753AD5D0EA97192716E", "9E8E373FF27EC202F82D07DF64F388FF42F9516D", "NotANumber")
                            .submit(chainID, "100000", CoinDenom.Upokt, "This is a test!")
                        expect(typeGuard(rawTxResponse, RpcError)).to.be.true
                    })
                })
            })

            describe("App stake message", function () {
                describe("Success scenarios", function () {
                    it("should succesfully submit an app stake message given the correct parameters", async () => {
                        const pocket = createPocketInstance()

                        // Create the account
                        const passphrase = "1234"
                        const accountOrError = await pocket.keybase.importAccount(Buffer.from(msgFixtures.appStake.fromPK, "hex"), passphrase)
                        const account = accountOrError as Account

                        // Create the transaction sender
                        const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                        let rawTxResponse = await transactionSender
                            .appStake(account.publicKey.toString("hex"), ["0001"], "15000000")
                            .submit(chainID, "100000", CoinDenom.Upokt)
                        expect(typeGuard(rawTxResponse, RpcError)).to.be.false
                        rawTxResponse = rawTxResponse as RawTxResponse
                        expect(rawTxResponse.height).to.equal(BigInt(0))
                        expect(rawTxResponse.hash).not.to.be.empty
                    })
                })

                describe("Error scenarios", function () {
                    it("should error to submit an app stake message with an empty amount", async () => {
                        const pocket = createPocketInstance()

                        // Create the account
                        const passphrase = "1234"
                        const accountOrError = await pocket.keybase.createAccount(passphrase)
                        const account = accountOrError as Account

                        // Create the transaction sender
                        const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                        const rawTxResponse = await transactionSender
                            .appStake("ee54d37f8b45b2a185c465463222e287afaa5d3027c7a8c1c3ed554b8b19c502", ["CHAIN1"], "")
                            .submit(chainID, "100000", CoinDenom.Upokt, "This is a test!")
                        expect(typeGuard(rawTxResponse, RpcError)).to.be.true
                    })

                    it("should error to submit an app stake message with a non-numerical amount", async () => {
                        const pocket = createPocketInstance()

                        // Create the account
                        const passphrase = "1234"
                        const accountOrError = await pocket.keybase.createAccount(passphrase)
                        const account = accountOrError as Account

                        // Create the transaction sender
                        const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                        const rawTxResponse = await transactionSender
                            .appStake("ee54d37f8b45b2a185c465463222e287afaa5d3027c7a8c1c3ed554b8b19c502", ["CHAIN1"], "NotANumber")
                            .submit(chainID, "100000", CoinDenom.Upokt, "This is a test!")
                        expect(typeGuard(rawTxResponse, RpcError)).to.be.true
                    })

                    it("should error to submit an app stake message with an empty chains list", async () => {
                        const pocket = createPocketInstance()

                        // Create the account
                        const passphrase = "1234"
                        const accountOrError = await pocket.keybase.createAccount(passphrase)
                        const account = accountOrError as Account

                        // Create the transaction sender
                        const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                        const rawTxResponse = await transactionSender
                            .appStake("ee54d37f8b45b2a185c465463222e287afaa5d3027c7a8c1c3ed554b8b19c502", [], "NotANumber")
                            .submit(chainID, "100000", CoinDenom.Upokt, "This is a test!")
                        expect(typeGuard(rawTxResponse, RpcError)).to.be.true
                    })
                })
            })

            describe("App unstake message", function () {
                describe("Success scenarios", function () {
                    it("should succesfully submit an app unstake message given the correct parameters", async () => {
                        const pocket = createPocketInstance()

                        // Create the account
                        const passphrase = "1234"
                        const accountOrError = await pocket.keybase.importAccount(Buffer.from(msgFixtures.appUnstake.fromPK, "hex"), passphrase)
                        const account = accountOrError as Account

                        // Create the transaction sender
                        const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                        let rawTxResponse = await transactionSender
                            .appUnstake(account.addressHex)
                            .submit(chainID, "100000", CoinDenom.Upokt, "This is a test!")
                        expect(typeGuard(rawTxResponse, RpcError)).to.be.false
                        rawTxResponse = rawTxResponse as RawTxResponse
                        expect(rawTxResponse.height).to.equal(BigInt(0))
                        expect(rawTxResponse.hash).not.to.be.empty
                    })
                })

                describe("Error scenarios", function () {
                    it("should error to submit an app unstake message given an empty address", async () => {
                        const pocket = createPocketInstance()

                        // Create the account
                        const passphrase = "1234"
                        const accountOrError = await pocket.keybase.createAccount(passphrase)
                        const account = accountOrError as Account

                        // Create the transaction sender
                        const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                        const rawTxResponse = await transactionSender
                            .appUnstake("")
                            .submit(chainID, "100000", CoinDenom.Upokt, "This is a test!")
                        expect(typeGuard(rawTxResponse, RpcError)).to.be.true
                    })

                    it("should error to submit an app unstake message given an invalid address", async () => {
                        const pocket = createPocketInstance()

                        // Create the account
                        const passphrase = "1234"
                        const accountOrError = await pocket.keybase.createAccount(passphrase)
                        const account = accountOrError as Account

                        // Create the transaction sender
                        const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                        const rawTxResponse = await transactionSender
                            .appUnstake("9E8E373FF27EC202")
                            .submit(chainID, "100000", CoinDenom.Upokt, "This is a test!")
                        expect(typeGuard(rawTxResponse, RpcError)).to.be.true
                    })
                })
            })

            describe("App unjail message", function () {
                describe("Success scenarios", function () {
                    it("should succesfully submit an app unjail message given the correct parameters", async () => {
                        const pocket = createPocketInstance()

                        // Create the account
                        const passphrase = "1234"
                        const accountOrError = await pocket.keybase.importAccount(Buffer.from(msgFixtures.appUnjail.fromPK, "hex"), passphrase)
                        const account = accountOrError as Account

                        // Create the transaction sender
                        const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                        let rawTxResponse = await transactionSender
                            .appUnjail(account.addressHex)
                            .submit(chainID, "100000", CoinDenom.Upokt, "This is a test!")
                        expect(typeGuard(rawTxResponse, RpcError)).to.be.false
                        rawTxResponse = rawTxResponse as RawTxResponse
                        expect(rawTxResponse.height).to.equal(BigInt(0))
                        expect(rawTxResponse.hash).not.to.be.empty
                    })
                })

                describe("Error scenarios", function () {
                    it("should error to submit an app unjail message given an empty address", async () => {
                        const pocket = createPocketInstance()

                        // Create the account
                        const passphrase = "1234"
                        const accountOrError = await pocket.keybase.createAccount(passphrase)
                        const account = accountOrError as Account

                        // Create the transaction sender
                        const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                        const rawTxResponse = await transactionSender
                            .appUnjail("")
                            .submit(chainID, "100000", CoinDenom.Upokt, "This is a test!")
                        expect(typeGuard(rawTxResponse, RpcError)).to.be.true
                    })

                    it("should error to submit an app unjail message given an invalid address", async () => {
                        const pocket = createPocketInstance()

                        // Create the account
                        const passphrase = "1234"
                        const accountOrError = await pocket.keybase.createAccount(passphrase)
                        const account = accountOrError as Account

                        // Create the transaction sender
                        const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                        const rawTxResponse = await transactionSender
                            .appUnjail("9E8E373FF27EC202")
                            .submit(chainID, "100000", CoinDenom.Upokt, "This is a test!")
                        expect(typeGuard(rawTxResponse, RpcError)).to.be.true
                    })
                })
            })

            describe("Node stake message", function () {
                describe("Success scenarios", function () {
                    it("should succesfully submit an node stake message given the correct parameters", async () => {
                        const pocket = createPocketInstance()

                        // Create the account
                        const passphrase = "1234"
                        const accountOrError = await pocket.keybase.importAccount(Buffer.from(msgFixtures.nodeStake.fromPK, "hex"), passphrase)
                        const account = accountOrError as Account

                        // Create the transaction sender
                        const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                        let rawTxResponse = await transactionSender
                            .nodeStake(account.publicKey.toString("hex"), ["0001"], "150000000", new URL("https://myawesomenode.network:443"))
                            .submit(chainID, "100000", CoinDenom.Upokt, "This is a test!")
                        expect(typeGuard(rawTxResponse, RpcError)).to.be.false
                        rawTxResponse = rawTxResponse as RawTxResponse
                        expect(rawTxResponse.height).to.equal(BigInt(0))
                        expect(rawTxResponse.hash).not.to.be.empty
                    })
                })

                describe("Error scenarios", function () {
                    it("should error to submit an node stake message with an empty amount", async () => {
                        const pocket = createPocketInstance()

                        // Create the account
                        const passphrase = "1234"
                        const accountOrError = await pocket.keybase.createAccount(passphrase)
                        const account = accountOrError as Account

                        // Create the transaction sender
                        const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                        const rawTxResponse = await transactionSender
                            .nodeStake("ee54d37f8b45b2a185c465463222e287afaa5d3027c7a8c1c3ed554b8b19c502", ["CHAIN1"], "", new URL("https://myawesomenode.network:443"))
                            .submit(chainID, "100000", CoinDenom.Upokt, "This is a test!")
                        expect(typeGuard(rawTxResponse, RpcError)).to.be.true
                    })

                    it("should error to submit an node stake message with a non-numerical amount", async () => {
                        const pocket = createPocketInstance()

                        // Create the account
                        const passphrase = "1234"
                        const accountOrError = await pocket.keybase.createAccount(passphrase)
                        const account = accountOrError as Account

                        // Create the transaction sender
                        const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                        const rawTxResponse = await transactionSender
                            .nodeStake("ee54d37f8b45b2a185c465463222e287afaa5d3027c7a8c1c3ed554b8b19c502", ["CHAIN1"], "NotANumber", new URL("https://myawesomenode.network:443"))
                            .submit(chainID, "10000000", CoinDenom.Upokt, "This is a test!")
                        expect(typeGuard(rawTxResponse, RpcError)).to.be.true
                    })

                    it("should error to submit an node stake message with an empty chains list", async () => {
                        const pocket = createPocketInstance()

                        // Create the account
                        const passphrase = "1234"
                        const accountOrError = await pocket.keybase.createAccount(passphrase)
                        const account = accountOrError as Account

                        // Create the transaction sender
                        const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                        const rawTxResponse = await transactionSender
                            .nodeStake("ee54d37f8b45b2a185c465463222e287afaa5d3027c7a8c1c3ed554b8b19c502", [], "NotANumber", new URL("https://myawesomenode.network:443"))
                            .submit(chainID, "100000", CoinDenom.Upokt, "This is a test!")
                        expect(typeGuard(rawTxResponse, RpcError)).to.be.true
                    })

                    it("should error to submit an node stake message with a non-https URL", async () => {
                        const pocket = createPocketInstance()

                        // Create the account
                        const passphrase = "1234"
                        const accountOrError = await pocket.keybase.createAccount(passphrase)
                        const account = accountOrError as Account

                        // Create the transaction sender
                        const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                        const rawTxResponse = await transactionSender
                            .nodeStake("ee54d37f8b45b2a185c465463222e287afaa5d3027c7a8c1c3ed554b8b19c502", [], "NotANumber", new URL("http://myawesomenode.network:443"))
                            .submit(chainID, "100000", CoinDenom.Upokt, "This is a test!")
                        expect(typeGuard(rawTxResponse, RpcError)).to.be.true
                    })
                })
            })

            describe("Node unstake message", function () {
                describe("Success scenarios", function () {
                    it("should succesfully submit an node unstake message given the correct parameters", async () => {
                        const pocket = createPocketInstance()

                        // Create the account
                        const passphrase = "1234"
                        const accountOrError = await pocket.keybase.importAccount(Buffer.from(msgFixtures.nodeUnstake.fromPK, "hex"), passphrase)
                        const account = accountOrError as Account

                        // Create the transaction sender
                        const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                        let rawTxResponse = await transactionSender
                            .nodeUnstake(account.addressHex)
                            .submit(chainID, "100000", CoinDenom.Upokt, "This is a test!")
                        expect(typeGuard(rawTxResponse, RpcError)).to.be.false
                        rawTxResponse = rawTxResponse as RawTxResponse
                        expect(rawTxResponse.height).to.equal(BigInt(0))
                        expect(rawTxResponse.hash).not.to.be.empty
                    })
                })

                describe("Error scenarios", function () {
                    it("should error to submit an node unstake message given an empty address", async () => {
                        const pocket = createPocketInstance()

                        // Create the account
                        const passphrase = "1234"
                        const accountOrError = await pocket.keybase.createAccount(passphrase)
                        const account = accountOrError as Account

                        // Create the transaction sender
                        const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                        const rawTxResponse = await transactionSender
                            .nodeUnstake("")
                            .submit(chainID, "100000", CoinDenom.Upokt, "This is a test!")
                        expect(typeGuard(rawTxResponse, RpcError)).to.be.true
                    })

                    it("should error to submit an node unstake message given an invalid address", async () => {
                        const pocket = createPocketInstance()

                        // Create the account
                        const passphrase = "1234"
                        const accountOrError = await pocket.keybase.createAccount(passphrase)
                        const account = accountOrError as Account

                        // Create the transaction sender
                        const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                        const rawTxResponse = await transactionSender
                            .nodeUnstake("9E8E373FF27EC202")
                            .submit(chainID, "100000", CoinDenom.Upokt, "This is a test!")
                        expect(typeGuard(rawTxResponse, RpcError)).to.be.true
                    })
                })
            })

            describe("Node unjail message", function () {
                describe("Success scenarios", function () {
                    it("should succesfully submit an node unjail message given the correct parameters", async () => {
                        const pocket = createPocketInstance()

                        // Create the account
                        const passphrase = "1234"
                        const accountOrError = await pocket.keybase.importAccount(Buffer.from(msgFixtures.nodeUnjail.fromPK, "hex"), passphrase)
                        const account = accountOrError as Account

                        // Create the transaction sender
                        const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                        let rawTxResponse = await transactionSender
                            .nodeUnjail(account.addressHex)
                            .submit(chainID, "100000", CoinDenom.Upokt, "This is a test!")
                        expect(typeGuard(rawTxResponse, RpcError)).to.be.false
                        rawTxResponse = rawTxResponse as RawTxResponse
                        expect(rawTxResponse.height).to.equal(BigInt(0))
                        expect(rawTxResponse.hash).not.to.be.empty
                    })
                })

                describe("Error scenarios", function () {
                    it("should error to submit an node unjail message given an empty address", async () => {
                        const pocket = createPocketInstance()

                        // Create the account
                        const passphrase = "1234"
                        const accountOrError = await pocket.keybase.createAccount(passphrase)
                        const account = accountOrError as Account

                        // Create the transaction sender
                        const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                        const rawTxResponse = await transactionSender
                            .nodeUnjail("")
                            .submit(chainID, "100000", CoinDenom.Upokt, "This is a test!")
                        expect(typeGuard(rawTxResponse, RpcError)).to.be.true
                    })

                    it("should error to submit an node unjail message given an invalid address", async () => {
                        const pocket = createPocketInstance()

                        // Create the account
                        const passphrase = "1234"
                        const accountOrError = await pocket.keybase.createAccount(passphrase)
                        const account = accountOrError as Account

                        // Create the transaction sender
                        const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                        const rawTxResponse = await transactionSender
                            .nodeUnjail("9E8E373FF27EC202")
                            .submit(chainID, "100000", CoinDenom.Upokt, "This is a test!")
                        expect(typeGuard(rawTxResponse, RpcError)).to.be.true
                    })
                })
            })
        })

        describe("Error scenarios", function () {

            it("should fail to submit a transaction given an empty chain id", async () => {
                
                const pocket = createPocketInstance()

                // Create the account
                const passphrase = "1234"
                const accountOrError = await pocket.keybase.createAccount(passphrase)
                const account = accountOrError as Account
                // Entropy
                const entropy = BigInt(Math.floor(Math.random() * 99999999999999999))
                // Create the transaction sender
                const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                const rawTxResponse = await transactionSender
                    .send("11AD05777C30F529C3FD3753AD5D0EA97192716E", "9E8E373FF27EC202F82D07DF64F388FF42F9516D", "10")
                    .submit("", "100000", CoinDenom.Upokt, "This is a test!")
                expect(typeGuard(rawTxResponse, Error)).to.be.true
            })

            it("should fail to submit a transaction given a non-numerical fee", async () => {
                
                const pocket = createPocketInstance()

                // Create the account
                const passphrase = "1234"
                const accountOrError = await pocket.keybase.createAccount(passphrase)
                const account = accountOrError as Account
                // Create the transaction sender
                const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                const rawTxResponse = await transactionSender
                    .send("11AD05777C30F529C3FD3753AD5D0EA97192716E", "9E8E373FF27EC202F82D07DF64F388FF42F9516D", "10")
                    .submit(chainID, "NotANumber", CoinDenom.Upokt, "This is a test!")
                expect(typeGuard(rawTxResponse, Error)).to.be.true
            })

            it("should fail to submit a transaction given an empty fee", async () => {
                
                const pocket = createPocketInstance()

                // Create the account
                const passphrase = "1234"
                const accountOrError = await pocket.keybase.createAccount(passphrase)
                const account = accountOrError as Account
                // Create the transaction sender
                const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                const rawTxResponse = await transactionSender
                    .send("11AD05777C30F529C3FD3753AD5D0EA97192716E", "9E8E373FF27EC202F82D07DF64F388FF42F9516D", "10")
                    .submit(chainID, "", CoinDenom.Upokt, "This is a test!")
                expect(typeGuard(rawTxResponse, Error)).to.be.true
            })
        })
    })
})