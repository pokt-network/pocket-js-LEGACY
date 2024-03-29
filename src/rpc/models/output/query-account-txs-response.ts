import { ResultTx } from "../result-tx"
import { Transaction } from "../transaction"

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
      const transactions: Transaction[] = []

      if (rawObjValue.txs) {
        rawObjValue.txs.forEach((tx: any) => {
          const transaction = Transaction.fromJSON(JSON.stringify(tx))
          transactions.push(transaction)
        })
      }

      return new QueryAccountTxsResponse(
        transactions,
        rawObjValue.total_txs,
        rawObjValue.page_count
      )
    } catch (error) {
      throw error
    }
  }

  public readonly transactions: Transaction[]
  public readonly totalCount: number
  public readonly pageCount: number

  /**
   * Query Account transaction list Response.
   * @constructor
   * @param {Transaction[]} transactions - List of transactions.
   * @param {number} totalCount - Transaction count
   */
  constructor(
    transactions: Transaction[],
    totalCount: number,
    pageCount: number
  ) {
    this.transactions = transactions
    this.totalCount = totalCount
    this.pageCount = pageCount

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
    const transactions: object[] = []

    this.transactions.forEach(tx => {
      transactions.push(tx.toJSON())
    })
    
    return {
      txs: transactions,
      total_count: this.totalCount,
      page_count: this.pageCount
    }
  }
  /**
   *
   * Check if the QueryAccountTxsResponse object is valid
   * @returns {boolean} - True or false.
   * @memberof QueryAccountTxsResponse
   */
  public isValid(): boolean {
    return true
  }
}
