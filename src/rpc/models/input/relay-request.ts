import { RelayProof } from "../relay-proof"
import { RelayPayload } from "./relay-payload"
import { RelayMeta } from "./relay-meta"
import { RequestHash } from "./request-hash"
import { PocketAAT } from "../../../pocket"
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
      const relayPayload = RelayPayload.fromJSON(JSON.stringify(jsonObject.payload))
      const relayMeta = RelayMeta.fromJSON(JSON.stringify(jsonObject.meta))
      const requestHash = new RequestHash(relayPayload, relayMeta)

      const pocketAAT = new PocketAAT(
        jsonObject.proof.aat.version,
        jsonObject.proof.aat.client_pub_key,
        jsonObject.proof.aat.app_pub_key,
        jsonObject.proof.aat.signature
      )
      const relayProof = new RelayProof(
        BigInt(jsonObject.proof.entropy),
        BigInt(jsonObject.proof.session_block_height),
        jsonObject.proof.servicer_pub_key,
        jsonObject.proof.blockchain,
        pocketAAT,
        jsonObject.proof.signature,
        requestHash
      )

      return new RelayRequest(
        relayPayload,
        relayMeta,
        relayProof
      )
    } catch (error) {
      throw error
    }
  }

  public readonly payload: RelayPayload
  public readonly meta: RelayMeta
  public readonly proof: RelayProof

  /**
   * Relay Request.
   * @constructor
   * @param {RelayPayload} payload - Relay payload.
   * @param {RelayMeta} meta - Relay meta.
   * @param {RelayProof} proof - Proof object.
   */
  constructor(payload: RelayPayload, meta: RelayMeta, proof: RelayProof) {
    this.payload = payload
    this.meta = meta
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
      meta: this.meta.toJSON(),
      proof: this.proof.toJSON()
    }
  }
  /**
   *
   * Check if the RelayRequest object is valid
   * @returns {boolean} - True or false.
   * @memberof RelayRequest
   */
  public isValid(): boolean {
    return this.payload.isValid() &&
      this.meta.isValid() &&
      this.proof.isValid()
  }
}
