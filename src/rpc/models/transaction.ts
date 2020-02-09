import { Hex } from "../../utils/hex"
import { TxProof } from "./tx-proof"

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

      return new Transaction(
        jsonObject.hash,
        jsonObject.height,
        jsonObject.index,
        jsonObject.tx,
        TxProof.fromJSON(JSON.stringify(jsonObject.proof))
      )
    } catch (error) {
      throw error
    }
  }

  public readonly hash: string
  public readonly height: BigInt
  public readonly index: BigInt
  public readonly tx: Hex
  public readonly proof: TxProof

  /**
   * Transaction.
   * @constructor
   * @param {string} hash - Transaction hash.
   * @param {BigInt} height - Session Block Height.
   * @param {BigInt} index - Transaction index in the block.
   * @param {Hex} tx - Transaction hex.
   * @param {TxProof} proof - Transaction Proof.
   */
  constructor(
    hash: string,
    height: BigInt,
    index: BigInt,
    tx: Hex,
    proof: TxProof
  ) {
    this.hash = hash
    this.height = height
    this.index = index
    this.tx = tx
    this.proof = proof

    if (!this.isValid()) {
      throw new TypeError("Invalid Transaction properties length.")
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
      height: this.height.toString(16),
      index: this.index.toString(16),
      proof: this.proof.toJSON(),
      tx: this.tx
    }
  }
  /**
   *
   * Check if the Transaction object is valid
   * @returns {boolean} - True or false.
   * @memberof Transaction
   */
  public isValid(): boolean {
    return Hex.isHex(this.hash) &&
    this.height !== undefined &&
    this.index !== undefined &&
    this.proof.isValid() &&
    this.tx !== undefined
  }
}
