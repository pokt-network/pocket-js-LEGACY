/**
 * @author Pabel Nunez Landestoy <pabel@pokt.network>
 * @description Unit test for the Pocket Core
 */
// Constants
import * as dotenv from "dotenv"
import { expect, assert } from 'chai'
import {
    Configuration,
    HttpRpcProvider,
    Pocket,
    typeGuard,
    Account,
    PocketAAT,
    ConsensusRelayResponse,
    ChallengeResponse,
    RelayResponse
} from '../../../src'
import { EnvironmentHelper } from '../../utils/env'
import { NockUtil } from '../../utils/nock-util'

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
// Pocket instance requirements
const dispatchURL = new URL(env.getPOKTRPC())
const configuration = new Configuration(5, 1000, 5, 40000)
const rpcProvider = new HttpRpcProvider(dispatchURL)

// Relay requirements
const appPubKeyHex = "3895f3a84afb824d7e2e63c5042a93ccdb13e0f891d5d61d10289df50d6c251d"
const appPrivKeyHex = "7ae62c4d807a85fb5e60ffd80d30b3132b836fd3506cc0d4cef87d9dd118db0d3895f3a84afb824d7e2e63c5042a93ccdb13e0f891d5d61d10289df50d6c251d"
const blockchain = "0022"

describe("Pocket Interface functionalities", async () => {
    it('should instantiate a Pocket instance due to a valid configuration is being used', () => {
        try {
            const pocket = new Pocket([dispatchURL], rpcProvider, configuration)
            expect(typeGuard(pocket, Pocket)).to.be.true
        } catch (error) {
            assert.fail()
        }
    }).timeout(0)

    describe("Relay functionality", () => {
        describe("Success scenarios", () => {
            it("should send a relay given the correct parameters", async () => {
                const pocket = new Pocket([dispatchURL], rpcProvider, configuration)
                // Generate client account
                const clientPassphrase = "1234"
                const clientAccountOrError = await pocket.keybase.createAccount(clientPassphrase)
                expect(typeGuard(clientAccountOrError, Error)).to.be.false
                const clientAccount = clientAccountOrError as Account
                const error = await pocket.keybase.unlockAccount(clientAccount.addressHex, clientPassphrase, 0)
                expect(error).to.be.undefined
                // Generate AAT
                const aat = await PocketAAT.from("0.0.1", clientAccount.publicKey.toString("hex"), appPubKeyHex, appPrivKeyHex)
                // Let's submit a relay!
                const relayData = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0x050ea4ab4183E41129B7D72A492DaBf52B27EdB5\",\"latest\"],\"id\":67}'
                const relayResponse = await pocket.sendRelay(relayData, blockchain, aat)
                expect(typeGuard(relayResponse, RelayResponse)).to.be.true
            })

            it("should send and validate a relay given the correct parameters", async () => {
                // In this test, we set the configuration flag for 'validateRelayResponses' to true.
                // The relay response will validate with the relay request 
                const config = new Configuration(5, 1000, 5, 40000, false, undefined, undefined, undefined, true)
                const pocket = new Pocket([dispatchURL], rpcProvider, config)
                // Generate client account
                const clientPassphrase = "1234"
                const clientAccountOrError = await pocket.keybase.createAccount(clientPassphrase)
                expect(typeGuard(clientAccountOrError, Error)).to.be.false
                const clientAccount = clientAccountOrError as Account
                const error = await pocket.keybase.unlockAccount(clientAccount.addressHex, clientPassphrase, 0)
                expect(error).to.be.undefined
                // Generate AAT
                const aat = await PocketAAT.from("0.0.1", clientAccount.publicKey.toString("hex"), appPubKeyHex, appPrivKeyHex)
                // Let's submit a relay!
                const relayData = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0x050ea4ab4183E41129B7D72A492DaBf52B27EdB5\",\"latest\"],\"id\":67}'
                const relayResponse = await pocket.sendRelay(relayData, blockchain, aat)
                expect(typeGuard(relayResponse, RelayResponse)).to.be.true
            })

            it("should send multiple relays for different clients given the correct parameters", async () => {
                const pocket = new Pocket([dispatchURL], rpcProvider, configuration)
                for (let i = 0; i < 10; i++) {
                    // Generate client account
                    const clientPassphrase = "1234"
                    const clientAccountOrError = await pocket.keybase.createAccount(clientPassphrase)
                    expect(typeGuard(clientAccountOrError, Error)).to.be.false
                    const clientAccount = clientAccountOrError as Account
                    const error = await pocket.keybase.unlockAccount(clientAccount.addressHex, clientPassphrase, 0)
                    expect(error).to.be.undefined
                    // Generate AAT
                    const aat = await PocketAAT.from("0.0.1", clientAccount.publicKey.toString("hex"), appPubKeyHex, appPrivKeyHex)
                    // Let's submit a relay!   
                    const relayData = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f\",\"latest\"],\"id\":67}'
                    const relayResponse = await pocket.sendRelay(relayData, blockchain, aat)
                    expect(typeGuard(relayResponse, RelayResponse)).to.be.true
                }
            })

            it("should send a consensus relay given the correct parameters", async () => {
                // We use a different configuration in which we especify that we want 3 consensus nodes,
                // meaning the relay will be sent to 3 different nodes and the result will be compare
                const config = new Configuration(5, 1000, 3, 40000, false)
                const pocket = new Pocket([dispatchURL], rpcProvider, config)
                // Generate client account
                const clientPassphrase = "1234"
                const clientAccountOrError = await pocket.keybase.createAccount(clientPassphrase)
                expect(typeGuard(clientAccountOrError, Error)).to.be.false
                const clientAccount = clientAccountOrError as Account
                const error = await pocket.keybase.unlockAccount(clientAccount.addressHex, clientPassphrase, 0)
                expect(error).to.be.undefined
                // Generate AAT
                const aat = await PocketAAT.from("0.0.1", clientAccount.publicKey.toString("hex"), appPubKeyHex, appPrivKeyHex)
                // Let's submit a consensus relay!
                const relayData = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f\",\"latest\"],\"id\":67}'
                const consensusRelayRespone = await pocket.sendConsensusRelay(relayData, blockchain, aat)
                expect(typeGuard(consensusRelayRespone, ConsensusRelayResponse)).to.be.true
            })

            it("should send a consensus relay given the correct parameters and accept a disputed response", async () => {
                // We use a different configuration in which we especify that we want 3 consensus nodes,
                // meaning the relay will be sent to 3 different nodes and the result will be compare

                // For this scenario we are looking to accept disputed responses, adding true to the configuration initializer
                const config = new Configuration(5, 1000, 3, 40000, true)
                const nockDispatchUrl = new URL(env.getPOKTRPC())
                const nockRpcProvider = new HttpRpcProvider(nockDispatchUrl)
                const pocket = new Pocket([nockDispatchUrl], nockRpcProvider, config)
                // Generate client account
                const clientPassphrase = "1234"
                const clientAccountOrError = await pocket.keybase.createAccount(clientPassphrase)
                expect(typeGuard(clientAccountOrError, Error)).to.be.false
                const clientAccount = clientAccountOrError as Account
                const error = await pocket.keybase.unlockAccount(clientAccount.addressHex, clientPassphrase, 0)
                expect(error).to.be.undefined
                // Generate AAT
                const aat = await PocketAAT.from("0.0.1", clientAccount.publicKey.toString("hex"), appPubKeyHex, appPrivKeyHex)
                // Let's submit a consensus relay!
                const relayData = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f\",\"latest\"],\"id\":67}'
                NockUtil.mockDispatchForConsensus()
                NockUtil.mockRelayForConsensus()
                NockUtil.mockRelayForConsensusFailure()
                NockUtil.mockRelayForConsensusFailure()
                const relayResponse = await pocket.sendConsensusRelay(relayData, blockchain, aat)
                expect(typeGuard(relayResponse, ConsensusRelayResponse)).to.be.true
            })

            it("should send consensus relay and fail the consensus which will trigger a challenge request", async () => {
                // We use a different configuration in which we especify that we want 3 consensus nodes,
                // meaning the relay will be sent to 3 different nodes and the result will be compare

                // For this scenario the consensus fails which will send a challenge request tx, for the nodes that are returning a bad response
                const config = new Configuration(5, 1000, 5, 40000, false)
                const nockDispatchUrl = new URL(env.getPOKTRPC())
                const nockRpcProvider = new HttpRpcProvider(nockDispatchUrl)
                const pocket = new Pocket([nockDispatchUrl], nockRpcProvider, config)
                // Generate client account
                const clientPassphrase = "1234"
                const clientAccountOrError = await pocket.keybase.createAccount(clientPassphrase)
                expect(typeGuard(clientAccountOrError, Error)).to.be.false
                const clientAccount = clientAccountOrError as Account
                const error = await pocket.keybase.unlockAccount(clientAccount.addressHex, clientPassphrase, 0)
                expect(error).to.be.undefined
                // Generate AAT
                const aat = await PocketAAT.from("0.0.1", clientAccount.publicKey.toString("hex"), appPubKeyHex, appPrivKeyHex)
                // Let's submit a consensus relay!
                const relayData = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f\",\"latest\"],\"id\":67}'
                NockUtil.mockDispatchForConsensus()
                NockUtil.mockRelayForConsensus()
                NockUtil.mockRelayForConsensusFailure()
                NockUtil.mockRelayForConsensusFailure()
                NockUtil.mockRelayForConsensusFailure()
                NockUtil.mockRelayForConsensusFailure()
                NockUtil.mockChallenge()
                const relayResponse = await pocket.sendConsensusRelay(relayData, blockchain, aat)
                expect(typeGuard(relayResponse, ChallengeResponse)).to.be.true
            })
        })
        describe("Failure scenarios", () => {

            it("should fail to instantiate a Configuration class due to consensusNodeCount NOT being an odd number", async () => {
                expect(function () {
                    new Configuration(5, 1000, 4, 40000, false)
                }).to.throw("Failed to instantiate a Configuration class object due to consensusNodeCount not being an odd number.")
            })

            it("should send and fail to validate a relay", async () => {
                // In this test, we set the configuration flag for 'validateRelayResponses' to false.
                // The relay response will validate with the relay request and fail
                const config = new Configuration(5, 1000, 5, 40000, false, undefined, undefined, undefined, true)
                const pocket = new Pocket([dispatchURL], rpcProvider, config)
                // Generate client account
                const clientPassphrase = "1234"
                const clientAccountOrError = await pocket.keybase.createAccount(clientPassphrase)
                expect(typeGuard(clientAccountOrError, Error)).to.be.false
                const clientAccount = clientAccountOrError as Account
                const error = await pocket.keybase.unlockAccount(clientAccount.addressHex, clientPassphrase, 0)
                expect(error).to.be.undefined
                // Generate AAT
                const aat = await PocketAAT.from("0.0.1", clientAccount.publicKey.toString("hex"), appPubKeyHex, appPrivKeyHex)
                // Let's submit a relay!
                const relayData = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0x050ea4ab4183E41129B7D72A492DaBf52B27EdB5\",\"latest\"],\"id\":67}'
                const relayResponse = await pocket.sendRelay(relayData, blockchain, aat)
                expect(typeGuard(relayResponse, RelayResponse)).to.be.true
            })

            it("should fail to instantiate a Configuration class due to consensusNodeCount NOT being set", async () => {
                // We use a different configuration in which we especify that we want 3 consensus nodes,
                // meaning the relay will be sent to 3 different nodes and the result will be compare

                // For this scenario the consensus fails due to not setting up the consensusNodeCount value in the configuration
                const config = new Configuration(5, 1000, undefined, 40000, false)
                const nockDispatchUrl = new URL(env.getPOKTRPC())
                const nockRpcProvider = new HttpRpcProvider(nockDispatchUrl)
                const pocket = new Pocket([nockDispatchUrl], nockRpcProvider, config)
                // Generate client account
                const clientPassphrase = "1234"
                const clientAccountOrError = await pocket.keybase.createAccount(clientPassphrase)
                expect(typeGuard(clientAccountOrError, Error)).to.be.false
                const clientAccount = clientAccountOrError as Account
                const error = await pocket.keybase.unlockAccount(clientAccount.addressHex, clientPassphrase, 0)
                expect(error).to.be.undefined
                // Generate AAT
                const aat = await PocketAAT.from("0.0.1", clientAccount.publicKey.toString("hex"), appPubKeyHex, appPrivKeyHex)
                // Let's submit a consensus relay!
                const relayData = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f\",\"latest\"],\"id\":67}'
                NockUtil.mockDispatchForConsensus()
                const relayResponse = await pocket.sendConsensusRelay(relayData, blockchain, aat)
                expect(typeGuard(relayResponse, Error)).to.be.true
            })

            it("should fail to send consensus relay due to consensusNodeCount being higher than the nodes in session", async () => {
                // We use a different configuration in which we especify that we want 3 consensus nodes,
                // meaning the relay will be sent to 3 different nodes and the result will be compare

                // For this scenario the consensus fails due to adding the consensusNodeCount value to the configuration using (7)
                const config = new Configuration(5, 1000, 7, 40000, false)
                const nockDispatchUrl = new URL(env.getPOKTRPC())
                const nockRpcProvider = new HttpRpcProvider(nockDispatchUrl)
                const pocket = new Pocket([nockDispatchUrl], nockRpcProvider, config)
                // Generate client account
                const clientPassphrase = "1234"
                const clientAccountOrError = await pocket.keybase.createAccount(clientPassphrase)
                expect(typeGuard(clientAccountOrError, Error)).to.be.false
                const clientAccount = clientAccountOrError as Account
                const error = await pocket.keybase.unlockAccount(clientAccount.addressHex, clientPassphrase, 0)
                expect(error).to.be.undefined
                // Generate AAT
                const aat = await PocketAAT.from("0.0.1", clientAccount.publicKey.toString("hex"), appPubKeyHex, appPrivKeyHex)
                // Let's submit a consensus relay!
                const relayData = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f\",\"latest\"],\"id\":67}'
                NockUtil.mockDispatchForConsensus()
                const relayResponse = await pocket.sendConsensusRelay(relayData, blockchain, aat)
                expect(typeGuard(relayResponse, Error)).to.be.true
            })

            it("should fail to send consensus relay due to consensusNodeCount being higher than the nodes in session", async () => {
                // We use a different configuration in which we especify that we want 3 consensus nodes,
                // meaning the relay will be sent to 3 different nodes and the result will be compare

                // For this scenario the consensus fails due to adding the consensusNodeCount value to the configuration using (undefined)
                const config = new Configuration(5, 1000, 7, 40000, false)
                const nockDispatchUrl = new URL(env.getPOKTRPC())
                const nockRpcProvider = new HttpRpcProvider(nockDispatchUrl)
                const pocket = new Pocket([nockDispatchUrl], nockRpcProvider, config)
                // Generate client account
                const clientPassphrase = "1234"
                const clientAccountOrError = await pocket.keybase.createAccount(clientPassphrase)
                expect(typeGuard(clientAccountOrError, Error)).to.be.false
                const clientAccount = clientAccountOrError as Account
                const error = await pocket.keybase.unlockAccount(clientAccount.addressHex, clientPassphrase, 0)
                expect(error).to.be.undefined
                // Generate AAT
                const aat = await PocketAAT.from("0.0.1", clientAccount.publicKey.toString("hex"), appPubKeyHex, appPrivKeyHex)
                // Let's submit a consensus relay!
                const relayData = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f\",\"latest\"],\"id\":67}'
                NockUtil.mockDispatchForConsensus()
                const relayResponse = await pocket.sendConsensusRelay(relayData, blockchain, aat)
                expect(typeGuard(relayResponse, Error)).to.be.true
            })
        })
    })
})