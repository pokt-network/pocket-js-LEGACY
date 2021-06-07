import { Hex } from "@pokt-network/pocket-js-utils"
import { TxProof } from "./tx-proof"
import { ResponseDeliverTx } from "./response-deliver-tx"
import { StdTxModel } from "./stdtx"

/**
 *
 *
 * @class Transaction
 */
export class Transaction {
  /**
   *
   * Creates a Transaction object using a JSON string
   * @param {string} json - JSON string.
   * @returns {Transaction} - Transaction object.
   * @memberof Transaction
   */
  public static fromJSON(json: string): Transaction {
    try {
      const jsonObject = JSON.parse(json)
      const txResult = ResponseDeliverTx.fromJSON(JSON.stringify(jsonObject.tx_result))
      
      return new Transaction(
        jsonObject.hash,
        BigInt(jsonObject.height),
        BigInt(jsonObject.index),
        txResult,
        jsonObject.tx,
        TxProof.fromJSON(JSON.stringify(jsonObject.proof)),
        StdTxModel.fromJSON(JSON.stringify(jsonObject.stdTx))
      )
    } catch (error) {
      throw error
    }
  }

  public readonly hash: string
  public readonly height: BigInt
  public readonly index: BigInt
  public readonly txResult: ResponseDeliverTx
  public readonly tx: string
  public readonly proof: TxProof
  public readonly stdTx: StdTxModel

  /**
   * Transaction.
   * @constructor
   * @param {string} hash - Transaction hash.
   * @param {BigInt} height - Session Block Height.
   * @param {BigInt} index - Transaction index in the block.
   * @param {ResponseDeliverTx} txResult - Transaction result object.
   * @param {string} tx - Transaction hex.
   * @param {TxProof} proof - Transaction Proof.
   * @param {StdTx} stdTx - Standard transaction object.
   */
  constructor(
    hash: string,
    height: BigInt,
    index: BigInt,
    txResult: ResponseDeliverTx,
    tx: string,
    proof: TxProof,
    stdTx: StdTxModel
  ) {
    this.hash = hash
    this.height = height
    this.index = index
    this.tx = tx
    this.proof = proof
    this.txResult = txResult
    this.stdTx = stdTx

    if (!this.isValid()) {
      throw new TypeError("Invalid Transaction properties.")
    }
  }
  /**
   *
   * Creates a JSON object with the Transaction properties
   * @returns {JSON} - JSON Object.
   * @memberof Transaction
   */
  public toJSON() {
    return {
      hash: this.hash,
      height: Number(this.height.toString()),
      index: Number(this.index.toString()),
      proof: this.proof.toJSON(),
      tx: this.tx,
      tx_result: this.txResult.toJSON(),
      stdTx: this.stdTx.toJSON()
    }
  }
  /**
   *
   * Check if the Transaction object is valid
   * @returns {boolean} - True or false.
   * @memberof Transaction
   */
  public isValid(): boolean {
    let validHash = true

    if (this.hash) {
      validHash = Hex.isHex(this.hash)
    }
    return validHash &&
    Number(this.height.toString()) >= 0 &&
    Number(this.index.toString()) >= 0  &&
    this.txResult.isValid()
  }
}
