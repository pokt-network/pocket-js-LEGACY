import { RelayProofResponse } from "./relay-proof-response"
import { RelayRequest } from "../input"

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
      const proof = RelayProofResponse.fromJSON(JSON.stringify(jsonObject.response.proof))
      const relayRequest = RelayRequest.fromJSON(JSON.stringify(jsonObject.request))

      return new RelayResponse(
        jsonObject.response.signature,
        jsonObject.response.payload,
        proof,
        relayRequest
      )
    } catch (error) {
      throw error
    }
  }

  public readonly signature: string
  public readonly payload: string
  public readonly proof: RelayProofResponse
  public readonly relayRequest: RelayRequest
  /**
   * Relay Response.
   * @constructor
   * @param {string} signature - Signature.
   * @param {string} payload - Payload string.
   */
  constructor(signature: string, payload: string, proof: RelayProofResponse, relayRequest: RelayRequest) {
    this.signature = signature
    this.payload = payload
    this.proof = proof
    this.relayRequest = relayRequest

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
      response: {
        payload: this.payload,
        signature: this.signature,
        proof: this.proof.toJSON(),
      },
      request: this.relayRequest.toJSON()
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
      this.payload.length !== 0 &&
      this.proof.isValid() &&
      this.relayRequest.isValid()
    )
  }
}
