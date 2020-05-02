import { ResultTx } from "../result-tx"

/**
 *
 *
 * @class QueryBlockTxsResponse
 */
export class QueryBlockTxsResponse {
  /**
   *
   * Creates a QueryBlockTxsResponse object using a JSON string
   * @param {String} json - JSON string.
   * @returns {QueryBlockTxsResponse} - QueryBlockTxsResponse object.
   * @memberof QueryBlockTxsResponse
   */
  public static fromJSON(json: string): QueryBlockTxsResponse {
    try {
      const rawObjValue = JSON.parse(json)
      const resultTx = ResultTx.fromJSON(rawObjValue.txs)
      
      return new QueryBlockTxsResponse(resultTx, rawObjValue.total_count)
    } catch (error) {
      throw error
    }
  }

  public readonly resultTx: ResultTx
  public readonly totalCount: number

  /**
   * Query Account Response.
   * @constructor
   * @param {ResultTx} resultTx - 
   * @param {number} totalCount - 
   */
  constructor( 
    resultTx: ResultTx,
    totalCount: number
  ) {
    this.resultTx = resultTx
    this.totalCount = totalCount

    if (!this.isValid()) {
      throw new TypeError("Invalid QueryBlockTxsResponse properties.")
    }
  }
  /**
   *
   * Creates a JSON object with the QueryBlockTxsResponse properties
   * @returns {JSON} - JSON Object.
   * @memberof QueryBlockTxsResponse
   */
  public toJSON() {
    return {
      txs: this.resultTx.toJSON(),
      total_count: this.totalCount
    }
  }
  /**
   *
   * Check if the QueryBlockTxsResponse object is valid
   * @returns {boolean} - True or false.
   * @memberof QueryBlockTxsResponse
   */
  public isValid(): boolean {
    return this.resultTx.isValid() &&
    this.totalCount !== undefined
  }
}
