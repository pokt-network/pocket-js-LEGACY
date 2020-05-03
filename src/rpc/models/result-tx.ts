import { Hex, TxProof } from "../.."
import { StakingStatus } from "./staking-status"
import { ResponseDeliverTx } from "./response-deliver-tx"
/**
 *
 *
 * @class ResultTx
 */
export class ResultTx {
  /**
   *
   * Creates a ResultTx object using a JSON string
   * @param {String} json - JSON string.
   * @returns {ResultTx} - ResultTx object.
   * @memberof ResultTx
   */
  public static fromJSON(json: string): ResultTx {
    try {
      const jsonObject = JSON.parse(json)
      const txProof = TxProof.fromJSON(JSON.stringify(jsonObject.proof))
      const responseDeliverTx = ResponseDeliverTx.fromJSON(JSON.stringify(jsonObject.tx_result))

      return new ResultTx(
        jsonObject.hash,
        BigInt(jsonObject.height),
        jsonObject.index,
        responseDeliverTx,
        jsonObject.tx,
        txProof
      )
    } catch (error) {
      throw error
    }
  }

  public readonly hash: string
  public readonly height: BigInt
  public readonly index: number
  public readonly txResult: ResponseDeliverTx
  public readonly tx: Buffer
  public readonly txProof: TxProof

  /**
   * Creates a ResultTx.
   * @constructor
   * @param {string} hash - 
   * @param {BigInt} height - 
   * @param {number} index - 
   * @param {ResponseDeliverTx} txResult - 
   * @param {Transaction} tx - 
   * @param {TxProof} txProof - 
   */
  constructor(
    hash: string,
    height: BigInt,
    index: number,
    txResult: ResponseDeliverTx,
    tx: Buffer,
    txProof: TxProof,
  ) {
    this.hash = hash
    this.height = height
    this.index = index
    this.txResult = txResult
    this.tx = tx
    this.txProof = txProof

    if (!this.isValid()) {
      throw new TypeError("Invalid ResultTx properties.")
    }
  }
  /**
   *
   * Creates a JSON object with the ResultTx properties
   * @returns {JSON} - JSON Object.
   * @memberof ResultTx
   */
  public toJSON() {
    return {
      hash: this.hash,
      height: this.height,
      index: this.index,
      tx_result: this.txResult.toJSON(),
      tx: this.tx.toString("hex"),
      proof: this.txProof.toJSON()
    }
  }
  /**
   *
   * Verify if all properties are valid
   * @returns {boolean} - True or false.
   * @memberof ResultTx
   */
  public isValid() {
    return this.hash.length > 0 &&
      Number(this.height.toString()) >= 0 &&
      this.index >= 0 &&
      this.txResult.isValid() &&
      this.tx.length > 0 &&
      this.txProof.isValid()
  }
}
