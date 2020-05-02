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
      // Initially load the session header timestamp with 0; it will be computed when the session is saved
      jsonObject.session.header.session_timestamp = 0
      const sessionHeader = SessionHeader.fromJSON(JSON.stringify(jsonObject.session.header))
      // Handle nodes
      const nodes: Node[] = []

      jsonObject.session.nodes.forEach(function (nodeJSON: any) {
        const node = Node.fromJSON(JSON.stringify(nodeJSON))
        nodes.push(node)
      })

      return new DispatchResponse(
        BigInt(jsonObject.block_height),
        sessionHeader,
        jsonObject.session.key,
        nodes
      )
    } catch (error) {
      throw error
    }
  }

  public readonly blockHeight: BigInt
  public readonly header: SessionHeader
  public readonly key: string
  public readonly nodes: Node[]

  /**
   * Dispatch Response.
   * @constructor
   * @param {BigInt} blockHeight - blockheight the dispatch response was received
   * @param {SessionHeader} header -
   * @param {string} key -
   * @param {Node[]} nodes -
   */
  constructor(blockHeight: BigInt, header: SessionHeader, key: string, nodes: Node[]) {
    this.blockHeight = blockHeight
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
      block_height: Number(this.blockHeight.toString()),
      session: {
        header: this.header.toJSON(),
        key: this.key,
        nodes: JSON.parse(JSON.stringify(this.nodes))
      }
    }
  }
  /**
   *
   * Check if the DispatchResponse object is valid
   * @returns {boolean} - True or false.
   * @memberof DispatchResponse
   */
  public isValid(): boolean {
    return this.header.isValid()
      && this.key.length !== 0
      && Number(this.blockHeight.toString()) >= 0
  }
}
