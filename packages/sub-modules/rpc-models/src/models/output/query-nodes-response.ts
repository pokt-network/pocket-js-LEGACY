/* eslint-disable @typescript-eslint/naming-convention */
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
   *
   * @param {String} json - JSON string.
   * @returns {QueryNodesResponse} - QueryNodesResponse object.
   * @memberof QueryNodesResponse
   */
  public static fromJSON(json: string): QueryNodesResponse {
    try {
      const jsonObject = JSON.parse(json)
      const nodes: Node[] = []

      if (Array.isArray(jsonObject.result)) {
        jsonObject.result.forEach(function (nodeJSON: {}) {
          const node = Node.fromJSON(JSON.stringify(nodeJSON))
          nodes.push(node)
        })
      }
      return new QueryNodesResponse(nodes, jsonObject.page, jsonObject.total_pages)
    } catch (error) {
      throw error
    }
  }

  public readonly nodes: Node[]
  public readonly page: number
  public readonly totalPages: number

  /**
   * Relay Response.
   *
   * @constructor
   * @param {Node[]} nodes - Node object array.
   * @param {number} page - Current page.
   * @param {number} totalPages - Total amount of pages.
   */
  constructor(nodes: Node[], page: number, totalPages: number) {
    this.nodes = nodes
    this.page = page
    this.totalPages = totalPages

    if (!this.isValid()) {
      throw new TypeError("Invalid QueryNodesResponse properties.")
    }
  }
  /**
   *
   * Creates a JSON object with the QueryNodesResponse properties
   *
   * @returns {JSON} - JSON Object.
   * @memberof QueryNodesResponse
   */
  public toJSON(): any {
    const nodeListJSON: object[] = []

    this.nodes.forEach(node => {
      nodeListJSON.push(node.toJSON())
    })
    
    return {
       result: nodeListJSON,
       page: this.page,
       total_pages: this.totalPages
    }
  }
  /**
   *
   * Check if the QueryNodesResponse object is valid
   *
   * @returns {boolean} - True or false.
   * @memberof QueryNodesResponse
   */
  public isValid(): boolean {
    return this.nodes !== undefined &&
    this.page >= 0 &&
    this.totalPages >= 0
  }
}
