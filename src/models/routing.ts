import { Node } from "./node"
import { Configuration } from "../configuration/configuration"
import { RpcErrorResponse } from "./output/rpc-error-response"
import { IKVStore } from "../utils/storage/kv-store"
import { InMemoryKVStore } from "../utils/storage/in-memory-kv-store"

/**
 *
 *
 * @class Routing
 */
export class Routing {
  public readonly configuration: Configuration
  public readonly localNodesFileName = ""

  private readonly nodesKey: string = "NODES_KEY"
  private readonly store: IKVStore
  /**
   * Creates an instance of routing.
   * @param {Array} nodes - Array holding the initial node(s).
   * @param {Configuration} configuration - Configuration object.
   * @memberof Routing
   */
  constructor(nodes: Node[] = [], configuration: Configuration, store: IKVStore = new InMemoryKVStore()) {
    if (nodes.length > configuration.maxNodes) {
      throw new Error(
        "Routing table cannot contain more than the specified maxNodes per blockchain."
      )
    }
    if (nodes.length < 1) {
      throw new Error(
        "Routing table must be initialized with at least one node."
      )
    }

    this.configuration = configuration
    this.store = store

    this.store.add(this.nodesKey, nodes)
  }

  /**
   * Reads an array of random nodes from the routing table
   * @param {number} count - desired number of nodes returned
   * @memberof Routing
   */
  public readRandomNodes(count: number): Node[] {
    const nodes = this.store.get(this.nodesKey) as Node[]
    // Shuffle array then return the slice
    const shuffled = nodes.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  /**
   * Reads a random node from the routing table based on blockchain netID
   * @memberof Routing
   */
  public readRandomNode(): Node {
    const nodes = this.store.get(this.nodesKey) as Node[]
    return nodes[Math.floor(Math.random() * nodes.length)]
  }

  /**
   * Gets a node for the Pocket network rpc calls
   * @memberof Routing
   */
  public getNode(): Node | RpcErrorResponse {
    const nodes = this.store.get(this.nodesKey) as Node[]
    if (nodes.length < 0) {
      return new RpcErrorResponse("101", "Node not found in routing table.")
    }
    return nodes[Math.floor(Math.random() * nodes.length)]
  }

  /**
   * Reads a specific node from the routing table based on public key
   * @param {string} publicKey - public key attached to the node
   * @memberof Routing
   */
  public readNode(publicKey: string): Node {
    const nodes = this.store.get(this.nodesKey) as Node[]
    nodes.forEach(function(node: Node) {
      if (node.address === publicKey) {
        return node
      }
    })
    throw new Error("Node not found in routing table.")
  }

  /**
   * Add a node to the routing table
   * @param {Node} node - node object to be added
   * @memberof Routing
   */
  public addNode(node: Node) {
    const nodes = this.store.get(this.nodesKey) as Node[]
    nodes.push(node)
    // If this pushes the count over the maxNodes, splice the first element off
    if (nodes.length > this.configuration.maxNodes) {
      nodes.splice(0, 1)
    }

    this.store.add(this.nodesKey, nodes)
  }

  /**
   * Deletes a node from the routing table
   * @param {Node} node - node object to be deleted
   * @memberof Routing
   */
  public deleteNode(node: Node): boolean {
    // Cycle through the list of nodes, find a match, splice it off
    const nodes = this.store.get(this.nodesKey) as Node[]
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].address === node.address) {
        nodes.splice(i, 1)
        return true
      }
    }
    return false
  }

  /**
   * Filter a list of nodes by chain.
   * @param {string} blockchain - Blockchain hash.
   * @param {Node[]} nodes - Node list to filter.
   * @returns {Node[]} - Filtered list of nodes.
   * @memberof Routing
   */
  public filterNodes(blockchain: string, nodes: Node[]): Node[] {
    const nodeList: Node[] = []
    nodes.forEach(node => {
      node.chains.forEach(chain => {
        if (chain === blockchain) {
          nodeList.push(node)
        }
      })
    })
    return nodes
  }

  /**
   * Filter the nodes list by chain and return a random one
   * @param {string} blockchain - Blockchain hash.
   * @param {Node[]} nodes - Node list to filter.
   * @returns {Node[]} - Filtered list of nodes.
   * @memberof Routing
   */
  // TODO: Do round robin type selection
  public readNodeBy(blockchain: string): Node | RpcErrorResponse {
    const nodes = this.store.get(this.nodesKey) as Node[]
    const filteredNodes = this.filterNodes(blockchain, nodes)
    if (filteredNodes.length !== 0) {
      return filteredNodes[Math.floor(Math.random() * nodes.length)]
    } else {
      return new RpcErrorResponse(
        "",
        "Failed to read node for the provided blockchain"
      )
    }
  }
}
