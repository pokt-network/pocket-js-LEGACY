import { expect } from 'chai'
import { typeGuard } from "@pokt-network/pocket-js-utils"
import { NockUtil } from "@pokt-network/pocket-js-nock-utils"
import { Relayer } from "../../../src/relayer"
import { Account } from "@pokt-network/pocket-js-keybase"
import { RelayResponse } from '@pokt-network/pocket-js-relay-models'
import { PocketAAT } from "@pokt-network/aat-js"
import 'mocha';
import { Configuration } from '@pokt-network/pocket-js-configuration'
import { ChallengeResponse, ConsensusRelayResponse, Session } from '@pokt-network/pocket-js-rpc-models'
import { SessionHeader, Node } from '@pokt-network/pocket-js-rpc-models'


const dispatcherUrl = new URL("http://localhost:8081")

// Relay requirements
const appPubKeyHex = "437ae2e7902b8b5ee8ce1735e416e1455d3eb05b23cfa6c54f49329c61c72a80"
const appPrivKeyHex = "60eb765a844b21c9207b91a96f89ceb03a69f88b4f6dafd26af230ed482307ff437ae2e7902b8b5ee8ce1735e416e1455d3eb05b23cfa6c54f49329c61c72a80"
const clientPrivKeyHex = "5116d5b34e96607f7b76e6bb7828927ec3539201c70bc241ec7da186861f7ec4a6588933478b72c6e0639fcbee7039e0ff28e323d712e69f269aa519fce93b61"
const blockchain = "0022"

type MutableSession = {
    -readonly [K in keyof Session]: Session[K] 
}

describe("Relayer", function () {
    describe("Success scenarios", function () {
        it("Should send a relay", async () => {
            const relayer = new Relayer([dispatcherUrl])

            // Generate client account
            const clientPassphrase = "1234"
            const clientAccountOrError = await relayer.keybase.importAccount(Buffer.from(clientPrivKeyHex, "hex"), clientPassphrase)
            expect(typeGuard(clientAccountOrError, Error)).to.be.false
            const clientAccount = clientAccountOrError as Account
            const error = await relayer.keybase.unlockAccount(clientAccount.addressHex, clientPassphrase, 0)
            expect(error).to.be.undefined

            // Generate AAT
            const aat = await PocketAAT.from("0.0.1", clientAccount.publicKey.toString("hex"), appPubKeyHex, appPrivKeyHex)
            // Relay data
            const relayData = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0x050ea4ab4183E41129B7D72A492DaBf52B27EdB5\",\"latest\"],\"id\":67}'
            // Nock
            NockUtil.mockDispatch()
            NockUtil.mockRelayResponse()
            // Let's submit a relay!
            const relayOrError = await relayer.send(relayData, blockchain, aat)

            expect(typeGuard(relayOrError, RelayResponse)).to.be.true
        }) 

        it("should send and validate a relay given the correct parameters", async () => {
            // In this test, we set the configuration flag for 'validateRelayResponses' to true.
            // The relay response will validate with the relay request 
            const config = new Configuration(5, 1000, 5, 40000, false, undefined, undefined, true)
            const relayer = new Relayer([dispatcherUrl], config)
            // Generate client account
            const clientPassphrase = "1234"
            const clientAccountOrError = await relayer.keybase.createAccount(clientPassphrase)
            expect(typeGuard(clientAccountOrError, Error)).to.be.false
            const clientAccount = clientAccountOrError as Account
            const error = await relayer.keybase.unlockAccount(clientAccount.addressHex, clientPassphrase, 0)
            expect(error).to.be.undefined
            // Generate AAT
            const aat = await PocketAAT.from("0.0.1", clientAccount.publicKey.toString("hex"), appPubKeyHex, appPrivKeyHex)
            // Let's submit a relay!
            const relayData = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0x050ea4ab4183E41129B7D72A492DaBf52B27EdB5\",\"latest\"],\"id\":67}'
            // Nock
            NockUtil.mockDispatch()
            NockUtil.mockRelayResponse()
            const relayResponse = await relayer.send(relayData, blockchain, aat)
            expect(typeGuard(relayResponse, RelayResponse)).to.be.true
        })

        
        it("should send a relay with an outdated session and retry the relay after receiving a new session", async () => {
            const config = new Configuration(5, 1000, 5, 40000, false, undefined, undefined, undefined, true)
            const relayer = new Relayer([dispatcherUrl], config)
            // Generate client account
            const clientPassphrase = "1234"
            const clientAccountOrError = await relayer.keybase.createAccount(clientPassphrase)
            expect(typeGuard(clientAccountOrError, Error)).to.be.false
            const clientAccount = clientAccountOrError as Account
            const error = await relayer.keybase.unlockAccount(clientAccount.addressHex, clientPassphrase, 0)
            expect(error).to.be.undefined
            // Generate AAT
            const aat = await PocketAAT.from("0.0.1", clientAccount.publicKey.toString("hex"), appPubKeyHex, appPrivKeyHex)
            // Nock
            NockUtil.mockDispatch()
            // Request a session
            const currentSessionOrError = await relayer.sessionManager.requestNewSession(aat, blockchain, config)
            expect(typeGuard(currentSessionOrError, Session)).to.be.true
            const currentSession = currentSessionOrError as Session
            const mutableSession: MutableSession = currentSession
            const oldSessionHeader = mutableSession.sessionHeader.toJSON()
            const newSessionHeader = new SessionHeader(oldSessionHeader.app_public_key, oldSessionHeader.chain, BigInt(1))
            mutableSession.sessionHeader = newSessionHeader
            relayer.sessionManager.destroySession(aat, blockchain)
            relayer.sessionManager.saveSession(relayer.sessionManager.getSessionKey(aat, blockchain), mutableSession, config)
            // Let's submit a relay!
            const relayData = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0x050ea4ab4183E41129B7D72A492DaBf52B27EdB5\",\"latest\"],\"id\":67}'
            // Nock
            NockUtil.mockDispatch()
            NockUtil.mockRelayResponse()
            const relayResponse = await relayer.send(relayData, blockchain, aat)
            expect(typeGuard(relayResponse, RelayResponse)).to.be.true
        })


        it("should send multiple relays for different clients given the correct parameters", async () => {
            const relayer = new Relayer([dispatcherUrl])
            const relayResponses: RelayResponse[] = []

            for (let i = 0; i < 10; i++) {
                // Generate client account
                const clientPassphrase = "1234"
                const clientAccountOrError = await relayer.keybase.createAccount(clientPassphrase)
                expect(typeGuard(clientAccountOrError, Error)).to.be.false
                const clientAccount = clientAccountOrError as Account
                const error = await relayer.keybase.unlockAccount(clientAccount.addressHex, clientPassphrase, 0)
                expect(error).to.be.undefined
                // Generate AAT
                const aat = await PocketAAT.from("0.0.1", clientAccount.publicKey.toString("hex"), appPubKeyHex, appPrivKeyHex)
                // Let's submit a relay!   
                const relayData = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f\",\"latest\"],\"id\":67}'
                // Nock
                NockUtil.mockDispatch()
                NockUtil.mockRelayResponse()
                // Send the relay
                const relayResponse = await relayer.send(relayData, blockchain, aat)

                if (typeGuard(relayResponse, RelayResponse)) {
                    relayResponses.push(relayResponse as RelayResponse)
                }
            }
            expect(relayResponses.length).to.be.equal(10)
        })

        it("should send a consensus relay given the correct parameters", async () => {
            // We use a different configuration in which we especify that we want 3 consensus nodes,
            // meaning the relay will be sent to 3 different nodes and the result will be compare
            const config = new Configuration(5, 1000, 3, 40000, false)
            const relayer = new Relayer([dispatcherUrl], config)
            // Generate client account
            const clientPassphrase = "1234"
            const clientAccountOrError = await relayer.keybase.createAccount(clientPassphrase)
            expect(typeGuard(clientAccountOrError, Error)).to.be.false
            const clientAccount = clientAccountOrError as Account
            const error = await relayer.keybase.unlockAccount(clientAccount.addressHex, clientPassphrase, 0)
            expect(error).to.be.undefined
            // Generate AAT
            const aat = await PocketAAT.from("0.0.1", clientAccount.publicKey.toString("hex"), appPubKeyHex, appPrivKeyHex)
            // Let's submit a consensus relay!
            const relayData = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f\",\"latest\"],\"id\":67}'
            NockUtil.mockDispatch()
            NockUtil.mockRelayForConsensus()
            NockUtil.mockRelayForConsensus()
            NockUtil.mockRelayForConsensus()
            const consensusRelayRespone = await relayer.sendConsensusRelay(relayData, blockchain, aat)
            expect(typeGuard(consensusRelayRespone, ConsensusRelayResponse)).to.be.true
        })

        it("should send a consensus relay given the correct parameters and accept a disputed response", async () => {
            // We use a different configuration in which we especify that we want 3 consensus nodes,
            // meaning the relay will be sent to 3 different nodes and the result will be compare,
            // The last 2 relay responses are going to be different than the first

            // For this scenario we are looking to accept disputed responses, adding TRUE to the configuration initializer
            const config = new Configuration(5, 1000, 3, 40000, true)
            const relayer = new Relayer([dispatcherUrl], config)
            // Nock mock blockchain id
            const nockBlockchain = "0002"
            // Generate client account
            const clientPassphrase = "1234"
            const clientAccountOrError = await relayer.keybase.createAccount(clientPassphrase)
            expect(typeGuard(clientAccountOrError, Error)).to.be.false
            const clientAccount = clientAccountOrError as Account
            const error = await relayer.keybase.unlockAccount(clientAccount.addressHex, clientPassphrase, 0)
            expect(error).to.be.undefined
            // Generate AAT
            const aat = await PocketAAT.from("0.0.1", clientAccount.publicKey.toString("hex"), appPubKeyHex, appPrivKeyHex)
            // Let's submit a consensus relay!
            const relayData = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f\",\"latest\"],\"id\":67}'
            NockUtil.mockDispatch()
            NockUtil.mockRelayForConsensus()
            NockUtil.mockRelayForConsensusFailure()
            NockUtil.mockRelayForConsensusFailure()
            const relayResponse = await relayer.sendConsensusRelay(relayData, nockBlockchain, aat)
            expect(typeGuard(relayResponse, ConsensusRelayResponse)).to.be.true
        })


        it("should send consensus relay without accepting the disputed response which will trigger a challenge request", async () => {
            // We use a different configuration in which we especify that we want 3 consensus nodes,
            // meaning the relay will be sent to 3 different nodes and the result will be compare,
            // The last 2 relay responses are going to be different than the first one

            // For this scenario we are looking to NOT accept disputed responses, adding FALSE to the configuration initializer
            const config = new Configuration(5, 1000, 3, 40000, false)
            const relayer = new Relayer([dispatcherUrl], config)
            // Generate client account
            const clientPassphrase = "1234"
            const clientAccountOrError = await relayer.keybase.createAccount(clientPassphrase)
            expect(typeGuard(clientAccountOrError, Error)).to.be.false
            const clientAccount = clientAccountOrError as Account
            const error = await relayer.keybase.unlockAccount(clientAccount.addressHex, clientPassphrase, 0)
            expect(error).to.be.undefined
            // Generate AAT
            const aat = await PocketAAT.from("0.0.1", clientAccount.publicKey.toString("hex"), appPubKeyHex, appPrivKeyHex)
            // Let's submit a consensus relay!
            const relayData = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f\",\"latest\"],\"id\":67}'
            NockUtil.mockDispatch()
            NockUtil.mockRelayForConsensus()
            NockUtil.mockRelayForConsensusFailure()
            NockUtil.mockRelayForConsensusFailure()
            NockUtil.mockRelayForConsensusFailure()
            NockUtil.mockRelayForConsensusFailure()
            NockUtil.mockChallenge()
            const relayResponse = await relayer.sendConsensusRelay(relayData, blockchain, aat)
            expect(typeGuard(relayResponse, ChallengeResponse)).to.be.true
        })
    })

    describe("Fail scenarios", function () {
        it("Should fail to send a relay due to provided node not being on the session", async () => {
            const relayer = new Relayer([dispatcherUrl])

            // Generate client account
            const clientPassphrase = "1234"
            const clientAccountOrError = await relayer.keybase.importAccount(Buffer.from(clientPrivKeyHex, "hex"), clientPassphrase)
            expect(typeGuard(clientAccountOrError, Error)).to.be.false
            const clientAccount = clientAccountOrError as Account
            const error = await relayer.keybase.unlockAccount(clientAccount.addressHex, clientPassphrase, 0)
            expect(error).to.be.undefined

            // Generate AAT
            const aat = await PocketAAT.from("0.0.1", clientAccount.publicKey.toString("hex"), appPubKeyHex, appPrivKeyHex)
            // Relay data
            const relayData = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0x050ea4ab4183E41129B7D72A492DaBf52B27EdB5\",\"latest\"],\"id\":67}'
            // Node
            const node = Node.fromJSON('{\"address\":\"a819b0c77165302cb8241aa7854c43fab805de45\",\"chains\":[\"0001\",\"0002\",\"0003\",\"0004\",\"0005\",\"0006\",\"0007\",\"0008\",\"0009\",\"0010\",\"0011\",\"0012\",\"0013\",\"0021\",\"0027\"],\"jailed\":false,\"public_key\":\"41401b10ebbbc41cc996c97c452f82dd4a90292b0eacfe916e87b0dc6257dd2b\",\"service_url\":\"https:\\\/\\\/im-not-on-session.io:443\",\"status\":2,\"tokens\":\"15099969801\",\"unstaking_time\":\"0001-01-01T00:00:00Z\"}')
            // Nock
            NockUtil.mockDispatch()
            NockUtil.mockRelayResponse()
            // Let's submit a relay!
            const relayOrError = await relayer.send(relayData, blockchain, aat, undefined, undefined, undefined, node)

            expect(typeGuard(relayOrError, Error)).to.be.true
            expect((relayOrError as Error).message).to.be.equal("Provided Node is not part of the current session for this application, check your PocketAAT")
        })

        it("Should fail to send a relay due to client account not being unlocked", async () => {
            const relayer = new Relayer([dispatcherUrl])

            // Generate client account
            const clientPassphrase = "1234"
            const clientAccountOrError = await relayer.keybase.importAccount(Buffer.from(clientPrivKeyHex, "hex"), clientPassphrase)
            expect(typeGuard(clientAccountOrError, Error)).to.be.false
            const clientAccount = clientAccountOrError as Account
            // For this test we comment out the unlockAccount call
            // const error = await relayer.keybase.unlockAccount(clientAccount.addressHex, clientPassphrase, 0)
            // expect(error).to.be.undefined

            // Generate AAT
            const aat = await PocketAAT.from("0.0.1", clientAccount.publicKey.toString("hex"), appPubKeyHex, appPrivKeyHex)
            // Relay data
            const relayData = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0x050ea4ab4183E41129B7D72A492DaBf52B27EdB5\",\"latest\"],\"id\":67}'
            // Nock
            NockUtil.mockDispatch()
            NockUtil.mockRelayResponse()
            // Let's submit a relay!
            const relayOrError = await relayer.send(relayData, blockchain, aat)

            expect(typeGuard(relayOrError, Error)).to.be.true
            expect((relayOrError as Error).message).to.be.equal("Client account " + clientAccount.addressHex + " for this AAT is not unlocked")
        })
    })
})