/**
 * @author Alex Firmani <alex@pokt.network>
 * @description Unit tests for the Routing Table
 */
// Config
// Constants
import { expect } from 'chai'
import { Pocket } from '../../src/pocket'
import { Routing } from "../../src/models/routing"
import { Node } from "../../src/models/node"
import { BondStatus } from "../../src/models/output/bond-status.js"
import { Configuration } from "../../src/models/configuration.js"
import { PocketAAT } from "pocket-aat-js"

// For Testing we are using dummy data, none of the following information is real.
const version = '0.0.1'
const clientPublicKey = 'f6d04ee2490e85f3f9ade95b80948816bd9b2986d5554aae347e7d21d93b6fb5'
const applicationPublicKey = 'd9c7f275388ca1f87900945dba7f3a90fa9bba78f158c070aa12e3eccf53a2eb'
const applicationPrivateKey = '15f53145bfa6efdde6e65ce5ebfd330ac0a2591ae451a8a03ace99eff894b9eed9c7f275388ca1f87900945dba7f3a90fa9bba78f158c070aa12e3eccf53a2eb'

describe('Routing Table tests',() => {
    const pocketAAT = PocketAAT.from(version, clientPublicKey, applicationPublicKey, applicationPrivateKey)
    it('should initialize a routing table', () => {
        const configuration = new Configuration(5, 40000, 200)
        const pocket = new Pocket(configuration)
        const node = new Node("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c","0x1", false, BondStatus.bonded, BigInt(0), "127.0.0.1:80", ["eth","aion"], undefined)
        const nodes: Node[] = [node]
        const routing = new Routing( nodes, pocket.configuration)

        expect(routing).to.be.an.instanceof(Routing)
    }).timeout(0)

    it('should fail to initialize a routing table due to lack of nodes', () => {
        const configuration = new Configuration(5, 40000, 200)
        const pocket = new Pocket(configuration)
        const nodes: Node[] = []

        expect(() => new Routing(nodes, pocket.configuration)).to.throw("Routing table must be initialized with at least one node.")
    }).timeout(0)

    it('should fail to initialize a routing table due to excessive nodes', () => {
        const configuration = new Configuration(5, 40000, 200)
        const pocket = new Pocket(configuration)
        const node = new Node("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c","0x1", false, BondStatus.bonded, BigInt(0), "127.0.0.1:80", ["eth","aion"], undefined)

        const nodes: Node[] = [node]
        for(let i = 0; i < pocket.configuration.maxNodes; i++) {
            const secondaryNode = new Node("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4"+ i,"0x1", false, BondStatus.bonded, BigInt(0), "127.0.0." + i + ":80", ["eth","aion"], undefined)
            nodes.push(secondaryNode)
        }

        expect(() => new Routing(nodes, pocket.configuration)).to.throw("Routing table cannot contain more than the specified maxNodes per blockchain.")
    }).timeout(0)

    it('should be able to read a specific node from the routing table', () => {
        const configuration = new Configuration(5, 40000, 200)
        const pocket = new Pocket(configuration)
        const node = new Node("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c","0x1", false, BondStatus.bonded, BigInt(0), "127.0.0.1:80", ["eth","aion"], undefined)
        const nodes: Node[] = [node]
        const routing = new Routing( nodes, pocket.configuration)

        const readNode = routing.readNode('0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c')
        expect(readNode).to.be.an.instanceof(Node)
    }).timeout(0)

    it('should be able to add a node to the routing table', () => {
        const configuration = new Configuration(5, 40000, 200)
        const pocket = new Pocket(configuration)
        const node = new Node("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c","0x1", false, BondStatus.bonded, BigInt(0), "127.0.0.1:80", ["eth","aion"], undefined)
        const nodes: Node[] = [node]

        const routing = new Routing( nodes, pocket.configuration)
        const secondaryNode = new Node("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4d","0x1", false, BondStatus.bonded, BigInt(0), "127.0.0.1:80", ["eth","aion"], undefined)
        routing.addNode(secondaryNode)

        const readNode = routing.readNode('0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c')
        expect(readNode).to.be.an.instanceof(Node)
    }).timeout(0)

    it('should be able to delete a node from the routing table', () => {
        const configuration = new Configuration(5, 40000, 200)
        const pocket = new Pocket(configuration)
        const node = new Node("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c","0x1", false, BondStatus.bonded, BigInt(0), "127.0.0.1:80", ["eth","aion"], undefined)
        const nodes: Node[] = [node]

        const routing = new Routing( nodes, pocket.configuration)
        routing.deleteNode(node)
        
        expect(() => routing.readNode('0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c')).to.throw("Node not found in routing table.")
    }).timeout(0)

    it('should not allow more than the max number of nodes per blockchain to be added to the routing table', () => {
        const configuration = new Configuration(5, 40000, 200)
        const pocket = new Pocket(configuration)
        const node = new Node("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c","0x1", false, BondStatus.bonded, BigInt(0), "127.0.0.1:80", ["eth","aion"], undefined)
        const nodes: Node[] = [node]

        const routing = new Routing( nodes, pocket.configuration)
        // Add more than the currently allowed since one was added already above
        for(let i = 0; i < pocket.configuration.maxNodes; i++) {
            const secondaryNode = new Node("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4"+ i,"0x1", false, BondStatus.bonded, BigInt(0), "127.0.0." + i + ":80", ["eth","aion"], undefined)
            routing.addNode(secondaryNode)
        }
        expect(routing.nodesCount).to.lte(pocket.configuration.maxNodes)
    }).timeout(0)

    it('should be able to read a random node from the routing table', () => {
        const configuration = new Configuration(5, 40000, 200)
        const pocket = new Pocket(configuration)
        const node = new Node("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c","0x1", false, BondStatus.bonded, BigInt(0), "127.0.0.1:80", ["eth","aion"], undefined)
        const nodes: Node[] = [node]
        const routing = new Routing( nodes, pocket.configuration)

        const readNode = routing.readRandomNode()
        expect(readNode).to.be.an.instanceof(Node)
    }).timeout(0)

    it('should be able to read multiple random nodes from the routing table', () => { // Test doesn't currently check randomness of results
        const configuration = new Configuration(5, 40000, 200)
        const pocket = new Pocket(configuration)
        
        const node = new Node("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c","0x1", false, BondStatus.bonded, BigInt(0), "127.0.0.1:80", ["eth","aion"], undefined)
        const nodes: Node[] = [node]
        const routing = new Routing( nodes, pocket.configuration)

        for(let i = 2; i <= pocket.configuration.maxNodes; i++) {
            const secondaryNode = new Node("0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4"+ i,"0x1", false, BondStatus.bonded, BigInt(0), "127.0.0." + i + ":80", ["eth","aion"], undefined)

            routing.addNode(secondaryNode)
        }

        const readNodes = routing.readRandomNodes(3)

        expect(readNodes[0]).to.be.an.instanceof(Node)
        expect(readNodes[1]).to.be.an.instanceof(Node)
        expect(readNodes[2]).to.be.an.instanceof(Node)
    }).timeout(0)

}).timeout(0)
