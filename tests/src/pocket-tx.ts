import { expect } from 'chai'
import { Pocket } from '../../src/pocket'
import {
    Configuration, BondStatus, Node, Account, ITransactionSender, typeGuard, RpcErrorResponse
} from '../../src'
import { CoinDenom } from '../../src/models/coin-denom'
import { RawTxResponse } from '../../src/models/output/raw-tx-response'
import { NockUtil } from '../utils/nock-util'
import { LocalNet } from '../../src/utils/env'

const env = new LocalNet()
const nodeAddress = "84871BAF5B4E01BE52E5007EACF7048F24BF57E0"
const nodePublicKey = "d9c7f275388ca1f87900945dba7f3a90fa9bba78f158c070aa12e3eccf53a2eb"
const testNode = new Node(nodeAddress, nodePublicKey, false, BondStatus.bonded, BigInt(100), env.getPOKTRPC(), ["ETH04"])

function defaultConfiguration(): Configuration {
    return new Configuration([testNode])
}

function createPocketInstance(configuration?: Configuration): Pocket {
    if(configuration === undefined) {
        return new Pocket(defaultConfiguration())
    } else {
        return new Pocket(configuration as Configuration)
    }
}

describe("Pocket Transactions Tests", function() {

    describe("Sending raw transactions", function() {
        describe("Success scenarios", function() {
            it("should succesfully send a raw transaction given a fromAddress, tx hex and Node", async () => {
                NockUtil.mockRawTx()
                const pocket = createPocketInstance()
                const senderAddressHex = "11AD05777C30F529C3FD3753AD5D0EA97192716E"
                const txHex = "c001db0b170d0a3c939866b00a1411ad05777c30f529c3fd3753ad5d0ea97192716e12149e8e373ff27ec202f82d07df64f388ff42f9516d1a0a0a04706f6b7412023130120b0a04706f6b7412033130301a690a259d54477420917fe8e7fc02ceabddfbb10168dcd6885180d9f2db8855dbe063f6c5f7f93c9c12402c40788aac1e27539647a14a447d89966ab5fa6d4380c2b24a839c91be0106fbae55b76a9168a780108a40466b85b190ef12b9b6db6a879f6daa3b70b090100a22046c6f6c6f"
                const response = await pocket.sendRawTx(senderAddressHex, txHex, pocket.configuration.nodes[0])
                expect(response).not.to.be.a('error')
            })
        })

        describe("Error scenarios", function () {
            it("should fail given an invalid or empty address hex", async () => {
                NockUtil.mockRawTx()

                // Invalid address
                const pocket = createPocketInstance()
                let senderAddressHex = "11AD05777C30F529C3FD3753AD5D0EA9719271"
                let txHex = "c001db0b170d0a3c939866b00a1411ad05777c30f529c3fd3753ad5d0ea97192716e12149e8e373ff27ec202f82d07df64f388ff42f9516d1a0a0a04706f6b7412023130120b0a04706f6b7412033130301a690a259d54477420917fe8e7fc02ceabddfbb10168dcd6885180d9f2db8855dbe063f6c5f7f93c9c12402c40788aac1e27539647a14a447d89966ab5fa6d4380c2b24a839c91be0106fbae55b76a9168a780108a40466b85b190ef12b9b6db6a879f6daa3b70b090100a22046c6f6c6f"
                const invalidResponse = await pocket.sendRawTx(senderAddressHex, txHex, pocket.configuration.nodes[0])
                expect(typeGuard(invalidResponse, RpcErrorResponse)).to.be.true

                // Empty address
                senderAddressHex = ""
                txHex = "c001db0b170d0a3c939866b00a1411ad05777c30f529c3fd3753ad5d0ea97192716e12149e8e373ff27ec202f82d07df64f388ff42f9516d1a0a0a04706f6b7412023130120b0a04706f6b7412033130301a690a259d54477420917fe8e7fc02ceabddfbb10168dcd6885180d9f2db8855dbe063f6c5f7f93c9c12402c40788aac1e27539647a14a447d89966ab5fa6d4380c2b24a839c91be0106fbae55b76a9168a780108a40466b85b190ef12b9b6db6a879f6daa3b70b090100a22046c6f6c6f"
                const emptyResponse = await pocket.sendRawTx(senderAddressHex, txHex, pocket.configuration.nodes[0])
                expect(typeGuard(emptyResponse, RpcErrorResponse)).to.be.true
            })

            it("should fail given an empty tx hex", async () => {
                NockUtil.mockRawTx()
                // Empty address
                const pocket = createPocketInstance()
                const senderAddressHex = "11AD05777C30F529C3FD3753AD5D0EA9719271"
                const txHex = ""
                const response = await pocket.sendRawTx(senderAddressHex, txHex, pocket.configuration.nodes[0])
                expect(typeGuard(response, RpcErrorResponse)).to.be.true
            })
        })
    })

    describe("Using ITransactionSender", function() {
        describe("Creating a transaction sender", function() {
            describe("With a private key", function() {
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

            describe("With an imported account", function() {
                describe("Success scenarios", function () {
                    it("should create a ITransactionSender with an already imported account and correct passphrase", async () => {
                        const pocket = createPocketInstance()
                        
                        // Create the account
                        const passphrase = "1234"
                        const accountOrError = await pocket.createAccount(passphrase)
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
                        const accountOrError = await pocket.createAccount(passphrase)
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
                        await pocket.createAccount(passphrase)
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

        describe("Submit transaction", function() {
            describe("Success scenarios", function() {
                it("should succesfully submit a transaction given the correct parameters", async () => {
                    NockUtil.mockRawTx()
                    const pocket = createPocketInstance()

                    // Create the account
                    const passphrase = "1234"
                    const accountOrError = await pocket.createAccount(passphrase)
                    const account = accountOrError as Account

                    // Create the transaction sender
                    const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                    let rawTxResponse = await transactionSender
                        .send("11AD05777C30F529C3FD3753AD5D0EA97192716E", "9E8E373FF27EC202F82D07DF64F388FF42F9516D", "10", CoinDenom.Pokt)
                        .submit("1234", "0", "mocked-pocket-testnet", testNode, "100", CoinDenom.Pokt, "This is a test!")   
                    expect(typeGuard(rawTxResponse, RpcErrorResponse)).to.be.false
                    rawTxResponse = rawTxResponse as RawTxResponse
                    expect(rawTxResponse.height).to.equal(BigInt(0))
                    expect(rawTxResponse.hash).not.to.be.empty
                })
            })

            describe("Error scenarios", function() {
                it("should fail to submit a transaction given a non-numerical account number", async () => {
                    NockUtil.mockRawTx()
                    const pocket = createPocketInstance()

                    // Create the account
                    const passphrase = "1234"
                    const accountOrError = await pocket.createAccount(passphrase)
                    const account = accountOrError as Account

                    // Create the transaction sender
                    const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                    const rawTxResponse = await transactionSender
                        .send("11AD05777C30F529C3FD3753AD5D0EA97192716E", "9E8E373FF27EC202F82D07DF64F388FF42F9516D", "10", CoinDenom.Pokt)
                        .submit("NotANumber", "0", "mocked-pocket-testnet", testNode, "100", CoinDenom.Pokt, "This is a test!")
                    expect(typeGuard(rawTxResponse, Error)).to.be.true
                })

                it("should fail to submit a transaction given an empty account number", async () => {
                    NockUtil.mockRawTx()
                    const pocket = createPocketInstance()

                    // Create the account
                    const passphrase = "1234"
                    const accountOrError = await pocket.createAccount(passphrase)
                    const account = accountOrError as Account

                    // Create the transaction sender
                    const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                    const rawTxResponse = await transactionSender
                        .send("11AD05777C30F529C3FD3753AD5D0EA97192716E", "9E8E373FF27EC202F82D07DF64F388FF42F9516D", "10", CoinDenom.Pokt)
                        .submit("", "0", "mocked-pocket-testnet", testNode, "100", CoinDenom.Pokt, "This is a test!")
                    expect(typeGuard(rawTxResponse, Error)).to.be.true
                })

                it("should fail to submit a transaction given a non-numerical sequence number", async () => {
                    NockUtil.mockRawTx()
                    const pocket = createPocketInstance()

                    // Create the account
                    const passphrase = "1234"
                    const accountOrError = await pocket.createAccount(passphrase)
                    const account = accountOrError as Account

                    // Create the transaction sender
                    const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                    const rawTxResponse = await transactionSender
                        .send("11AD05777C30F529C3FD3753AD5D0EA97192716E", "9E8E373FF27EC202F82D07DF64F388FF42F9516D", "10", CoinDenom.Pokt)
                        .submit("1234", "NotANumber", "mocked-pocket-testnet", testNode, "100", CoinDenom.Pokt, "This is a test!")
                    expect(typeGuard(rawTxResponse, Error)).to.be.true
                })

                it("should fail to submit a transaction given an empty sequence number", async () => {
                    NockUtil.mockRawTx()
                    const pocket = createPocketInstance()

                    // Create the account
                    const passphrase = "1234"
                    const accountOrError = await pocket.createAccount(passphrase)
                    const account = accountOrError as Account

                    // Create the transaction sender
                    const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                    const rawTxResponse = await transactionSender
                        .send("11AD05777C30F529C3FD3753AD5D0EA97192716E", "9E8E373FF27EC202F82D07DF64F388FF42F9516D", "10", CoinDenom.Pokt)
                        .submit("1234", "", "mocked-pocket-testnet", testNode, "100", CoinDenom.Pokt, "This is a test!")
                    expect(typeGuard(rawTxResponse, Error)).to.be.true
                })

                it("should fail to submit a transaction given an empty chain id", async () => {
                    NockUtil.mockRawTx()
                    const pocket = createPocketInstance()

                    // Create the account
                    const passphrase = "1234"
                    const accountOrError = await pocket.createAccount(passphrase)
                    const account = accountOrError as Account

                    // Create the transaction sender
                    const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                    const rawTxResponse = await transactionSender
                        .send("11AD05777C30F529C3FD3753AD5D0EA97192716E", "9E8E373FF27EC202F82D07DF64F388FF42F9516D", "10", CoinDenom.Pokt)
                        .submit("1234", "0", "", testNode, "100", CoinDenom.Pokt, "This is a test!")
                    expect(typeGuard(rawTxResponse, Error)).to.be.true
                })

                it("should fail to submit a transaction given a non-numerical fee", async () => {
                    NockUtil.mockRawTx()
                    const pocket = createPocketInstance()

                    // Create the account
                    const passphrase = "1234"
                    const accountOrError = await pocket.createAccount(passphrase)
                    const account = accountOrError as Account

                    // Create the transaction sender
                    const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                    const rawTxResponse = await transactionSender
                        .send("11AD05777C30F529C3FD3753AD5D0EA97192716E", "9E8E373FF27EC202F82D07DF64F388FF42F9516D", "10", CoinDenom.Pokt)
                        .submit("1234", "0", "mocked-pocket-testnet", testNode, "NotANumber", CoinDenom.Pokt, "This is a test!")
                    expect(typeGuard(rawTxResponse, Error)).to.be.true
                })

                it("should fail to submit a transaction given an empty fee", async () => {
                    NockUtil.mockRawTx()
                    const pocket = createPocketInstance()

                    // Create the account
                    const passphrase = "1234"
                    const accountOrError = await pocket.createAccount(passphrase)
                    const account = accountOrError as Account

                    // Create the transaction sender
                    const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                    const rawTxResponse = await transactionSender
                        .send("11AD05777C30F529C3FD3753AD5D0EA97192716E", "9E8E373FF27EC202F82D07DF64F388FF42F9516D", "10", CoinDenom.Pokt)
                        .submit("1234", "0", "mocked-pocket-testnet", testNode, "", CoinDenom.Pokt, "This is a test!")
                    expect(typeGuard(rawTxResponse, Error)).to.be.true
                })
            })
        })

        describe("Send message", function() {
            describe("Success scenarios", function () {
                it("should succesfully submit a send message given the correct parameters", async () => {
                    NockUtil.mockRawTx()
                    const pocket = createPocketInstance()

                    // Create the account
                    const passphrase = "1234"
                    const accountOrError = await pocket.createAccount(passphrase)
                    const account = accountOrError as Account

                    // Create the transaction sender
                    const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                    let rawTxResponse = await transactionSender
                        .send("11AD05777C30F529C3FD3753AD5D0EA97192716E", "9E8E373FF27EC202F82D07DF64F388FF42F9516D", "10", CoinDenom.Pokt)
                        .submit("1234", "0", "mocked-pocket-testnet", testNode, "100", CoinDenom.Pokt, "This is a test!")
                    expect(typeGuard(rawTxResponse, RpcErrorResponse)).to.be.false
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
                    const accountOrError = await pocket.createAccount(passphrase)
                    const account = accountOrError as Account

                    // Create the transaction sender
                    const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                    const rawTxResponse = await transactionSender
                        .send("11AD05777C30F529C3FD3753AD5D0EA97192716E", "9E8E373FF27EC202F82D07DF64F388FF42F9516D", "", CoinDenom.Pokt)
                        .submit("1234", "0", "mocked-pocket-testnet", testNode, "100", CoinDenom.Pokt, "This is a test!")
                    expect(typeGuard(rawTxResponse, RpcErrorResponse)).to.be.true
                })

                it("should error to submit a send message with an non-numerical amount", async () => {
                    NockUtil.mockRawTx()
                    const pocket = createPocketInstance()

                    // Create the account
                    const passphrase = "1234"
                    const accountOrError = await pocket.createAccount(passphrase)
                    const account = accountOrError as Account

                    // Create the transaction sender
                    const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                    const rawTxResponse = await transactionSender
                        .send("11AD05777C30F529C3FD3753AD5D0EA97192716E", "9E8E373FF27EC202F82D07DF64F388FF42F9516D", "NotANumber", CoinDenom.Pokt)
                        .submit("1234", "0", "mocked-pocket-testnet", testNode, "100", CoinDenom.Pokt, "This is a test!")
                    expect(typeGuard(rawTxResponse, RpcErrorResponse)).to.be.true
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
                    const accountOrError = await pocket.createAccount(passphrase)
                    const account = accountOrError as Account

                    // Create the transaction sender
                    const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                    let rawTxResponse = await transactionSender
                        .appStake("ee54d37f8b45b2a185c465463222e287afaa5d3027c7a8c1c3ed554b8b19c502", ["CHAIN1"], "15000")
                        .submit("1234", "0", "mocked-pocket-testnet", testNode, "100", CoinDenom.Pokt, "This is a test!")
                    expect(typeGuard(rawTxResponse, RpcErrorResponse)).to.be.false
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
                    const accountOrError = await pocket.createAccount(passphrase)
                    const account = accountOrError as Account

                    // Create the transaction sender
                    const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                    const rawTxResponse = await transactionSender
                        .appStake("ee54d37f8b45b2a185c465463222e287afaa5d3027c7a8c1c3ed554b8b19c502", ["CHAIN1"], "")
                        .submit("1234", "0", "mocked-pocket-testnet", testNode, "100", CoinDenom.Pokt, "This is a test!")
                    expect(typeGuard(rawTxResponse, RpcErrorResponse)).to.be.true
                })

                it("should error to submit an app stake message with a non-numerical amount", async () => {
                    NockUtil.mockRawTx()
                    const pocket = createPocketInstance()

                    // Create the account
                    const passphrase = "1234"
                    const accountOrError = await pocket.createAccount(passphrase)
                    const account = accountOrError as Account

                    // Create the transaction sender
                    const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                    const rawTxResponse = await transactionSender
                        .appStake("ee54d37f8b45b2a185c465463222e287afaa5d3027c7a8c1c3ed554b8b19c502", ["CHAIN1"], "NotANumber")
                        .submit("1234", "0", "mocked-pocket-testnet", testNode, "100", CoinDenom.Pokt, "This is a test!")
                    expect(typeGuard(rawTxResponse, RpcErrorResponse)).to.be.true
                })

                it("should error to submit an app stake message with an empty chains list", async () => {
                    NockUtil.mockRawTx()
                    const pocket = createPocketInstance()

                    // Create the account
                    const passphrase = "1234"
                    const accountOrError = await pocket.createAccount(passphrase)
                    const account = accountOrError as Account

                    // Create the transaction sender
                    const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                    const rawTxResponse = await transactionSender
                        .appStake("ee54d37f8b45b2a185c465463222e287afaa5d3027c7a8c1c3ed554b8b19c502", [], "NotANumber")
                        .submit("1234", "0", "mocked-pocket-testnet", testNode, "100", CoinDenom.Pokt, "This is a test!")
                    expect(typeGuard(rawTxResponse, RpcErrorResponse)).to.be.true
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
                    const accountOrError = await pocket.createAccount(passphrase)
                    const account = accountOrError as Account

                    // Create the transaction sender
                    const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                    let rawTxResponse = await transactionSender
                        .appUnstake("9E8E373FF27EC202F82D07DF64F388FF42F9516D")
                        .submit("1234", "0", "mocked-pocket-testnet", testNode, "100", CoinDenom.Pokt, "This is a test!")
                    expect(typeGuard(rawTxResponse, RpcErrorResponse)).to.be.false
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
                    const accountOrError = await pocket.createAccount(passphrase)
                    const account = accountOrError as Account

                    // Create the transaction sender
                    const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                    const rawTxResponse = await transactionSender
                        .appUnstake("")
                        .submit("1234", "0", "mocked-pocket-testnet", testNode, "100", CoinDenom.Pokt, "This is a test!")
                    expect(typeGuard(rawTxResponse, RpcErrorResponse)).to.be.true
                })

                it("should error to submit an app unstake message given an invalid address", async () => {
                    NockUtil.mockRawTx()
                    const pocket = createPocketInstance()

                    // Create the account
                    const passphrase = "1234"
                    const accountOrError = await pocket.createAccount(passphrase)
                    const account = accountOrError as Account

                    // Create the transaction sender
                    const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                    const rawTxResponse = await transactionSender
                        .appUnstake("9E8E373FF27EC202")
                        .submit("1234", "0", "mocked-pocket-testnet", testNode, "100", CoinDenom.Pokt, "This is a test!")
                    expect(typeGuard(rawTxResponse, RpcErrorResponse)).to.be.true
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
                    const accountOrError = await pocket.createAccount(passphrase)
                    const account = accountOrError as Account

                    // Create the transaction sender
                    const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                    let rawTxResponse = await transactionSender
                        .appUnjail("9E8E373FF27EC202F82D07DF64F388FF42F9516D")
                        .submit("1234", "0", "mocked-pocket-testnet", testNode, "100", CoinDenom.Pokt, "This is a test!")
                    expect(typeGuard(rawTxResponse, RpcErrorResponse)).to.be.false
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
                    const accountOrError = await pocket.createAccount(passphrase)
                    const account = accountOrError as Account

                    // Create the transaction sender
                    const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                    const rawTxResponse = await transactionSender
                        .appUnjail("")
                        .submit("1234", "0", "mocked-pocket-testnet", testNode, "100", CoinDenom.Pokt, "This is a test!")
                    expect(typeGuard(rawTxResponse, RpcErrorResponse)).to.be.true
                })

                it("should error to submit an app unjail message given an invalid address", async () => {
                    NockUtil.mockRawTx()
                    const pocket = createPocketInstance()

                    // Create the account
                    const passphrase = "1234"
                    const accountOrError = await pocket.createAccount(passphrase)
                    const account = accountOrError as Account

                    // Create the transaction sender
                    const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                    const rawTxResponse = await transactionSender
                        .appUnjail("9E8E373FF27EC202")
                        .submit("1234", "0", "mocked-pocket-testnet", testNode, "100", CoinDenom.Pokt, "This is a test!")
                    expect(typeGuard(rawTxResponse, RpcErrorResponse)).to.be.true
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
                    const accountOrError = await pocket.createAccount(passphrase)
                    const account = accountOrError as Account

                    // Create the transaction sender
                    const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                    let rawTxResponse = await transactionSender
                        .nodeStake("ee54d37f8b45b2a185c465463222e287afaa5d3027c7a8c1c3ed554b8b19c502", ["CHAIN1"], "15000", new URL("https://myawesomenode.network"))
                        .submit("1234", "0", "mocked-pocket-testnet", testNode, "100", CoinDenom.Pokt, "This is a test!")
                    expect(typeGuard(rawTxResponse, RpcErrorResponse)).to.be.false
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
                    const accountOrError = await pocket.createAccount(passphrase)
                    const account = accountOrError as Account

                    // Create the transaction sender
                    const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                    const rawTxResponse = await transactionSender
                        .nodeStake("ee54d37f8b45b2a185c465463222e287afaa5d3027c7a8c1c3ed554b8b19c502", ["CHAIN1"], "", new URL("https://myawesomenode.network"))
                        .submit("1234", "0", "mocked-pocket-testnet", testNode, "100", CoinDenom.Pokt, "This is a test!")
                    expect(typeGuard(rawTxResponse, RpcErrorResponse)).to.be.true
                })

                it("should error to submit an node stake message with a non-numerical amount", async () => {
                    NockUtil.mockRawTx()
                    const pocket = createPocketInstance()

                    // Create the account
                    const passphrase = "1234"
                    const accountOrError = await pocket.createAccount(passphrase)
                    const account = accountOrError as Account

                    // Create the transaction sender
                    const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                    const rawTxResponse = await transactionSender
                        .nodeStake("ee54d37f8b45b2a185c465463222e287afaa5d3027c7a8c1c3ed554b8b19c502", ["CHAIN1"], "NotANumber", new URL("https://myawesomenode.network"))
                        .submit("1234", "0", "mocked-pocket-testnet", testNode, "100", CoinDenom.Pokt, "This is a test!")
                    expect(typeGuard(rawTxResponse, RpcErrorResponse)).to.be.true
                })

                it("should error to submit an node stake message with an empty chains list", async () => {
                    NockUtil.mockRawTx()
                    const pocket = createPocketInstance()

                    // Create the account
                    const passphrase = "1234"
                    const accountOrError = await pocket.createAccount(passphrase)
                    const account = accountOrError as Account

                    // Create the transaction sender
                    const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                    const rawTxResponse = await transactionSender
                        .nodeStake("ee54d37f8b45b2a185c465463222e287afaa5d3027c7a8c1c3ed554b8b19c502", [], "NotANumber", new URL("https://myawesomenode.network"))
                        .submit("1234", "0", "mocked-pocket-testnet", testNode, "100", CoinDenom.Pokt, "This is a test!")
                    expect(typeGuard(rawTxResponse, RpcErrorResponse)).to.be.true
                })

                it("should error to submit an node stake message with a non-https URL", async () => {
                    NockUtil.mockRawTx()
                    const pocket = createPocketInstance()

                    // Create the account
                    const passphrase = "1234"
                    const accountOrError = await pocket.createAccount(passphrase)
                    const account = accountOrError as Account

                    // Create the transaction sender
                    const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                    const rawTxResponse = await transactionSender
                        .nodeStake("ee54d37f8b45b2a185c465463222e287afaa5d3027c7a8c1c3ed554b8b19c502", [], "NotANumber", new URL("http://myawesomenode.network"))
                        .submit("1234", "0", "mocked-pocket-testnet", testNode, "100", CoinDenom.Pokt, "This is a test!")
                    expect(typeGuard(rawTxResponse, RpcErrorResponse)).to.be.true
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
                    const accountOrError = await pocket.createAccount(passphrase)
                    const account = accountOrError as Account

                    // Create the transaction sender
                    const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                    let rawTxResponse = await transactionSender
                        .nodeUnstake("9E8E373FF27EC202F82D07DF64F388FF42F9516D")
                        .submit("1234", "0", "mocked-pocket-testnet", testNode, "100", CoinDenom.Pokt, "This is a test!")
                    expect(typeGuard(rawTxResponse, RpcErrorResponse)).to.be.false
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
                    const accountOrError = await pocket.createAccount(passphrase)
                    const account = accountOrError as Account

                    // Create the transaction sender
                    const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                    const rawTxResponse = await transactionSender
                        .nodeUnstake("")
                        .submit("1234", "0", "mocked-pocket-testnet", testNode, "100", CoinDenom.Pokt, "This is a test!")
                    expect(typeGuard(rawTxResponse, RpcErrorResponse)).to.be.true
                })

                it("should error to submit an node unstake message given an invalid address", async () => {
                    NockUtil.mockRawTx()
                    const pocket = createPocketInstance()

                    // Create the account
                    const passphrase = "1234"
                    const accountOrError = await pocket.createAccount(passphrase)
                    const account = accountOrError as Account

                    // Create the transaction sender
                    const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                    const rawTxResponse = await transactionSender
                        .nodeUnstake("9E8E373FF27EC202")
                        .submit("1234", "0", "mocked-pocket-testnet", testNode, "100", CoinDenom.Pokt, "This is a test!")
                    expect(typeGuard(rawTxResponse, RpcErrorResponse)).to.be.true
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
                    const accountOrError = await pocket.createAccount(passphrase)
                    const account = accountOrError as Account

                    // Create the transaction sender
                    const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                    let rawTxResponse = await transactionSender
                        .nodeUnjail("9E8E373FF27EC202F82D07DF64F388FF42F9516D")
                        .submit("1234", "0", "mocked-pocket-testnet", testNode, "100", CoinDenom.Pokt, "This is a test!")
                    expect(typeGuard(rawTxResponse, RpcErrorResponse)).to.be.false
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
                    const accountOrError = await pocket.createAccount(passphrase)
                    const account = accountOrError as Account

                    // Create the transaction sender
                    const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                    const rawTxResponse = await transactionSender
                        .nodeUnjail("")
                        .submit("1234", "0", "mocked-pocket-testnet", testNode, "100", CoinDenom.Pokt, "This is a test!")
                    expect(typeGuard(rawTxResponse, RpcErrorResponse)).to.be.true
                })

                it("should error to submit an node unjail message given an invalid address", async () => {
                    NockUtil.mockRawTx()
                    const pocket = createPocketInstance()

                    // Create the account
                    const passphrase = "1234"
                    const accountOrError = await pocket.createAccount(passphrase)
                    const account = accountOrError as Account

                    // Create the transaction sender
                    const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
                    const rawTxResponse = await transactionSender
                        .nodeUnjail("9E8E373FF27EC202")
                        .submit("1234", "0", "mocked-pocket-testnet", testNode, "100", CoinDenom.Pokt, "This is a test!")
                    expect(typeGuard(rawTxResponse, RpcErrorResponse)).to.be.true
                })
            })
        })
    })
})