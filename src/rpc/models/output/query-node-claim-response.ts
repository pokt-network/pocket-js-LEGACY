import { MsgClaim } from "./msg-claim"

/**
 *
 *
 * @class QueryNodeClaimResponse
 */
export class QueryNodeClaimResponse {
  /**
   *
   * Creates a QueryNodeClaimResponse object using a JSON string
   * @param {String} json - JSON string.
   * @returns {QueryNodeClaimResponse} - QueryNodeClaimResponse object.
   * @memberof QueryNodeClaimResponse
   */
  public static fromJSON(json: string): QueryNodeClaimResponse {
    try {
      const jsonObject = JSON.parse(json)
      const msgClaim = MsgClaim.fromJSON(JSON.stringify(jsonObject.value))

      return new QueryNodeClaimResponse(
        msgClaim
      )
    } catch (error) {
      throw error
    }
  }

  public readonly msgClaim: MsgClaim

  /**
   * Query Node Claim Response.
   * @constructor
   * @param {MsgClaim} msgClaim - Message claim object.
   */
  constructor(
    msgClaim: MsgClaim
  ) {
    this.msgClaim = msgClaim

    if (!this.isValid()) {
      throw new TypeError("Invalid QueryNodeClaimResponse properties.")
    }
  }
  /**
   *
   * Creates a JSON object with the QueryNodeClaimResponse properties
   * @returns {JSON} - JSON Object.
   * @memberof QueryNodeClaimResponse
   */
  public toJSON() {
    return this.msgClaim.toJSON()
  }
  /**
   *
   * Check if the QueryNodeClaimResponse object is valid
   * @returns {boolean} - True or false.
   * @memberof QueryNodeClaimResponse
   */
  public isValid(): boolean {
    return this.msgClaim.isValid()
  }
}
