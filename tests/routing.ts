/**
 * @author Alex Firmani <alex@pokt.network>
 * @description Unit tests for the Routing Table
 */
// Config
import * as config from "../config.json";
// Constants
import { expect } from 'chai';
import { Pocket } from '../src/pocket';
import { Routing } from "../src/models/routing";
import { Node } from "../src/models/node";
import { Blockchain } from "../src/models/blockchain";

const DEV_ID = config.dev_id;

describe('Routing Table tests',() => {
    it('should initialize a routing table', () => {
        const opts = {
            devID: DEV_ID,
            netIDs: [10],
            networkName: "ETH",
            requestTimeOut: 40000
        }
        const pocket = new Pocket(opts);
        const blockchain = new Blockchain(pocket.configuration.blockchains[0].name, pocket.configuration.blockchains[0].netID);
        const node = new Node(blockchain, '127.0.0.1:80', '0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c');
        const nodes: Node[] = [node];
        const routing = new Routing( nodes, pocket.configuration);

        expect(routing).to.be.an.instanceof(Routing);
    }).timeout(0);

    it('should fail to initialize a routing table due to lack of nodes', () => {
        const opts = {
            devID: DEV_ID,
            netIDs: [10],
            networkName: "ETH",
            requestTimeOut: 40000
        }
        const pocket = new Pocket(opts);
        const nodes: Node[] = [];

        expect(() => new Routing(nodes, pocket.configuration)).to.throw("Routing table must be initialized with at least one node.");
    }).timeout(0);

    it('should fail to initialize a routing table due to excessive nodes', () => {
        const opts = {
            devID: DEV_ID,
            netIDs: [10],
            networkName: "ETH",
            requestTimeOut: 40000
        }
        const pocket = new Pocket(opts);
        const blockchain = new Blockchain(pocket.configuration.blockchains[0].name, pocket.configuration.blockchains[0].netID);
        const node = new Node(blockchain, '127.0.0.1:80', '0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c');

        const nodes: Node[] = [node];
        for(let i = 0; i < pocket.configuration.maxNodes; i++) {
            const secondaryNode = new Node(blockchain, '127.0.0.' + i + ':80', '0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4' + i);
            nodes.push(secondaryNode);
        }

        expect(() => new Routing(nodes, pocket.configuration)).to.throw("Routing table cannot contain more than the specified maxNodes per blockchain.");
    }).timeout(0);

    it('should be able to read a specific node from the routing table', () => {
        const opts = {
            devID: DEV_ID,
            netIDs: [10],
            networkName: "ETH",
            requestTimeOut: 40000
        }
        const pocket = new Pocket(opts);
        const blockchain = new Blockchain(pocket.configuration.blockchains[0].name, pocket.configuration.blockchains[0].netID);
        const node = new Node(blockchain, '127.0.0.1:80', '0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c');
        const nodes: Node[] = [node];
        const routing = new Routing( nodes, pocket.configuration);

        const readNode = routing.readNode('0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c');
        expect(readNode).to.be.an.instanceof(Node);
    }).timeout(0);

    it('should be able to add a node to the routing table', () => {
        const opts = {
            devID: DEV_ID,
            netIDs: [10],
            networkName: "ETH",
            requestTimeOut: 40000
        }
        const pocket = new Pocket(opts);
        const blockchain = new Blockchain(pocket.configuration.blockchains[0].name, pocket.configuration.blockchains[0].netID);
        const node = new Node(blockchain, '127.0.0.1:80', '0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c');
        const nodes: Node[] = [node];

        const routing = new Routing( nodes, pocket.configuration);
        const secondaryNode = new Node(blockchain, '127.0.0.2:80', '0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4d');
        routing.addNode(secondaryNode);

        const readNode = routing.readNode('0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c');
        expect(readNode).to.be.an.instanceof(Node);
    }).timeout(0);

    it('should be able to delete a node from the routing table', () => {
        const opts = {
            devID: DEV_ID,
            netIDs: [10],
            networkName: "ETH",
            requestTimeOut: 40000
        }
        const pocket = new Pocket(opts);
        const blockchain = new Blockchain(pocket.configuration.blockchains[0].name, pocket.configuration.blockchains[0].netID);
        const node = new Node(blockchain, '127.0.0.1:80', '0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c');
        const nodes: Node[] = [node];

        const routing = new Routing( nodes, pocket.configuration);
        routing.deleteNode(node);
        
        expect(() => routing.readNode('0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c')).to.throw("Node not found in routing table.");
    }).timeout(0);

    it('should not allow more than the max number of nodes per blockchain to be added to the routing table', () => {
        const opts = {
            devID: DEV_ID,
            netIDs: [10],
            networkName: "ETH",
            requestTimeOut: 40000
        }
        const pocket = new Pocket(opts);
        const blockchain = new Blockchain(pocket.configuration.blockchains[0].name, pocket.configuration.blockchains[0].netID);
        const node = new Node(blockchain, '127.0.0.1:80', '0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c');
        const nodes: Node[] = [node];

        const routing = new Routing( nodes, pocket.configuration);
        // Add more than the currently allowed since one was added already above
        for(let i = 0; i < pocket.configuration.maxNodes; i++) {
            const secondaryNode = new Node(blockchain, '127.0.0.' + i + ':80', '0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4' + i);
            routing.addNode(secondaryNode);
        }
        expect(routing.nodes.length).to.lte(pocket.configuration.maxNodes);
    }).timeout(0);

    it('should be able to read a random node from the routing table', () => {
        const opts = {
            devID: DEV_ID,
            netIDs: [10],
            networkName: "ETH",
            requestTimeOut: 40000
        }
        const pocket = new Pocket(opts);
        const blockchain = new Blockchain(pocket.configuration.blockchains[0].name, pocket.configuration.blockchains[0].netID);
        const node = new Node(blockchain, '127.0.0.1:80', '0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c');
        const nodes: Node[] = [node];
        const routing = new Routing( nodes, pocket.configuration);

        const readNode = routing.readRandomNode();
        expect(readNode).to.be.an.instanceof(Node);
    }).timeout(0);

    it('should be able to read multiple random nodes from the routing table', () => { // Test doesn't currently check randomness of results
        const opts = {
            devID: DEV_ID,
            netIDs: [10],
            networkName: "ETH",
            requestTimeOut: 40000
        }
        const pocket = new Pocket(opts);
        const blockchain = new Blockchain(pocket.configuration.blockchains[0].name, pocket.configuration.blockchains[0].netID);

        const node = new Node(blockchain, '127.0.0.1:80', '0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c');
        const nodes: Node[] = [node];
        const routing = new Routing( nodes, pocket.configuration);

        for(let i = 2; i <= pocket.configuration.maxNodes; i++) {
            const secondaryNode = new Node(blockchain, '127.0.0.' + i + ':80', '0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4' + i);
            routing.addNode(secondaryNode);
        }

        const readNodes = routing.readRandomNodes(3);

        expect(readNodes[0]).to.be.an.instanceof(Node);
        expect(readNodes[1]).to.be.an.instanceof(Node);
        expect(readNodes[2]).to.be.an.instanceof(Node);
    }).timeout(0);

}).timeout(0);
