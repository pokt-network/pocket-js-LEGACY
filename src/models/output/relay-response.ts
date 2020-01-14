import { Proof } from "../proof"
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
    const jsonObject = JSON.parse(json)

    return new RelayResponse(
      jsonObject.signature,
      jsonObject.response,
      jsonObject.proof
    )
  }

  public readonly signature: string
  public readonly response: string
  public readonly proof: Proof

  /**
   * Relay Response.
   * @constructor
   * @param {string} signature - Signature.
   * @param {string} response - Response string.
   * @param {Proof} proof - Proof object.
   */
  constructor(signature: string, response: string, proof: Proof) {
    this.signature = signature
    this.response = response
    this.proof = proof

    if (!this.isValid()) {
      throw new TypeError("Invalid properties length.")
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
      response: this.response,
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
      this.response.length !== 0
    )
  }
}
