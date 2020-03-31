/**
 * @author Pabel Nunez Landestoy <pabel@pokt.network>
 * @description Unit test for the Pocket Core
 */
// Constants
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

// // For Testing we are using dummy data, none of the following information is real.
// const addressHex = "4930289621AEFBF9252C91C4C729B7F685E44C4B"
// const applicationPublicKey = 'f62f77db69d448c1b56f3540c633f294d23ccdaf002bf6b376d058a00b51cfaa'
// const ethBlockchain = "36f028580bb02cc8272a9a020f4200e346e276ae664e45ee80745574e2f5ab80"
// const blockchains = [ethBlockchain]
// /** Specify the environment using using EnvironmentHelper.getLocalNet()
//  * LocalNet will run the tests againt's nock which have a set of responses mocked.abs
//  * TestNet will run the tests with the TestNet Network.
//  * MainNet will run the tests with the MainNet Network (not available).
//  * 
//  * Note: Can be done also using the Network enum (LocalNet,TestNet and MainNet)
//  * EnvironmentHelper.get(Network.LocalNet)
//  */
const env = EnvironmentHelper.getLocalNet()

// Pocket instance requirements
const dispatchURL = new URL("http://35.245.7.53:8081")
const configuration = new Configuration(5, 1000, 5, 40000)
const rpcProvider = new HttpRpcProvider(dispatchURL)

// Relay requirements
// const appPubKeyHex = "25e433add38bee8bf9d5236267f6c9b8f3d224a0f164f142c351f441792f2b2e"
// const appPrivKeyHex = "640d19b8bfb1cd70fe565ead88e705beaab34fe18fb0879d32539ebfe5ba511725e433add38bee8bf9d5236267f6c9b8f3d224a0f164f142c351f441792f2b2e"
const appPubKeyHex = "73f765cb848f9d40aa9a16a3726f1ec5703f77bad22b2487cd4baaaf777f6e90"
const appPrivKeyHex = "dfd4ae8742a5d07f1e59fc5b41b5f7d04f026c14ce2c273e0da0e8d2f36df79273f765cb848f9d40aa9a16a3726f1ec5703f77bad22b2487cd4baaaf777f6e90"
const blockchain = "8cf7f8799c5b30d36c86d18f0f4ca041cf1803e0414ed9e9fd3a19ba2f0938ff"

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
                const aat = PocketAAT.from("0.0.1", clientAccount.publicKey.toString("hex"), appPubKeyHex, appPrivKeyHex)
                // Let's submit a relay!
                const relayData = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f\",\"latest\"],\"id\":67}'
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
                    const aat = PocketAAT.from("0.0.1", clientAccount.publicKey.toString("hex"), appPubKeyHex, appPrivKeyHex)
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
                const aat = PocketAAT.from("0.0.1", clientAccount.publicKey.toString("hex"), appPubKeyHex, appPrivKeyHex)
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
                const aat = PocketAAT.from("0.0.1", clientAccount.publicKey.toString("hex"), appPubKeyHex, appPrivKeyHex)
                // Let's submit a consensus relay!
                const relayData = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f\",\"latest\"],\"id\":67}'
                NockUtil.mockDispatchForConsensus()
                NockUtil.mockRelayForConsensus()
                NockUtil.mockRelayForConsensus()
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
                const aat = PocketAAT.from("0.0.1", clientAccount.publicKey.toString("hex"), appPubKeyHex, appPrivKeyHex)
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
                expect(function(){
                    new Configuration(5, 1000, 4, 40000, false)
                }).to.throw("Failed to instantiate a Configuration class object due to consensusNodeCount not being an odd number.")
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
                const aat = PocketAAT.from("0.0.1", clientAccount.publicKey.toString("hex"), appPubKeyHex, appPrivKeyHex)
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
                const aat = PocketAAT.from("0.0.1", clientAccount.publicKey.toString("hex"), appPubKeyHex, appPrivKeyHex)
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
                const aat = PocketAAT.from("0.0.1", clientAccount.publicKey.toString("hex"), appPubKeyHex, appPrivKeyHex)
                // Let's submit a consensus relay!
                const relayData = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f\",\"latest\"],\"id\":67}'
                NockUtil.mockDispatchForConsensus()
                const relayResponse = await pocket.sendConsensusRelay(relayData, blockchain, aat)
                expect(typeGuard(relayResponse, Error)).to.be.true
            })
        })
    })
})