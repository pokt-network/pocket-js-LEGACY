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

      if (jsonObject.result) {
        jsonObject.result.forEach((claim: any) => {
          const msgClaim = MsgClaim.fromJSON(JSON.stringify(claim))
          msgClaims.push(msgClaim)
        })
      }

      return new QueryNodeClaimsResponse(
        msgClaims,
        jsonObject.page,
        jsonObject.total_pages
      )
    } catch (error) {
      throw error
    }
  }

  public readonly msgClaims: MsgClaim[]
  public readonly page: number
  public readonly totalPages: number

  /**
   * Query Node Claims Response.
   * @constructor
   * @param {MsgClaim[]} msgClaims - Stored receipt object.
   */
  constructor(
    msgClaims: MsgClaim[],
    page: number,
    totalPages: number
  ) {
    this.msgClaims = msgClaims
    this.page = page
    this.totalPages = totalPages

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
    const msgClaimsList: object[] = []

    this.msgClaims.forEach(msgClaim => {
      msgClaimsList.push(msgClaim.toJSON())
    })

    return {
      page: this.page,
      total_pages: this.totalPages,
      result: msgClaimsList
    }
  }
  /**
   *
   * Check if the QueryNodeClaimsResponse object is valid
   * @returns {boolean} - True or false.
   * @memberof QueryNodeClaimsResponse
   */
  public isValid(): boolean {
    if (this.msgClaims.length > 0) {
      this.msgClaims.forEach(msg => {
        if (!msg.isValid()) {
          return false
        }
      })
    }
    return true
  }
}
