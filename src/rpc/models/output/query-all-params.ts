import { MsgClaim } from "./msg-claim"

/**
 *
 *
 * @class QueryAllParams
 */
export class QueryAllParams {
  /**
   *
   * Creates a QueryAllParams object using a JSON string
   * @param {String} json - JSON string.
   * @returns {QueryAllParams} - QueryAllParams object.
   * @memberof QueryAllParams
   */
  public static fromJSON(json: string): QueryAllParams {
    try {
      const msgClaim = MsgClaim.fromJSON(json)

      return new QueryAllParams(
        msgClaim
      )
    } catch (error) {
      throw error
    }
  }

  public readonly msgClaim: MsgClaim

  /**
   * Query All Params Response.
   * @constructor
   * @param {MsgClaim} msgClaim - Message claim object.
   */
  constructor(
    msgClaim: MsgClaim
  ) {
    this.msgClaim = msgClaim

    if (!this.isValid()) {
      throw new TypeError("Invalid QueryAllParams properties.")
    }
  }
  /**
   *
   * Creates a JSON object with the QueryAllParams properties
   * @returns {JSON} - JSON Object.
   * @memberof QueryAllParams
   */
  public toJSON() {
    return this.msgClaim.toJSON()
  }
  /**
   *
   * Check if the QueryAllParams object is valid
   * @returns {boolean} - True or false.
   * @memberof QueryAllParams
   */
  public isValid(): boolean {
    return this.msgClaim.isValid()
  }
}
