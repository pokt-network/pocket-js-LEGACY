import { Node } from "./node"
import { RelayResponse } from "./output"

/**
 *
 *
 * @class ConsensusNode
 */
export class ConsensusNode {
  /**
   *
   * Creates a ConsensusNode object using a JSON string
   * @param {String} json - JSON string.
   * @returns {ConsensusNode} - ConsensusNode object.
   * @memberof ConsensusNode
   */
  public static fromJSON(json: string): ConsensusNode {
    try {
      const jsonObject = JSON.parse(json)
  
      return new ConsensusNode(
        jsonObject.node,
        jsonObject.status,
        jsonObject.relay_response
      )
    } catch (error) {
      throw error
    }
  }

  public readonly node: Node
  public status: boolean
  public readonly relayResponse: RelayResponse

  /**
   * Consensus node.
   * @constructor
   * @param {Node} node - Signature.
   * @param {boolean} status - True if the response is accepted or false if not.
   * @param {RelayResponse} relayResponse - Relay Response.
   */
  constructor(node: Node, status: boolean, relayResponse: RelayResponse) {
    this.node = node
    this.status = status
    this.relayResponse = relayResponse

    if (!this.isValid()) {
      throw new TypeError("Invalid ConsensusNode properties.")
    }
  }

  /**
   *
   * Creates a JSON object with the ConsensusNode properties
   * @returns {JSON} - JSON Object.
   * @memberof ConsensusNode
   */
  public toJSON() {
    return {
      node: this.node.toJSON(),
      status: this.status,
      relay_response: this.relayResponse.toJSON()
    }
  }
  /**
   *
   * Check if the ConsensusNode object is valid
   * @returns {boolean} - True or false.
   * @memberof ConsensusNode
   */
  public isValid(): boolean {
    return (
      this.node.isValid() &&
      this.status !== undefined &&
      this.relayResponse.isValid()
    )
  }
}
