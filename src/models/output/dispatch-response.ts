import { Node } from ".."

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
    const jsonObject = JSON.parse(json)

    return new DispatchResponse(
      jsonObject.header,
      jsonObject.key,
      jsonObject.nodes
    )
  }

  public readonly header: string
  public readonly key: string
  public readonly nodes: Node[]

  /**
   * Dispatch Response.
   * @constructor
   * @param {string} header -
   * @param {string} key -
   * @param {Node[]} nodes -
   */
  constructor(header: string, key: string, nodes: Node[]) {
    this.header = header
    this.key = key
    this.nodes = nodes

    if (!this.isValid()) {
      throw new TypeError("Invalid properties length.")
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
      header: this.header,
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
    return this.header.length !== 0 && this.key.length !== 0
  }
}
