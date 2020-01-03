import { Node } from "./node";
import { Configuration } from "../configuration/configuration";

/**
 *
 *
 * @class Routing
 */
export class Routing {
    public readonly nodes: { [netID: string]: Node[] } = {};
    public readonly configuration: Configuration;
    /**
    * Creates an instance of routing.
    * @param {Array} nodes - Array holding the initial node(s).
    * @param {Configuration} configuration - Configuration object.
    * @memberof Routing
    */
    constructor(nodes: Node[], configuration: Configuration) {
        let routingNodes: { [netID: string]: Node[] } = {};
        nodes.forEach(function (node) {
            routingNodes[node.blockchain.netID] = routingNodes[node.blockchain.netID] || [];
            routingNodes[node.blockchain.netID].push(node);
            if (routingNodes[node.blockchain.netID].length  > configuration.maxNodes) {
                throw new Error("Routing table cannot contain more than the specified maxNodes per blockchain.");
            }
        });

        if (Object.keys(routingNodes).length < 1) {
            throw new Error("Routing table must be initialized with at least one node.");
        }

        this.nodes = routingNodes;
        this.configuration = configuration;
    }

    /**
    * Reads an array of random nodes from the routing table based on blockchain netID
    * @param {string} netID - blockchain netID
    * @param {number} count - desired number of nodes returned
    */
    public readRandomNodes(netID: string, count: number) {
        let nodes = this.nodes[netID];
        // Shuffle array then return the slice
        const shuffled = nodes.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    /**
    * Reads a random node from the routing table based on blockchain netID
    * @param {string} netID - blockchain netID
    */
    public readRandomNode(netID: string) {
        return this.nodes[netID][Math.floor(Math.random() * this.nodes[netID].length)];
    }

    /**
    * Reads a specific node from the routing table based on blockchain netID, ip, and port
    * @param {string} netID - blockchain netID
    * @param {string} ipPort - Ip and port string ("127.0.0.1:80")
    */
    public readNode(netID: string, ipPort: string) {
        for(let i = 0; i < this.nodes[netID].length; i++) {
            if (this.nodes[netID][i].ipPort == ipPort) {
                return this.nodes[netID][i];
            }
        }
        return new Error("Node not found in routing table.");
    }

    /**
    * Add a node to the routing table
    * @param {Node} node - node object to be added
    */
    public addNode(node: Node) {
        this.nodes[node.blockchain.netID] = this.nodes[node.blockchain.netID] || [];
        this.nodes[node.blockchain.netID].push(node);
        // If this pushes the count over the maxNodes, splice the first element off
        if (this.nodes[node.blockchain.netID].length  > this.configuration.maxNodes) {
            this.nodes[node.blockchain.netID].splice(0, 1);
        }
    }

    /**
    * Deletes a node from the routing table
    * @param {Node} node - node object to be deleted
    */
    public deleteNode(node: Node) {
        // Cycle through the list of nodes, find a match, splice it off
        for(let i = 0; i < this.nodes[node.blockchain.netID].length; i++) {
            if (this.nodes[node.blockchain.netID][i].ipPort == node.ipPort) {
                this.nodes[node.blockchain.netID].splice(i, 1);
            }
        }
    }
}
