import { Node } from "./node";
import { Configuration } from "../configuration/configuration";

/**
 *
 *
 * @class Routing
 */
export class Routing {
    public readonly nodes: Node[] = [];
    public readonly configuration: Configuration;
    /**
     * Creates an instance of routing.
     * @param {Array} nodes - Array holding the initial node(s).
     * @param {Configuration} configuration - Configuration object.
     * @memberof Routing
     */
    constructor(nodes: Node[], configuration: Configuration) {

        if (Object.keys(nodes).length > configuration.maxNodes) {
            throw new Error("Routing table cannot contain more than the specified maxNodes per blockchain.");
        }
        if (Object.keys(nodes).length < 1) {
            throw new Error("Routing table must be initialized with at least one node.");
        }

        this.nodes = nodes;
        this.configuration = configuration;
    }

    /**
     * Reads an array of random nodes from the routing table
     * @param {number} count - desired number of nodes returned
     */
    public readRandomNodes(count: number) {
        const nodes = this.nodes;
        // Shuffle array then return the slice
        const shuffled = nodes.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    /**
     * Reads a random node from the routing table based on blockchain netID
     */
    public readRandomNode() {
        return this.nodes[Math.floor(Math.random() * this.nodes.length)];
    }

    /**
     * Reads a specific node from the routing table based on public key
     * @param {string} publicKey - public key attached to the node
     */
    public readNode(publicKey: string) {
        for(let i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].publicKey === publicKey) {
                return this.nodes[i];
            }
        }
        return new Error("Node not found in routing table.");
    }

    /**
     * Add a node to the routing table
     * @param {Node} node - node object to be added
     */
    public addNode(node: Node) {
        this.nodes.push(node);
        // If this pushes the count over the maxNodes, splice the first element off
        if (this.nodes.length  > this.configuration.maxNodes) {
            this.nodes.splice(0, 1);
        }
    }

    /**
     * Deletes a node from the routing table
     * @param {Node} node - node object to be deleted
     */
    public deleteNode(node: Node) {
        // Cycle through the list of nodes, find a match, splice it off
        for(let i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].publicKey === node.publicKey) {
                this.nodes.splice(i, 1);
            }
        }
    }
}
