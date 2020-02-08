import { Proof } from "../proof"
import { RelayPayload } from "./relay-payload"
/**
 *
 *
 * @class RelayRequest
 */
export class RelayRequest {
  /**
   *
   * Creates a RelayRequest object using a JSON string
   * @param {String} json - JSON string.
   * @returns {RelayRequest} - RelayRequest object.
   * @memberof RelayRequest
   */
  public static fromJSON(json: string): RelayRequest {
    try {
      const jsonObject = JSON.parse(json)
      return new RelayRequest(
        RelayPayload.fromJSON(JSON.stringify(jsonObject.payload)),
        Proof.fromJSON(JSON.stringify(jsonObject.proof))
      )
    } catch (error) {
      throw error
    }
  }

  public readonly payload: RelayPayload
  public readonly proof: Proof

  /**
   * Relay Request.
   * @constructor
   * @param {RelayPayload} payload - Relay payload.
   * @param {Proof} proof - Proof object.
   */
  constructor(payload: RelayPayload, proof: Proof) {
    this.payload = payload
    this.proof = proof

    if (!this.isValid()) {
      throw new TypeError("Invalid RelayRequest properties.")
    }
  }
  /**
   *
   * Creates a JSON object with the RelayRequest properties
   * @returns {JSON} - JSON Object.
   * @memberof RelayRequest
   */
  public toJSON() {
    return {
      payload: this.payload.toJSON(),
      relayProof: this.proof.toJSON()
    }
  }
  /**
   *
   * Check if the RelayRequest object is valid
   * @returns {boolean} - True or false.
   * @memberof RelayRequest
   */
  public isValid(): boolean {
    return this.payload.isValid() && this.proof.isValid()
  }
}
