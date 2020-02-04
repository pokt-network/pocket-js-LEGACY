import { NodeProof } from "../input"
/**
 *
 *
 * @class QueryNodeProofResponse
 */
export class QueryNodeProofResponse {
  /**
   *
   * Creates a QueryNodeProofResponse object using a JSON string
   * @param {String} json - JSON string.
   * @returns {QueryNodeProofResponse} - QueryNodeProofResponse object.
   * @memberof QueryNodeProofResponse
   */
  public static fromJSON(json: string): QueryNodeProofResponse {
    const jsonObject = JSON.parse(json)
    const storedProof = NodeProof.fromJSON(JSON.stringify(jsonObject))
    
    return new QueryNodeProofResponse(storedProof)
  }

  public readonly nodeProof: NodeProof

  /**
   * QueryNodeProofResponse.
   * @constructor
   * @param {StoredProof} nodeProof - Amount staked by the node.
   */
  constructor(nodeProof: NodeProof) {
    this.nodeProof = nodeProof
  }
  /**
   *
   * Creates a JSON object with the QueryNodeProofResponse properties
   * @returns {JSON} - JSON Object.
   * @memberof QueryNodeProofResponse
   */
  public toJSON() {
    return this.nodeProof.toJSON()
  }
}
