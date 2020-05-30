import { Hex } from "../../../utils"
import { EvidenceType } from "../evidence-type"

/**
 *
 *
 * @class Receipt
 */
export class Receipt {
  /**
   *
   * Creates a Receipt object using a JSON string
   * @param {String} json - JSON string.
   * @returns {Receipt} - Receipt object.
   * @memberof Receipt
   */
  public static fromJSON(json: string): Receipt {
    try {
      const jsonObject = JSON.parse(json)
      const evidenceType = EvidenceType.getType(jsonObject.evidence_type)
      return new Receipt(
        jsonObject.address,
        jsonObject.blockchain,
        jsonObject.app_pubkey,
        BigInt(jsonObject.session_block_height),
        BigInt(jsonObject.height),
        evidenceType
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
  public readonly evidenceType: EvidenceType

  /**
   * Receipt.
   * @constructor
   * @param {string} address - Node address.
   * @param {string} blockchain - Blockchain hash.
   * @param {string} appPubKey - Application Key associated with a client.
   * @param {BigInt} sessionBlockHeight - Session Block Height.
   * @param {BigInt} height - Current height.
   * @param {EvidenceType} evidenceType - Evidence type.
   */
  constructor(
    address: string,
    blockchain: string,
    appPubKey: string,
    sessionBlockHeight: BigInt,
    height: BigInt,
    evidenceType: EvidenceType
  ) {
    this.address = address
    this.blockchain = blockchain
    this.appPubKey = appPubKey
    this.sessionBlockHeight = sessionBlockHeight
    this.height = height
    this.evidenceType = evidenceType

    if (!this.isValid()) {
      throw new TypeError("Invalid Receipt properties.")
    }
  }
  /**
   *
   * Creates a JSON object with the Receipt properties
   * @returns {JSON} - JSON Object.
   * @memberof Receipt
   */
  public toJSON() {
    return {
      address: this.address,
      app_pubkey: this.appPubKey,
      blockchain: this.blockchain,
      height: Number(this.height.toString()),
      session_block_height: Number(this.sessionBlockHeight.toString()),
      evidence_type: this.evidenceType
    }
  }
  /**
   *
   * Check if the Receipt object is valid
   * @returns {boolean} - True or false.
   * @memberof Receipt
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
      this.evidenceType >= 0 
    )
  }
}
