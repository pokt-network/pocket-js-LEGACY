import { RelayProof } from "../relay-proof"
/**
 *
 *
 * @class RelayResponse
 */
export class RelayResponse {
  /**
   *
   * Creates a RelayResponse object using a JSON string
   * @param {String} json - JSON string.
   * @returns {RelayResponse} - RelayResponse object.
   * @memberof RelayResponse
   */
  public static fromJSON(json: string): RelayResponse {
    try {
      const jsonObject = JSON.parse(json)
      const proof = RelayProof.fromJSON(JSON.stringify(jsonObject.RelayProof))
  
      return new RelayResponse(
        jsonObject.signature,
        jsonObject.payload,
        proof
      )
    } catch (error) {
      throw error
    }
  }

  public readonly signature: string
  public readonly payload: string
  public readonly proof: RelayProof

  /**
   * Relay Response.
   * @constructor
   * @param {string} signature - Signature.
   * @param {string} payload - Payload string.
   * @param {RelayProof} proof - Proof object.
   */
  constructor(signature: string, payload: string, proof: RelayProof) {
    this.signature = signature
    this.payload = payload
    this.proof = proof

    if (!this.isValid()) {
      throw new TypeError("Invalid RelayResponse properties.")
    }
  }
  /**
   *
   * Creates a JSON object with the RelayResponse properties
   * @returns {JSON} - JSON Object.
   * @memberof RelayResponse
   */
  public toJSON() {
    return {
      proof: this.proof.toJSON(),
      payload: this.payload,
      signature: this.signature
    }
  }
  /**
   *
   * Check if the RelayResponse object is valid
   * @returns {boolean} - True or false.
   * @memberof RelayResponse
   */
  public isValid(): boolean {
    return (
      this.signature.length !== 0 &&
      this.proof.isValid() &&
      this.payload.length !== 0
    )
  }
}
