import { Node } from "../"
import { SessionHeader } from "../input"

/**
 *
 *
 * @class DispatchResponse
 */
export class DispatchResponse {
  /**
   *
   * Creates a DispatchResponse object using a JSON string
   * @param {String} json - JSON string.
   * @returns {DispatchResponse} - DispatchResponse object.
   * @memberof DispatchResponse
   */
  public static fromJSON(json: string): DispatchResponse {
    try {
      const jsonObject = JSON.parse(json)
      const sessionHeader = SessionHeader.fromJSON(JSON.stringify(jsonObject.value.header))
      // Handle nodes
      const nodes: Node[] = []

      jsonObject.value.nodes.forEach(function(nodeJSON: any) {
        const node = Node.fromJSON(JSON.stringify(nodeJSON.value))
        nodes.push(node)
      })

      return new DispatchResponse(
        sessionHeader,
        jsonObject.value.key,
        nodes
      )
    } catch (error) {
      throw error
    }
  }

  public readonly header: SessionHeader
  public readonly key: string
  public readonly nodes: Node[]

  /**
   * Dispatch Response.
   * @constructor
   * @param {SessionHeader} header -
   * @param {string} key -
   * @param {Node[]} nodes -
   */
  constructor(header: SessionHeader, key: string, nodes: Node[]) {
    this.header = header
    this.key = key
    this.nodes = nodes

    if (!this.isValid()) {
      throw new TypeError("Invalid DispatchResponse properties.")
    }
  }
  /**
   *
   * Creates a JSON object with the DispatchResponse properties
   * @returns {JSON} - JSON Object.
   * @memberof DispatchResponse
   */
  public toJSON() {
    return {
      header: this.header.toJSON(),
      key: this.key,
      nodes: JSON.parse(JSON.stringify(this.nodes))
    }
  }
  /**
   *
   * Check if the DispatchResponse object is valid
   * @returns {boolean} - True or false.
   * @memberof DispatchResponse
   */
  public isValid(): boolean {
    return this.header.isValid() && this.key.length !== 0
  }
}
