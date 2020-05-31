import { StoredReceipt } from "../stored-receipt"
/**
 *
 *
 * @class QueryNodeReceiptsResponse
 */
export class QueryNodeReceiptsResponse {
  /**
   *
   * Creates a QueryNodeReceiptsResponse object using a JSON string
   * @param {String} json - JSON string.
   * @returns {QueryNodeReceiptsResponse} - QueryNodeReceiptsResponse object.
   * @memberof QueryNodeReceiptsResponse
   */
  public static fromJSON(json: any): QueryNodeReceiptsResponse {
    try {
      const jsonObject = JSON.parse(json)
      const receipts: StoredReceipt[] = []

      jsonObject.result.forEach(function(receiptJSON: {}) {
        const receipt = StoredReceipt.fromJSON(JSON.stringify(receiptJSON))
        receipts.push(receipt)
      })
      if (receipts !== undefined) {
        return new QueryNodeReceiptsResponse(
          receipts as StoredReceipt[],
          jsonObject.page,
          jsonObject.total_pages
        )
      } else {
        throw new Error("Failed to parse QueryNodeReceiptsResponse")
      }
    } catch (error) {
      throw error
    }
  }

  public readonly storedReceipts: StoredReceipt[]
  public readonly page: number
  public readonly totalPages: number

  /**
   * QueryNodeReceiptsResponse.
   * @constructor
   * @param {StoredReceipt[]} storedReceipts - Stored receipts array.
   */
  constructor(storedReceipts: StoredReceipt[], page: number, totalPages: number) {
    this.storedReceipts = storedReceipts
    this.page = page
    this.totalPages = totalPages
  }
  /**
   *
   * Creates a JSON object with the QueryNodeReceiptsResponse properties
   * @returns {JSON} - JSON Object.
   * @memberof QueryNodeReceiptsResponse
   */
  public toJSON() {
    const receiptsListJSON: StoredReceipt[] = []
    this.storedReceipts.forEach(receipt => {
      receiptsListJSON.push(receipt)
    })
    const jsonObject = {
      result: JSON.parse(JSON.stringify(receiptsListJSON)),
      page: this.page,
      total_pages: this.totalPages
    }
    return jsonObject
  }

  /**
   *
   * Check if the QueryNodeReceiptsResponse object is valid
   * @returns {boolean} - True or false.
   * @memberof QueryNodeReceiptsResponse
   */
  public isValid(): boolean {
    this.storedReceipts.forEach(receipt => {
      if (!receipt.isValid()) {
        return false
      }
    })
    return true
  }
}
