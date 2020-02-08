import { Node } from "../node"

/**
 *
 *
 * @class QueryNodesResponse
 */
export class QueryNodesResponse {
  /**
   *
   * Creates a QueryNodesResponse object using a JSON string
   * @param {String} json - JSON string.
   * @returns {QueryNodesResponse} - QueryNodesResponse object.
   * @memberof QueryNodesResponse
   */
  public static fromJSON(json: string): QueryNodesResponse {
    try {
      const jsonObject = JSON.parse(json)
      const nodes: Node[] = []
      if (Array.isArray(jsonObject)) {
        jsonObject.forEach(function(nodeJSON: {}) {
          const node = Node.fromJSON(JSON.stringify(nodeJSON))
          nodes.push(node)
        })
        if (nodes !== undefined) {
          return new QueryNodesResponse(nodes)
        } else {
          throw new Error("Failed to parse the node list for QueryNodesResponse")
        }
      } else {
        const node = Node.fromJSON(JSON.stringify(jsonObject))
        return new QueryNodesResponse([node])
      }
    } catch (error) {
      throw error
    }
  }

  public readonly nodes: Node[]

  /**
   * Relay Response.
   * @constructor
   * @param {Node[]} nodes - Node object array.
   */
  constructor(nodes: Node[]) {
    this.nodes = nodes

    if (!this.isValid()) {
      throw new TypeError("Invalid QueryNodesResponse properties.")
    }
  }
  /**
   *
   * Creates a JSON object with the QueryNodesResponse properties
   * @returns {JSON} - JSON Object.
   * @memberof QueryNodesResponse
   */
  public toJSON() {
    const nodeListJSON: Node[] = []
    this.nodes.forEach(node => {
      nodeListJSON.push(node)
    })
    return { nodes: JSON.parse(JSON.stringify(nodeListJSON)) }
  }
  /**
   *
   * Check if the QueryNodesResponse object is valid
   * @returns {boolean} - True or false.
   * @memberof QueryNodesResponse
   */
  public isValid(): boolean {
    return this.nodes !== undefined
  }
}
