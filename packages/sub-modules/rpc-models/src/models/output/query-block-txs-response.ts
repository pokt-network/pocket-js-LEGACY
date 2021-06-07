import { Transaction } from "../transaction"

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
      const transactions: Transaction[] = []

      if (rawObjValue.txs) {
        rawObjValue.txs.forEach((tx: any) => {
          const resultTx = Transaction.fromJSON(JSON.stringify(tx))
          transactions.push(resultTx)
        })
      }

      return new QueryBlockTxsResponse(
        transactions,
        rawObjValue.total_count
      )
    } catch (error) {
      throw error
    }
  }

  public readonly transactions: Transaction[]
  public readonly totalCount: number

  /**
   * Query block transactions Response.
   * @constructor
   * @param {Transaction[]} transactions - List of transactions.
   * @param {number} totalCount - Transaction count
   */
  constructor(
    transactions: Transaction[],
    totalCount: number
  ) {
    this.transactions = transactions
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
    const transactions: {}[] = []

    this.transactions.forEach(tx => {
      const transactionsObj = tx.toJSON()
      transactions.push(transactionsObj)
    })

    return {
      txs: transactions,
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
    return true
  }
}
