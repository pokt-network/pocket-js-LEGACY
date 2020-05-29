import { QueryNodeReceiptsResponse } from "./query-node-receipts-response"

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
      const nodeReceiptsResponse = QueryNodeReceiptsResponse.fromJSON(json)

      return new QueryNodeClaimResponse(
        nodeReceiptsResponse
      )
    } catch (error) {
      throw error
    }
  }

  public readonly nodeReceiptsResponse: QueryNodeReceiptsResponse

  /**
   * Query Node Claim Response.
   * @constructor
   * @param {QueryNodeReceiptsResponse} nodeReceiptsResponse - Node receipts response object.
   */
  constructor(
    nodeReceiptsResponse: QueryNodeReceiptsResponse
  ) {
    this.nodeReceiptsResponse = nodeReceiptsResponse

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
    return this.nodeReceiptsResponse.toJSON()
  }
  /**
   *
   * Check if the QueryNodeClaimResponse object is valid
   * @returns {boolean} - True or false.
   * @memberof QueryNodeClaimResponse
   */
  public isValid(): boolean {
    return this.nodeReceiptsResponse.isValid()
  }
}
