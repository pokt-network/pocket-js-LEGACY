import { StoredProof } from "../stored-proof"
/**
 *
 *
 * @class QueryNodeProofsResponse
 */
export class QueryNodeProofsResponse {
  /**
   *
   * Creates a QueryNodeProofsResponse object using a JSON string
   * @param {String} json - JSON string.
   * @returns {QueryNodeProofsResponse} - QueryNodeProofsResponse object.
   * @memberof QueryNodeProofsResponse
   */
  public static fromJSON(json: string): QueryNodeProofsResponse {
    const jsonObject = JSON.parse(json)

    const proofs: StoredProof[] = []

    jsonObject.forEach(function(proofJSON: {}) {
      const proof = StoredProof.fromJSON(JSON.stringify(proofJSON))
      proofs.push(proof)
    })
    if (proofs !== undefined) {
      return new QueryNodeProofsResponse(proofs as StoredProof[])
    } else {
      // TODO: Handle undefined scenario properly
      return new QueryNodeProofsResponse(jsonObject)
    }
  }

  public readonly stroredProofs: StoredProof[]

  /**
   * QueryNodeProofsResponse.
   * @constructor
   * @param {StoredProof[]} stroredProofs - Amount staked by the node.
   */
  constructor(stroredProofs: StoredProof[]) {
    this.stroredProofs = stroredProofs
  }
  /**
   *
   * Creates a JSON object with the QueryNodeProofsResponse properties
   * @returns {JSON} - JSON Object.
   * @memberof QueryNodeProofsResponse
   */
  public toJSON() {
    const proofsListJSON: StoredProof[] = []
    this.stroredProofs.forEach(proof => {
      proofsListJSON.push(proof)
    })
    return { proofs: JSON.parse(JSON.stringify(proofsListJSON)) }
  }
}
