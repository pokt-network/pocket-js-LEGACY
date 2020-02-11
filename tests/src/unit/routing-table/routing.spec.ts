/**
 * @author Alex Firmani <alex@pokt.network>
 * @description Unit tests for the Routing Table
 */
import { expect } from 'chai'
import { BondStatus, InMemoryKVStore, Configuration, RoutingTable, Node } from '../../../../src'
// Constants
// For Testing we are using dummy data, none of the following information is real.
const addressHex = "84871BAF5B4E01BE52E5007EACF7048F24BF57E0"
const applicationPublicKey = 'd9c7f275388ca1f87900945dba7f3a90fa9bba78f158c070aa12e3eccf53a2eb'
const node01 = new Node(addressHex, applicationPublicKey, false, BondStatus.bonded, BigInt(100), "http://127.0.0.1:80", ["ETH04", "ETH01"])
const store = new InMemoryKVStore()

describe('Routing Table tests',() => {
    it('should initialize a routing table', () => {
        const configuration = new Configuration([node01], 5, 40000, 200)
        
        const routing = new RoutingTable([node01], configuration, store)

        expect(routing).to.be.an.instanceof(RoutingTable)
    }).timeout(0)

    it('should fail to initialize a routing table due to excessive nodes', () => {
        const configuration = new Configuration([node01], 5, 40000, 200)
        
        const nodes: Node[] = [node01]
        for(let i = 0; i < configuration.maxNodes; i++) {
            const additionalNode = node01
            nodes.push(additionalNode)
        }

        expect(() => new RoutingTable(nodes, configuration, store)).to.throw("Routing table cannot contain more than the specified maxNodes per blockchain.")
    }).timeout(0)

    it('should be able to read a specific node from the routing table', () => {
        const configuration = new Configuration([node01], 5, 40000, 200)
        const routing = new RoutingTable([node01], configuration, store)
        const readNode = routing.readNode(addressHex)
        
        expect(readNode).to.be.an.instanceof(Node)
    }).timeout(0)

    it('should be able to add a node to the routing table', () => {
        const configuration = new Configuration([node01], 5, 40000, 200)
        
        const routing = new RoutingTable([node01], configuration, store)
        const secondaryNode = new Node(
            "00071BAF5B4E01BE52E5007EACF7048F24BF5000", "ccc7f275388ca1f87900945dba7f3a90fa9bba78f158c070aa12e3eccf53a2cc",
            false, BondStatus.bonded, BigInt(0), "http://127.0.0.1:80", ["ETH04", "ETH01"]
        )
        routing.addNode(secondaryNode)
        
        const readNode = routing.readNode('00071BAF5B4E01BE52E5007EACF7048F24BF5000')
        expect(readNode).to.be.an.instanceof(Node)
    }).timeout(0)

    it('should be able to delete a node from the routing table', () => {
        const configuration = new Configuration([node01], 5, 40000, 200)

        const routing = new RoutingTable([node01], configuration, store)
        routing.deleteNode(node01)
        
        expect(() => routing.readNode(addressHex)).to.throw("Node not found in routing table.")
    }).timeout(0)

    it('should not allow more than the max number of nodes per blockchain to be added to the routing table', () => {
        const configuration = new Configuration([node01], 5, 40000, 200)

        const routing = new RoutingTable([node01], configuration, store)
        // Add more than the currently allowed since one was added already above
        for(let i = 0; i < configuration.maxNodes; i++) {
            const secondaryNode = new Node(
                "00071BAF5B4E01BE52E5007EACF7048F24BF5000", "ccc7f275388ca1f87900945dba7f3a90fa9bba78f158c070aa12e3eccf53a2cc",
                false, BondStatus.bonded, BigInt(0), "http://127.0.0.1:80", ["ETH04", "ETH01"]
            )
            routing.addNode(secondaryNode)
        }
        expect(routing.nodesCount).to.lte(configuration.maxNodes)
    }).timeout(0)

    it('should be able to read a random node from the routing table', () => {
        const configuration = new Configuration([node01], 5, 40000, 200)
        
        const routing = new RoutingTable([node01], configuration, store)

        const readNode = routing.readRandomNode()
        expect(readNode).to.be.an.instanceof(Node)
    }).timeout(0)

    it('should be able to read multiple random nodes from the routing table', () => { // Test doesn't currently check randomness of results
        const configuration = new Configuration([node01], 5, 40000, 200)
        
    
        const routing = new RoutingTable([node01], configuration, store)

        for(let i = 2; i <= configuration.maxNodes; i++) {
            const secondaryNode = new Node(
                "00071BAF5B4E01BE52E5007EACF7048F24BF5000", "ccc7f275388ca1f87900945dba7f3a90fa9bba78f158c070aa12e3eccf53a2cc",
                false, BondStatus.bonded, BigInt(0), "http://127.0.0.1:80", ["ETH04", "ETH01"]
            )

            routing.addNode(secondaryNode)
        }

        const readNodes = routing.readRandomNodes(3)

        expect(readNodes[0]).to.be.an.instanceof(Node)
        expect(readNodes[1]).to.be.an.instanceof(Node)
        expect(readNodes[2]).to.be.an.instanceof(Node)
    }).timeout(0)

}).timeout(0)
