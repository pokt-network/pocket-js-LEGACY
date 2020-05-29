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
  public static fromJSON(json: string): QueryNodeReceiptsResponse {
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
          jsonObject.per_page
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
  public readonly perPage: number

  /**
   * QueryNodeReceiptsResponse.
   * @constructor
   * @param {StoredReceipt[]} storedReceipts - Stored receipts array.
   */
  constructor(storedReceipts: StoredReceipt[], page: number, perPage: number) {
    this.storedReceipts = storedReceipts
    this.page = page
    this.perPage = perPage
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
      per_page: this.perPage
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
