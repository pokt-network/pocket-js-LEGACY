import { expect } from 'chai'
import { Account, Node, BondStatus, Configuration, Pocket, HttpRpcProvider, ITransactionSender, CoinDenom, typeGuard, RpcError, RawTxResponse, QueryAccountResponse } from '../../../../src'
import { NockUtil } from '../../../utils/nock-util'
import { EnvironmentHelper } from '../../../utils/env/helper'
import { type } from 'os'

// let env = EnvironmentHelper.getTestNet()
// const nodeAddress = "84871BAF5B4E01BE52E5007EACF7048F24BF57E0"
// const nodePublicKey = "d9c7f275388ca1f87900945dba7f3a90fa9bba78f158c070aa12e3eccf53a2eb"
// const testNode = new Node(nodeAddress, nodePublicKey, false, BondStatus.bonded, BigInt(100), env.getPOKTRPC(), ["49aff8a9f51b268f6fc485ec14fb08466c3ec68c8d86d9b5810ad80546b65f29"])

const dispatchNodeJSON = "{\"address\":\"189ceb72c06b99e15a53fd437b81d4500f7a01f1\",\"public_key\":\"1839f4836f22d438692355b2ee34e47d396f6eb23b423bf3a1e623137ddbf7e3\",\"jailed\":false,\"status\":2,\"tokens\":\"1000000000\",\"service_url\":\"http:\/\/35.245.90.148:8081\",\"chains\":[\"6d3ce011e06e27a74cfa7d774228c52597ef5ef26f4a4afa9ad3cebefb5f3ca8\",\"49aff8a9f51b268f6fc485ec14fb08466c3ec68c8d86d9b5810ad80546b65f29\"],\"unstaking_time\":\"0001-01-01T00:00:00Z\"}"
const dispatchNode = Node.fromJSON(dispatchNodeJSON)
const dispatcher: URL = dispatchNode.serviceURL
const configuration = new Configuration(5, 60000, 1000000)

function defaultConfiguration(): Configuration {
    return configuration
}

function createPocketInstance(configuration?: Configuration): Pocket {
    if (configuration === undefined) {
        const rpcProvider = new HttpRpcProvider(dispatchNode.serviceURL)
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
                    expect(pocket.withPrivateKey("23eaa0dba825603e30ebff8cbd25d43e43009615b28c68a648f834002272b3f7917fe8e7fc02ceabddfbb10168dcd6885180d9f2db8855dbe063f6c5f7f93c9c")).to.not.throw
                })

                it("Should create a ITransactionSender given a private key buffer", async () => {
                    const pocket = createPocketInstance()
                    expect(pocket.withPrivateKey(Buffer.from("23eaa0dba825603e30ebff8cbd25d43e43009615b28c68a648f834002272b3f7917fe8e7fc02ceabddfbb10168dcd6885180d9f2db8855dbe063f6c5f7f93c9c", "hex"))).to.not.throw
                })
            })

            describe("Error scenarios", function () {
                it("Should fail to create with an empty or invalid private key string", async () => {
                    // Invalid private key
                    const pocket = createPocketInstance()
                    expect(pocket.withPrivateKey("23eaa0dba825603e30ebff8cbd25d43e43009615b28c68a648f834002272b3f7917fe8e7fc02ceabddfbb10168dcd6885180d9f2db8855dbe063f6c5f7f93c")).to.not.throw

                    // Empty private key
                    expect(pocket.withPrivateKey("")).to.not.throw
                })

                it("Should fail to create with an empty or invalid private key buffer", async () => {
                    // Invalid private key
                    const pocket = createPocketInstance()
                    expect(pocket.withPrivateKey(Buffer.from("23eaa0dba825603e30ebff8cbd25d43e43009615b28c68a648f834002272b3f7917fe8e7fc02ceabddfbb10168dcd6885180d9f2db8855dbe063f6c5f7f93c", "hex"))).to.not.throw

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

                // Create the account
                const passphrase = "1234"
                const accountOrError = await pocket.keybase.importAccount(Buffer.from("2dec343f5d225be87663194f5ce61611ee585ab68baf1046694b0045124bd1a5d3814cf87d0d0b249dc9727d2e124a03cbb4d23e37c169833ef88562546f0958", "hex"), passphrase)
                const account = accountOrError as Account

                // Create the transaction sender
                const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                
                // Get account information
                let accountInfo = await pocket.rpc()!.query.getAccount(account.addressHex)
                expect(typeGuard(accountInfo, QueryAccountResponse))
                accountInfo = accountInfo as QueryAccountResponse
                // Entropy
                const entropy = BigInt(Math.floor(Math.random() * 99999999999999999))
                let rawTxResponse = await transactionSender
                    .send(account.addressHex, "A8224A98BCDBEF16CF1C4B67F75F092BC6C38E4A", "10")
                    .submit("pocket-testet-playground", "100000", entropy, CoinDenom.Upokt, "This is a test!")
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
                    .submit("", "100", entropy, CoinDenom.Pokt, "This is a test!")
                expect(typeGuard(rawTxResponse, Error)).to.be.true
            })

            it("should fail to submit a transaction given a non-numerical fee", async () => {
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
                    .submit("mocked-pocket-testnet", "NotANumber", entropy,  CoinDenom.Pokt, "This is a test!")
                expect(typeGuard(rawTxResponse, Error)).to.be.true
            })

            it("should fail to submit a transaction given an empty fee", async () => {
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
                    .submit("mocked-pocket-testnet", "", entropy, CoinDenom.Pokt, "This is a test!")
                expect(typeGuard(rawTxResponse, Error)).to.be.true
            })
        })
    })

    // TODO: test messages
    // describe("Send message", function () {
    //     describe("Success scenarios", function () {
    //         it("should succesfully submit a send message given the correct parameters", async () => {
    //             NockUtil.mockRawTx()
    //             const pocket = createPocketInstance()

    //             // Create the account
    //             const passphrase = "1234"
    //             const accountOrError = await pocket.keybase.createAccount(passphrase)
    //             const account = accountOrError as Account

    //             // Create the transaction sender
    //             const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
    //             let rawTxResponse = await transactionSender
    //                 .send("11AD05777C30F529C3FD3753AD5D0EA97192716E", "9E8E373FF27EC202F82D07DF64F388FF42F9516D", "10")
    //                 .submit("1234", "0", "mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
    //             expect(typeGuard(rawTxResponse, RpcError)).to.be.false
    //             rawTxResponse = rawTxResponse as RawTxResponse
    //             expect(rawTxResponse.height).to.equal(BigInt(0))
    //             expect(rawTxResponse.hash).not.to.be.empty
    //         })
    //     })

    //     describe("Error scenarios", function () {
    //         it("should error to submit a send message with an empty amount", async () => {
    //             NockUtil.mockRawTx()
    //             const pocket = createPocketInstance()

    //             // Create the account
    //             const passphrase = "1234"
    //             const accountOrError = await pocket.keybase.createAccount(passphrase)
    //             const account = accountOrError as Account

    //             // Create the transaction sender
    //             const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
    //             const rawTxResponse = await transactionSender
    //                 .send("11AD05777C30F529C3FD3753AD5D0EA97192716E", "9E8E373FF27EC202F82D07DF64F388FF42F9516D", "")
    //                 .submit("1234", "0", "mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
    //             expect(typeGuard(rawTxResponse, RpcError)).to.be.true
    //         })

    //         it("should error to submit a send message with an non-numerical amount", async () => {
    //             NockUtil.mockRawTx()
    //             const pocket = createPocketInstance()

    //             // Create the account
    //             const passphrase = "1234"
    //             const accountOrError = await pocket.keybase.createAccount(passphrase)
    //             const account = accountOrError as Account

    //             // Create the transaction sender
    //             const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
    //             const rawTxResponse = await transactionSender
    //                 .send("11AD05777C30F529C3FD3753AD5D0EA97192716E", "9E8E373FF27EC202F82D07DF64F388FF42F9516D", "NotANumber")
    //                 .submit("1234", "0", "mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
    //             expect(typeGuard(rawTxResponse, RpcError)).to.be.true
    //         })
    //     })
    // })

    // describe("App stake message", function () {
    //     describe("Success scenarios", function () {
    //         it("should succesfully submit an app stake message given the correct parameters", async () => {
    //             NockUtil.mockRawTx()
    //             const pocket = createPocketInstance()

    //             // Create the account
    //             const passphrase = "1234"
    //             const accountOrError = await pocket.keybase.createAccount(passphrase)
    //             const account = accountOrError as Account

    //             // Create the transaction sender
    //             const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
    //             let rawTxResponse = await transactionSender
    //                 .appStake("ee54d37f8b45b2a185c465463222e287afaa5d3027c7a8c1c3ed554b8b19c502", ["CHAIN1"], "15000")
    //                 .submit("1234", "0", "mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
    //             expect(typeGuard(rawTxResponse, RpcError)).to.be.false
    //             rawTxResponse = rawTxResponse as RawTxResponse
    //             expect(rawTxResponse.height).to.equal(BigInt(0))
    //             expect(rawTxResponse.hash).not.to.be.empty
    //         })
    //     })

    //     describe("Error scenarios", function () {
    //         it("should error to submit an app stake message with an empty amount", async () => {
    //             NockUtil.mockRawTx()
    //             const pocket = createPocketInstance()

    //             // Create the account
    //             const passphrase = "1234"
    //             const accountOrError = await pocket.keybase.createAccount(passphrase)
    //             const account = accountOrError as Account

    //             // Create the transaction sender
    //             const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
    //             const rawTxResponse = await transactionSender
    //                 .appStake("ee54d37f8b45b2a185c465463222e287afaa5d3027c7a8c1c3ed554b8b19c502", ["CHAIN1"], "")
    //                 .submit("1234", "0", "mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
    //             expect(typeGuard(rawTxResponse, RpcError)).to.be.true
    //         })

    //         it("should error to submit an app stake message with a non-numerical amount", async () => {
    //             NockUtil.mockRawTx()
    //             const pocket = createPocketInstance()

    //             // Create the account
    //             const passphrase = "1234"
    //             const accountOrError = await pocket.keybase.createAccount(passphrase)
    //             const account = accountOrError as Account

    //             // Create the transaction sender
    //             const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
    //             const rawTxResponse = await transactionSender
    //                 .appStake("ee54d37f8b45b2a185c465463222e287afaa5d3027c7a8c1c3ed554b8b19c502", ["CHAIN1"], "NotANumber")
    //                 .submit("1234", "0", "mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
    //             expect(typeGuard(rawTxResponse, RpcError)).to.be.true
    //         })

    //         it("should error to submit an app stake message with an empty chains list", async () => {
    //             NockUtil.mockRawTx()
    //             const pocket = createPocketInstance()

    //             // Create the account
    //             const passphrase = "1234"
    //             const accountOrError = await pocket.keybase.createAccount(passphrase)
    //             const account = accountOrError as Account

    //             // Create the transaction sender
    //             const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
    //             const rawTxResponse = await transactionSender
    //                 .appStake("ee54d37f8b45b2a185c465463222e287afaa5d3027c7a8c1c3ed554b8b19c502", [], "NotANumber")
    //                 .submit("1234", "0", "mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
    //             expect(typeGuard(rawTxResponse, RpcError)).to.be.true
    //         })
    //     })
    // })

    // describe("App unstake message", function () {
    //     describe("Success scenarios", function () {
    //         it("should succesfully submit an app unstake message given the correct parameters", async () => {
    //             NockUtil.mockRawTx()
    //             const pocket = createPocketInstance()

    //             // Create the account
    //             const passphrase = "1234"
    //             const accountOrError = await pocket.keybase.createAccount(passphrase)
    //             const account = accountOrError as Account

    //             // Create the transaction sender
    //             const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
    //             let rawTxResponse = await transactionSender
    //                 .appUnstake("9E8E373FF27EC202F82D07DF64F388FF42F9516D")
    //                 .submit("1234", "0", "mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
    //             expect(typeGuard(rawTxResponse, RpcError)).to.be.false
    //             rawTxResponse = rawTxResponse as RawTxResponse
    //             expect(rawTxResponse.height).to.equal(BigInt(0))
    //             expect(rawTxResponse.hash).not.to.be.empty
    //         })
    //     })

    //     describe("Error scenarios", function () {
    //         it("should error to submit an app unstake message given an empty address", async () => {
    //             NockUtil.mockRawTx()
    //             const pocket = createPocketInstance()

    //             // Create the account
    //             const passphrase = "1234"
    //             const accountOrError = await pocket.keybase.createAccount(passphrase)
    //             const account = accountOrError as Account

    //             // Create the transaction sender
    //             const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
    //             const rawTxResponse = await transactionSender
    //                 .appUnstake("")
    //                 .submit("1234", "0", "mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
    //             expect(typeGuard(rawTxResponse, RpcError)).to.be.true
    //         })

    //         it("should error to submit an app unstake message given an invalid address", async () => {
    //             NockUtil.mockRawTx()
    //             const pocket = createPocketInstance()

    //             // Create the account
    //             const passphrase = "1234"
    //             const accountOrError = await pocket.keybase.createAccount(passphrase)
    //             const account = accountOrError as Account

    //             // Create the transaction sender
    //             const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
    //             const rawTxResponse = await transactionSender
    //                 .appUnstake("9E8E373FF27EC202")
    //                 .submit("1234", "0", "mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
    //             expect(typeGuard(rawTxResponse, RpcError)).to.be.true
    //         })
    //     })
    // })

    // describe("App unjail message", function () {
    //     describe("Success scenarios", function () {
    //         it("should succesfully submit an app unjail message given the correct parameters", async () => {
    //             NockUtil.mockRawTx()
    //             const pocket = createPocketInstance()

    //             // Create the account
    //             const passphrase = "1234"
    //             const accountOrError = await pocket.keybase.createAccount(passphrase)
    //             const account = accountOrError as Account

    //             // Create the transaction sender
    //             const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
    //             let rawTxResponse = await transactionSender
    //                 .appUnjail("9E8E373FF27EC202F82D07DF64F388FF42F9516D")
    //                 .submit("1234", "0", "mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
    //             expect(typeGuard(rawTxResponse, RpcError)).to.be.false
    //             rawTxResponse = rawTxResponse as RawTxResponse
    //             expect(rawTxResponse.height).to.equal(BigInt(0))
    //             expect(rawTxResponse.hash).not.to.be.empty
    //         })
    //     })

    //     describe("Error scenarios", function () {
    //         it("should error to submit an app unjail message given an empty address", async () => {
    //             NockUtil.mockRawTx()
    //             const pocket = createPocketInstance()

    //             // Create the account
    //             const passphrase = "1234"
    //             const accountOrError = await pocket.keybase.createAccount(passphrase)
    //             const account = accountOrError as Account

    //             // Create the transaction sender
    //             const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
    //             const rawTxResponse = await transactionSender
    //                 .appUnjail("")
    //                 .submit("1234", "0", "mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
    //             expect(typeGuard(rawTxResponse, RpcError)).to.be.true
    //         })

    //         it("should error to submit an app unjail message given an invalid address", async () => {
    //             NockUtil.mockRawTx()
    //             const pocket = createPocketInstance()

    //             // Create the account
    //             const passphrase = "1234"
    //             const accountOrError = await pocket.keybase.createAccount(passphrase)
    //             const account = accountOrError as Account

    //             // Create the transaction sender
    //             const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
    //             const rawTxResponse = await transactionSender
    //                 .appUnjail("9E8E373FF27EC202")
    //                 .submit("1234", "0", "mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
    //             expect(typeGuard(rawTxResponse, RpcError)).to.be.true
    //         })
    //     })
    // })

    // describe("Node stake message", function () {
    //     describe("Success scenarios", function () {
    //         it("should succesfully submit an node stake message given the correct parameters", async () => {
    //             NockUtil.mockRawTx()
    //             const pocket = createPocketInstance()

    //             // Create the account
    //             const passphrase = "1234"
    //             const accountOrError = await pocket.keybase.createAccount(passphrase)
    //             const account = accountOrError as Account

    //             // Create the transaction sender
    //             const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
    //             let rawTxResponse = await transactionSender
    //                 .nodeStake("ee54d37f8b45b2a185c465463222e287afaa5d3027c7a8c1c3ed554b8b19c502", ["CHAIN1"], "15000", new URL("https://myawesomenode.network"))
    //                 .submit("1234", "0", "mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
    //             expect(typeGuard(rawTxResponse, RpcError)).to.be.false
    //             rawTxResponse = rawTxResponse as RawTxResponse
    //             expect(rawTxResponse.height).to.equal(BigInt(0))
    //             expect(rawTxResponse.hash).not.to.be.empty
    //         })
    //     })

    //     describe("Error scenarios", function () {
    //         it("should error to submit an node stake message with an empty amount", async () => {
    //             NockUtil.mockRawTx()
    //             const pocket = createPocketInstance()

    //             // Create the account
    //             const passphrase = "1234"
    //             const accountOrError = await pocket.keybase.createAccount(passphrase)
    //             const account = accountOrError as Account

    //             // Create the transaction sender
    //             const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
    //             const rawTxResponse = await transactionSender
    //                 .nodeStake("ee54d37f8b45b2a185c465463222e287afaa5d3027c7a8c1c3ed554b8b19c502", ["CHAIN1"], "", new URL("https://myawesomenode.network"))
    //                 .submit("1234", "0", "mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
    //             expect(typeGuard(rawTxResponse, RpcError)).to.be.true
    //         })

    //         it("should error to submit an node stake message with a non-numerical amount", async () => {
    //             NockUtil.mockRawTx()
    //             const pocket = createPocketInstance()

    //             // Create the account
    //             const passphrase = "1234"
    //             const accountOrError = await pocket.keybase.createAccount(passphrase)
    //             const account = accountOrError as Account

    //             // Create the transaction sender
    //             const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
    //             const rawTxResponse = await transactionSender
    //                 .nodeStake("ee54d37f8b45b2a185c465463222e287afaa5d3027c7a8c1c3ed554b8b19c502", ["CHAIN1"], "NotANumber", new URL("https://myawesomenode.network"))
    //                 .submit("1234", "0", "mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
    //             expect(typeGuard(rawTxResponse, RpcError)).to.be.true
    //         })

    //         it("should error to submit an node stake message with an empty chains list", async () => {
    //             NockUtil.mockRawTx()
    //             const pocket = createPocketInstance()

    //             // Create the account
    //             const passphrase = "1234"
    //             const accountOrError = await pocket.keybase.createAccount(passphrase)
    //             const account = accountOrError as Account

    //             // Create the transaction sender
    //             const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
    //             const rawTxResponse = await transactionSender
    //                 .nodeStake("ee54d37f8b45b2a185c465463222e287afaa5d3027c7a8c1c3ed554b8b19c502", [], "NotANumber", new URL("https://myawesomenode.network"))
    //                 .submit("1234", "0", "mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
    //             expect(typeGuard(rawTxResponse, RpcError)).to.be.true
    //         })

    //         it("should error to submit an node stake message with a non-https URL", async () => {
    //             NockUtil.mockRawTx()
    //             const pocket = createPocketInstance()

    //             // Create the account
    //             const passphrase = "1234"
    //             const accountOrError = await pocket.keybase.createAccount(passphrase)
    //             const account = accountOrError as Account

    //             // Create the transaction sender
    //             const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
    //             const rawTxResponse = await transactionSender
    //                 .nodeStake("ee54d37f8b45b2a185c465463222e287afaa5d3027c7a8c1c3ed554b8b19c502", [], "NotANumber", new URL("http://myawesomenode.network"))
    //                 .submit("1234", "0", "mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
    //             expect(typeGuard(rawTxResponse, RpcError)).to.be.true
    //         })
    //     })
    // })

    // describe("Node unstake message", function () {
    //     describe("Success scenarios", function () {
    //         it("should succesfully submit an node unstake message given the correct parameters", async () => {
    //             NockUtil.mockRawTx()
    //             const pocket = createPocketInstance()

    //             // Create the account
    //             const passphrase = "1234"
    //             const accountOrError = await pocket.keybase.createAccount(passphrase)
    //             const account = accountOrError as Account

    //             // Create the transaction sender
    //             const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
    //             let rawTxResponse = await transactionSender
    //                 .nodeUnstake("9E8E373FF27EC202F82D07DF64F388FF42F9516D")
    //                 .submit("1234", "0", "mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
    //             expect(typeGuard(rawTxResponse, RpcError)).to.be.false
    //             rawTxResponse = rawTxResponse as RawTxResponse
    //             expect(rawTxResponse.height).to.equal(BigInt(0))
    //             expect(rawTxResponse.hash).not.to.be.empty
    //         })
    //     })

    //     describe("Error scenarios", function () {
    //         it("should error to submit an node unstake message given an empty address", async () => {
    //             NockUtil.mockRawTx()
    //             const pocket = createPocketInstance()

    //             // Create the account
    //             const passphrase = "1234"
    //             const accountOrError = await pocket.keybase.createAccount(passphrase)
    //             const account = accountOrError as Account

    //             // Create the transaction sender
    //             const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
    //             const rawTxResponse = await transactionSender
    //                 .nodeUnstake("")
    //                 .submit("1234", "0", "mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
    //             expect(typeGuard(rawTxResponse, RpcError)).to.be.true
    //         })

    //         it("should error to submit an node unstake message given an invalid address", async () => {
    //             NockUtil.mockRawTx()
    //             const pocket = createPocketInstance()

    //             // Create the account
    //             const passphrase = "1234"
    //             const accountOrError = await pocket.keybase.createAccount(passphrase)
    //             const account = accountOrError as Account

    //             // Create the transaction sender
    //             const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
    //             const rawTxResponse = await transactionSender
    //                 .nodeUnstake("9E8E373FF27EC202")
    //                 .submit("1234", "0", "mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
    //             expect(typeGuard(rawTxResponse, RpcError)).to.be.true
    //         })
    //     })
    // })

    // describe("Node unjail message", function () {
    //     describe("Success scenarios", function () {
    //         it("should succesfully submit an node unjail message given the correct parameters", async () => {
    //             NockUtil.mockRawTx()
    //             const pocket = createPocketInstance()

    //             // Create the account
    //             const passphrase = "1234"
    //             const accountOrError = await pocket.keybase.createAccount(passphrase)
    //             const account = accountOrError as Account

    //             // Create the transaction sender
    //             const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
    //             let rawTxResponse = await transactionSender
    //                 .nodeUnjail("9E8E373FF27EC202F82D07DF64F388FF42F9516D")
    //                 .submit("1234", "0", "mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
    //             expect(typeGuard(rawTxResponse, RpcError)).to.be.false
    //             rawTxResponse = rawTxResponse as RawTxResponse
    //             expect(rawTxResponse.height).to.equal(BigInt(0))
    //             expect(rawTxResponse.hash).not.to.be.empty
    //         })
    //     })

    //     describe("Error scenarios", function () {
    //         it("should error to submit an node unjail message given an empty address", async () => {
    //             NockUtil.mockRawTx()
    //             const pocket = createPocketInstance()

    //             // Create the account
    //             const passphrase = "1234"
    //             const accountOrError = await pocket.keybase.createAccount(passphrase)
    //             const account = accountOrError as Account

    //             // Create the transaction sender
    //             const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
    //             const rawTxResponse = await transactionSender
    //                 .nodeUnjail("")
    //                 .submit("1234", "0", "mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
    //             expect(typeGuard(rawTxResponse, RpcError)).to.be.true
    //         })

    //         it("should error to submit an node unjail message given an invalid address", async () => {
    //             NockUtil.mockRawTx()
    //             const pocket = createPocketInstance()

    //             // Create the account
    //             const passphrase = "1234"
    //             const accountOrError = await pocket.keybase.createAccount(passphrase)
    //             const account = accountOrError as Account

    //             // Create the transaction sender
    //             const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
    //             const rawTxResponse = await transactionSender
    //                 .nodeUnjail("9E8E373FF27EC202")
    //                 .submit("1234", "0", "mocked-pocket-testnet", "100", CoinDenom.Pokt, "This is a test!")
    //             expect(typeGuard(rawTxResponse, RpcError)).to.be.true
    //         })
    //     })
    // })
})