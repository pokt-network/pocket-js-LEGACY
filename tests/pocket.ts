/**
 * @author Pabel Nunez Landestoy <pabel@pokt.network>
 * @description Unit test for the Pocket Core
 */
// Constants
import { expect } from 'chai'
import { Pocket } from '../src/pocket'
import { Configuration, RelayRequest, RpcErrorResponse, RelayResponse, QueryBlockResponse, QueryTXResponse, QueryHeightResponse, QueryBalanceResponse, StakingStatus, QueryNodesResponse, QueryNodeResponse, QueryNodeParamsResponse, QueryNodeProofsResponse, NodeProof, QueryNodeProofResponse, QueryAppsResponse, QueryAppResponse, QueryAppParamsResponse, QueryPocketParamsResponse, QuerySupportedChainsResponse, QuerySupplyResponse } from '../src'
import { Node } from "../src/models/node"
import { BondStatus } from "../src/models/output/bond-status"
import { PocketAAT } from "pocket-aat-js"
import { NockUtil } from '../src/utils/nock-util' 

// For Testing we are using dummy data, none of the following information is real.
const version = '0.0.1'
const clientPublicKey = 'f6d04ee2490e85f3f9ade95b80948816bd9b2986d5554aae347e7d21d93b6fb5'
const applicationPublicKey = 'd9c7f275388ca1f87900945dba7f3a90fa9bba78f158c070aa12e3eccf53a2eb'
const applicationPrivateKey = '15f53145bfa6efdde6e65ce5ebfd330ac0a2591ae451a8a03ace99eff894b9eed9c7f275388ca1f87900945dba7f3a90fa9bba78f158c070aa12e3eccf53a2eb'
const applicationSignature = '7c3706dce9a5248187cb58cf1d65f12d93c7dfc500de8cfe76b6f925f450d1678ccba666a0374fc83f89f986fc1af640a6000a6b94dd0c9a87d9060613c6b504'
// TODO: Add Pocket interfae tests for PocketAAT related functions, this will be done with issue:
// https://github.com/pokt-network/pocket-js/issues/166
const pocketAAT = PocketAAT.from(version, clientPublicKey, applicationPublicKey, applicationPrivateKey)
const node = new Node("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c","0x1", 
false, BondStatus.bonded, BigInt(0), "127.0.0.1:80", 
["eth","aion"], undefined)
const configuration = new Configuration(5, 40000, 200)

describe("Pocket Interface functionalities", () => {
    describe("Success scenarios", () => {
        it('should instantiate a Pocket instance due to a valid configuration is being used',() => {
            
            const pocket = new Pocket(configuration)
            
            expect(pocket).to.not.be.an.instanceof(Error)
            expect(pocket).to.be.an.instanceof(Pocket)
        }).timeout(0)

        it('should instance a RelayRequest instance due to a node is being passed ', () => {
            const pocket = new Pocket(configuration)
            pocket.routingTable.addNode(node)

            const data = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f\",\"latest\"],\"id\":67}'
            const headers: Record<string, string> = {
                "Content-Type": "application/json"
            }
            pocket.createRelayRequest(data, "ETH", headers, pocketAAT, node, true, "GET", "network/version").then(request => {
                expect(request).to.be.an.instanceOf(RelayRequest)
                expect(request).to.not.be.an.instanceOf(RpcErrorResponse)
            })
            
        }).timeout(0)

        it('should send a relay due to a valid RelayRequest is being created and used', () => {
            const pocket = new Pocket(configuration)
            pocket.routingTable.addNode(node)

            const data = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f\",\"latest\"],\"id\":67}'
            const headers: Record<string, string> = {
                "Content-Type": "application/json"
            }
            pocket.createRelayRequest(data, "ETH", headers, pocketAAT, node, true, "GET", "network/version").then(request => {
                if(request instanceof RelayRequest){
                    NockUtil.mockRelay()
                    pocket.sendRelay(request, configuration).then(relayResponse => {
                        expect(relayResponse).to.be.instanceOf(RelayResponse)
                    })
                }
            })
        }).timeout(0)

        it('should get a block due to a valid node and a valid configuration are being used', () => {
            NockUtil.mockGetBlock()

            const pocket = new Pocket(configuration)
            pocket.routingTable.addNode(node)

            pocket.getBlock(BigInt(5), true).then(blockResponse => {
                expect(blockResponse).to.be.instanceOf(QueryBlockResponse)
            })
        }).timeout(0)

        it('should get a transaction due to a valid node and a valid configuration are being used', () => {
            NockUtil.mockGetTx()

            const pocket = new Pocket(configuration)
            pocket.routingTable.addNode(node)

            pocket.getTX("0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f", true).then(txResponse => {
                expect(txResponse).to.be.instanceOf(QueryTXResponse)
            })
        }).timeout(0)

        it('should get the height due to a valid node and a valid configuration are being used', () => {
            NockUtil.mockGetHeight()

            const pocket = new Pocket(configuration)
            pocket.routingTable.addNode(node)

            pocket.getHeight(true).then(heightResponse => {
                expect(heightResponse).to.be.instanceOf(QueryHeightResponse)
            })
        }).timeout(0)

        it('should get the balance due to a valid node and a valid configuration are being used', () => {
            NockUtil.mockGetBalance()

            const pocket = new Pocket(configuration)
            pocket.routingTable.addNode(node)

            pocket.getBalance("0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f", BigInt(5), true).then(balanceResponse => {
                expect(balanceResponse).to.be.instanceOf(QueryBalanceResponse)
            })
        }).timeout(0)

        it('should get a list of nodes due to the proper request is being created', () => {
            NockUtil.mockGetNodes()

            const pocket = new Pocket(configuration)
            pocket.routingTable.addNode(node)

            pocket.getNodes(StakingStatus.Staked, BigInt(5), true).then(nodeResponse => {
                expect(nodeResponse).to.be.instanceOf(QueryNodesResponse)
            })
        }).timeout(0)

        it('should get a node due to an existing address is being used', () => {
            NockUtil.mockGetNode()

            const pocket = new Pocket(configuration)
            pocket.routingTable.addNode(node)

            pocket.getNode("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c", BigInt(5), true).then(nodeResponse => {
                expect(nodeResponse).to.be.instanceOf(QueryNodeResponse)
            })
        }).timeout(0)

        it('should get a node params due to a valid node and a valid configuration are being used', () => {
            NockUtil.mockGetNodeParams()

            const pocket = new Pocket(configuration)
            pocket.routingTable.addNode(node)

            pocket.getNodeParams(BigInt(5), true).then(nodeParamsResponse => {
                expect(nodeParamsResponse).to.be.instanceOf(QueryNodeParamsResponse)
            })
        }).timeout(0)

        it('should get a list of proofs of a node due to a valid address is being used', () => {
            NockUtil.mockGetNodeProofs()

            const pocket = new Pocket(configuration)
            pocket.routingTable.addNode(node)

            pocket.getNodeProofs("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c", BigInt(5), true).then(nodeProofsResponse => {
                expect(nodeProofsResponse).to.be.instanceOf(QueryNodeProofsResponse)
            })
        }).timeout(0)

        it('should get a proof of a node due to a valid node and a valid NodeProof are being used', () => {
            NockUtil.mockGetNodeProof()

            const nodeProof = new NodeProof("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c", "ETH10", "0x1", BigInt(0), BigInt(0))
            const pocket = new Pocket(configuration)
            pocket.routingTable.addNode(node)

            pocket.getNodeProof(nodeProof, true).then(nodeProofResponse => {
                expect(nodeProofResponse).to.be.instanceOf(QueryNodeProofResponse)
            })
        }).timeout(0)

        it('should get a list of apps due to a valid node and a valid configuration are being used', () => {
            NockUtil.mockGetApps()

            const pocket = new Pocket(configuration)
            pocket.routingTable.addNode(node)

            pocket.getApps(StakingStatus.Staked, BigInt(5), true).then(appsResponse => {
                expect(appsResponse).to.be.instanceOf(QueryAppsResponse)
            })
        }).timeout(0)

        it('should get an app due to a valid address is being used', () => {
            NockUtil.mockGetApp()

            const pocket = new Pocket(configuration)
            pocket.routingTable.addNode(node)

            pocket.getApp("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c", BigInt(5), true).then(appResponse => {
                expect(appResponse).to.be.instanceOf(QueryAppResponse)
            })
        }).timeout(0)

        it('should get an app params due to a valid node and a valid configuration are being used', () => {
            NockUtil.mockGetAppParams()

            const pocket = new Pocket(configuration)
            pocket.routingTable.addNode(node)

            pocket.getAppParams(BigInt(5), true).then(appParamsResponse => {
                expect(appParamsResponse).to.be.instanceOf(QueryAppParamsResponse)
            })
        }).timeout(0)

        it('should get the pocket params due to a valid node and a valid configuration are being used', () => {
            NockUtil.mockGetPocketParams()

            const pocket = new Pocket(configuration)
            pocket.routingTable.addNode(node)

            pocket.getPocketParams(BigInt(5), true).then(pocketParamsResponse => {
                expect(pocketParamsResponse).to.be.instanceOf(QueryPocketParamsResponse)
            })
        }).timeout(0)

        it('should get the supported chains due to a valid node and a valid configuration are being used', () => {
            NockUtil.mockGetSupportedChains()

            const pocket = new Pocket(configuration)
            pocket.routingTable.addNode(node)

            pocket.getSupportedChains(BigInt(5), true).then(supportedResponse => {
                expect(supportedResponse).to.be.instanceOf(QuerySupportedChainsResponse)
            })
        }).timeout(0)

        it('should get the supply due to a valid node and a valid configuration are being used', () => {
            NockUtil.mockGetSupply()

            const pocket = new Pocket(configuration)
            pocket.routingTable.addNode(node)

            pocket.getSupply(BigInt(5), true).then(supplyResponse => {
                expect(supplyResponse).to.be.instanceOf(QuerySupplyResponse)
            })
        }).timeout(0)
    })

    describe("Error scenarios", () => {

        it('should error to create an instance of RelayRequest instance due to no nodes are being passed', () => {
            const pocket = new Pocket(configuration)
            const data = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f\",\"latest\"],\"id\":67}'
            const headers: Record<string, string> = {
                "Content-Type": "application/json"
            }
            const relayRequest = pocket.createRelayRequest(data, "ETH", headers, pocketAAT, undefined, true, "GET", "network/version")

            pocket.createRelayRequest(data, "ETH", headers, pocketAAT, node, true, "GET", "network/version").then(request => {
                expect(request).to.not.be.an.instanceOf(RelayRequest)
                expect(request).to.be.an.instanceOf(RpcErrorResponse)
            })
        }).timeout(0)

        it('should error to send a relay due to the lack of a valid node. An RpcErrorResponse is expected', () => {
            const pocket = new Pocket(configuration)

            const data = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f\",\"latest\"],\"id\":67}'
            const headers: Record<string, string> = {
                "Content-Type": "application/json"
            }
            pocket.createRelayRequest(data, "ETH", headers, pocketAAT, node, true, "GET", "network/version").then(request => {
                if(request instanceof RelayRequest){
                    NockUtil.mockRelay(500)
                    pocket.sendRelay(request, configuration).then(relayResponse => {
                        expect(relayResponse).to.be.instanceOf(RpcErrorResponse)
                    })
                }
            })
        }).timeout(0)

        it('should returns an error trying to get a block due to the lack of a valid node. An RpcErrorResponse is expected', () => {
            NockUtil.mockGetBlock(500)

            const pocket = new Pocket(configuration)
            
            pocket.getBlock(BigInt(5), true).then(blockResponse => {
                expect(blockResponse).to.be.instanceOf(RpcErrorResponse)
            })
        }).timeout(0)

        it('should returns an error trying to get a transaction due to an address is not being sent. An RpcErrorResponse is expected', () => {
            NockUtil.mockGetTx(500)

            const pocket = new Pocket(configuration)
            pocket.getTX("", true).then(txResponse => {
                expect(txResponse).to.be.instanceOf(RpcErrorResponse)
            })
        }).timeout(0)

        it('should returns an error trying to get the height due to the lack of a valid node. An RpcErrorResponse is expected', () => {
            NockUtil.mockGetHeight(500)

            const pocket = new Pocket(configuration)
            
            pocket.getHeight(true).then(heightResponse => {
                expect(heightResponse).to.be.instanceOf(RpcErrorResponse)
            })
        }).timeout(0)

        it('should returns an error trying to get the balance due to an invalid address is being sent. An RpcErrorResponse is expected', () => {
            NockUtil.mockGetBalance(500)

            const pocket = new Pocket(configuration)
        
            pocket.getBalance("0xa", BigInt(5), true).then(balanceResponse => {
                expect(balanceResponse).to.be.instanceOf(RpcErrorResponse)
            })
        }).timeout(0)

        it('should returns an error trying to get a list of nodes due to the lack of a valid node. An RpcErrorResponse is expected', () => {
            NockUtil.mockGetNodes(500)

            const pocket = new Pocket(configuration)
            
            pocket.getNodes(StakingStatus.Staked, BigInt(5), true).then(nodesResponse => {
                expect(nodesResponse).to.be.instanceOf(RpcErrorResponse)
            })
        }).timeout(0)

        it('should returns an error trying to get a node due to an invalid address is being sent. An RpcErrorResponse is expected', () => {
            NockUtil.mockGetNode(500)

            const pocket = new Pocket(configuration)
            pocket.routingTable.addNode(node)

            pocket.getNode("0xa", BigInt(5), true).then(nodeResponse => {
                expect(nodeResponse).to.be.instanceOf(RpcErrorResponse)
            })
        }).timeout(0)

        it('should returns an error trying to get the node params due to the lack of a valid node. An RpcErrorResponse is expected', () => {
            NockUtil.mockGetNodeParams(500)

            const pocket = new Pocket(configuration)

            pocket.getNodeParams(BigInt(5), true).then(nodeParamsResponse => {
                expect(nodeParamsResponse).to.be.instanceOf(RpcErrorResponse)
            })
        }).timeout(0)

        it('should returns an error trying to get a list of proofs of a node due to an invalid address is being sent. An RpcErrorResponse is expected', () => {
            NockUtil.mockGetNodeProofs(500)

            const pocket = new Pocket(configuration)

            pocket.getNodeProofs("0xa", BigInt(5), true).then(nodeProofsResponse => {
                expect(nodeProofsResponse).to.be.instanceOf(RpcErrorResponse)
            })
        }).timeout(0)

        it('should returns an error trying to get a proof of a node due to a invalid NodeProof is being used. An RpcErrorResponse is expected', () => {
            NockUtil.mockGetNodeProof(500)

            const nodeProof = new NodeProof(")x0", "ETH10", "0x1", BigInt(0), BigInt(0))
            const pocket = new Pocket(configuration)
            pocket.routingTable.addNode(node)

            pocket.getNodeProof(nodeProof, true).then(nodeProofResponse => {
                expect(nodeProofResponse).to.be.instanceOf(RpcErrorResponse)
            })
        }).timeout(0)

        it('should returns an error trying to get a list of apps due to the lack of a valid node. An RpcErrorResponse is expected', () => {
            NockUtil.mockGetApps(500)

            const pocket = new Pocket(configuration)

            pocket.getApps(StakingStatus.Staked, BigInt(5), true).then(appsResponse => {
                expect(appsResponse).to.be.instanceOf(RpcErrorResponse)
            })
        }).timeout(0)

        it('should returns an error trying to get an app due to an invalid address is being sent. An RpcErrorResponse is expected', () => {
            NockUtil.mockGetApp(500)

            const pocket = new Pocket(configuration)
            pocket.routingTable.addNode(node)

            pocket.getApp("0x1", BigInt(5), true).then(appResponse => {
                expect(appResponse).to.be.instanceOf(RpcErrorResponse)
            })
        }).timeout(0)

        it('should returns an error trying to get an app params due to the lack of a valid node. An RpcErrorResponse is expected', () => {
            NockUtil.mockGetAppParams(500)

            const pocket = new Pocket(configuration)

            pocket.getAppParams(BigInt(5), true).then(appParamsResponse => {
                expect(appParamsResponse).to.be.instanceOf(RpcErrorResponse)
            })
        }).timeout(0)

        it('should returns an error trying to get the pocket params due to the lack of a valid node. An RpcErrorResponse is expected', () => {
            NockUtil.mockGetPocketParams(500)

            const pocket = new Pocket(configuration)

            pocket.getPocketParams(BigInt(5), true).then(pocketParamsResponse => {
                expect(pocketParamsResponse).to.be.instanceOf(RpcErrorResponse)
            })
        }).timeout(0)

        it('should returns an error trying to get the supported chains due to the lack of a valid node. An RpcErrorResponse is expected', () => {
            NockUtil.mockGetSupportedChains(500)

            const pocket = new Pocket(configuration)

            pocket.getSupportedChains(BigInt(5), true).then(supportedResponse => {
                expect(supportedResponse).to.be.instanceOf(RpcErrorResponse)
            })
        }).timeout(0)

        it('should returns an error trying to get the supply due to the lack of a valid node. An RpcErrorResponse is expected', () => {
            NockUtil.mockGetSupply(500)

            const pocket = new Pocket(configuration)

            pocket.getSupply(BigInt(5), true).then(supplyResponse => {
                expect(supplyResponse).to.be.instanceOf(RpcErrorResponse)
            })
        }).timeout(0)
    }) 
})