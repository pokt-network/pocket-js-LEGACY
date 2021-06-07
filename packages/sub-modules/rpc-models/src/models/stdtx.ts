export type Fee = { amount: string, denom: string }
export type Signature = { pub_key: string, signature: string }

/**
 *
 *
 * @class StdTxModel
 */
 export class StdTxModel {
  /**
   *
   * Creates a StdTxModel object using a JSON string
   * @param {string} json - JSON string.
   * @returns {StdTxModel} - StdTxModel object.
   * @memberof StdTxModel
   */
  public static fromJSON(json: string): StdTxModel {
    try {
      const jsonObject = JSON.parse(json)
      
      const fee = { amount: jsonObject.fee[0].amount, denom: jsonObject.fee[0].denom }
      const msg = jsonObject.msg || {}

      const signature = { pub_key: jsonObject.signature.pub_key, signature: jsonObject.signature.signature }

      return new StdTxModel(
        jsonObject.entropy,
        fee,
        jsonObject.memo,
        msg,
        signature
      )
    } catch (error) {
      throw error
    }
  }

  public readonly entropy: number
  public readonly fee: Fee
  public readonly memo: string
  public readonly msg: any
  public readonly signature: Signature

  /**
   * StdTxModel.
   * @constructor
   * @param {number} entropy - Entropy.
   * @param {Fee} fee - Fee.
   * @param {Msg} msg - Msg.
   * @param {Signature} signature - signature.
   */
  constructor(entropy: number, fee: Fee, memo: string, msg: any, signature: Signature) {
    this.entropy = entropy
    this.fee = fee
    this.memo = memo
    this.msg = msg
    this.signature = signature

    if (!this.isValid()) {
      throw new TypeError("Invalid StdTxModel properties.")
    }
  }
  /**
   *
   * Creates a JSON object with the StdTxModel properties
   * @returns {JSON} - JSON Object.
   * @memberof StdTxModel
   */
  public toJSON() {
    return {
      entropy: this.entropy,
      fee: this.fee,
      memo: this.memo,
      msg: this.msg,
      signature: this.signature
    }
  }
  /**
   *
   * Check if the StdTxModel object is valid
   * @returns {boolean} - True or false.
   * @memberof StdTxModel
   */
  public isValid(): boolean {
    return true
  }
}