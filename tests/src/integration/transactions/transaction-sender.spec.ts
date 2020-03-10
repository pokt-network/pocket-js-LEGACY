import { expect } from 'chai'
import { Account, Node, BondStatus, Configuration, Pocket, HttpRpcProvider, ITransactionSender, CoinDenom, typeGuard, RpcError, RawTxResponse, QueryAccountResponse, TransactionSender, publicKeyFromPrivate, addressFromPublickey } from '../../../../src'
import { NockUtil } from '../../../utils/nock-util'
import { EnvironmentHelper } from '../../../utils/env/helper'
import { type } from 'os'

const dispatcherURL = new URL("http://node9.testnet.pokt.network:8081")
const configuration = new Configuration(5, 60000, 1000000)
const privKey = "640d19b8bfb1cd70fe565ead88e705beaab34fe18fb0879d32539ebfe5ba511725e433add38bee8bf9d5236267f6c9b8f3d224a0f164f142c351f441792f2b2e"
function defaultConfiguration(): Configuration {
    return configuration
}

function createPocketInstance(configuration?: Configuration): Pocket {
    if (configuration === undefined) {
        const rpcProvider = new HttpRpcProvider(dispatcherURL)
        return new Pocket([dispatcherURL], rpcProvider, defaultConfiguration())
    } else {
        const baseURL = dispatcherURL
        const rpcProvider = new HttpRpcProvider(baseURL)
        return new Pocket([dispatcherURL], rpcProvider, configuration)
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
        describe("Success scenarios", function () {
            it("should succesfully submit a transaction given the correct parameters", async () => {
                const pocket = createPocketInstance()
                
                const publicKey = publicKeyFromPrivate(Buffer.from(privKey, "hex"))
                const address = addressFromPublickey(publicKey)
                // Create the transaction sender
                let transactionSender = await pocket.withPrivateKey(privKey)
                transactionSender = transactionSender as TransactionSender

                let rawTxResponse = await transactionSender
                    .send(address.toString("hex"), "ac67edb3eb7a94bfc4e204a6e93e6a5827afca62", "1000000000")
                    .submit("pocket-testnet", "100000")
                expect(typeGuard(rawTxResponse, RpcError)).to.be.false
                rawTxResponse = rawTxResponse as RawTxResponse
                expect(rawTxResponse.height).to.equal(BigInt(0))
                expect(rawTxResponse.hash).not.to.be.empty
            })
        })

        describe("Error scenarios", function () {

            it("should fail to submit a transaction given an empty chain id", async () => {
                NockUtil.mockRawTx()
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
                    .submit("", "100", CoinDenom.Pokt, "This is a test!")
                expect(typeGuard(rawTxResponse, Error)).to.be.true
            })

            it("should fail to submit a transaction given a non-numerical fee", async () => {
                NockUtil.mockRawTx()
                const pocket = createPocketInstance()

                // Create the account
                const passphrase = "1234"
                const accountOrError = await pocket.keybase.createAccount(passphrase)
                const account = accountOrError as Account
                // Create the transaction sender
                const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                const rawTxResponse = await transactionSender
                    .send("11AD05777C30F529C3FD3753AD5D0EA97192716E", "9E8E373FF27EC202F82D07DF64F388FF42F9516D", "10")
                    .submit("mocked-pocket-testnet", "NotANumber", CoinDenom.Pokt, "This is a test!")
                expect(typeGuard(rawTxResponse, Error)).to.be.true
            })

            it("should fail to submit a transaction given an empty fee", async () => {
                NockUtil.mockRawTx()
                const pocket = createPocketInstance()

                // Create the account
                const passphrase = "1234"
                const accountOrError = await pocket.keybase.createAccount(passphrase)
                const account = accountOrError as Account
                // Create the transaction sender
                const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                const rawTxResponse = await transactionSender
                    .send("11AD05777C30F529C3FD3753AD5D0EA97192716E", "9E8E373FF27EC202F82D07DF64F388FF42F9516D", "10")
                    .submit("mocked-pocket-testnet", "", CoinDenom.Pokt, "This is a test!")
                expect(typeGuard(rawTxResponse, Error)).to.be.true
            })
        })
    })

    // TODO: test messages
    describe("Send message", function () {
        describe("Success scenarios", function () {
            it("should succesfully submit a send message given the correct parameters", async () => {
                NockUtil.mockRawTx()
                const pocket = createPocketInstance()

                const publicKey = publicKeyFromPrivate(Buffer.from(privKey, "hex"))
                const address = addressFromPublickey(publicKey)
                // Create the transaction sender
                let transactionSender = await pocket.withPrivateKey(privKey)
                transactionSender = transactionSender as TransactionSender

                let rawTxResponse = await transactionSender
                    .send(address.toString("hex"), "9E8E373FF27EC202F82D07DF64F388FF42F9516D", "100000")
                    .submit("pocket-testnet", "100000", CoinDenom.Pokt, "This is a test!")
                expect(typeGuard(rawTxResponse, RpcError)).to.be.false
                rawTxResponse = rawTxResponse as RawTxResponse
                expect(rawTxResponse.height).to.equal(BigInt(0))
                expect(rawTxResponse.hash).not.to.be.empty
            })
        })

        describe("Error scenarios", function () {
            it("should error to submit a send message with an empty amount", async () => {
                NockUtil.mockRawTx()
                const pocket = createPocketInstance()

                // Create the account
                const passphrase = "1234"
                const accountOrError = await pocket.keybase.createAccount(passphrase)
                const account = accountOrError as Account

                // Create the transaction sender
                const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                const rawTxResponse = await transactionSender
                    .send("11AD05777C30F529C3FD3753AD5D0EA97192716E", "9E8E373FF27EC202F82D07DF64F388FF42F9516D", "")
                    .submit("mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
                expect(typeGuard(rawTxResponse, RpcError)).to.be.true
            })

            it("should error to submit a send message with an non-numerical amount", async () => {
                NockUtil.mockRawTx()
                const pocket = createPocketInstance()

                // Create the account
                const passphrase = "1234"
                const accountOrError = await pocket.keybase.createAccount(passphrase)
                const account = accountOrError as Account

                // Create the transaction sender
                const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                const rawTxResponse = await transactionSender
                    .send("11AD05777C30F529C3FD3753AD5D0EA97192716E", "9E8E373FF27EC202F82D07DF64F388FF42F9516D", "NotANumber")
                    .submit("mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
                expect(typeGuard(rawTxResponse, RpcError)).to.be.true
            })
        })
    })

    describe("App stake message", function () {
        describe("Success scenarios", function () {
            it("should succesfully submit an app stake message given the correct parameters", async () => {
                NockUtil.mockRawTx()
                const pocket = createPocketInstance()

                // Create the account
                const passphrase = "1234"
                const accountOrError = await pocket.keybase.createAccount(passphrase)
                const account = accountOrError as Account

                // Create the transaction sender
                const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                let rawTxResponse = await transactionSender
                    .appStake("ee54d37f8b45b2a185c465463222e287afaa5d3027c7a8c1c3ed554b8b19c502", ["CHAIN1"], "15000")
                    .submit("mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
                expect(typeGuard(rawTxResponse, RpcError)).to.be.false
                rawTxResponse = rawTxResponse as RawTxResponse
                expect(rawTxResponse.height).to.equal(BigInt(0))
                expect(rawTxResponse.hash).not.to.be.empty
            })
        })

        describe("Error scenarios", function () {
            it("should error to submit an app stake message with an empty amount", async () => {
                NockUtil.mockRawTx()
                const pocket = createPocketInstance()

                // Create the account
                const passphrase = "1234"
                const accountOrError = await pocket.keybase.createAccount(passphrase)
                const account = accountOrError as Account

                // Create the transaction sender
                const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                const rawTxResponse = await transactionSender
                    .appStake("ee54d37f8b45b2a185c465463222e287afaa5d3027c7a8c1c3ed554b8b19c502", ["CHAIN1"], "")
                    .submit("mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
                expect(typeGuard(rawTxResponse, RpcError)).to.be.true
            })

            it("should error to submit an app stake message with a non-numerical amount", async () => {
                NockUtil.mockRawTx()
                const pocket = createPocketInstance()

                // Create the account
                const passphrase = "1234"
                const accountOrError = await pocket.keybase.createAccount(passphrase)
                const account = accountOrError as Account

                // Create the transaction sender
                const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                const rawTxResponse = await transactionSender
                    .appStake("ee54d37f8b45b2a185c465463222e287afaa5d3027c7a8c1c3ed554b8b19c502", ["CHAIN1"], "NotANumber")
                    .submit("mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
                expect(typeGuard(rawTxResponse, RpcError)).to.be.true
            })

            it("should error to submit an app stake message with an empty chains list", async () => {
                NockUtil.mockRawTx()
                const pocket = createPocketInstance()

                // Create the account
                const passphrase = "1234"
                const accountOrError = await pocket.keybase.createAccount(passphrase)
                const account = accountOrError as Account

                // Create the transaction sender
                const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                const rawTxResponse = await transactionSender
                    .appStake("ee54d37f8b45b2a185c465463222e287afaa5d3027c7a8c1c3ed554b8b19c502", [], "NotANumber")
                    .submit("mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
                expect(typeGuard(rawTxResponse, RpcError)).to.be.true
            })
        })
    })

    describe("App unstake message", function () {
        describe("Success scenarios", function () {
            it("should succesfully submit an app unstake message given the correct parameters", async () => {
                NockUtil.mockRawTx()
                const pocket = createPocketInstance()

                // Create the account
                const passphrase = "1234"
                const accountOrError = await pocket.keybase.createAccount(passphrase)
                const account = accountOrError as Account

                // Create the transaction sender
                const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                let rawTxResponse = await transactionSender
                    .appUnstake("9E8E373FF27EC202F82D07DF64F388FF42F9516D")
                    .submit("mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
                expect(typeGuard(rawTxResponse, RpcError)).to.be.false
                rawTxResponse = rawTxResponse as RawTxResponse
                expect(rawTxResponse.height).to.equal(BigInt(0))
                expect(rawTxResponse.hash).not.to.be.empty
            })
        })

        describe("Error scenarios", function () {
            it("should error to submit an app unstake message given an empty address", async () => {
                NockUtil.mockRawTx()
                const pocket = createPocketInstance()

                // Create the account
                const passphrase = "1234"
                const accountOrError = await pocket.keybase.createAccount(passphrase)
                const account = accountOrError as Account

                // Create the transaction sender
                const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                const rawTxResponse = await transactionSender
                    .appUnstake("")
                    .submit("mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
                expect(typeGuard(rawTxResponse, RpcError)).to.be.true
            })

            it("should error to submit an app unstake message given an invalid address", async () => {
                NockUtil.mockRawTx()
                const pocket = createPocketInstance()

                // Create the account
                const passphrase = "1234"
                const accountOrError = await pocket.keybase.createAccount(passphrase)
                const account = accountOrError as Account

                // Create the transaction sender
                const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                const rawTxResponse = await transactionSender
                    .appUnstake("9E8E373FF27EC202")
                    .submit("mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
                expect(typeGuard(rawTxResponse, RpcError)).to.be.true
            })
        })
    })

    describe("App unjail message", function () {
        describe("Success scenarios", function () {
            it("should succesfully submit an app unjail message given the correct parameters", async () => {
                NockUtil.mockRawTx()
                const pocket = createPocketInstance()

                // Create the account
                const passphrase = "1234"
                const accountOrError = await pocket.keybase.createAccount(passphrase)
                const account = accountOrError as Account

                // Create the transaction sender
                const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                let rawTxResponse = await transactionSender
                    .appUnjail("9E8E373FF27EC202F82D07DF64F388FF42F9516D")
                    .submit("mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
                expect(typeGuard(rawTxResponse, RpcError)).to.be.false
                rawTxResponse = rawTxResponse as RawTxResponse
                expect(rawTxResponse.height).to.equal(BigInt(0))
                expect(rawTxResponse.hash).not.to.be.empty
            })
        })

        describe("Error scenarios", function () {
            it("should error to submit an app unjail message given an empty address", async () => {
                NockUtil.mockRawTx()
                const pocket = createPocketInstance()

                // Create the account
                const passphrase = "1234"
                const accountOrError = await pocket.keybase.createAccount(passphrase)
                const account = accountOrError as Account

                // Create the transaction sender
                const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                const rawTxResponse = await transactionSender
                    .appUnjail("")
                    .submit("mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
                expect(typeGuard(rawTxResponse, RpcError)).to.be.true
            })

            it("should error to submit an app unjail message given an invalid address", async () => {
                NockUtil.mockRawTx()
                const pocket = createPocketInstance()

                // Create the account
                const passphrase = "1234"
                const accountOrError = await pocket.keybase.createAccount(passphrase)
                const account = accountOrError as Account

                // Create the transaction sender
                const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                const rawTxResponse = await transactionSender
                    .appUnjail("9E8E373FF27EC202")
                    .submit("mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
                expect(typeGuard(rawTxResponse, RpcError)).to.be.true
            })
        })
    })

    describe("Node stake message", function () {
        describe("Success scenarios", function () {
            it("should succesfully submit an node stake message given the correct parameters", async () => {
                NockUtil.mockRawTx()
                const pocket = createPocketInstance()

                // Create the account
                const passphrase = "1234"
                const accountOrError = await pocket.keybase.createAccount(passphrase)
                const account = accountOrError as Account

                // Create the transaction sender
                const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                let rawTxResponse = await transactionSender
                    .nodeStake("ee54d37f8b45b2a185c465463222e287afaa5d3027c7a8c1c3ed554b8b19c502", ["CHAIN1"], "15000", new URL("https://myawesomenode.network"))
                    .submit("mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
                expect(typeGuard(rawTxResponse, RpcError)).to.be.false
                rawTxResponse = rawTxResponse as RawTxResponse
                expect(rawTxResponse.height).to.equal(BigInt(0))
                expect(rawTxResponse.hash).not.to.be.empty
            })
        })

        describe("Error scenarios", function () {
            it("should error to submit an node stake message with an empty amount", async () => {
                NockUtil.mockRawTx()
                const pocket = createPocketInstance()

                // Create the account
                const passphrase = "1234"
                const accountOrError = await pocket.keybase.createAccount(passphrase)
                const account = accountOrError as Account

                // Create the transaction sender
                const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                const rawTxResponse = await transactionSender
                    .nodeStake("ee54d37f8b45b2a185c465463222e287afaa5d3027c7a8c1c3ed554b8b19c502", ["CHAIN1"], "", new URL("https://myawesomenode.network"))
                    .submit("mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
                expect(typeGuard(rawTxResponse, RpcError)).to.be.true
            })

            it("should error to submit an node stake message with a non-numerical amount", async () => {
                NockUtil.mockRawTx()
                const pocket = createPocketInstance()

                // Create the account
                const passphrase = "1234"
                const accountOrError = await pocket.keybase.createAccount(passphrase)
                const account = accountOrError as Account

                // Create the transaction sender
                const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                const rawTxResponse = await transactionSender
                    .nodeStake("ee54d37f8b45b2a185c465463222e287afaa5d3027c7a8c1c3ed554b8b19c502", ["CHAIN1"], "NotANumber", new URL("https://myawesomenode.network"))
                    .submit("mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
                expect(typeGuard(rawTxResponse, RpcError)).to.be.true
            })

            it("should error to submit an node stake message with an empty chains list", async () => {
                NockUtil.mockRawTx()
                const pocket = createPocketInstance()

                // Create the account
                const passphrase = "1234"
                const accountOrError = await pocket.keybase.createAccount(passphrase)
                const account = accountOrError as Account

                // Create the transaction sender
                const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                const rawTxResponse = await transactionSender
                    .nodeStake("ee54d37f8b45b2a185c465463222e287afaa5d3027c7a8c1c3ed554b8b19c502", [], "NotANumber", new URL("https://myawesomenode.network"))
                    .submit("mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
                expect(typeGuard(rawTxResponse, RpcError)).to.be.true
            })

            it("should error to submit an node stake message with a non-https URL", async () => {
                NockUtil.mockRawTx()
                const pocket = createPocketInstance()

                // Create the account
                const passphrase = "1234"
                const accountOrError = await pocket.keybase.createAccount(passphrase)
                const account = accountOrError as Account

                // Create the transaction sender
                const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                const rawTxResponse = await transactionSender
                    .nodeStake("ee54d37f8b45b2a185c465463222e287afaa5d3027c7a8c1c3ed554b8b19c502", [], "NotANumber", new URL("http://myawesomenode.network"))
                    .submit("mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
                expect(typeGuard(rawTxResponse, RpcError)).to.be.true
            })
        })
    })

    describe("Node unstake message", function () {
        describe("Success scenarios", function () {
            it("should succesfully submit an node unstake message given the correct parameters", async () => {
                NockUtil.mockRawTx()
                const pocket = createPocketInstance()

                // Create the account
                const passphrase = "1234"
                const accountOrError = await pocket.keybase.createAccount(passphrase)
                const account = accountOrError as Account

                // Create the transaction sender
                const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                let rawTxResponse = await transactionSender
                    .nodeUnstake("9E8E373FF27EC202F82D07DF64F388FF42F9516D")
                    .submit("mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
                expect(typeGuard(rawTxResponse, RpcError)).to.be.false
                rawTxResponse = rawTxResponse as RawTxResponse
                expect(rawTxResponse.height).to.equal(BigInt(0))
                expect(rawTxResponse.hash).not.to.be.empty
            })
        })

        describe("Error scenarios", function () {
            it("should error to submit an node unstake message given an empty address", async () => {
                NockUtil.mockRawTx()
                const pocket = createPocketInstance()

                // Create the account
                const passphrase = "1234"
                const accountOrError = await pocket.keybase.createAccount(passphrase)
                const account = accountOrError as Account

                // Create the transaction sender
                const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                const rawTxResponse = await transactionSender
                    .nodeUnstake("")
                    .submit("mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
                expect(typeGuard(rawTxResponse, RpcError)).to.be.true
            })

            it("should error to submit an node unstake message given an invalid address", async () => {
                NockUtil.mockRawTx()
                const pocket = createPocketInstance()

                // Create the account
                const passphrase = "1234"
                const accountOrError = await pocket.keybase.createAccount(passphrase)
                const account = accountOrError as Account

                // Create the transaction sender
                const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                const rawTxResponse = await transactionSender
                    .nodeUnstake("9E8E373FF27EC202")
                    .submit("mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
                expect(typeGuard(rawTxResponse, RpcError)).to.be.true
            })
        })
    })

    describe("Node unjail message", function () {
        describe("Success scenarios", function () {
            it("should succesfully submit an node unjail message given the correct parameters", async () => {
                NockUtil.mockRawTx()
                const pocket = createPocketInstance()

                // Create the account
                const passphrase = "1234"
                const accountOrError = await pocket.keybase.createAccount(passphrase)
                const account = accountOrError as Account

                // Create the transaction sender
                const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                let rawTxResponse = await transactionSender
                    .nodeUnjail("9E8E373FF27EC202F82D07DF64F388FF42F9516D")
                    .submit("mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
                expect(typeGuard(rawTxResponse, RpcError)).to.be.false
                rawTxResponse = rawTxResponse as RawTxResponse
                expect(rawTxResponse.height).to.equal(BigInt(0))
                expect(rawTxResponse.hash).not.to.be.empty
            })
        })

        describe("Error scenarios", function () {
            it("should error to submit an node unjail message given an empty address", async () => {
                NockUtil.mockRawTx()
                const pocket = createPocketInstance()

                // Create the account
                const passphrase = "1234"
                const accountOrError = await pocket.keybase.createAccount(passphrase)
                const account = accountOrError as Account

                // Create the transaction sender
                const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                const rawTxResponse = await transactionSender
                    .nodeUnjail("")
                    .submit("mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
                expect(typeGuard(rawTxResponse, RpcError)).to.be.true
            })

            it("should error to submit an node unjail message given an invalid address", async () => {
                NockUtil.mockRawTx()
                const pocket = createPocketInstance()

                // Create the account
                const passphrase = "1234"
                const accountOrError = await pocket.keybase.createAccount(passphrase)
                const account = accountOrError as Account

                // Create the transaction sender
                const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                const rawTxResponse = await transactionSender
                    .nodeUnjail("9E8E373FF27EC202")
                    .submit("mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
                expect(typeGuard(rawTxResponse, RpcError)).to.be.true
            })
        })
    })
})