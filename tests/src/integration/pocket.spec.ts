/**
 * @author Pabel Nunez Landestoy <pabel@pokt.network>
 * @description Unit test for the Pocket Core
 */
// Constants
import { expect, assert } from 'chai'
import { Node, BondStatus, Configuration, HttpRpcProvider, Pocket, typeGuard, Account, PocketAAT, Session, RelayResponse } from '../../../src'
import { EnvironmentHelper } from '../../utils/env'

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
// const env = EnvironmentHelper.getLocalNet()

// Pocket instance requirements
const dispatchURL = new URL("http://node9.testnet.pokt.network:8081")
const configuration = new Configuration(5, 60000, 1000000)
const rpcProvider = new HttpRpcProvider(dispatchURL)

// Relay requirements
const appPubKeyHex = "25e433add38bee8bf9d5236267f6c9b8f3d224a0f164f142c351f441792f2b2e"
const appPrivKeyHex = "640d19b8bfb1cd70fe565ead88e705beaab34fe18fb0879d32539ebfe5ba511725e433add38bee8bf9d5236267f6c9b8f3d224a0f164f142c351f441792f2b2e"
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
                const relayResponse = await pocket.sendRelay(relayData, blockchain, aat, undefined, undefined, undefined, undefined)
                expect(typeGuard(relayResponse, RelayResponse)).to.be.true
            })

            it("should send multiple relays for different clients given the correct parameters", async () => {
                const pocket = new Pocket([dispatchURL], rpcProvider, configuration)
                for (let i = 0; i < 15; i++) {
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
        })
    })
})