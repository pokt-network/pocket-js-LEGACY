/**
 * @author Pabel Nunez Landestoy <pabel@pokt.network>
 * @description Unit test for the Pocket Core Query interface
 */
import { expect } from "chai"
import { Pocket, typeGuard, QueryAccountResponse, 
    QueryBlockResponse, QueryTXResponse, QueryHeightResponse, 
    QueryBalanceResponse, StakingStatus, QueryNodesResponse, QueryNodeResponse, 
    QueryNodeParamsResponse, QueryNodeProofsResponse, NodeProof, 
    QueryNodeProofResponse, QueryAppsResponse, QueryAppResponse, 
    QueryAppParamsResponse, QueryPocketParamsResponse, QuerySupportedChainsResponse, 
    QuerySupplyResponse, BondStatus, Configuration, HttpRpcProvider, Node,
    EnvironmentHelper,
    RpcError,
    PocketAAT
} from "../../../src"
import { NockUtil } from "../../utils/nock-util"

// Constants
// For Testing we are using dummy data, none of the following information is real.
const version = '0.0.1'
const addressHex = "4930289621AEFBF9252C91C4C729B7F685E44C4B"
const clientPublicKey = 'f6d04ee2490e85f3f9ade95b80948816bd9b2986d5554aae347e7d21d93b6fb5'
const applicationPublicKey = 'f62f77db69d448c1b56f3540c633f294d23ccdaf002bf6b376d058a00b51cfaa'
const applicationPrivateKey = '5cdf6e47ab6c525b3f10418e557f4e2b10d486b4bb458dea1af53391c6d94664f62f77db69d448c1b56f3540c633f294d23ccdaf002bf6b376d058a00b51cfaa'
const applicationSignature = 'f9ef487152452ae417930a0c4144dc9d40fc95d93ebce35a95af30267f1d03d3d8db1ec8da173c144169a582836ff1a5fdf197714b6a893f5aa726edea434409'
const ethBlockchain = "36f028580bb02cc8272a9a020f4200e346e276ae664e45ee80745574e2f5ab80"
const blockchains = [ethBlockchain]
const nodeAddress = "E9769C199E5A35A64CE342493F351DEBDD0E4633"

/** Specify the environment using using EnvironmentHelper.getLocalNet()
 * LocalNet will run the tests againt's nock which have a set of responses mocked.abs
 * TestNet will run the tests with the TestNet Network.
 * MainNet will run the tests with the MainNet Network (not available).
 * 
 * Note: Can be done also using the Network enum (LocalNet,TestNet and MainNet)
 * EnvironmentHelper.get(Network.LocalNet)
 */
const env = EnvironmentHelper.getLocalNet()

const pocketAAT = PocketAAT.from(version, clientPublicKey, applicationPublicKey, applicationPrivateKey)
// Instances
const node01 = new Node(addressHex, applicationPublicKey, false, BondStatus.bonded, BigInt(100), env.getPOKTRPC(), blockchains)
const configuration = new Configuration([node01],5, 40000, 200)
const rpcProvider = new HttpRpcProvider(new URL(node01.serviceURL))

// Default pocket instance to reuse code
function getPocketDefaultInstance(): Pocket {
    return new Pocket(configuration, rpcProvider)
}

describe("Pocket RPC Query Interface", async () => {
    describe("Success scenarios", async () => {

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
        it('should returns an error trying to get a block due block height lower than 0.', async () => {
            // NockUtil.mockGetBlock(500)

            const pocket = getPocketDefaultInstance()

            const blockResponse = await pocket.rpc.query.getBlock(BigInt(-1))
            expect(typeGuard(blockResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get a transaction due to an invalid address hex.', async () => {
            NockUtil.mockGetTx(500)

            const pocket = getPocketDefaultInstance()

            const txResponse = await pocket.rpc.query.getTX("0xw892400Dc3C5a5eeBc96070ccd575D6A720F0F9z")
            expect(typeGuard(txResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get a transaction due to an empty address hex.', async () => {
            NockUtil.mockGetTx(500)

            const pocket = getPocketDefaultInstance()

            const txResponse = await pocket.rpc.query.getTX("")
            expect(typeGuard(txResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get the height due to internal server error.', async () => {
            NockUtil.mockGetHeight(500)

            const pocket = getPocketDefaultInstance()

            const heightResponse = await pocket.rpc.query.getHeight()
            expect(typeGuard(heightResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get the balance due to an invalid address.', async () => {
            NockUtil.mockGetBalance(500)

            const pocket = getPocketDefaultInstance()

            const balanceResponse = await pocket.rpc.query.getBalance("0xz892400Dc3C5a5eeBc96070ccd575D6A720F0F9wee", BigInt(5))
            expect(typeGuard(balanceResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get the balance due to an empty address.', async () => {
            NockUtil.mockGetBalance(500)

            const pocket = getPocketDefaultInstance()

            const balanceResponse = await pocket.rpc.query.getBalance("", BigInt(5))
            expect(typeGuard(balanceResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get the balance due to the block height less than 0.', async () => {
            NockUtil.mockGetBalance(500)

            const pocket = getPocketDefaultInstance()

            const balanceResponse = await pocket.rpc.query.getBalance("0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f", BigInt(-1))
            expect(typeGuard(balanceResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get a list of nodes due to the block height less than 0.', async () => {
            NockUtil.mockGetNodes(500)

            const pocket = getPocketDefaultInstance()

            const nodeResponse = await pocket.rpc.query.getNodes(StakingStatus.Staked, BigInt(-1))
            expect(typeGuard(nodeResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get a node due to an invalid address.', async () => {
            NockUtil.mockGetNode(500)

            const pocket = getPocketDefaultInstance()

            const nodeResponse = await pocket.rpc.query.getNode("0xzA0b54D5dc17e0AadC383d2db43B0a0D3E029c4czz", BigInt(5))
            expect(typeGuard(nodeResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get a node due to an empty address.', async () => {
            NockUtil.mockGetNode(500)

            const pocket = getPocketDefaultInstance()

            const nodeResponse = await pocket.rpc.query.getNode("", BigInt(5))
            expect(typeGuard(nodeResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get a node due to the block height is less than 0.', async () => {
            NockUtil.mockGetNode(500)

            const pocket = getPocketDefaultInstance()

            const nodeResponse = await pocket.rpc.query.getNode("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c", BigInt(-1))
            expect(typeGuard(nodeResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get the node params due to the block height is less than 0.', async () => {
            NockUtil.mockGetNodeParams(500)

            const pocket = getPocketDefaultInstance()

            const nodeParamsResponse = await pocket.rpc.query.getNodeParams(BigInt(-1))
            expect(typeGuard(nodeParamsResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get a node proofs list of proofs due to an invalid address.', async () => {
            NockUtil.mockGetNodeProofs(500)

            const pocket = getPocketDefaultInstance()

            const nodeProofsResponse = await pocket.rpc.query.getNodeProofs("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4czz", BigInt(5))
            expect(typeGuard(nodeProofsResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get a node proofs list of proofs due to the block height being less than 0.', async () => {
            NockUtil.mockGetNodeProofs(500)

            const pocket = getPocketDefaultInstance()

            const nodeProofsResponse = await pocket.rpc.query.getNodeProofs(addressHex, BigInt(-1))
            expect(typeGuard(nodeProofsResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get a proof of a node due to internal server error.', async () => {
            NockUtil.mockGetNodeProof(500)

            const nodeProof = new NodeProof(addressHex, "ETH10", applicationPublicKey, BigInt(0), BigInt(0))
            const pocket = getPocketDefaultInstance()

            const nodeProofResponse = await pocket.rpc.query.getNodeProof(nodeProof)
            expect(typeGuard(nodeProofResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get a list of apps due to the block height being less than 0.', async () => {
            NockUtil.mockGetApps(500)

            const pocket = getPocketDefaultInstance()

            const appsResponse = await pocket.rpc.query.getApps(StakingStatus.Staked, BigInt(-1))
            expect(typeGuard(appsResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get an app due to an invalid address.', async () => {
            NockUtil.mockGetApp(500)

            const pocket = getPocketDefaultInstance()

            const appResponse = await pocket.rpc.query.getApp("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4czz", BigInt(5))
            expect(typeGuard(appResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get an app due to block height being less than 0.', async () => {
            NockUtil.mockGetApp(500)

            const pocket = getPocketDefaultInstance()

            const appResponse = await pocket.rpc.query.getApp("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c", BigInt(-5))
            expect(typeGuard(appResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get an app params due block height being less than 0.', async () => {
            NockUtil.mockGetAppParams(500)

            const pocket = getPocketDefaultInstance()

            const appParamsResponse = await pocket.rpc.query.getAppParams(BigInt(-5))
            expect(typeGuard(appParamsResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get the pocket params due block height being less than 0.', async () => {
            NockUtil.mockGetPocketParams(500)

            const pocket = getPocketDefaultInstance()

            const pocketParamsResponse = await pocket.rpc.query.getPocketParams(BigInt(-5))
            expect(typeGuard(pocketParamsResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get the supported chains due block height being less than 0.', async () => {
            NockUtil.mockGetSupportedChains(500)

            const pocket = getPocketDefaultInstance()

            const supportedResponse = await pocket.rpc.query.getSupportedChains(BigInt(-5))
            expect(typeGuard(supportedResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get the supply due block height being less than 0.', async () => {
            NockUtil.mockGetSupply(500)

            const pocket = getPocketDefaultInstance()

            const supplyResponse = await pocket.rpc.query.getSupply(BigInt(-5))
            expect(typeGuard(supplyResponse, RpcError)).to.be.true
        }).timeout(0)
    })
})