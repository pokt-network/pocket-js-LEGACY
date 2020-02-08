/**
 * @author Pabel Nunez Landestoy <pabel@pokt.network>
 * @description Unit test for the Pocket Core
 */
// Constants
import { expect, assert } from 'chai'
import { Pocket } from '../../src/pocket'
import { Node } from '../../src/models/node'
import { Configuration } from '../../src/models/configuration'
import { QueryBlockResponse } from '../../src/models/output'
import { QueryHeightResponse } from '../../src/models/output'
import { QueryBalanceResponse } from '../../src/models/output'
import { StakingStatus } from '../../src/utils/enums'
import { BondStatus } from '../../src/models/output/bond-status'
import { QueryNodesResponse } from '../../src/models/output'
import { QueryNodeResponse } from '../../src/models/output'
import { QueryNodeParamsResponse } from '../../src/models/output'
import { QueryAppsResponse } from '../../src/models/output'
import { QueryAppResponse } from '../../src/models/output'
import { QueryAppParamsResponse } from '../../src/models/output'
import { QueryPocketParamsResponse } from '../../src/models/output'
import { QuerySupportedChainsResponse } from '../../src/models/output'
import { QueryAccountResponse } from '../../src/models/output'
import { Proof } from '../../src/models/proof'
import { PocketAAT } from "pocket-aat-js"
import { sha3_256 } from "js-sha3"
import { TestNet } from '../../src/utils/env'
import { Account } from '../../src/models/account'
import { NockUtil } from '../utils/nock-util'
import { RelayResponse, QueryTXResponse, QueryNodeProofsResponse, NodeProof, 
    QueryNodeProofResponse, QuerySupplyResponse} from '../../src/models'

// For Testing we are using dummy data, none of the following information is real.
const version = '0.0.1'
const addressHex = "175090018C3796FA05F4C0120EC61E2BBDA523F6"
const clientPublicKey = 'f6d04ee2490e85f3f9ade95b80948816bd9b2986d5554aae347e7d21d93b6fb5'
const applicationPublicKey = '633149e7e361b521e6a37f47c38b2f409fbaa0a5e5b3ad67280982a27e543bc2'
const applicationPrivateKey = 'e47d606d7fb38e694a7848d21f96a111e00fcb0d8e1c1dee47ee2357aada97ef633149e7e361b521e6a37f47c38b2f409fbaa0a5e5b3ad67280982a27e543bc2'
const applicationSignature = 'c6b3ec7c6b34734c4edc0ad9396ca9645620662ee7c662bb9ce19eef2f010ae6cba106c5dd127259962667453264b904d17a96ba01e047ca337da08ee05b6600'
const alternatePublicKey = "0c390b7a6c532bef52f484e3795ece973aea04776fe7d72a40e8ed6eb223fdc9"
const alternatePrivateKey = "de54546ae6bfb7b67e74546c9a55816effa1fc8af004f9b0d231340d29d505580c390b7a6c532bef52f484e3795ece973aea04776fe7d72a40e8ed6eb223fdc9"

const env = new TestNet()
const pocketAAT = PocketAAT.from(version, clientPublicKey, applicationPublicKey, applicationPrivateKey)
const noSessionPocketAAT = PocketAAT.from(version, clientPublicKey, alternatePublicKey, alternatePrivateKey)
const blockchain = "6d3ce011e06e27a74cfa7d774228c52597ef5ef26f4a4afa9ad3cebefb5f3ca8"
const ethBlockchain = "36f028580bb02cc8272a9a020f4200e346e276ae664e45ee80745574e2f5ab80"
const blockchains = [ethBlockchain]
const nodeAddress = "E9769C199E5A35A64CE342493F351DEBDD0E4633"
const node01 = new Node(addressHex, applicationPublicKey, false, BondStatus.bonded, BigInt(100), "http://35.236.208.175:8081", blockchains)
const node02 = new Node(addressHex, applicationPublicKey, false, BondStatus.bonded, BigInt(100), "http://35.245.90.148:8081", blockchains)
const node03 = new Node(addressHex, applicationPublicKey, false, BondStatus.bonded, BigInt(100), "http://35.236.203.13:8081", blockchains)

const configuration = new Configuration([node01],5, 40000, 200)

describe("Pocket Interface functionalities", async () => {
    describe("Success scenarios", async () => {
        it('should instantiate a Pocket instance due to a valid configuration is being used', () => {
            try {
                const pocket = new Pocket(configuration)
                expect(pocket).to.not.be.an.instanceof(Error)
                expect(pocket).to.be.an.instanceof(Pocket)
            } catch (error) {
                assert.fail()
            }
        }).timeout(0)

        it('should create an account using a passphrase', async () => {
            const passphrase = "passphrase123"
            const pocket = new Pocket(configuration)
            const account = await pocket.createAccount(passphrase)

            expect(account).to.not.be.an.instanceof(Error)
            expect(account).to.be.an.instanceof(Account)
        }).timeout(0)

        it('should import an account using a passphrase', async () => {
            const passphrase = "passphrase123"
            const pocket = new Pocket(configuration)

            const importedAccount = await pocket.importAccount(passphrase, applicationPrivateKey)

            expect(importedAccount).to.not.be.an.instanceof(Error)
            expect(importedAccount).to.be.an.instanceof(Account)
        }).timeout(0)

        it('should export an already imported account using a passphrase', async () => {
            const passphrase = "passphrase123"
            const pocket = new Pocket(configuration)
            
            const importedAccount = await pocket.importAccount(passphrase, applicationPrivateKey)

            const exportedOrError = await pocket.exportAccount(importedAccount as Account, passphrase)
            expect(exportedOrError).to.not.be.an.instanceof(Error)
            expect(exportedOrError).to.be.an.instanceof(Buffer)
        }).timeout(0)

        it('should unlock an account using a passphrase', async () => {
            const passphrase = "passphrase123"
            const pocket = new Pocket(configuration)
            const account = await pocket.createAccount(passphrase)

            expect(account).to.not.be.an.instanceof(Error)
            expect(account).to.be.an.instanceof(Account)

            const addressHex = (account as Account).addressHex
            const result = await pocket.unlockAccount(addressHex, passphrase)
            
            expect(result).to.not.be.an.instanceof(Error)

        }).timeout(0)

        it('should sign a relay proof with an unlocked account', async () => {
            const passphrase = "passphrase123"
            const pocket = new Pocket(configuration)
            const importedAndUnlocked = await pocket.importAndUnlockAccount(passphrase, applicationPrivateKey)
            
            // Create the necessary properties for the relay request
            const proofIndex = BigInt(Math.floor(Math.random() * 10000000))
            const relayProof = new Proof(proofIndex, BigInt(5), addressHex, blockchain, pocketAAT)
            
            // Create a Relay Proof buffer
            const hash = sha3_256.create()
            hash.update(JSON.stringify(relayProof.toJSON()))
            const relayProofBuffer = Buffer.from(hash.hex(), 'hex')
            // Sign the relay payload
            const signature = await pocket.signWithUnlockedAccount((importedAndUnlocked as Account).addressHex, relayProofBuffer)

            expect(signature).to.not.be.an.instanceof(Error)
            expect(signature).to.be.an.instanceof(Buffer)
        }).timeout(0)

        // it('should successfully send a relay due to a valid information', async () => {
            // TODO: Fix signing 
        //     const pocket = new Pocket(configuration)
        //     // Account
        //     const passphrase = "passphrase123"
        //     const result = await pocket.importAndUnlockAccount(passphrase, applicationPrivateKey)

        //     expect(result).to.not.be.an.instanceof(Error)
        //     // Relay
        //     const data = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f\",\"latest\"],\"id\":67}'
        //     // NockUtil.mockDispatch()
        //     // NockUtil.mockGetHeight()
        //     // NockUtil.mockGetNodeParams()
        //     // NockUtil.mockRelay()
        //     const response = await pocket.sendRelay(data, blockchain, null, pocketAAT)

        //     expect(response).to.not.be.instanceOf(Error)
        //     expect(response).to.not.be.undefined
        // }).timeout(0)

        it('should successfully retrieve an account information', async () => {
            const pocket = new Pocket(configuration)

            const accountResponse = await pocket.queryGetAccount("E9769C199E5A35A64CE342493F351DEBDD0E4633")
            expect(accountResponse).to.be.instanceOf(QueryAccountResponse)
        }).timeout(0)

        it('should successfully retrieve a block information', async () => {
            // NockUtil.mockGetBlock()

            const pocket = new Pocket(configuration)

            const blockResponse = await pocket.getBlock(BigInt(5), configuration)
            expect(blockResponse).to.be.instanceOf(QueryBlockResponse)
        }).timeout(0)

        // it('should successfully retrieve a transaction information', async () => {
        //     // NockUtil.mockGetTx()
               // TODO: Get a transaction hash for testing
        //     const pocket = new Pocket(configuration)

        //     const txResponse = await pocket.getTX("84871BAF5B4E01BE52E5007EACF7048F24BF57E0")
        //     expect(txResponse).to.be.instanceOf(QueryTXResponse)
        // }).timeout(0)

        it('should successfully retrieve the current block height', async () => {
            // NockUtil.mockGetHeight()

            const pocket = new Pocket(configuration)

            const heightResponse = await pocket.getHeight()
            expect(heightResponse).to.be.instanceOf(QueryHeightResponse)
        }).timeout(0)

        it('should successfully retrieve an account balance', async () => {
            // NockUtil.mockGetBalance()

            const pocket = new Pocket(configuration)

            const balanceResponse = await pocket.getBalance(addressHex, BigInt(446))
            expect(balanceResponse).to.be.instanceOf(QueryBalanceResponse)
        }).timeout(0)

        it('should successfully retrieve a list of nodes', async () => {
            // NockUtil.mockGetNodes()

            const pocket = new Pocket(configuration)

            const nodeResponse = await pocket.getNodes(StakingStatus.Staked, BigInt(446))
            expect(nodeResponse).to.be.instanceOf(QueryNodesResponse)
        }).timeout(0)

        it('should successfully retrieve a node information', async () => {
            // NockUtil.mockGetNode()
            const pocket = new Pocket(configuration)

            const nodeResponse = await pocket.getNode(nodeAddress, BigInt(446))
            expect(nodeResponse).to.be.instanceOf(QueryNodeResponse)
        }).timeout(0)

        it('should successfully retrieve a node params information', async () => {
            // NockUtil.mockGetNodeParams()

            const pocket = new Pocket(configuration)

            const nodeParamsResponse = await pocket.getNodeParams(BigInt(446))
            expect(nodeParamsResponse).to.be.instanceOf(QueryNodeParamsResponse)
        }).timeout(0)

        // it('should successfully retrieve a node proofs', async () => {
        //     // NockUtil.mockGetNodeProofs()
        //     // TODO: Infra is crashing when calling this endpoint - status pending
        //     const pocket = new Pocket(configuration)

        //     const nodeProofsResponse = await pocket.getNodeProofs(nodeAddress, BigInt(446))
        //     expect(nodeProofsResponse).to.be.instanceOf(QueryNodeProofsResponse)
        // }).timeout(0)

        // it('should successfully retrieve a node proof', async () => {
        //     // NockUtil.mockGetNodeProof()
               // TODO: Peform testing after the nodeProofs endpoint is fixed
        //     const nodeProof = new NodeProof(addressHex, ethBlockchain, applicationPublicKey, BigInt(5), BigInt(5))
        //     const pocket = new Pocket(configuration)

        //     const nodeProofResponse = await pocket.getNodeProof(nodeProof)
        //     expect(nodeProofResponse).to.be.instanceOf(QueryNodeProofResponse)
        // }).timeout(0)

        it('should successfully retrieve a list of apps', async () => {
            // NockUtil.mockGetApps()

            const pocket = new Pocket(configuration)

            const appsResponse = await pocket.getApps(StakingStatus.Staked, BigInt(446))
            expect(appsResponse).to.be.instanceOf(QueryAppsResponse)
        }).timeout(0)

        it('should successfully retrieve an app information', async () => {
            // NockUtil.mockGetApp()
            const pocket = new Pocket(configuration)

            const appResponse = await pocket.getApp(addressHex, BigInt(446))
            expect(appResponse).to.be.instanceOf(QueryAppResponse)
        }).timeout(0)

        it('should successfully retrieve the app params', async () => {
            // NockUtil.mockGetAppParams()
            const pocket = new Pocket(configuration)

            const appParamsResponse = await pocket.getAppParams(BigInt(446))
            expect(appParamsResponse).to.be.instanceOf(QueryAppParamsResponse)
        }).timeout(0)

        it('should successfully retrieve the Pocket params', async () => {
            // NockUtil.mockGetPocketParams()

            const pocket = new Pocket(configuration)

            const pocketParamsResponse = await pocket.getPocketParams(BigInt(446))
            expect(pocketParamsResponse).to.be.instanceOf(QueryPocketParamsResponse)
        }).timeout(0)

        it('should successfully retrieve the supported chains', async () => {
            // NockUtil.mockGetSupportedChains()

            const pocket = new Pocket(configuration)

            const supportedResponse = await pocket.getSupportedChains(BigInt(446))
            expect(supportedResponse).to.be.instanceOf(QuerySupportedChainsResponse)
        }).timeout(0)

        // it('should successfully retrieve the supply information', async () => {
        //     // NockUtil.mockGetSupply()
        //     // TODO: Calling this endpoint is crashing the infra
        //     const pocket = new Pocket(configuration)

        //     const supplyResponse = await pocket.getSupply(BigInt(446))
        //     expect(supplyResponse).to.be.instanceOf(QuerySupplyResponse)
        // }).timeout(0)
    })
    // describe("Error scenarios", async () => {
    //     // Account scenarios
    //     it('should fail to create an account using an empty passphrase', async () => {
    //         const passphrase = ""
    //         const pocket = new Pocket(configuration)
    //         const account = await pocket.createAccount(passphrase)

    //         expect(account).to.not.be.an.instanceof(Account)
    //         expect(account).to.be.an.instanceof(Error)
    //     }).timeout(0)

    //     it('should fail to import an account using an empty passphrase', async () => {
    //         const passphrase = ""
    //         const pocket = new Pocket(configuration)

    //         const importedAccount = await pocket.importAccount(passphrase, applicationPrivateKey)

    //         expect(importedAccount).to.not.be.an.instanceof(Account)
    //         expect(importedAccount).to.be.an.instanceof(Error)
    //     }).timeout(0)

    //     it('should fail to import an account using an invalid privateKey', async () => {
    //         const passphrase = "passphrase123"
    //         const pocket = new Pocket(configuration)
    //         const invalidPrivateKey = applicationPrivateKey.slice(0, -5)
    //         const importedAccount = await pocket.importAccount(passphrase, invalidPrivateKey)

    //         expect(importedAccount).to.not.be.an.instanceof(Account)
    //         expect(importedAccount).to.be.an.instanceof(Error)
    //     }).timeout(0)

    //     it('should fail to export an already imported account using an invalid passphrase', async () => {
    //         const passphrase = "passphrase123"
    //         const invalidPassphrase = passphrase + "4567890"
    //         const pocket = new Pocket(configuration)

    //         const importedAccount = await pocket.importAccount(passphrase, applicationPrivateKey)
    //         const exportedAccount = await pocket.exportAccount(importedAccount as Account, invalidPassphrase)

    //         expect(exportedAccount).to.not.be.an.instanceof(Buffer)
    //         expect(exportedAccount).to.be.an.instanceof(Error)
    //     }).timeout(0)

    //     it('should fail to export a non existing account from the keybase', async () => {
    //         const passphrase = "passphrase123"
    //         const publicKeyBuffer = Buffer.from(alternatePublicKey, 'hex')
    //         const account = new Account(publicKeyBuffer, alternatePrivateKey)
    //         const pocket = new Pocket(configuration)

    //         const exportedAccount = await pocket.exportAccount(account, passphrase)

    //         expect(exportedAccount).to.not.be.an.instanceof(Buffer)
    //         expect(exportedAccount).to.be.an.instanceof(Error)
    //     }).timeout(0)

    //     it('should fail to unlock an account using an invalid passphrase', async () => {
    //         const passphrase = "passphrase123"
    //         const invalidPassphrase = passphrase + "4567890"
    //         const pocket = new Pocket(configuration)
    //         const account = await pocket.createAccount(passphrase)

    //         expect(account).to.not.be.an.instanceof(Error)
    //         expect(account).to.be.an.instanceof(Account)

    //         const addressHex = (account as Account).addressHex
    //         const result = await pocket.unlockAccount(addressHex, invalidPassphrase)

    //         expect(result).to.not.be.an.instanceof(Buffer)
    //         expect(result).to.be.an.instanceof(Error)
    //     }).timeout(0)

    //     it('should fail to sign a relayRequest with an invalid addressHex length', async () => {
    //         const passphrase = "passphrase123"
    //         const invalidAddressHex = addressHex + "EED"
    //         const pocket = new Pocket(configuration)
    //         await pocket.importAccount(passphrase, applicationPrivateKey)
    //         await pocket.unlockAccount(addressHex, passphrase)
    //         // Create the necessary properties for the relay request
    //         const proofIndex = BigInt(Math.floor(Math.random() * 10000000))
    //         const relayProof = new Proof(proofIndex, BigInt(5), applicationPublicKey, blockchain, pocketAAT)
    //         // Create a Relay Proof buffer
    //         const hash = sha3_256.create()
    //         hash.update(JSON.stringify(relayProof.toJSON()))
    //         const relayProofBuffer = Buffer.from(hash.hex(), 'hex')
    //         // Sign the relay payload
    //         const signature = await pocket.signWithUnlockedAccount(invalidAddressHex, relayProofBuffer)

    //         expect(signature).to.be.an.instanceof(Error)
    //         expect(signature).to.not.be.an.instanceof(Buffer)
    //     }).timeout(0)

    //     it('should fail to sign a relayRequest with an invalid addressHex format', async () => {
    //         const passphrase = "passphrase123"
    //         const invalidAddressHex = addressHex.replace("B", "Z")
    //         const pocket = new Pocket(configuration)
    //         await pocket.importAccount(passphrase, applicationPrivateKey)
    //         await pocket.unlockAccount(addressHex, passphrase)
    //         // Create the necessary properties for the relay request
    //         const proofIndex = BigInt(Math.floor(Math.random() * 10000000))
    //         const relayProof = new Proof(proofIndex, BigInt(5), applicationPublicKey, blockchain, pocketAAT)
    //         // Create a Relay Proof buffer
    //         const hash = sha3_256.create()
    //         hash.update(JSON.stringify(relayProof.toJSON()))
    //         const relayProofBuffer = Buffer.from(hash.hex(), 'hex')
    //         // Sign the relay payload
    //         const signature = await pocket.signWithUnlockedAccount(invalidAddressHex, relayProofBuffer)

    //         expect(signature).to.be.an.instanceof(Error)
    //         expect(signature).to.not.be.an.instanceof(Buffer)
    //     }).timeout(0)

    //     it('should fail to sign a relayRequest with a locked account', async () => {
    //         const passphrase = "passphrase123"

    //         const pocket = new Pocket(configuration)
    //         await pocket.importAccount(passphrase, applicationPrivateKey)

    //         // Create the necessary properties for the relay request
    //         const proofIndex = BigInt(Math.floor(Math.random() * 10000000))
    //         const relayProof = new Proof(proofIndex, BigInt(5), applicationPublicKey, blockchain, pocketAAT)
    //         // Create a Relay Proof buffer
    //         const hash = sha3_256.create()
    //         hash.update(JSON.stringify(relayProof.toJSON()))
    //         const relayProofBuffer = Buffer.from(hash.hex(), 'hex')
    //         // Sign the relay payload
    //         const signature = await pocket.signWithUnlockedAccount(addressHex, relayProofBuffer)

    //         expect(signature).to.be.an.instanceof(Error)
    //         expect(signature).to.not.be.an.instanceof(Buffer)
    //     }).timeout(0)

    //     // Relay and RPC calls scenarios

    //     it('should fail to send a relay due to no sessions found', async () => {
    //         const pocket = new Pocket(configuration)

    //         const data = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f\",\"latest\"],\"id\":67}'
    //         NockUtil.mockRelay(500)
    //         const response = await pocket.sendRelay(data, blockchain, null, noSessionPocketAAT)

    //         expect(response).to.be.instanceOf(Error)
    //     }).timeout(0)

    //     it('should fail to send a relay due to no stake amount', async () => {
    //         const pocket = new Pocket(configuration)

    //         const data = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f\",\"latest\"],\"id\":67}'

    //         NockUtil.mockRelay(500)
    //         const response = await pocket.sendRelay(data, blockchain, null, noSessionPocketAAT)

    //         expect(response).to.be.instanceOf(Error)
    //     }).timeout(0)

    //     it('should returns an error trying to get a block due block height lower than 0.', async () => {
    //         NockUtil.mockGetBlock(500)

    //         const pocket = new Pocket(configuration)

    //         const blockResponse = await pocket.getBlock(BigInt(-1), configuration)
    //         expect(blockResponse).to.be.instanceOf(Error)
    //     }).timeout(0)

    //     it('should returns an error trying to get a transaction due to an invalid address hex.', async () => {
    //         NockUtil.mockGetTx(500)

    //         const pocket = new Pocket(configuration)

    //         const txResponse = await pocket.getTX("0xw892400Dc3C5a5eeBc96070ccd575D6A720F0F9z")
    //         expect(txResponse).to.be.instanceOf(Error)
    //     }).timeout(0)

    //     it('should returns an error trying to get a transaction due to an empty address hex.', async () => {
    //         NockUtil.mockGetTx(500)

    //         const pocket = new Pocket(configuration)

    //         const txResponse = await pocket.getTX("")
    //         expect(txResponse).to.be.instanceOf(Error)
    //     }).timeout(0)

    //     it('should returns an error trying to get the height due to internal server error.', async () => {
    //         NockUtil.mockGetHeight(500)

    //         const pocket = new Pocket(configuration)

    //         const heightResponse = await pocket.getHeight()
    //         expect(heightResponse).to.be.instanceOf(Error)
    //     }).timeout(0)

    //     it('should returns an error trying to get the balance due to an invalid address.', async () => {
    //         NockUtil.mockGetBalance(500)

    //         const pocket = new Pocket(configuration)

    //         const balanceResponse = await pocket.getBalance("0xz892400Dc3C5a5eeBc96070ccd575D6A720F0F9wee", BigInt(5))
    //         expect(balanceResponse).to.be.instanceOf(Error)
    //     }).timeout(0)

    //     it('should returns an error trying to get the balance due to an empty address.', async () => {
    //         NockUtil.mockGetBalance(500)

    //         const pocket = new Pocket(configuration)

    //         const balanceResponse = await pocket.getBalance("", BigInt(5))
    //         expect(balanceResponse).to.be.instanceOf(Error)
    //     }).timeout(0)

    //     it('should returns an error trying to get the balance due to the block height less than 0.', async () => {
    //         NockUtil.mockGetBalance(500)

    //         const pocket = new Pocket(configuration)

    //         const balanceResponse = await pocket.getBalance("0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f", BigInt(-1))
    //         expect(balanceResponse).to.be.instanceOf(Error)
    //     }).timeout(0)

    //     it('should returns an error trying to get a list of nodes due to the block height less than 0.', async () => {
    //         NockUtil.mockGetNodes(500)

    //         const pocket = new Pocket(configuration)

    //         const nodeResponse = await pocket.getNodes(StakingStatus.Staked, BigInt(-1))
    //         expect(nodeResponse).to.be.instanceOf(Error)
    //     }).timeout(0)

    //     it('should returns an error trying to get a node due to an invalid address.', async () => {
    //         NockUtil.mockGetNode(500)

    //         const pocket = new Pocket(configuration)

    //         const nodeResponse = await pocket.getNode("0xzA0b54D5dc17e0AadC383d2db43B0a0D3E029c4czz", BigInt(5))
    //         expect(nodeResponse).to.be.instanceOf(Error)
    //     }).timeout(0)

    //     it('should returns an error trying to get a node due to an empty address.', async () => {
    //         NockUtil.mockGetNode(500)

    //         const pocket = new Pocket(configuration)

    //         const nodeResponse = await pocket.getNode("", BigInt(5))
    //         expect(nodeResponse).to.be.instanceOf(Error)
    //     }).timeout(0)

    //     it('should returns an error trying to get a node due to the block height is less than 0.', async () => {
    //         NockUtil.mockGetNode(500)

    //         const pocket = new Pocket(configuration)

    //         const nodeResponse = await pocket.getNode("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c", BigInt(-1))
    //         expect(nodeResponse).to.be.instanceOf(Error)
    //     }).timeout(0)

    //     it('should returns an error trying to get the node params due to the block height is less than 0.', async () => {
    //         NockUtil.mockGetNodeParams(500)

    //         const pocket = new Pocket(configuration)

    //         const nodeParamsResponse = await pocket.getNodeParams(BigInt(-1))
    //         expect(nodeParamsResponse).to.be.instanceOf(Error)
    //     }).timeout(0)

    //     it('should returns an error trying to get a node proofs list of proofs due to an invalid address.', async () => {
    //         NockUtil.mockGetNodeProofs(500)

    //         const pocket = new Pocket(configuration)

    //         const nodeProofsResponse = await pocket.getNodeProofs("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4czz", BigInt(5))
    //         expect(nodeProofsResponse).to.be.instanceOf(Error)
    //     }).timeout(0)

    //     it('should returns an error trying to get a node proofs list of proofs due to the block height being less than 0.', async () => {
    //         NockUtil.mockGetNodeProofs(500)

    //         const pocket = new Pocket(configuration)

    //         const nodeProofsResponse = await pocket.getNodeProofs(addressHex, BigInt(-1))
    //         expect(nodeProofsResponse).to.be.instanceOf(Error)
    //     }).timeout(0)

    //     it('should returns an error trying to get a proof of a node due to internal server error.', async () => {
    //         NockUtil.mockGetNodeProof(500)

    //         const nodeProof = new NodeProof(addressHex, "ETH10", applicationPublicKey, BigInt(0), BigInt(0))
    //         const pocket = new Pocket(configuration)

    //         const nodeProofResponse = await pocket.getNodeProof(nodeProof)
    //         expect(nodeProofResponse).to.be.instanceOf(Error)
    //     }).timeout(0)

    //     it('should returns an error trying to get a list of apps due to the block height being less than 0.', async () => {
    //         NockUtil.mockGetApps(500)

    //         const pocket = new Pocket(configuration)

    //         const appsResponse = await pocket.getApps(StakingStatus.Staked, BigInt(-1))
    //         expect(appsResponse).to.be.instanceOf(Error)
    //     }).timeout(0)

    //     it('should returns an error trying to get an app due to an invalid address.', async () => {
    //         NockUtil.mockGetApp(500)

    //         const pocket = new Pocket(configuration)

    //         const appResponse = await pocket.getApp("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4czz", BigInt(5))
    //         expect(appResponse).to.be.instanceOf(Error)
    //     }).timeout(0)

    //     it('should returns an error trying to get an app due to block height being less than 0.', async () => {
    //         NockUtil.mockGetApp(500)

    //         const pocket = new Pocket(configuration)

    //         const appResponse = await pocket.getApp("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c", BigInt(-5))
    //         expect(appResponse).to.be.instanceOf(Error)
    //     }).timeout(0)

    //     it('should returns an error trying to get an app params due block height being less than 0.', async () => {
    //         NockUtil.mockGetAppParams(500)

    //         const pocket = new Pocket(configuration)

    //         const appParamsResponse = await pocket.getAppParams(BigInt(-5))
    //         expect(appParamsResponse).to.be.instanceOf(Error)
    //     }).timeout(0)

    //     it('should returns an error trying to get the pocket params due block height being less than 0.', async () => {
    //         NockUtil.mockGetPocketParams(500)

    //         const pocket = new Pocket(configuration)

    //         const pocketParamsResponse = await pocket.getPocketParams(BigInt(-5))
    //         expect(pocketParamsResponse).to.be.instanceOf(Error)
    //     }).timeout(0)

    //     it('should returns an error trying to get the supported chains due block height being less than 0.', async () => {
    //         NockUtil.mockGetSupportedChains(500)

    //         const pocket = new Pocket(configuration)

    //         const supportedResponse = await pocket.getSupportedChains(BigInt(-5))
    //         expect(supportedResponse).to.be.instanceOf(Error)
    //     }).timeout(0)

    //     it('should returns an error trying to get the supply due block height being less than 0.', async () => {
    //         NockUtil.mockGetSupply(500)

    //         const pocket = new Pocket(configuration)

    //         const supplyResponse = await pocket.getSupply(BigInt(-5))
    //         expect(supplyResponse).to.be.instanceOf(Error)
    //     }).timeout(0)
    // })
})
