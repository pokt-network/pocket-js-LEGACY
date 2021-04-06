/**
 * @author Pabel Nunez Landestoy <pabel@pokt.network>
 * @description Integration tests for the Pocket Core Query interface
 */
import * as dotenv from "dotenv"
import { expect } from "chai"
import { EnvironmentHelper } from "@pokt-network/pocket-js-test-utils"
import { typeGuard, RpcError } from "@pokt-network/pocket-js-utils"
import { HttpRpcProvider } from "@pokt-network/pocket-js-http-provider"
import {
    QueryAccountResponse, QueryBlockResponse, QueryTXResponse,
    QueryHeightResponse, QueryBalanceResponse, StakingStatus,
    QueryNodesResponse, QueryNodeResponse, QueryNodeParamsResponse,
    QueryAppsResponse, QueryAppResponse, QueryAppParamsResponse,
    QueryPocketParamsResponse, QuerySupportedChainsResponse, QuerySupplyResponse,
    JailedStatus, QueryAccountTxsResponse, QueryNodeClaimsResponse, QueryNodeClaimResponse, QueryAllParamsResponse,
    ChallengeRequest, ChallengeResponse, MajorityResponse, MinorityResponse, QueryBlockTxsResponse
} from "@pokt-network/pocket-js-rpc-models"
import { RPC } from "../../../src/index"

// Constants
// For Testing we are using dummy data, none of the following information is real.
const appAddress = "57adff41d7339b63a9e6f5e93bb82406b1160c8d"
const nodeAddress = "da0d712e0ad5b37393c022c3333bed46c8667d0a"

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
const dispatcher = new URL(env.getPOKTRPC())
const rpcProvider = new HttpRpcProvider(dispatcher)

// Default pocket instance to reuse code
function getDefaultRpcInstance(): RPC {
    return new RPC(rpcProvider)
}

describe("Pocket RPC Query Interface", async () => {
    describe("Success scenarios", async () => {

        it('should successfully retrieve an account information', async () => {
            const rpc = getDefaultRpcInstance()

            const accountResponse = await rpc.query.getAccount("da0d712e0ad5b37393c022c3333bed46c8667d0a")
            expect(typeGuard(accountResponse, QueryAccountResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a block information', async () => {
            const rpc = getDefaultRpcInstance()

            const blockResponse = await rpc.query.getBlock(BigInt(3))
            expect(typeGuard(blockResponse, QueryBlockResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a transaction information', async () => {
            const rpc = getDefaultRpcInstance()

            const txResponse = await rpc.query.getTX("6E09E914DC3596719A5B31DDF68C5FDCC152EBEA55F65B19F8341A894DEC2071")
            expect(typeGuard(txResponse, QueryTXResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve the current block height', async () => {
            const rpc = getDefaultRpcInstance()

            const heightResponse = await rpc.query.getHeight()
            expect(typeGuard(heightResponse, QueryHeightResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve an account balance', async () => {
            const rpc = getDefaultRpcInstance()

            const balanceResponse = await rpc.query.getBalance("da0d712e0ad5b37393c022c3333bed46c8667d0a", BigInt(0))
            expect(typeGuard(balanceResponse, QueryBalanceResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a list of validator nodes', async () => {
            const rpc = getDefaultRpcInstance()

            const nodesResponse = await rpc.query.getNodes(StakingStatus.Staked, JailedStatus.Unjailed, BigInt(1), "", 1, 10)
            expect(typeGuard(nodesResponse, QueryNodesResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a node information', async () => {
            const rpc = getDefaultRpcInstance()

            const nodeResponse = await rpc.query.getNode(nodeAddress, BigInt(1))
            expect(typeGuard(nodeResponse, QueryNodeResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a node params information', async () => {
            const rpc = getDefaultRpcInstance()

            const nodeParamsResponse = await rpc.query.getNodeParams(BigInt(0))
            expect(typeGuard(nodeParamsResponse, QueryNodeParamsResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a list of apps', async () => {
            const rpc = getDefaultRpcInstance()

            const appsResponse = await rpc.query.getApps(StakingStatus.Staked, BigInt(1), undefined, 1, 10)
            expect(typeGuard(appsResponse, QueryAppsResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve an app information', async () => {
            const rpc = getDefaultRpcInstance()

            const appResponse = await rpc.query.getApp(appAddress, BigInt(0))
            expect(typeGuard(appResponse, QueryAppResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve the app params', async () => {
            const rpc = getDefaultRpcInstance()

            const appParamsResponse = await rpc.query.getAppParams(BigInt(1))
            expect(typeGuard(appParamsResponse, QueryAppParamsResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve the Pocket params', async () => {
            const rpc = getDefaultRpcInstance()

            const pocketParamsResponse = await rpc.query.getPocketParams(BigInt(1))
            expect(typeGuard(pocketParamsResponse, QueryPocketParamsResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve the supported chains', async () => {
            const rpc = getDefaultRpcInstance()

            const supportedResponse = await rpc.query.getSupportedChains(BigInt(1))
            expect(typeGuard(supportedResponse, QuerySupportedChainsResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve the supply information', async () => {
            const rpc = getDefaultRpcInstance()

            const supplyResponse = await rpc.query.getSupply(BigInt(1))
            expect(typeGuard(supplyResponse, QuerySupplyResponse)).to.be.true
        }).timeout(0)

        // // it('should successfully retrieve a challenge response', async () => {
        // //     const env = EnvironmentHelper.getNetwork(process.env.localhost_env_url)
        // //     const dispatcher = new URL(env.getPOKTRPC())
        // //     const configuration = new Configuration(5, 1000, undefined, 40000)
        // //     const rpcProvider = new HttpRpcProvider(dispatcher)
        // //     const rpc = getDefaultRpcInstance()

        // //     const majorityResponse: MajorityResponse = new MajorityResponse([NockUtil.getMockRelayResponse(), NockUtil.getMockRelayResponse()])
        // //     const minorityResponse: MinorityResponse = new MinorityResponse(NockUtil.getMockRelayResponse())
        // //     const challengeRequest: ChallengeRequest = new ChallengeRequest(majorityResponse, minorityResponse)

        // //     const challengeResponse = await rpc.query.requestChallenge(challengeRequest)
        // //     expect(typeGuard(challengeResponse, ChallengeResponse)).to.be.true
        // // }).timeout(0)

        it('should successfully retrieve an account transaction list with the proof object by setting the prove boolean to true', async () => {
            const rpc = getDefaultRpcInstance()

            const accountTxsResponse = await rpc.query.getAccountTxs(nodeAddress, false, true, 1, 10)
            expect(typeGuard(accountTxsResponse, QueryAccountTxsResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve an account transaction list that with empty proof object by setting the prove boolean to false', async () => {
            const rpc = getDefaultRpcInstance()

            const accountTxsResponse = await rpc.query.getAccountTxs(nodeAddress, false, false, 1, 10)
            expect(typeGuard(accountTxsResponse, QueryAccountTxsResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve an account received transaction list by setting the received property to true', async () => {
            const rpc = getDefaultRpcInstance()

            const accountTxsResponse = await rpc.query.getAccountTxs(nodeAddress, true, false, 1, 10)
            expect(typeGuard(accountTxsResponse, QueryAccountTxsResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a block transaction list with the proof object by setting the prove boolean to true', async () => {
            const rpc = getDefaultRpcInstance()

            const blockTxsResponse = await rpc.query.getBlockTxs(BigInt(3), true, 1, 10)
            expect(typeGuard(blockTxsResponse, QueryBlockTxsResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a block transaction list with empty proof object by setting the prove boolean to false', async () => {
            const rpc = getDefaultRpcInstance()

            const blockTxsResponse = await rpc.query.getBlockTxs(BigInt(187), false, 1, 10)
            expect(typeGuard(blockTxsResponse, QueryBlockTxsResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a list with all the network parameters', async () => {
            const rpc = getDefaultRpcInstance()

            const allParamsResponse = await rpc.query.getAllParams(BigInt(10))
            expect(typeGuard(allParamsResponse, QueryAllParamsResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a node claim list', async () => {
            const rpc = getDefaultRpcInstance()
            const obj = {
                address : nodeAddress,
                blockHeight: BigInt(0),
                page: 1,
                perPage: 30
            }
            const queryNodeClaimsResponse = await rpc.query.getNodeClaims(
                obj.address,
                obj.blockHeight,
                obj.page,
                obj.perPage
            )
            expect(typeGuard(queryNodeClaimsResponse, QueryNodeClaimsResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a node claim', async () => {
            const rpc = getDefaultRpcInstance()
            const obj = {
                address : "19c0551853f19ce1b7a4a1ede775c6e3db431b0f",
                appPubkey: "a7e8ec112d0c7bcb2521fe783eac704b874a148541f9e9d43bbb9f831503abea",
                blockchain: "0022",
                blockHeight: BigInt(261),
                sessionBlockHeight: BigInt(251),
                receiptType: "relay"
            }
            const queryNodeClaimResponse = await rpc.query.getNodeClaim(
                obj.address,
                obj.appPubkey,
                obj.blockchain,
                obj.blockHeight,
                obj.sessionBlockHeight,
                obj.receiptType
            )
            expect(typeGuard(queryNodeClaimResponse, QueryNodeClaimResponse)).to.be.true
        }).timeout(0)
    })
    describe("Error scenarios", async () => {
        it('should returns an error trying to get a block due block height lower than 0.', async () => {
            const rpc = getDefaultRpcInstance()

            const blockResponse = await rpc.query.getBlock(BigInt(-1))
            expect(typeGuard(blockResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get a transaction due to an invalid address hex.', async () => {
            // NockUtil.mockGetTx(500)

            const rpc = getDefaultRpcInstance()

            const txResponse = await rpc.query.getTX("0xw892400Dc3C5a5eeBc96070ccd575D6A720F0F9z")
            expect(typeGuard(txResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get a transaction due to an empty address hex.', async () => {
            // NockUtil.mockGetTx(500)

            const rpc = getDefaultRpcInstance()

            const txResponse = await rpc.query.getTX("")
            expect(typeGuard(txResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get the balance due to an invalid address.', async () => {
            // NockUtil.mockGetBalance(500)

            const rpc = getDefaultRpcInstance()

            const balanceResponse = await rpc.query.getBalance("0xz892400Dc3C5a5eeBc96070ccd575D6A720F0F9wee", BigInt(5))
            expect(typeGuard(balanceResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get the balance due to an empty address.', async () => {
            // NockUtil.mockGetBalance(500)

            const rpc = getDefaultRpcInstance()

            const balanceResponse = await rpc.query.getBalance("", BigInt(5))
            expect(typeGuard(balanceResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get the balance due to the block height less than 0.', async () => {
            // NockUtil.mockGetBalance(500)

            const rpc = getDefaultRpcInstance()

            const balanceResponse = await rpc.query.getBalance("0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f", BigInt(-1))
            expect(typeGuard(balanceResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get a list of nodes due to the block height less than 0.', async () => {
            const rpc = getDefaultRpcInstance()

            const nodeResponse = await rpc.query.getNodes(StakingStatus.Staked, JailedStatus.Unjailed, BigInt(-1), undefined, 1, 10)
            expect(typeGuard(nodeResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get a node due to an invalid address.', async () => {
            const rpc = getDefaultRpcInstance()

            const nodeResponse = await rpc.query.getNode("0xzA0b54D5dc17e0AadC383d2db43B0a0D3E029c4czz", BigInt(5))
            expect(typeGuard(nodeResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get a node due to an empty address.', async () => {
            const rpc = getDefaultRpcInstance()

            const nodeResponse = await rpc.query.getNode("", BigInt(5))
            expect(typeGuard(nodeResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get a node due to the block height is less than 0.', async () => {
            // NockUtil.mockGetNode(500)

            const rpc = getDefaultRpcInstance()

            const nodeResponse = await rpc.query.getNode("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c", BigInt(-1))
            expect(typeGuard(nodeResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get the node params due to the block height is less than 0.', async () => {
            // NockUtil.mockGetNodeParams(500)

            const rpc = getDefaultRpcInstance()

            const nodeParamsResponse = await rpc.query.getNodeParams(BigInt(-1))
            expect(typeGuard(nodeParamsResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get a list of apps due to the block height being less than 0.', async () => {
            // NockUtil.mockGetApps(500)

            const rpc = getDefaultRpcInstance()

            const appsResponse = await rpc.query.getApps(StakingStatus.Staked, BigInt(-1))
            expect(typeGuard(appsResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get an app due to an invalid address.', async () => {
            // NockUtil.mockGetApp(500)

            const rpc = getDefaultRpcInstance()

            const appResponse = await rpc.query.getApp("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4czz", BigInt(5))
            expect(typeGuard(appResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get an app due to block height being less than 0.', async () => {
            // NockUtil.mockGetApp(500)

            const rpc = getDefaultRpcInstance()

            const appResponse = await rpc.query.getApp("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c", BigInt(-5))
            expect(typeGuard(appResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get an app params due block height being less than 0.', async () => {
            // NockUtil.mockGetAppParams(500)

            const rpc = getDefaultRpcInstance()

            const appParamsResponse = await rpc.query.getAppParams(BigInt(-5))
            expect(typeGuard(appParamsResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get the pocket params due block height being less than 0.', async () => {
            // NockUtil.mockGetPocketParams(500)

            const rpc = getDefaultRpcInstance()

            const pocketParamsResponse = await rpc.query.getPocketParams(BigInt(-5))
            expect(typeGuard(pocketParamsResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get the supported chains due block height being less than 0.', async () => {
            // NockUtil.mockGetSupportedChains(500)

            const rpc = getDefaultRpcInstance()

            const supportedResponse = await rpc.query.getSupportedChains(BigInt(-5))
            expect(typeGuard(supportedResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get the supply due block height being less than 0.', async () => {
            // NockUtil.mockGetSupply(500)

            const rpc = getDefaultRpcInstance()

            const supplyResponse = await rpc.query.getSupply(BigInt(-5))
            expect(typeGuard(supplyResponse, RpcError)).to.be.true
        }).timeout(0)

        // it('should returns an error trying to get a challenge response due missing relay.', async () => {
        //     const rpc = getDefaultRpcInstance()

        //     const majorityResponse: MajorityResponse = new MajorityResponse([NockUtil.getMockRelayResponse()])
        //     const minorityResponse: MinorityResponse = new MinorityResponse(NockUtil.getMockRelayResponse())
        //     const challengeRequest: ChallengeRequest = new ChallengeRequest(majorityResponse, minorityResponse)

        //     const challengeResponse = await rpc.query.requestChallenge(challengeRequest)
        //     expect(typeGuard(challengeResponse, Error)).to.be.true
        // }).timeout(0)
    })
})