import { Hex } from "../../../utils"

/**
 *
 *
 * @class NodeReceipt
 */
export class NodeReceipt {
  /**
   *
   * Creates a NodeReceipt object using a JSON string
   * @param {String} json - JSON string.
   * @returns {NodeReceipt} - NodeReceipt object.
   * @memberof NodeReceipt
   */
  public static fromJSON(json: string): NodeReceipt {
    try {
      const jsonObject = JSON.parse(json)

      return new NodeReceipt(
        jsonObject.address,
        jsonObject.blockchain,
        jsonObject.app_pubkey,
        BigInt(jsonObject.session_block_height),
        BigInt(jsonObject.height),
        jsonObject.receipt_type
      )
    } catch (error) {
      throw error
    }
  }

  public readonly address: string
  public readonly blockchain: string
  public readonly appPubKey: string
  public readonly sessionBlockHeight: BigInt
  public readonly height: BigInt
  public readonly receiptType: string
  /**
   * Node Receipt.
   * @constructor
   * @param {string} address - Node address.
   * @param {string} blockchain - Blockchain hash.
   * @param {string} appPubKey - Application Key associated with a client.
   * @param {BigInt} sessionBlockHeight - Session Block Height.
   * @param {BigInt} height - Current height.
   * @param {string} receiptType - Receipt type.
   */
  constructor(
    address: string,
    blockchain: string,
    appPubKey: string,
    sessionBlockHeight: BigInt,
    height: BigInt,
    receiptType: string
  ) {
    this.address = address
    this.blockchain = blockchain
    this.appPubKey = appPubKey
    this.sessionBlockHeight = sessionBlockHeight
    this.height = height
    this.receiptType = receiptType

    if (!this.isValid()) {
      throw new TypeError("Invalid NodeReceipt properties.")
    }
  }
  /**
   *
   * Creates a JSON object with the NodeReceipt properties
   * @returns {JSON} - JSON Object.
   * @memberof NodeReceipt
   */
  public toJSON() {
    return {
      address: this.address,
      app_pubkey: this.appPubKey,
      blockchain: this.blockchain,
      height: Number(this.height.toString()),
      session_block_height: Number(this.sessionBlockHeight.toString())
    }
  }
  /**
   *
   * Check if the NodeReceipt object is valid
   * @returns {boolean} - True or false.
   * @memberof NodeReceipt
   */
  public isValid(): boolean {
    return (
      Hex.isHex(this.address) && 
      Hex.byteLength(this.address) === 20 &&
      this.blockchain.length !== 0 &&
      Hex.isHex(this.appPubKey) &&
      Hex.byteLength(this.appPubKey) === 32 &&
      this.sessionBlockHeight !== undefined &&
      this.height !== undefined &&
      this.receiptType.length > 0
    )
  }
}
