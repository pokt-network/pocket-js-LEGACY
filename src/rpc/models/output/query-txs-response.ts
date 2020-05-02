import { ResultTx } from "../result-tx"

/**
 *
 *
 * @class QueryTxsResponse
 */
export class QueryTxsResponse {
  /**
   *
   * Creates a QueryTxsResponse object using a JSON string
   * @param {String} json - JSON string.
   * @returns {QueryTxsResponse} - QueryTxsResponse object.
   * @memberof QueryTxsResponse
   */
  public static fromJSON(json: string): QueryTxsResponse {
    try {
      const rawObjValue = JSON.parse(json)
      const resultTx = ResultTx.fromJSON(rawObjValue.txs)

      return new QueryTxsResponse(resultTx, rawObjValue.total_count)
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
      throw new TypeError("Invalid QueryTxsResponse properties.")
    }
  }
  /**
   *
   * Creates a JSON object with the QueryTxsResponse properties
   * @returns {JSON} - JSON Object.
   * @memberof QueryTxsResponse
   */
  public toJSON() {
    return {
      txs: this.resultTx.toJSON(),
      total_count: this.totalCount
    }
  }
  /**
   *
   * Check if the QueryTxsResponse object is valid
   * @returns {boolean} - True or false.
   * @memberof QueryTxsResponse
   */
  public isValid(): boolean {
    return this.resultTx.isValid() &&
    this.totalCount !== undefined
  }
}
