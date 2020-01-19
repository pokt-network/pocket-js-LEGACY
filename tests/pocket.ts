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
import nock from 'nock'
import { NockUtil } from '../src/utils/nock-util' 

const pocketAAT = new PocketAAT("0.1.0", "0xc", "0x1")
const node = new Node("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c","0x1", false, BondStatus.bonded, BigInt(0), "127.0.0.1:80", ["eth","aion"], undefined)
const validConfiguration = new Configuration(["ETH10"], pocketAAT, 5, 40000, true)
const invalidConfiguration = new Configuration([], undefined, 5, 40000, true)

describe("Pocket Interface functionalities", () => {
    describe("Success scenarios", () => {
        it('should instantiate a Pocket instance',() => {
            
            const pocket = new Pocket(validConfiguration)
            
            expect(pocket).to.not.be.an.instanceof(Error)
            expect(pocket).to.be.an.instanceof(Pocket)
        }).timeout(0)

        it('should instance a RelayRequest instance', () => {
            const pocket = new Pocket(validConfiguration)
            pocket.routingTable.addNode(node)

            const data = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f\",\"latest\"],\"id\":67}'
            const headers: Record<string, string> = {
                "Content-Type": "application/json"
            }
            pocket.createRelayRequest(data, "ETH", headers, node, true, "GET", "network/version").then(request => {
                expect(request).to.be.an.instanceOf(RelayRequest)
                expect(request).to.not.be.an.instanceOf(RpcErrorResponse)
            })
            
        }).timeout(0)

        it('should send a relay', () => {
            const pocket = new Pocket(validConfiguration)
            pocket.routingTable.addNode(node)

            const data = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f\",\"latest\"],\"id\":67}'
            const headers: Record<string, string> = {
                "Content-Type": "application/json"
            }
            pocket.createRelayRequest(data, "ETH", headers, node, true, "GET", "network/version").then(request => {
                if(request instanceof RelayRequest){
                    NockUtil.mockRelay()
                    pocket.sendRelay(request, validConfiguration).then(relayResponse => {
                        expect(relayResponse).to.be.instanceOf(RelayResponse)
                    })
                }
            })
        }).timeout(0)

        it('should get a block', () => {
            NockUtil.mockGetBlock()

            const pocket = new Pocket(validConfiguration)
            pocket.routingTable.addNode(node)

            pocket.getBlock(BigInt(5), true).then(blockResponse => {
                expect(blockResponse).to.be.instanceOf(QueryBlockResponse)
            })
        }).timeout(0)

        it('should get a transaction', () => {
            NockUtil.mockGetTx()

            const pocket = new Pocket(validConfiguration)
            pocket.routingTable.addNode(node)

            pocket.getTX("0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f", true).then(txResponse => {
                expect(txResponse).to.be.instanceOf(QueryTXResponse)
            })
        }).timeout(0)

        it('should get the height', () => {
            NockUtil.mockGetHeight()

            const pocket = new Pocket(validConfiguration)
            pocket.routingTable.addNode(node)

            pocket.getHeight(true).then(heightResponse => {
                expect(heightResponse).to.be.instanceOf(QueryHeightResponse)
            })
        }).timeout(0)

        it('should get the balance', () => {
            NockUtil.mockGetBalance()

            const pocket = new Pocket(validConfiguration)
            pocket.routingTable.addNode(node)

            pocket.getBalance("0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f", BigInt(5), true).then(balanceResponse => {
                expect(balanceResponse).to.be.instanceOf(QueryBalanceResponse)
            })
        }).timeout(0)

        it('should get a list of nodes', () => {
            NockUtil.mockGetNodes()

            const pocket = new Pocket(validConfiguration)
            pocket.routingTable.addNode(node)

            pocket.getNodes(StakingStatus.Staked, BigInt(5), true).then(nodeResponse => {
                expect(nodeResponse).to.be.instanceOf(QueryNodesResponse)
            })
        }).timeout(0)

        it('should get a node', () => {
            NockUtil.mockGetNode()

            const pocket = new Pocket(validConfiguration)
            pocket.routingTable.addNode(node)

            pocket.getNode("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c", BigInt(5), true).then(nodeResponse => {
                expect(nodeResponse).to.be.instanceOf(QueryNodeResponse)
            })
        }).timeout(0)

        it('should get a node params', () => {
            NockUtil.mockGetNodeParams()

            const pocket = new Pocket(validConfiguration)
            pocket.routingTable.addNode(node)

            pocket.getNodeParams(BigInt(5), true).then(nodeParamsResponse => {
                expect(nodeParamsResponse).to.be.instanceOf(QueryNodeParamsResponse)
            })
        }).timeout(0)

        it('should get a list of proofs of a node', () => {
            NockUtil.mockGetNodeProofs()

            const pocket = new Pocket(validConfiguration)
            pocket.routingTable.addNode(node)

            pocket.getNodeProofs("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c", BigInt(5), true).then(nodeProofsResponse => {
                expect(nodeProofsResponse).to.be.instanceOf(QueryNodeProofsResponse)
            })
        }).timeout(0)

        it('should get a proof of a node', () => {
            NockUtil.mockGetNodeProof()

            const nodeProof = new NodeProof("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c", "ETH10", "0x1", BigInt(0), BigInt(0))
            const pocket = new Pocket(validConfiguration)
            pocket.routingTable.addNode(node)

            pocket.getNodeProof(nodeProof, true).then(nodeProofResponse => {
                expect(nodeProofResponse).to.be.instanceOf(QueryNodeProofResponse)
            })
        }).timeout(0)

        it('should get a list of apps', () => {
            NockUtil.mockGetApps()

            const pocket = new Pocket(validConfiguration)
            pocket.routingTable.addNode(node)

            pocket.getApps(StakingStatus.Staked, BigInt(5), true).then(appsResponse => {
                expect(appsResponse).to.be.instanceOf(QueryAppsResponse)
            })
        }).timeout(0)

        it('should get an app', () => {
            NockUtil.mockGetApp()

            const pocket = new Pocket(validConfiguration)
            pocket.routingTable.addNode(node)

            pocket.getApp("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c", BigInt(5), true).then(appResponse => {
                expect(appResponse).to.be.instanceOf(QueryAppResponse)
            })
        }).timeout(0)

        it('should get an app params', () => {
            NockUtil.mockGetAppParams()

            const pocket = new Pocket(validConfiguration)
            pocket.routingTable.addNode(node)

            pocket.getAppParams(BigInt(5), true).then(appParamsResponse => {
                expect(appParamsResponse).to.be.instanceOf(QueryAppParamsResponse)
            })
        }).timeout(0)

        it('should get the pocket params', () => {
            NockUtil.mockGetPocketParams()

            const pocket = new Pocket(validConfiguration)
            pocket.routingTable.addNode(node)

            pocket.getPocketParams(BigInt(5), true).then(pocketParamsResponse => {
                expect(pocketParamsResponse).to.be.instanceOf(QueryPocketParamsResponse)
            })
        }).timeout(0)

        it('should get the supported chains', () => {
            NockUtil.mockGetSupportedChains()

            const pocket = new Pocket(validConfiguration)
            pocket.routingTable.addNode(node)

            pocket.getSupportedChains(BigInt(5), true).then(supportedResponse => {
                expect(supportedResponse).to.be.instanceOf(QuerySupportedChainsResponse)
            })
        }).timeout(0)

        it('should get the supply', () => {
            NockUtil.mockGetSupply()

            const pocket = new Pocket(validConfiguration)
            pocket.routingTable.addNode(node)

            pocket.getSupply(BigInt(5), true).then(supplyResponse => {
                expect(supplyResponse).to.be.instanceOf(QuerySupplyResponse)
            })
        }).timeout(0)
    })

    describe("Error scenarios", () => {
        it('should error to create an instance of Pocket when using invalid configuration and throw an error with "Configuration is not valid"',() => {
            (() => 
                new Pocket(invalidConfiguration)
            ).should.throw(TypeError, /Configuration is not valid/);
        }).timeout(0)

        it('should error to create an instance of RelayRequest instance', () => {
            const pocket = new Pocket(validConfiguration)
            const data = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f\",\"latest\"],\"id\":67}'
            const headers: Record<string, string> = {
                "Content-Type": "application/json"
            }
            const relayRequest = pocket.createRelayRequest(data, "ETH", headers, undefined, true, "GET", "network/version")

            pocket.createRelayRequest(data, "ETH", headers, node, true, "GET", "network/version").then(request => {
                expect(request).to.not.be.an.instanceOf(RelayRequest)
                expect(request).to.be.an.instanceOf(RpcErrorResponse)
            })
        }).timeout(0)

        it('should error to send a relay', () => {
            const pocket = new Pocket(validConfiguration)
            pocket.routingTable.addNode(node)

            const data = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f\",\"latest\"],\"id\":67}'
            const headers: Record<string, string> = {
                "Content-Type": "application/json"
            }
            pocket.createRelayRequest(data, "ETH", headers, node, true, "GET", "network/version").then(request => {
                if(request instanceof RelayRequest){
                    NockUtil.mockRelay(500)
                    pocket.sendRelay(request, validConfiguration).then(relayResponse => {
                        expect(relayResponse).to.be.instanceOf(RpcErrorResponse)
                    })
                }
            })
        }).timeout(0)

        it('should returns an error trying to get a block', () => {
            NockUtil.mockGetBlock(500)

            const pocket = new Pocket(validConfiguration)
            pocket.routingTable.addNode(node)
            
            pocket.getBlock(BigInt(5), true).then(blockResponse => {
                expect(blockResponse).to.be.instanceOf(RpcErrorResponse)
            })
        }).timeout(0)

        it('should returns an error trying to get a transaction', () => {
            NockUtil.mockGetTx(500)

            const pocket = new Pocket(validConfiguration)
            pocket.routingTable.addNode(node)

            pocket.getTX("0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f", true).then(txResponse => {
                expect(txResponse).to.be.instanceOf(RpcErrorResponse)
            })
        }).timeout(0)

        it('should returns an error trying to get the height', () => {
            NockUtil.mockGetHeight(500)

            const pocket = new Pocket(validConfiguration)
            pocket.routingTable.addNode(node)

            pocket.getHeight(true).then(heightResponse => {
                expect(heightResponse).to.be.instanceOf(RpcErrorResponse)
            })
        }).timeout(0)

        it('should returns an error trying to get the balance', () => {
            NockUtil.mockGetBalance(500)

            const pocket = new Pocket(validConfiguration)
            pocket.routingTable.addNode(node)

            pocket.getBalance("0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f", BigInt(5), true).then(balanceResponse => {
                expect(balanceResponse).to.be.instanceOf(RpcErrorResponse)
            })
        }).timeout(0)

        it('should returns an error trying to get a list of nodes', () => {
            NockUtil.mockGetNodes(500)

            const pocket = new Pocket(validConfiguration)
            pocket.routingTable.addNode(node)

            pocket.getNodes(StakingStatus.Staked, BigInt(5), true).then(nodesResponse => {
                expect(nodesResponse).to.be.instanceOf(RpcErrorResponse)
            })
        }).timeout(0)

        it('should returns an error trying to get a node', () => {
            NockUtil.mockGetNode(500)

            const pocket = new Pocket(validConfiguration)
            pocket.routingTable.addNode(node)

            pocket.getNode("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c", BigInt(5), true).then(nodeResponse => {
                expect(nodeResponse).to.be.instanceOf(RpcErrorResponse)
            })
        }).timeout(0)

        it('should returns an error trying to get the node params', () => {
            NockUtil.mockGetNodeParams(500)

            const pocket = new Pocket(validConfiguration)
            pocket.routingTable.addNode(node)

            pocket.getNodeParams(BigInt(5), true).then(nodeParamsResponse => {
                expect(nodeParamsResponse).to.be.instanceOf(RpcErrorResponse)
            })
        }).timeout(0)

        it('should returns an error trying to get a list of proofs of a node', () => {
            NockUtil.mockGetNodeProofs(500)

            const pocket = new Pocket(validConfiguration)
            pocket.routingTable.addNode(node)

            pocket.getNodeProofs("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c", BigInt(5), true).then(nodeProofsResponse => {
                expect(nodeProofsResponse).to.be.instanceOf(RpcErrorResponse)
            })
        }).timeout(0)

        it('should returns an error trying to get a proof of a node', () => {
            NockUtil.mockGetNodeProof(500)

            const nodeProof = new NodeProof(")x0", "ETH10", "0x1", BigInt(0), BigInt(0))
            const pocket = new Pocket(validConfiguration)
            pocket.routingTable.addNode(node)

            pocket.getNodeProof(nodeProof, true).then(nodeProofResponse => {
                expect(nodeProofResponse).to.be.instanceOf(RpcErrorResponse)
            })
        }).timeout(0)

        it('should returns an error trying to get a list of apps', () => {
            NockUtil.mockGetApps(500)

            const pocket = new Pocket(validConfiguration)
            pocket.routingTable.addNode(node)

            pocket.getApps(StakingStatus.Staked, BigInt(5), true).then(appsResponse => {
                expect(appsResponse).to.be.instanceOf(RpcErrorResponse)
            })
        }).timeout(0)

        it('should returns an error trying to get an app', () => {
            NockUtil.mockGetApp(500)

            const pocket = new Pocket(validConfiguration)
            pocket.routingTable.addNode(node)

            pocket.getApp("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c", BigInt(5), true).then(appResponse => {
                expect(appResponse).to.be.instanceOf(RpcErrorResponse)
            })
        }).timeout(0)

        it('should returns an error trying to get an app params', () => {
            NockUtil.mockGetAppParams(500)

            const pocket = new Pocket(validConfiguration)
            pocket.routingTable.addNode(node)

            pocket.getAppParams(BigInt(5), true).then(appParamsResponse => {
                expect(appParamsResponse).to.be.instanceOf(RpcErrorResponse)
            })
        }).timeout(0)

        it('should returns an error trying to get the pocket params', () => {
            NockUtil.mockGetPocketParams(500)

            const pocket = new Pocket(validConfiguration)
            pocket.routingTable.addNode(node)

            pocket.getPocketParams(BigInt(5), true).then(pocketParamsResponse => {
                expect(pocketParamsResponse).to.be.instanceOf(RpcErrorResponse)
            })
        }).timeout(0)

        it('should returns an error trying to get the supported chains', () => {
            NockUtil.mockGetSupportedChains(500)

            const pocket = new Pocket(validConfiguration)
            pocket.routingTable.addNode(node)

            pocket.getSupportedChains(BigInt(5), true).then(supportedResponse => {
                expect(supportedResponse).to.be.instanceOf(RpcErrorResponse)
            })
        }).timeout(0)

        it('should returns an error trying to get the supply', () => {
            NockUtil.mockGetSupply(500)

            const pocket = new Pocket(validConfiguration)
            pocket.routingTable.addNode(node)

            pocket.getSupply(BigInt(5), true).then(supplyResponse => {
                expect(supplyResponse).to.be.instanceOf(RpcErrorResponse)
            })
        }).timeout(0)
    }) 
})