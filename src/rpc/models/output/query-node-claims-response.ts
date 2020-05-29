import { StoredReceipt } from "../stored-receipt"
import { MsgClaim } from "./msg-claim"

/**
 *
 *
 * @class QueryNodeClaimsResponse
 */
export class QueryNodeClaimsResponse {
  /**
   *
   * Creates a QueryNodeClaimsResponse object using a JSON string
   * @param {String} json - JSON string.
   * @returns {QueryNodeClaimsResponse} - QueryNodeClaimsResponse object.
   * @memberof QueryNodeClaimsResponse
   */
  public static fromJSON(json: string): QueryNodeClaimsResponse {
    try {
      const jsonObject = JSON.parse(json)
      const msgClaims: MsgClaim[] = []

      jsonObject.forEach((claim: any) => {
        const msgClaim = MsgClaim.fromJSON(JSON.stringify(claim))
        msgClaims.push(msgClaim)
      })

      return new QueryNodeClaimsResponse(
        msgClaims
      )
    } catch (error) {
      throw error
    }
  }

  public readonly msgClaims: MsgClaim[]

  /**
   * Query Node Claims Response.
   * @constructor
   * @param {MsgClaim[]} msgClaims - Stored receipt object.
   */
  constructor(
    msgClaims: MsgClaim[]
  ) {
    this.msgClaims = msgClaims

    if (!this.isValid()) {
      throw new TypeError("Invalid QueryNodeClaimsResponse properties.")
    }
  }
  /**
   *
   * Creates a JSON object with the QueryNodeClaimsResponse properties
   * @returns {JSON} - JSON Object.
   * @memberof QueryNodeClaimsResponse
   */
  public toJSON() {
    return JSON.parse(JSON.stringify(this.msgClaims))
  }
  /**
   *
   * Check if the QueryNodeClaimsResponse object is valid
   * @returns {boolean} - True or false.
   * @memberof QueryNodeClaimsResponse
   */
  public isValid(): boolean {
    this.msgClaims.forEach(msg => {
      if (!msg.isValid()) {
        return false
      }
    })
    return true
  }
}
