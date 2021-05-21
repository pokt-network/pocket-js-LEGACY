import { expect } from 'chai'
import { typeGuard } from "@pokt-network/pocket-js-utils"
import { NockUtil } from "@pokt-network/pocket-js-nock-utils"
import { Relayer } from "../../../src/relayer"
import { Account } from "@pokt-network/pocket-js-keybase"
import { RelayResponse } from '@pokt-network/pocket-js-relay-models'
import { PocketAAT } from "@pokt-network/aat-js"
import 'mocha';
import { Configuration } from '@pokt-network/pocket-js-configuration'
import { ChallengeRequest, ChallengeResponse, ConsensusRelayResponse, MajorityResponse, MinorityResponse, Session, StakingStatus } from '@pokt-network/pocket-js-rpc-models'
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

        it('should successfully retrieve a challenge response', async () => {
            const relayer = new Relayer([dispatcherUrl])
            const relay1 = '{"request":{"payload":{"data":"{\\"jsonrpc\\":\\"2.0\\",\\"method\\":\\"eth_getBalance\\",\\"params\\":[\\"0x050ea4ab4183E41129B7D72A492DaBf52B27EdB5\\",\\"latest\\"],\\"id\\":67}","method":"","path":"","headers":null},"meta":{"block_height":26257},"proof":{"entropy":31039971842500692,"session_block_height":26257,"servicer_pub_key":"5b3210eabe59db069255f12c230c9dfdf4244a440a4c2f5b70a6aa0fe157eb81","blockchain":"0022","aat":{"app_pub_key":"2099e51e72ece8458b09680899a747e114343b66bec00f272d090da96aaeb436","client_pub_key":"e7e91202573bdd1927b00fce9b0b46fa7944b06e6fe1bc987abc86e4d0dd47d6","signature":"6172942ce26f3f11ead505b36dba7c56ca0cb08403b0214b337a3fc09fba74341b6600312e58825e48f2d20930966eeaa7a9c732f2d5bd17ca8e58279d63040c","version":"0.0.1"},"signature":"bda73d6df6828fa2ea0693026c3ac9cbd5e09cd399e94069d32b4f79dd038d12ffcda6b1385e7d2cda591fe45fcb81538efff6498fd64a1e213025ac0d1e0200","request_hash":"ea93845b8a84556751c64085f0f1fc2d870b80a7194298ac526a46df485c49f1"}},"response":{"response":"{\\"id\\":67,\\"jsonrpc\\":\\"2.0\\",\\"result\\":\\"0x1043561a8814822\\"}","signature":"952352cc3b1e915c4470612e7f25b3cf811b30e1a95ab79d0c593d6afcbf0a7d0f50a945345e97c263641dfb8b1ba66911debe0be6d0586268720c3f9b83530f"}}'
            const relay2 = '{"request":{"payload":{"data":"{\\"jsonrpc\\":\\"2.0\\",\\"method\\":\\"eth_getBalance\\",\\"params\\":[\\"0x050ea4ab4183E41129B7D72A492DaBf52B27EdB5\\",\\"latest\\"],\\"id\\":67}","method":"","path":"","headers":null},"meta":{"block_height":26257},"proof":{"entropy":31039971842500692,"session_block_height":26257,"servicer_pub_key":"5b3210eabe59db069255f12c230c9dfdf4244a440a4c2f5b70a6aa0fe157eb81","blockchain":"0022","aat":{"app_pub_key":"2099e51e72ece8458b09680899a747e114343b66bec00f272d090da96aaeb436","client_pub_key":"e7e91202573bdd1927b00fce9b0b46fa7944b06e6fe1bc987abc86e4d0dd47d6","signature":"6172942ce26f3f11ead505b36dba7c56ca0cb08403b0214b337a3fc09fba74341b6600312e58825e48f2d20930966eeaa7a9c732f2d5bd17ca8e58279d63040c","version":"0.0.1"},"signature":"bda73d6df6828fa2ea0693026c3ac9cbd5e09cd399e94069d32b4f79dd038d12ffcda6b1385e7d2cda591fe45fcb81538efff6498fd64a1e213025ac0d1e0200","request_hash":"ea93845b8a84556751c64085f0f1fc2d870b80a7194298ac526a46df485c49f1"}},"response":{"response":"{\\"id\\":67,\\"jsonrpc\\":\\"2.0\\",\\"result\\":\\"0x1043561a8811100\\"}","signature":"952352cc3b1e915c4470612e7f25b3cf811b30e1a95ab79d0c593d6afcbf0a7d0f50a945345e97c263641dfb8b1ba66911debe0be6d0586268720c3f9b83530f"}}'
            
            const relayResponse1 = RelayResponse.fromJSON(relay1)
            const relayResponse2 = RelayResponse.fromJSON(relay2)

            const majorityResponse: MajorityResponse = new MajorityResponse([relayResponse1, relayResponse1])
            const minorityResponse: MinorityResponse = new MinorityResponse(relayResponse2)
            const challengeRequest: ChallengeRequest = new ChallengeRequest(majorityResponse, minorityResponse)
            const node = new Node("", "", false, StakingStatus.Staked, BigInt(0), dispatcherUrl.toString(), ["002","0022"])
            // Nock
            NockUtil.mockChallenge()
            const challengeResponse = await relayer.requestChallenge(challengeRequest, node)
            expect(typeGuard(challengeResponse, ChallengeResponse)).to.be.true
        }).timeout(0)
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