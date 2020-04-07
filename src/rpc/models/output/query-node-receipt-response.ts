import { NodeReceipt } from "../input"
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
      const storedReceipt = NodeReceipt.fromJSON(JSON.stringify(jsonObject))
      
      return new QueryNodeReceiptResponse(storedReceipt)
    } catch (error) {
      throw error
    }
  }

  public readonly nodeReceipt: NodeReceipt

  /**
   * QueryNodeReceiptResponse.
   * @constructor
   * @param {storedReceipt} nodeReceipt - Amount staked by the node.
   */
  constructor(nodeReceipt: NodeReceipt) {
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
