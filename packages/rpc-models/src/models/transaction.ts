import { Hex } from "@pokt-network/pocket-js-utils"
import { TxProof } from "./tx-proof"
import { ResponseDeliverTx } from "./response-deliver-tx"

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
        jsonObject.tx,
        TxProof.fromJSON(JSON.stringify(jsonObject.proof)),
        txResult
      )
    } catch (error) {
      throw error
    }
  }

  public readonly hash: string
  public readonly height: BigInt
  public readonly index: BigInt
  public readonly tx: string
  public readonly proof: TxProof
  public readonly txResult: ResponseDeliverTx

  /**
   * Transaction.
   * @constructor
   * @param {string} hash - Transaction hash.
   * @param {BigInt} height - Session Block Height.
   * @param {BigInt} index - Transaction index in the block.
   * @param {string} tx - Transaction hex.
   * @param {TxProof} proof - Transaction Proof.
   */
  constructor(
    hash: string,
    height: BigInt,
    index: BigInt,
    tx: string,
    proof: TxProof,
    txResult: ResponseDeliverTx
  ) {
    this.hash = hash
    this.height = height
    this.index = index
    this.tx = tx
    this.proof = proof
    this.txResult = txResult

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
      tx_result: this.txResult.toJSON()
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
