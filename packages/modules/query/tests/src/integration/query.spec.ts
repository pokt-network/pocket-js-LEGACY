/**
 * @author Pabel Nunez Landestoy <pabel@pokt.network>
 * @description Integration tests for the Pocket Core Query interface
 */
import { expect } from "chai"
import { typeGuard, RpcError } from "@pokt-network/pocket-js-utils"
import {
    QueryAccountResponse, QueryBlockResponse, QueryTXResponse,
    QueryHeightResponse, QueryBalanceResponse, StakingStatus,
    QueryNodesResponse, QueryNodeResponse, QueryNodeParamsResponse,
    QueryAppsResponse, QueryAppResponse, QueryAppParamsResponse,
    QueryPocketParamsResponse, QuerySupportedChainsResponse, QuerySupplyResponse,
    JailedStatus, QueryAccountTxsResponse, QueryNodeClaimsResponse, QueryNodeClaimResponse, QueryAllParamsResponse,
    QueryBlockTxsResponse, QueryUpgradeResponse
} from "@pokt-network/pocket-js-rpc-models"
import { HttpRpcProvider } from "@pokt-network/pocket-js-http-provider"
import { Query } from "../../../src/query"
import { NockUtil } from "@pokt-network/pocket-js-nock-utils"

// Constants
const appAddress = "57adff41d7339b63a9e6f5e93bb82406b1160c8d"
const nodeAddress = "da0d712e0ad5b37393c022c3333bed46c8667d0a"
const dispatcher = new URL("http://localhost:8081")
const rpcProvider = new HttpRpcProvider(dispatcher)

// Default pocket instance to reuse code
function getDefaultRpcInstance(): Query {
    return new Query(rpcProvider)
}

describe("Pocket RPC Query Interface", async () => {
    describe("Success scenarios", async () => {

        it('should successfully retrieve an account information', async () => {
            const query = getDefaultRpcInstance()
            // Nock
            NockUtil.mockGetAccount()
            const accountResponse = await query.getAccount("da0d712e0ad5b37393c022c3333bed46c8667d0a")
            expect(typeGuard(accountResponse, QueryAccountResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a block information', async () => {
            const query = getDefaultRpcInstance()
            // Nock
            NockUtil.mockGetBlock()
            const blockResponse = await query.getBlock(BigInt(26377))
            expect(typeGuard(blockResponse, QueryBlockResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a transaction information', async () => {
            const query = getDefaultRpcInstance()
            // Nock
            NockUtil.mockGetTx()
            const txResponse = await query.getTX("6E09E914DC3596719A5B31DDF68C5FDCC152EBEA55F65B19F8341A894DEC2071")
            expect(typeGuard(txResponse, QueryTXResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve the current block height', async () => {
            const query = getDefaultRpcInstance()
            // Nock
            NockUtil.mockGetHeight()
            const heightResponse = await query.getHeight()
            expect(typeGuard(heightResponse, QueryHeightResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve an account balance', async () => {
            const query = getDefaultRpcInstance()
            // Nock
            NockUtil.mockGetBalance()
            const balanceResponse = await query.getBalance("da0d712e0ad5b37393c022c3333bed46c8667d0a", BigInt(0))
            expect(typeGuard(balanceResponse, QueryBalanceResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a list of validator nodes', async () => {
            const query = getDefaultRpcInstance()
            // Nock
            NockUtil.mockGetNodesWithJailedAndStakingStatus()
            const nodesResponse = await query.getNodes(StakingStatus.Staked, JailedStatus.Unjailed, BigInt(1), "", 1, 10)
            expect(typeGuard(nodesResponse, QueryNodesResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a list of validator nodes with staking status', async () => {
            const query = getDefaultRpcInstance()
            // Nock
            NockUtil.mockGetNodesWithStakingStatus()
            const nodesResponse = await query.getNodes(StakingStatus.Staked, undefined, BigInt(0), "", 1, 10)
            expect(typeGuard(nodesResponse, QueryNodesResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a list of validator nodes with jail status', async () => {
            const query = getDefaultRpcInstance()
            // Nock
            NockUtil.mockGetNodesWithJailedStatus()
            const nodesResponse = await query.getNodes(undefined, JailedStatus.Unjailed, BigInt(0), "", 1, 10)
            expect(typeGuard(nodesResponse, QueryNodesResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a list of validator nodes with staking and jailed status', async () => {
            const query = getDefaultRpcInstance()
            // Nock
            NockUtil.mockGetNodesWithJailedAndStakingStatus()
            const nodesResponse = await query.getNodes(StakingStatus.Staked, JailedStatus.Unjailed, BigInt(0), "", 1, 10)
            expect(typeGuard(nodesResponse, QueryNodesResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a node information', async () => {
            const query = getDefaultRpcInstance()
            // Nock
            NockUtil.mockGetNode()
            const nodeResponse = await query.getNode(nodeAddress, BigInt(1))
            expect(typeGuard(nodeResponse, QueryNodeResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a node params information', async () => {
            const query = getDefaultRpcInstance()
            // Nock
            NockUtil.mockGetNodeParams()
            const nodeParamsResponse = await query.getNodeParams(BigInt(0))
            expect(typeGuard(nodeParamsResponse, QueryNodeParamsResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a list of apps', async () => {
            const query = getDefaultRpcInstance()
            // Nock
            NockUtil.mockGetApps()
            const appsResponse = await query.getApps(StakingStatus.Staked, BigInt(1), undefined, 1, 10)
            expect(typeGuard(appsResponse, QueryAppsResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a list of apps without staking status', async () => {
            const query = getDefaultRpcInstance()
            // Nock
            NockUtil.mockGetApps()
            const appsResponse = await query.getApps(StakingStatus.Staked, BigInt(1), undefined, 1, 10)
            expect(typeGuard(appsResponse, QueryAppsResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve an app information', async () => {
            const query = getDefaultRpcInstance()
            // Nock
            NockUtil.mockGetApp()
            const appResponse = await query.getApp(appAddress, BigInt(0))
            expect(typeGuard(appResponse, QueryAppResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve the app params', async () => {
            const query = getDefaultRpcInstance()
            // Nock
            NockUtil.mockGetAppParams()
            const appParamsResponse = await query.getAppParams(BigInt(1))
            expect(typeGuard(appParamsResponse, QueryAppParamsResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve the Pocket params', async () => {
            const query = getDefaultRpcInstance()
            // Nock
            NockUtil.mockGetPocketParams()
            const pocketParamsResponse = await query.getPocketParams(BigInt(1))
            expect(typeGuard(pocketParamsResponse, QueryPocketParamsResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve the supported chains', async () => {
            const query = getDefaultRpcInstance()
            // Nock
            NockUtil.mockGetSupportedChains()
            const supportedResponse = await query.getSupportedChains(BigInt(1))
            expect(typeGuard(supportedResponse, QuerySupportedChainsResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve the supply information', async () => {
            const query = getDefaultRpcInstance()
            // Nock
            NockUtil.mockGetSupply()
            const supplyResponse = await query.getSupply(BigInt(1))
            expect(typeGuard(supplyResponse, QuerySupplyResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve an account transaction list with the proof object by setting the prove boolean to true', async () => {
            const query = getDefaultRpcInstance()
            // Nock
            NockUtil.mockAccountTxs()
            const accountTxsResponse = await query.getAccountTxs(nodeAddress, false, true, 1, 10)
            expect(typeGuard(accountTxsResponse, QueryAccountTxsResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve an account transaction list that with empty proof object by setting the prove boolean to false', async () => {
            const query = getDefaultRpcInstance()
            // Nock
            NockUtil.mockAccountTxsWithProve()
            const accountTxsResponse = await query.getAccountTxs(nodeAddress, false, false, 1, 10)
            expect(typeGuard(accountTxsResponse, QueryAccountTxsResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve an account received transaction list by setting the received property to true', async () => {
            const query = getDefaultRpcInstance()
            // Nock
            NockUtil.mockAccountTxsWithProve()
            const accountTxsResponse = await query.getAccountTxs(nodeAddress, true, false, 1, 10)
            expect(typeGuard(accountTxsResponse, QueryAccountTxsResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a block transaction list with the proof object by setting the prove boolean to true', async () => {
            const query = getDefaultRpcInstance()
            // Nock
            NockUtil.mockBlockTxs()
            const blockTxsResponse = await query.getBlockTxs(BigInt(3), true, 1, 10)
            expect(typeGuard(blockTxsResponse, QueryBlockTxsResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a block transaction list with empty proof object by setting the prove boolean to false', async () => {
            const query = getDefaultRpcInstance()
            // Nock
            NockUtil.mockBlockTxsWithProve()
            const blockTxsResponse = await query.getBlockTxs(BigInt(187), false, 1, 10)
            expect(typeGuard(blockTxsResponse, QueryBlockTxsResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a list with all the network parameters', async () => {
            const query = getDefaultRpcInstance()
            // Nock
            NockUtil.mockGetAllParams()
            const allParamsResponse = await query.getAllParams(BigInt(10))
            expect(typeGuard(allParamsResponse, QueryAllParamsResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve the amino to protobuf upgrade information', async () => {
            const query = getDefaultRpcInstance()
            // Nock
            NockUtil.mockGetUpgrade()
            const upgradeResponse = await query.getUpgrade()
            expect(typeGuard(upgradeResponse, QueryUpgradeResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a node claims list', async () => {
            const query = getDefaultRpcInstance()
            const obj = {
                address : "033b2a160343ca53819a0fa40bf76b1dfe280a7f",
                blockHeight: BigInt(26545),
                page: 1,
                perPage: 3
            }
            // Nock
            NockUtil.mockGetNodeClaims()
            const queryNodeClaimsResponse = await query.getNodeClaims(
                obj.address,
                obj.blockHeight,
                obj.page,
                obj.perPage
            )
            expect(typeGuard(queryNodeClaimsResponse, QueryNodeClaimsResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a node claim', async () => {
            const query = getDefaultRpcInstance()
            const obj = {
                address : "19c0551853f19ce1b7a4a1ede775c6e3db431b0f",
                appPubkey: "a7e8ec112d0c7bcb2521fe783eac704b874a148541f9e9d43bbb9f831503abea",
                blockchain: "0022",
                blockHeight: BigInt(261),
                sessionBlockHeight: BigInt(251),
                receiptType: "relay"
            }
            // Nock
            NockUtil.mockGetNodeClaim()
            const queryNodeClaimResponse = await query.getNodeClaim(
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
            const query = getDefaultRpcInstance()

            const blockResponse = await query.getBlock(BigInt(-1))
            expect(typeGuard(blockResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get a transaction due to an invalid address hex.', async () => {
            const query = getDefaultRpcInstance()

            const txResponse = await query.getTX("5EAE1505666E810F3F67110C680E9673C4859971C4803016D66CE244D23D8DE4")
            expect(typeGuard(txResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get a transaction due to an empty address hex.', async () => {
            const query = getDefaultRpcInstance()

            const txResponse = await query.getTX("")
            expect(typeGuard(txResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get the balance due to an invalid address.', async () => {
            const query = getDefaultRpcInstance()

            const balanceResponse = await query.getBalance("0xz892400Dc3C5a5eeBc96070ccd575D6A720F0F9wee", BigInt(5))
            expect(typeGuard(balanceResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get the balance due to an empty address.', async () => {
            const query = getDefaultRpcInstance()

            const balanceResponse = await query.getBalance("", BigInt(5))
            expect(typeGuard(balanceResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get the balance due to the block height less than 0.', async () => {
            const query = getDefaultRpcInstance()

            const balanceResponse = await query.getBalance("0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f", BigInt(-1))
            expect(typeGuard(balanceResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get a list of nodes due to the block height less than 0.', async () => {
            const query = getDefaultRpcInstance()

            const nodeResponse = await query.getNodes(StakingStatus.Staked, JailedStatus.Unjailed, BigInt(-1), undefined, 1, 10)
            expect(typeGuard(nodeResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get a node due to an invalid address.', async () => {
            const query = getDefaultRpcInstance()

            const nodeResponse = await query.getNode("0xzA0b54D5dc17e0AadC383d2db43B0a0D3E029c4czz", BigInt(5))
            expect(typeGuard(nodeResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get a node due to an empty address.', async () => {
            const query = getDefaultRpcInstance()

            const nodeResponse = await query.getNode("", BigInt(5))
            expect(typeGuard(nodeResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get a node due to the block height is less than 0.', async () => {
            const query = getDefaultRpcInstance()

            const nodeResponse = await query.getNode("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c", BigInt(-1))
            expect(typeGuard(nodeResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get the node params due to the block height is less than 0.', async () => {
            const query = getDefaultRpcInstance()

            const nodeParamsResponse = await query.getNodeParams(BigInt(-1))
            expect(typeGuard(nodeParamsResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get a list of apps due to the block height being less than 0.', async () => {
            const query = getDefaultRpcInstance()

            const appsResponse = await query.getApps(StakingStatus.Staked, BigInt(-1))
            expect(typeGuard(appsResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get an app due to an invalid address.', async () => {
            const query = getDefaultRpcInstance()

            const appResponse = await query.getApp("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4czz", BigInt(5))
            expect(typeGuard(appResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get an app due to block height being less than 0.', async () => {
            const query = getDefaultRpcInstance()

            const appResponse = await query.getApp("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c", BigInt(-5))
            expect(typeGuard(appResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get an app params due block height being less than 0.', async () => {
            const query = getDefaultRpcInstance()

            const appParamsResponse = await query.getAppParams(BigInt(-5))
            expect(typeGuard(appParamsResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get the pocket params due block height being less than 0.', async () => {
            const query = getDefaultRpcInstance()

            const pocketParamsResponse = await query.getPocketParams(BigInt(-5))
            expect(typeGuard(pocketParamsResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get the supported chains due block height being less than 0.', async () => {
            const query = getDefaultRpcInstance()

            const supportedResponse = await query.getSupportedChains(BigInt(-5))
            expect(typeGuard(supportedResponse, RpcError)).to.be.true
        }).timeout(0)

        it('should returns an error trying to get the supply due block height being less than 0.', async () => {
            const query = getDefaultRpcInstance()

            const supplyResponse = await query.getSupply(BigInt(-5))
            expect(typeGuard(supplyResponse, RpcError)).to.be.true
        }).timeout(0)
    })
})