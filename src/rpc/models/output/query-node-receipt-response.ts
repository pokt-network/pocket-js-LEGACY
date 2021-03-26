import { StoredReceipt } from "../stored-receipt"
/**
 *
 *
 * @class QueryNodeReceiptResponse
 */
export class QueryNodeReceiptResponse {
  /**
   *
   * Creates a QueryNodeReceiptResponse object using a JSON string
   * @param {String} json - JSON string.
   * @returns {QueryNodeReceiptResponse} - QueryNodeReceiptResponse object.
   * @memberof QueryNodeReceiptResponse
   */
  public static fromJSON(json: string): QueryNodeReceiptResponse {
    try {
      const jsonObject = JSON.parse(json)
      const storedReceipt = StoredReceipt.fromJSON(JSON.stringify(jsonObject.value))
      
      return new QueryNodeReceiptResponse(storedReceipt)
    } catch (error) {
      throw error
    }
  }

  public readonly nodeReceipt: StoredReceipt

  /**
   * QueryNodeReceiptResponse.
   * @constructor
   * @param {StoredReceipt} nodeReceipt - Amount staked by the node.
   */
  constructor(nodeReceipt: StoredReceipt) {
    this.nodeReceipt = nodeReceipt
  }
  /**
   *
   * Creates a JSON object with the QueryNodeReceiptResponse properties
   * @returns {JSON} - JSON Object.
   * @memberof QueryNodeReceiptResponse
   */
  public toJSON() {
    return this.nodeReceipt.toJSON()
  }
}
