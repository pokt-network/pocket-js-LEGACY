/**
 * @author Pabel Nunez Landestoy <pabel@pokt.network>
 * @description Unit test for the Pocket Core
 */
// Constants
import { expect, assert } from 'chai'
import { Node, PocketAAT, BondStatus, Configuration, Pocket, QueryAccountResponse, 
    QueryBlockResponse, QueryHeightResponse, QueryBalanceResponse, StakingStatus, 
    QueryNodesResponse, QueryNodeResponse, QueryNodeParamsResponse, QueryAppsResponse, 
    QueryAppResponse, QueryAppParamsResponse, QueryPocketParamsResponse, QuerySupportedChainsResponse, LocalNet, HttpRpcProvider, typeGuard, QueryTXResponse, QueryNodeProofsResponse, NodeProof, QueryNodeProofResponse, QuerySupplyResponse 
} from '../../src'
import { Account } from '../../src/keybase/models'
import { sha3_256 } from 'js-sha3'
import { NockUtil } from '../utils/nock-util'

// For Testing we are using dummy data, none of the following information is real.
const version = '0.0.1'
const addressHex = "175090018C3796FA05F4C0120EC61E2BBDA523F6"
const clientPublicKey = 'f6d04ee2490e85f3f9ade95b80948816bd9b2986d5554aae347e7d21d93b6fb5'
const applicationPublicKey = '633149e7e361b521e6a37f47c38b2f409fbaa0a5e5b3ad67280982a27e543bc2'
const applicationPrivateKey = 'e47d606d7fb38e694a7848d21f96a111e00fcb0d8e1c1dee47ee2357aada97ef633149e7e361b521e6a37f47c38b2f409fbaa0a5e5b3ad67280982a27e543bc2'
const applicationSignature = 'c6b3ec7c6b34734c4edc0ad9396ca9645620662ee7c662bb9ce19eef2f010ae6cba106c5dd127259962667453264b904d17a96ba01e047ca337da08ee05b6600'
const alternatePublicKey = "0c390b7a6c532bef52f484e3795ece973aea04776fe7d72a40e8ed6eb223fdc9"
const alternatePrivateKey = "de54546ae6bfb7b67e74546c9a55816effa1fc8af004f9b0d231340d29d505580c390b7a6c532bef52f484e3795ece973aea04776fe7d72a40e8ed6eb223fdc9"

const env = new LocalNet()
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
const rpcProvider = new HttpRpcProvider(new URL(env.getPOKTRPC()))

function getPocketDefaultInstance(): Pocket{
    return new Pocket(configuration, rpcProvider)
}

describe("Pocket Interface functionalities", async () => {
    describe("Success scenarios", async () => {
        it('should instantiate a Pocket instance due to a valid configuration is being used', () => {
            try {
                const pocket = getPocketDefaultInstance()
                expect(typeGuard(pocket, Pocket)).to.be.true
            } catch (error) {
                assert.fail()
            }
        }).timeout(0)
        // TODO: Fix signing 
        // it('should successfully send a relay due to a valid information', async () => {
        //     const pocket = getPocketDefaultInstance()
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
            const pocket = getPocketDefaultInstance()

            const accountResponse = await pocket.rpc.query.getAccount("E9769C199E5A35A64CE342493F351DEBDD0E4633")
            expect(typeGuard(accountResponse, QueryAccountResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a block information', async () => {
            // NockUtil.mockGetBlock()

            const pocket = getPocketDefaultInstance()

            const blockResponse = await pocket.rpc.query.getBlock(BigInt(5))
            expect(typeGuard(blockResponse, QueryBlockResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a transaction information', async () => {
            // NockUtil.mockGetTx()
            // TODO: Get a transaction hash for testing
            const pocket = getPocketDefaultInstance()

            const txResponse = await pocket.rpc.query.getTX("84871BAF5B4E01BE52E5007EACF7048F24BF57E0")
            expect(typeGuard(txResponse, QueryTXResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve the current block height', async () => {
            // NockUtil.mockGetHeight()

            const pocket = getPocketDefaultInstance()

            const heightResponse = await pocket.rpc.query.getHeight()
            expect(typeGuard(heightResponse, QueryHeightResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve an account balance', async () => {
            // NockUtil.mockGetBalance()

            const pocket = getPocketDefaultInstance()

            const balanceResponse = await pocket.rpc.query.getBalance(addressHex, BigInt(446))
            expect(typeGuard(balanceResponse, QueryBalanceResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a list of nodes', async () => {
            // NockUtil.mockGetNodes()

            const pocket = getPocketDefaultInstance()

            const nodeResponse = await pocket.rpc.query.getNodes(StakingStatus.Staked, BigInt(446))
            expect(typeGuard(nodeResponse, QueryNodesResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a node information', async () => {
            // NockUtil.mockGetNode()
            const pocket = getPocketDefaultInstance()

            const nodeResponse = await pocket.rpc.query.getNode(nodeAddress, BigInt(446))
            expect(typeGuard(nodeResponse, QueryNodeResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a node params information', async () => {
            // NockUtil.mockGetNodeParams()

            const pocket = getPocketDefaultInstance()

            const nodeParamsResponse = await pocket.rpc.query.getNodeParams(BigInt(446))
            expect(typeGuard(nodeParamsResponse, QueryNodeParamsResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a node proofs', async () => {
            // NockUtil.mockGetNodeProofs()
            // TODO: Infra is crashing when calling this endpoint - status pending
            const pocket = getPocketDefaultInstance()

            const nodeProofsResponse = await pocket.rpc.query.getNodeProofs(nodeAddress, BigInt(446))
            expect(typeGuard(nodeProofsResponse, QueryNodeProofsResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a node proof', async () => {
            // NockUtil.mockGetNodeProof()
            //    TODO: Peform testing after the nodeProofs endpoint is fixed
            const nodeProof = new NodeProof(addressHex, ethBlockchain, applicationPublicKey, BigInt(5), BigInt(5))
            const pocket = getPocketDefaultInstance()

            const nodeProofResponse = await pocket.rpc.query.getNodeProof(nodeProof)
            expect(typeGuard(nodeProofResponse, QueryNodeProofResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a list of apps', async () => {
            // NockUtil.mockGetApps()

            const pocket = getPocketDefaultInstance()

            const appsResponse = await pocket.rpc.query.getApps(StakingStatus.Staked, BigInt(446))
            expect(typeGuard(appsResponse, QueryAppsResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve an app information', async () => {
            // NockUtil.mockGetApp()
            const pocket = getPocketDefaultInstance()

            const appResponse = await pocket.rpc.query.getApp(addressHex, BigInt(446))
            expect(typeGuard(appResponse, QueryAppResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve the app params', async () => {
            // NockUtil.mockGetAppParams()
            const pocket = getPocketDefaultInstance()

            const appParamsResponse = await pocket.rpc.query.getAppParams(BigInt(446))
            expect(typeGuard(appParamsResponse, QueryAppParamsResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve the Pocket params', async () => {
            // NockUtil.mockGetPocketParams()

            const pocket = getPocketDefaultInstance()

            const pocketParamsResponse = await pocket.rpc.query.getPocketParams(BigInt(446))
            expect(typeGuard(pocketParamsResponse, QueryPocketParamsResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve the supported chains', async () => {
            // NockUtil.mockGetSupportedChains()

            const pocket = getPocketDefaultInstance()

            const supportedResponse = await pocket.rpc.query.getSupportedChains(BigInt(446))
            expect(typeGuard(supportedResponse, QuerySupportedChainsResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve the supply information', async () => {
            // NockUtil.mockGetSupply()
            // TODO: Calling this endpoint is crashing the infra
            const pocket = getPocketDefaultInstance()

            const supplyResponse = await pocket.rpc.query.getSupply(BigInt(446))
            expect(typeGuard(supplyResponse, QuerySupplyResponse)).to.be.true
        }).timeout(0)
    })
    describe("Error scenarios", async () => {
        // Relay and RPC calls scenarios

        it('should fail to send a relay due to no sessions found', async () => {
            const pocket = getPocketDefaultInstance()

            const data = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f\",\"latest\"],\"id\":67}'
            NockUtil.mockRelay(500)
            const response = await pocket.sendRelay(data, blockchain, noSessionPocketAAT)

            expect(response).to.be.instanceOf(Error)
        }).timeout(0)

        it('should fail to send a relay due to no stake amount', async () => {
            const pocket = getPocketDefaultInstance()

            const data = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f\",\"latest\"],\"id\":67}'

            NockUtil.mockRelay(500)
            const response = await pocket.sendRelay(data, blockchain, noSessionPocketAAT)

            expect(response).to.be.instanceOf(Error)
        }).timeout(0)

        it('should returns an error trying to get a block due block height lower than 0.', async () => {
            // NockUtil.mockGetBlock(500)

            const pocket = getPocketDefaultInstance()

            const blockResponse = await pocket.rpc.query.getBlock(BigInt(-1))
            expect(blockResponse).to.be.instanceOf(Error)
        }).timeout(0)

        it('should returns an error trying to get a transaction due to an invalid address hex.', async () => {
            NockUtil.mockGetTx(500)

            const pocket = getPocketDefaultInstance()

            const txResponse = await pocket.rpc.query.getTX("0xw892400Dc3C5a5eeBc96070ccd575D6A720F0F9z")
            expect(txResponse).to.be.instanceOf(Error)
        }).timeout(0)

        it('should returns an error trying to get a transaction due to an empty address hex.', async () => {
            NockUtil.mockGetTx(500)

            const pocket = getPocketDefaultInstance()

            const txResponse = await pocket.rpc.query.getTX("")
            expect(txResponse).to.be.instanceOf(Error)
        }).timeout(0)

        it('should returns an error trying to get the height due to internal server error.', async () => {
            NockUtil.mockGetHeight(500)

            const pocket = getPocketDefaultInstance()

            const heightResponse = await pocket.rpc.query.getHeight()
            expect(heightResponse).to.be.instanceOf(Error)
        }).timeout(0)

        it('should returns an error trying to get the balance due to an invalid address.', async () => {
            NockUtil.mockGetBalance(500)

            const pocket = getPocketDefaultInstance()

            const balanceResponse = await pocket.rpc.query.getBalance("0xz892400Dc3C5a5eeBc96070ccd575D6A720F0F9wee", BigInt(5))
            expect(balanceResponse).to.be.instanceOf(Error)
        }).timeout(0)

        it('should returns an error trying to get the balance due to an empty address.', async () => {
            NockUtil.mockGetBalance(500)

            const pocket = getPocketDefaultInstance()

            const balanceResponse = await pocket.rpc.query.getBalance("", BigInt(5))
            expect(balanceResponse).to.be.instanceOf(Error)
        }).timeout(0)

        it('should returns an error trying to get the balance due to the block height less than 0.', async () => {
            NockUtil.mockGetBalance(500)

            const pocket = getPocketDefaultInstance()

            const balanceResponse = await pocket.rpc.query.getBalance("0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f", BigInt(-1))
            expect(balanceResponse).to.be.instanceOf(Error)
        }).timeout(0)

        it('should returns an error trying to get a list of nodes due to the block height less than 0.', async () => {
            NockUtil.mockGetNodes(500)

            const pocket = getPocketDefaultInstance()

            const nodeResponse = await pocket.rpc.query.getNodes(StakingStatus.Staked, BigInt(-1))
            expect(nodeResponse).to.be.instanceOf(Error)
        }).timeout(0)

        it('should returns an error trying to get a node due to an invalid address.', async () => {
            NockUtil.mockGetNode(500)

            const pocket = getPocketDefaultInstance()

            const nodeResponse = await pocket.rpc.query.getNode("0xzA0b54D5dc17e0AadC383d2db43B0a0D3E029c4czz", BigInt(5))
            expect(nodeResponse).to.be.instanceOf(Error)
        }).timeout(0)

        it('should returns an error trying to get a node due to an empty address.', async () => {
            NockUtil.mockGetNode(500)

            const pocket = getPocketDefaultInstance()

            const nodeResponse = await pocket.rpc.query.getNode("", BigInt(5))
            expect(nodeResponse).to.be.instanceOf(Error)
        }).timeout(0)

        it('should returns an error trying to get a node due to the block height is less than 0.', async () => {
            NockUtil.mockGetNode(500)

            const pocket = getPocketDefaultInstance()

            const nodeResponse = await pocket.rpc.query.getNode("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c", BigInt(-1))
            expect(nodeResponse).to.be.instanceOf(Error)
        }).timeout(0)

        it('should returns an error trying to get the node params due to the block height is less than 0.', async () => {
            NockUtil.mockGetNodeParams(500)

            const pocket = getPocketDefaultInstance()

            const nodeParamsResponse = await pocket.rpc.query.getNodeParams(BigInt(-1))
            expect(nodeParamsResponse).to.be.instanceOf(Error)
        }).timeout(0)

        it('should returns an error trying to get a node proofs list of proofs due to an invalid address.', async () => {
            NockUtil.mockGetNodeProofs(500)

            const pocket = getPocketDefaultInstance()

            const nodeProofsResponse = await pocket.rpc.query.getNodeProofs("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4czz", BigInt(5))
            expect(nodeProofsResponse).to.be.instanceOf(Error)
        }).timeout(0)

        it('should returns an error trying to get a node proofs list of proofs due to the block height being less than 0.', async () => {
            NockUtil.mockGetNodeProofs(500)

            const pocket = getPocketDefaultInstance()

            const nodeProofsResponse = await pocket.rpc.query.getNodeProofs(addressHex, BigInt(-1))
            expect(nodeProofsResponse).to.be.instanceOf(Error)
        }).timeout(0)

        it('should returns an error trying to get a proof of a node due to internal server error.', async () => {
            NockUtil.mockGetNodeProof(500)

            const nodeProof = new NodeProof(addressHex, "ETH10", applicationPublicKey, BigInt(0), BigInt(0))
            const pocket = getPocketDefaultInstance()

            const nodeProofResponse = await pocket.rpc.query.getNodeProof(nodeProof)
            expect(nodeProofResponse).to.be.instanceOf(Error)
        }).timeout(0)

        it('should returns an error trying to get a list of apps due to the block height being less than 0.', async () => {
            NockUtil.mockGetApps(500)

            const pocket = getPocketDefaultInstance()

            const appsResponse = await pocket.rpc.query.getApps(StakingStatus.Staked, BigInt(-1))
            expect(appsResponse).to.be.instanceOf(Error)
        }).timeout(0)

        it('should returns an error trying to get an app due to an invalid address.', async () => {
            NockUtil.mockGetApp(500)

            const pocket = getPocketDefaultInstance()

            const appResponse = await pocket.rpc.query.getApp("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4czz", BigInt(5))
            expect(appResponse).to.be.instanceOf(Error)
        }).timeout(0)

        it('should returns an error trying to get an app due to block height being less than 0.', async () => {
            NockUtil.mockGetApp(500)

            const pocket = getPocketDefaultInstance()

            const appResponse = await pocket.rpc.query.getApp("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c", BigInt(-5))
            expect(appResponse).to.be.instanceOf(Error)
        }).timeout(0)

        it('should returns an error trying to get an app params due block height being less than 0.', async () => {
            NockUtil.mockGetAppParams(500)

            const pocket = getPocketDefaultInstance()

            const appParamsResponse = await pocket.rpc.query.getAppParams(BigInt(-5))
            expect(appParamsResponse).to.be.instanceOf(Error)
        }).timeout(0)

        it('should returns an error trying to get the pocket params due block height being less than 0.', async () => {
            NockUtil.mockGetPocketParams(500)

            const pocket = getPocketDefaultInstance()

            const pocketParamsResponse = await pocket.rpc.query.getPocketParams(BigInt(-5))
            expect(pocketParamsResponse).to.be.instanceOf(Error)
        }).timeout(0)

        it('should returns an error trying to get the supported chains due block height being less than 0.', async () => {
            NockUtil.mockGetSupportedChains(500)

            const pocket = getPocketDefaultInstance()

            const supportedResponse = await pocket.rpc.query.getSupportedChains(BigInt(-5))
            expect(supportedResponse).to.be.instanceOf(Error)
        }).timeout(0)

        it('should returns an error trying to get the supply due block height being less than 0.', async () => {
            NockUtil.mockGetSupply(500)

            const pocket = getPocketDefaultInstance()

            const supplyResponse = await pocket.rpc.query.getSupply(BigInt(-5))
            expect(supplyResponse).to.be.instanceOf(Error)
        }).timeout(0)
    })
})
