/**
 * @author Pabel Nunez Landestoy <pabel@pokt.network>
 * @description Unit test for the Pocket Core Query interface
 */
import * as dotenv from "dotenv"
import { expect } from "chai"
import { EnvironmentHelper, Network } from "../../../utils/env/helper"
import {
    Configuration, HttpRpcProvider, Pocket, typeGuard,
    QueryAccountResponse, QueryBlockResponse, QueryTXResponse,
    QueryHeightResponse, QueryBalanceResponse, StakingStatus,
    QueryValidatorsResponse, QueryNodeResponse, QueryNodeParamsResponse,
    QueryNodeReceiptsResponse, NodeReceipt, QueryNodeReceiptResponse,
    QueryAppsResponse, QueryAppResponse, QueryAppParamsResponse,
    QueryPocketParamsResponse, QuerySupportedChainsResponse, QuerySupplyResponse,
    RpcError,
    JailedStatus,
    QueryAccountTxsResponse,
    QueryNodeClaimsResponse,
    QueryNodeClaimResponse,
    QueryAllParamsResponse
} from "../../../../src"
import { ChallengeResponse } from "../../../../src/rpc/models/output/challenge-response"
import { ChallengeRequest } from "../../../../src/rpc/models/input/challenge-request"
import { MajorityResponse } from "../../../../src/rpc/models/input/majority-response"
import { MinorityResponse } from "../../../../src/rpc/models/input/minority-response"
import { NockUtil } from "../../../utils/nock-util"
import { QueryBlockTxsResponse } from "../../../../src/rpc/models/output/query-block-txs-response"

// Constants
// For Testing we are using dummy data, none of the following information is real.
const addressHex = "175090018C3796FA05F4C0120EC61E2BBDA523F6"
const ethBlockchain = "0022"
const blockchains = [ethBlockchain]
const nodeAddress = "19c0551853f19ce1b7a4a1ede775c6e3db431b0f"

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
const configuration = new Configuration(5, 1000, undefined, 40000)
const rpcProvider = new HttpRpcProvider(dispatcher)

// Default pocket instance to reuse code
function getPocketDefaultInstance(): Pocket {
    return new Pocket([dispatcher], rpcProvider, configuration)
}

describe("Pocket RPC Query Interface", async () => {
    describe("Success scenarios", async () => {

        it('should successfully retrieve an account information', async () => {
            const pocket = getPocketDefaultInstance()

            const accountResponse = await pocket.rpc()!.query.getAccount("19c0551853f19ce1b7a4a1ede775c6e3db431b0f")
            expect(typeGuard(accountResponse, QueryAccountResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a block information', async () => {
            const pocket = getPocketDefaultInstance()

            const blockResponse = await pocket.rpc()!.query.getBlock(BigInt(261))
            expect(typeGuard(blockResponse, QueryBlockResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a transaction information', async () => {
            const pocket = getPocketDefaultInstance()

            const txResponse = await pocket.rpc()!.query.getTX("E2ED1429911C45B8187FBED7D6AC59FF690F2D60CFD32C22676D5D2FA5E71BEA")
            expect(typeGuard(txResponse, QueryTXResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve the current block height', async () => {
            const pocket = getPocketDefaultInstance()

            const heightResponse = await pocket.rpc()!.query.getHeight()
            expect(typeGuard(heightResponse, QueryHeightResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve an account balance', async () => {
            const pocket = getPocketDefaultInstance()

            const balanceResponse = await pocket.rpc()!.query.getBalance("19c0551853f19ce1b7a4a1ede775c6e3db431b0f", BigInt(0))
            expect(typeGuard(balanceResponse, QueryBalanceResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a list of validator nodes', async () => {
            const pocket = getPocketDefaultInstance()

            const validatorResponse = await pocket.rpc()!.query.getNodes(StakingStatus.Staked, JailedStatus.Unjailed, BigInt(1), undefined, 1, 10)
            expect(typeGuard(validatorResponse, QueryValidatorsResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a node information', async () => {
            const pocket = getPocketDefaultInstance()

            const nodeResponse = await pocket.rpc()!.query.getNode(nodeAddress, BigInt(1))
            expect(typeGuard(nodeResponse, QueryNodeResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a node params information', async () => {
            const pocket = getPocketDefaultInstance()

            const nodeParamsResponse = await pocket.rpc()!.query.getNodeParams(BigInt(0))
            expect(typeGuard(nodeParamsResponse, QueryNodeParamsResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a list of apps', async () => {
            const pocket = getPocketDefaultInstance()

            const appsResponse = await pocket.rpc()!.query.getApps(StakingStatus.Staked, BigInt(1), undefined, 1, 10)
            expect(typeGuard(appsResponse, QueryAppsResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve an app information', async () => {
            const pocket = getPocketDefaultInstance()

            const appResponse = await pocket.rpc()!.query.getApp("802fddec29f99cae7a601cf648eafced1c062d39", BigInt(0))
            expect(typeGuard(appResponse, QueryAppResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve the app params', async () => {
            const pocket = getPocketDefaultInstance()

            const appParamsResponse = await pocket.rpc()!.query.getAppParams(BigInt(1))
            expect(typeGuard(appParamsResponse, QueryAppParamsResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve the Pocket params', async () => {
            const pocket = getPocketDefaultInstance()

            const pocketParamsResponse = await pocket.rpc()!.query.getPocketParams(BigInt(1))
            expect(typeGuard(pocketParamsResponse, QueryPocketParamsResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve the supported chains', async () => {
            const pocket = getPocketDefaultInstance()

            const supportedResponse = await pocket.rpc()!.query.getSupportedChains(BigInt(1))
            expect(typeGuard(supportedResponse, QuerySupportedChainsResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve the supply information', async () => {
            const pocket = getPocketDefaultInstance()

            const supplyResponse = await pocket.rpc()!.query.getSupply(BigInt(1))
            expect(typeGuard(supplyResponse, QuerySupplyResponse)).to.be.true
        }).timeout(0)

        // it('should successfully retrieve a challenge response', async () => {
        //     const env = EnvironmentHelper.getNetwork(process.env.localhost_env_url)
        //     const dispatcher = new URL(env.getPOKTRPC())
        //     const configuration = new Configuration(5, 1000, undefined, 40000)
        //     const rpcProvider = new HttpRpcProvider(dispatcher)
        //     const pocket = getPocketDefaultInstance()

        //     const majorityResponse: MajorityResponse = new MajorityResponse([NockUtil.getMockRelayResponse(), NockUtil.getMockRelayResponse()])
        //     const minorityResponse: MinorityResponse = new MinorityResponse(NockUtil.getMockRelayResponse())
        //     const challengeRequest: ChallengeRequest = new ChallengeRequest(majorityResponse, minorityResponse)

        //     const challengeResponse = await pocket.rpc()!.query.requestChallenge(challengeRequest)
        //     expect(typeGuard(challengeResponse, ChallengeResponse)).to.be.true
        // }).timeout(0)

        it('should successfully retrieve an account transaction list with the proof object by setting the prove boolean to true', async () => {
            const pocket = getPocketDefaultInstance()

            const accountTxsResponse = await pocket.rpc()!.query.getAccountTxs("19c0551853f19ce1b7a4a1ede775c6e3db431b0f", false, true, 1, 10)
            expect(typeGuard(accountTxsResponse, QueryAccountTxsResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve an account transaction list that with empty proof object by setting the prove boolean to false', async () => {
            const pocket = getPocketDefaultInstance()

            const accountTxsResponse = await pocket.rpc()!.query.getAccountTxs("19c0551853f19ce1b7a4a1ede775c6e3db431b0f", false, false, 1, 10)
            expect(typeGuard(accountTxsResponse, QueryAccountTxsResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve an account received transaction list by setting the received property to true', async () => {
            const pocket = getPocketDefaultInstance()

            const accountTxsResponse = await pocket.rpc()!.query.getAccountTxs("19c0551853f19ce1b7a4a1ede775c6e3db431b0f", true, false, 1, 10)
            expect(typeGuard(accountTxsResponse, QueryAccountTxsResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a block transaction list with the proof object by setting the prove boolean to true', async () => {
            const pocket = getPocketDefaultInstance()

            const blockTxsResponse = await pocket.rpc()!.query.getBlockTxs(BigInt(187), true, 1, 10)
            expect(typeGuard(blockTxsResponse, QueryBlockTxsResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a block transaction list with empty proof object by setting the prove boolean to false', async () => {
            const pocket = getPocketDefaultInstance()

            const blockTxsResponse = await pocket.rpc()!.query.getBlockTxs(BigInt(187), false, 1, 10)
            expect(typeGuard(blockTxsResponse, QueryBlockTxsResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a list of node receipts', async () => {
            const pocket = getPocketDefaultInstance()
            const obj = {
                address : "19c0551853f19ce1b7a4a1ede775c6e3db431b0f",
                blockHeight: BigInt(0),
                page: 1,
                perPage: 30
            }
            const nodeReceiptsResponse = await pocket.rpc()!.query.getNodeReceipts(
                obj.address,
                obj.blockHeight,
                obj.page,
                obj.perPage
            )
            expect(typeGuard(nodeReceiptsResponse, QueryNodeReceiptsResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a node receipt', async () => {
            const pocket = getPocketDefaultInstance()
            const obj = {
                address : "19c0551853f19ce1b7a4a1ede775c6e3db431b0f",
                appPubkey: "a7e8ec112d0c7bcb2521fe783eac704b874a148541f9e9d43bbb9f831503abea",
                blockchain: "0022",
                blockHeight: BigInt(0),
                sessionBlockHeight: BigInt(181),
                receiptType: "relay"
            }
            const nodeReceiptResponse = await pocket.rpc()!.query.getNodeReceipt(
                obj.address, 
                obj.appPubkey, 
                obj.blockchain, 
                obj.blockHeight, 
                obj.sessionBlockHeight, 
                obj.receiptType)
            expect(typeGuard(nodeReceiptResponse, QueryNodeReceiptResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a list with all the network parameters', async () => {
            const pocket = getPocketDefaultInstance()

            const allParamsResponse = await pocket.rpc()!.query.getAllParams(BigInt(10))
            expect(typeGuard(allParamsResponse, QueryAllParamsResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a node claim list', async () => {
            const pocket = getPocketDefaultInstance()
            const obj = {
                address : "19c0551853f19ce1b7a4a1ede775c6e3db431b0f",
                blockHeight: BigInt(261),
                page: 1,
                perPage: 30
            }
            const queryNodeClaimsResponse = await pocket.rpc()!.query.getNodeClaims(
                obj.address,
                obj.blockHeight,
                obj.page,
                obj.perPage
            )
            expect(typeGuard(queryNodeClaimsResponse, QueryNodeClaimsResponse)).to.be.true
        }).timeout(0)

        it('should successfully retrieve a node claim', async () => {
            const pocket = getPocketDefaultInstance()
            const obj = {
                address : "19c0551853f19ce1b7a4a1ede775c6e3db431b0f",
                appPubkey: "a7e8ec112d0c7bcb2521fe783eac704b874a148541f9e9d43bbb9f831503abea",
                blockchain: "0022",
                blockHeight: BigInt(261),
                sessionBlockHeight: BigInt(251),
                receiptType: "relay"
            }
            const queryNodeClaimResponse = await pocket.rpc()!.query.getNodeClaim(
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
    // describe("Error scenarios", async () => {
    //     it('should returns an error trying to get a block due block height lower than 0.', async () => {
    //         const pocket = getPocketDefaultInstance()

    //         const blockResponse = await pocket.rpc()!.query.getBlock(BigInt(-1))
    //         expect(typeGuard(blockResponse, RpcError)).to.be.true
    //     }).timeout(0)

    //     it('should returns an error trying to get a transaction due to an invalid address hex.', async () => {
    //         // NockUtil.mockGetTx(500)

    //         const pocket = getPocketDefaultInstance()

    //         const txResponse = await pocket.rpc()!.query.getTX("0xw892400Dc3C5a5eeBc96070ccd575D6A720F0F9z")
    //         expect(typeGuard(txResponse, RpcError)).to.be.true
    //     }).timeout(0)

    //     it('should returns an error trying to get a transaction due to an empty address hex.', async () => {
    //         // NockUtil.mockGetTx(500)

    //         const pocket = getPocketDefaultInstance()

    //         const txResponse = await pocket.rpc()!.query.getTX("")
    //         expect(typeGuard(txResponse, RpcError)).to.be.true
    //     }).timeout(0)

    //     // Figure out test
    //     // it('should returns an error trying to get the height due to internal server error.', async () => {
    //     //     // NockUtil.mockGetHeight(500)

    //     //     const pocket = getPocketDefaultInstance()

    //     //     const heightResponse = await pocket.rpc.query.getHeight()
    //     //     expect(typeGuard(heightResponse, RpcError)).to.be.true
    //     // }).timeout(0)

    //     it('should returns an error trying to get the balance due to an invalid address.', async () => {
    //         // NockUtil.mockGetBalance(500)

    //         const pocket = getPocketDefaultInstance()

    //         const balanceResponse = await pocket.rpc()!.query.getBalance("0xz892400Dc3C5a5eeBc96070ccd575D6A720F0F9wee", BigInt(5))
    //         expect(typeGuard(balanceResponse, RpcError)).to.be.true
    //     }).timeout(0)

    //     it('should returns an error trying to get the balance due to an empty address.', async () => {
    //         // NockUtil.mockGetBalance(500)

    //         const pocket = getPocketDefaultInstance()

    //         const balanceResponse = await pocket.rpc()!.query.getBalance("", BigInt(5))
    //         expect(typeGuard(balanceResponse, RpcError)).to.be.true
    //     }).timeout(0)

    //     it('should returns an error trying to get the balance due to the block height less than 0.', async () => {
    //         // NockUtil.mockGetBalance(500)

    //         const pocket = getPocketDefaultInstance()

    //         const balanceResponse = await pocket.rpc()!.query.getBalance("0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f", BigInt(-1))
    //         expect(typeGuard(balanceResponse, RpcError)).to.be.true
    //     }).timeout(0)

    //     it('should returns an error trying to get a list of nodes due to the block height less than 0.', async () => {
    //         const pocket = getPocketDefaultInstance()

    //         const nodeResponse = await pocket.rpc()!.query.getNodes(StakingStatus.Staked, JailedStatus.Unjailed, BigInt(-1), undefined, 1, 10)
    //         expect(typeGuard(nodeResponse, RpcError)).to.be.true
    //     }).timeout(0)

    //     it('should returns an error trying to get a node due to an invalid address.', async () => {
    //         const pocket = getPocketDefaultInstance()

    //         const nodeResponse = await pocket.rpc()!.query.getNode("0xzA0b54D5dc17e0AadC383d2db43B0a0D3E029c4czz", BigInt(5))
    //         expect(typeGuard(nodeResponse, RpcError)).to.be.true
    //     }).timeout(0)

    //     it('should returns an error trying to get a node due to an empty address.', async () => {
    //         const pocket = getPocketDefaultInstance()

    //         const nodeResponse = await pocket.rpc()!.query.getNode("", BigInt(5))
    //         expect(typeGuard(nodeResponse, RpcError)).to.be.true
    //     }).timeout(0)

    //     it('should returns an error trying to get a node due to the block height is less than 0.', async () => {
    //         // NockUtil.mockGetNode(500)

    //         const pocket = getPocketDefaultInstance()

    //         const nodeResponse = await pocket.rpc()!.query.getNode("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c", BigInt(-1))
    //         expect(typeGuard(nodeResponse, RpcError)).to.be.true
    //     }).timeout(0)

    //     it('should returns an error trying to get the node params due to the block height is less than 0.', async () => {
    //         // NockUtil.mockGetNodeParams(500)

    //         const pocket = getPocketDefaultInstance()

    //         const nodeParamsResponse = await pocket.rpc()!.query.getNodeParams(BigInt(-1))
    //         expect(typeGuard(nodeParamsResponse, RpcError)).to.be.true
    //     }).timeout(0)

    //     it('should returns an error trying to get a node receipts list of receipts due to an invalid address.', async () => {
    //         // NockUtil.mockGetNodeReceipts(500)

    //         const pocket = getPocketDefaultInstance()

    //         const nodeReceiptsResponse = await pocket.rpc()!.query.getNodeReceipts("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4czz", BigInt(5))
    //         expect(typeGuard(nodeReceiptsResponse, RpcError)).to.be.true
    //     }).timeout(0)

    //     it('should returns an error trying to get a node receipts list due to the block height being less than 0.', async () => {
    //         // NockUtil.mockGetNodeReceipts(500)

    //         const pocket = getPocketDefaultInstance()

    //         const nodeReceiptsResponse = await pocket.rpc()!.query.getNodeReceipts(addressHex, BigInt(-1))
    //         expect(typeGuard(nodeReceiptsResponse, RpcError)).to.be.true
    //     }).timeout(0)

    //     // Figure out test
    //     // it('should returns an error trying to get a receipt of a node due to internal server error.', async () => {
    //     //     // NockUtil.mockGetNodeReceipt(500)

    //     //     const nodeReceipt = new NodeReceipt(addressHex, "ETH10", applicationPublicKey, BigInt(0), BigInt(0))
    //     //     const pocket = getPocketDefaultInstance()

    //     //     const nodeReceiptResponse = await pocket.rpc.query.getNodeReceipt(nodeReceipt)
    //     //     expect(typeGuard(nodeReceiptResponse, RpcError)).to.be.true
    //     // }).timeout(0)

    //     it('should returns an error trying to get a list of apps due to the block height being less than 0.', async () => {
    //         // NockUtil.mockGetApps(500)

    //         const pocket = getPocketDefaultInstance()

    //         const appsResponse = await pocket.rpc()!.query.getApps(StakingStatus.Staked, BigInt(-1))
    //         expect(typeGuard(appsResponse, RpcError)).to.be.true
    //     }).timeout(0)

    //     it('should returns an error trying to get an app due to an invalid address.', async () => {
    //         // NockUtil.mockGetApp(500)

    //         const pocket = getPocketDefaultInstance()

    //         const appResponse = await pocket.rpc()!.query.getApp("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4czz", BigInt(5))
    //         expect(typeGuard(appResponse, RpcError)).to.be.true
    //     }).timeout(0)

    //     it('should returns an error trying to get an app due to block height being less than 0.', async () => {
    //         // NockUtil.mockGetApp(500)

    //         const pocket = getPocketDefaultInstance()

    //         const appResponse = await pocket.rpc()!.query.getApp("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c", BigInt(-5))
    //         expect(typeGuard(appResponse, RpcError)).to.be.true
    //     }).timeout(0)

    //     it('should returns an error trying to get an app params due block height being less than 0.', async () => {
    //         // NockUtil.mockGetAppParams(500)

    //         const pocket = getPocketDefaultInstance()

    //         const appParamsResponse = await pocket.rpc()!.query.getAppParams(BigInt(-5))
    //         expect(typeGuard(appParamsResponse, RpcError)).to.be.true
    //     }).timeout(0)

    //     it('should returns an error trying to get the pocket params due block height being less than 0.', async () => {
    //         // NockUtil.mockGetPocketParams(500)

    //         const pocket = getPocketDefaultInstance()

    //         const pocketParamsResponse = await pocket.rpc()!.query.getPocketParams(BigInt(-5))
    //         expect(typeGuard(pocketParamsResponse, RpcError)).to.be.true
    //     }).timeout(0)

    //     it('should returns an error trying to get the supported chains due block height being less than 0.', async () => {
    //         // NockUtil.mockGetSupportedChains(500)

    //         const pocket = getPocketDefaultInstance()

    //         const supportedResponse = await pocket.rpc()!.query.getSupportedChains(BigInt(-5))
    //         expect(typeGuard(supportedResponse, RpcError)).to.be.true
    //     }).timeout(0)

    //     it('should returns an error trying to get the supply due block height being less than 0.', async () => {
    //         // NockUtil.mockGetSupply(500)

    //         const pocket = getPocketDefaultInstance()

    //         const supplyResponse = await pocket.rpc()!.query.getSupply(BigInt(-5))
    //         expect(typeGuard(supplyResponse, RpcError)).to.be.true
    //     }).timeout(0)

    //     it('should returns an error trying to get a challenge response due missing relay.', async () => {
    //         const pocket = getPocketDefaultInstance()

    //         const majorityResponse: MajorityResponse = new MajorityResponse([NockUtil.getMockRelayResponse()])
    //         const minorityResponse: MinorityResponse = new MinorityResponse(NockUtil.getMockRelayResponse())
    //         const challengeRequest: ChallengeRequest = new ChallengeRequest(majorityResponse, minorityResponse)

    //         const challengeResponse = await pocket.rpc()!.query.requestChallenge(challengeRequest)
    //         expect(typeGuard(challengeResponse, Error)).to.be.true
    //     }).timeout(0)
    // })
})