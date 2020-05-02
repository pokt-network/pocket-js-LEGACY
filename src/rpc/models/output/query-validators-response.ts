import { Node } from "../node"

/**
 *
 *
 * @class QueryValidatorsResponse
 */
export class QueryValidatorsResponse {
  /**
   *
   * Creates a QueryValidatorsResponse object using a JSON string
   * @param {String} json - JSON string.
   * @returns {QueryValidatorsResponse} - QueryValidatorsResponse object.
   * @memberof QueryValidatorsResponse
   */
  public static fromJSON(json: string): QueryValidatorsResponse {
    try {
      const jsonObject = JSON.parse(json)
      const nodes: Node[] = []
      if (Array.isArray(jsonObject)) {
        jsonObject.forEach(function (nodeJSON: {}) {
          const node = Node.fromJSON(JSON.stringify(nodeJSON))
          nodes.push(node)
        })
        if (nodes !== undefined) {
          return new QueryValidatorsResponse(nodes)
        } else {
          throw new Error("Failed to parse the node list for QueryValidatorsResponse")
        }
      } else {
        const node = Node.fromJSON(JSON.stringify(jsonObject))
        return new QueryValidatorsResponse([node])
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
      throw new TypeError("Invalid QueryValidatorsResponse properties.")
    }
  }
  /**
   *
   * Creates a JSON object with the QueryValidatorsResponse properties
   * @returns {JSON} - JSON Object.
   * @memberof QueryValidatorsResponse
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
   * Check if the QueryValidatorsResponse object is valid
   * @returns {boolean} - True or false.
   * @memberof QueryValidatorsResponse
   */
  public isValid(): boolean {
    return this.nodes !== undefined
  }
}
