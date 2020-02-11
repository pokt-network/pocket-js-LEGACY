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

// // Instances
// const node01 = new Node(addressHex, applicationPublicKey, false, BondStatus.bonded, BigInt(100), env.getPOKTRPC(), blockchains)
// const configuration = new Configuration([node01], 5, 40000, 200)
// const rpcProvider = new HttpRpcProvider(new URL(node01.serviceURL))


// const nodeJSON = "{\"address\":\"b5f68f97bcd6e5c749723150a509d98d7ae766b4\",\"public_key\":\"e9c04dfc08514377ddeb4d7451137a7ce11a0ab6ae4f86a51d6677667072530a\",\"jailed\":false,\"status\":2,\"tokens\":\"1000000000\",\"service_url\":\"http:\/\/35.236.203.13:8081\",\"chains\":[\"6d3ce011e06e27a74cfa7d774228c52597ef5ef26f4a4afa9ad3cebefb5f3ca8\",\"49aff8a9f51b268f6fc485ec14fb08466c3ec68c8d86d9b5810ad80546b65f29\"],\"unstaking_time\":\"0001-01-01T00:00:00Z\"}"

// Pocket instance requirements
const dispatchNodeJSON = "{\"address\":\"189ceb72c06b99e15a53fd437b81d4500f7a01f1\",\"public_key\":\"1839f4836f22d438692355b2ee34e47d396f6eb23b423bf3a1e623137ddbf7e3\",\"jailed\":false,\"status\":2,\"tokens\":\"1000000000\",\"service_url\":\"http:\/\/35.245.90.148:8081\",\"chains\":[\"6d3ce011e06e27a74cfa7d774228c52597ef5ef26f4a4afa9ad3cebefb5f3ca8\",\"49aff8a9f51b268f6fc485ec14fb08466c3ec68c8d86d9b5810ad80546b65f29\"],\"unstaking_time\":\"0001-01-01T00:00:00Z\"}"
const dispatchNode = Node.fromJSON(dispatchNodeJSON)
const configuration = new Configuration([dispatchNode], 5, 60000, 1000000)
const rpcProvider = new HttpRpcProvider(new URL(dispatchNode.serviceURL))

// Relay requirements
const appPubKeyHex = "d3814cf87d0d0b249dc9727d2e124a03cbb4d23e37c169833ef88562546f0958"
const appPrivKeyHex = "2dec343f5d225be87663194f5ce61611ee585ab68baf1046694b0045124bd1a5d3814cf87d0d0b249dc9727d2e124a03cbb4d23e37c169833ef88562546f0958"

describe("Pocket Interface functionalities", async () => {
    it('should instantiate a Pocket instance due to a valid configuration is being used', () => {
        try {
            const pocket = new Pocket(configuration, rpcProvider)
            expect(typeGuard(pocket, Pocket)).to.be.true
        } catch (error) {
            assert.fail()
        }
    }).timeout(0)

    describe("Relay functionality", () => {
        describe("Success scenarios", () => {
            it("should send a relay given the correct parameters", async () => {
                const pocket = new Pocket(configuration, rpcProvider)
                // Generate client account
                const clientPassphrase = "1234"
                const clientAccountOrError = await pocket.keybase.createAccount(clientPassphrase)
                expect(typeGuard(clientAccountOrError, Error)).to.be.false
                const clientAccount = clientAccountOrError as Account
                const error = await pocket.keybase.unlockAccount(clientAccount.addressHex, clientPassphrase, 0)
                expect(error).to.be.undefined
                // Generate AAT
                const aat = PocketAAT.from("0.0.1", clientAccount.publicKey.toString("hex"), appPubKeyHex, appPrivKeyHex)
                const blockchain = "49aff8a9f51b268f6fc485ec14fb08466c3ec68c8d86d9b5810ad80546b65f29"
                // Let's submit a relay!
                const relayData = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f\",\"latest\"],\"id\":67}'
                const relayResponse = await pocket.sendRelay(relayData, blockchain, aat, undefined, undefined, undefined, undefined)
                expect(typeGuard(relayResponse, RelayResponse)).to.be.true
            })

            it("should send multiple relays for different clients given the correct parameters", async () => {
                const pocket = new Pocket(configuration, rpcProvider)
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
                    const blockchain = "49aff8a9f51b268f6fc485ec14fb08466c3ec68c8d86d9b5810ad80546b65f29"
                    // Let's submit a relay!
                    const relayData = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f\",\"latest\"],\"id\":67}'
                    const relayResponse = await pocket.sendRelay(relayData, blockchain, aat, undefined, undefined, undefined, undefined)
                    expect(typeGuard(relayResponse, RelayResponse)).to.be.true
                }
            })
        })
    })
})
