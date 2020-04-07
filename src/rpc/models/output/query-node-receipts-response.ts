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
  
      jsonObject.nodes.forEach(function(receiptJSON: {}) {
        const receipt = StoredReceipt.fromJSON(JSON.stringify(receiptJSON))
        receipts.push(receipt)
      })
      if (receipts !== undefined) {
        return new QueryNodeReceiptsResponse(receipts as StoredReceipt[])
      } else {
        throw new Error("Failed to parse QueryNodeReceiptsResponse")
      }
    } catch (error) {
      throw error
    }
  }

  public readonly stroredReceipts: StoredReceipt[]

  /**
   * QueryNodeReceiptsResponse.
   * @constructor
   * @param {StoredReceipt[]} stroredReceipts - Stored receipts array.
   */
  constructor(stroredReceipts: StoredReceipt[]) {
    this.stroredReceipts = stroredReceipts
  }
  /**
   *
   * Creates a JSON object with the QueryNodeReceiptsResponse properties
   * @returns {JSON} - JSON Object.
   * @memberof QueryNodeReceiptsResponse
   */
  public toJSON() {
    const receiptsListJSON: StoredReceipt[] = []
    this.stroredReceipts.forEach(receipt => {
      receiptsListJSON.push(receipt)
    })
    return JSON.parse(JSON.stringify(receiptsListJSON))
  }
}
