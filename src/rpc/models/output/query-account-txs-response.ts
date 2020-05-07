import { ResultTx } from "../result-tx"

/**
 *
 *
 * @class QueryAccountTxsResponse
 */
export class QueryAccountTxsResponse {
  /**
   *
   * Creates a QueryAccountTxsResponse object using a JSON string
   * @param {String} json - JSON string.
   * @returns {QueryAccountTxsResponse} - QueryAccountTxsResponse object.
   * @memberof QueryAccountTxsResponse
   */
  public static fromJSON(json: string): QueryAccountTxsResponse {
    try {
      const rawObjValue = JSON.parse(json)
      const resultTxs: ResultTx[] = []

      rawObjValue.txs.forEach((tx: any) => {
        const resultTx = ResultTx.fromJSON(JSON.stringify(tx))
        resultTxs.push(resultTx)
      })

      return new QueryAccountTxsResponse(
        resultTxs,
        rawObjValue.total_count
      )
    } catch (error) {
      throw error
    }
  }

  public readonly resultTx: ResultTx[]
  public readonly totalCount: number

  /**
   * Query Account transaction Response.
   * @constructor
   * @param {ResultTx[]} resultTx - List of transactions.
   * @param {number} totalCount - Transaction count
   */
  constructor(
    resultTx: ResultTx[],
    totalCount: number
  ) {
    this.resultTx = resultTx
    this.totalCount = totalCount

    if (!this.isValid()) {
      throw new TypeError("Invalid QueryAccountTxsResponse properties.")
    }
  }
  /**
   *
   * Creates a JSON object with the QueryAccountTxsResponse properties
   * @returns {JSON} - JSON Object.
   * @memberof QueryAccountTxsResponse
   */
  public toJSON() {
    const resultTxs: {}[] = []

    this.resultTx.forEach(resultTx => {
      const resultTxObj = resultTx.toJSON()
      resultTxs.push(resultTxObj)
    })
    return {
      txs: resultTxs,
      total_count: this.totalCount
    }
  }
  /**
   *
   * Check if the QueryAccountTxsResponse object is valid
   * @returns {boolean} - True or false.
   * @memberof QueryAccountTxsResponse
   */
  public isValid(): boolean {
    return this.resultTx !== undefined &&
      this.totalCount !== undefined
  }
}
