import { StoredReceipt } from "../stored-receipt"

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
      const storedReceipt = StoredReceipt.fromJSON(json)

      return new QueryNodeClaimsResponse(
        storedReceipt
      )
    } catch (error) {
      throw error
    }
  }

  public readonly storedReceipt: StoredReceipt

  /**
   * Query Node Claims Response.
   * @constructor
   * @param {StoredReceipt} storedReceipt - Stored receipt object.
   */
  constructor(
    storedReceipt: StoredReceipt
  ) {
    this.storedReceipt = storedReceipt

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
    return this.storedReceipt.toJSON()
  }
  /**
   *
   * Check if the QueryNodeClaimsResponse object is valid
   * @returns {boolean} - True or false.
   * @memberof QueryNodeClaimsResponse
   */
  public isValid(): boolean {
    return this.storedReceipt.isValid()
  }
}
