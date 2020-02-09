import { Hex } from "../../../utils"

/**
 *
 *
 * @class NodeProof
 */
export class NodeProof {
  /**
   *
   * Creates a NodeProof object using a JSON string
   * @param {String} json - JSON string.
   * @returns {NodeProof} - NodeProof object.
   * @memberof NodeProof
   */
  public static fromJSON(json: string): NodeProof {
    try {
      const jsonObject = JSON.parse(json)

      return new NodeProof(
        jsonObject.address,
        jsonObject.blockchain,
        jsonObject.app_pubkey,
        BigInt(jsonObject.session_block_height),
        BigInt(jsonObject.height)
      )
    } catch (error) {
      throw error
    }
  }

  public readonly address: string
  public readonly blockchain: string
  public readonly appPubKey: string
  public readonly SBlockHeight: BigInt
  public readonly height: BigInt

  /**
   * Node Proof.
   * @constructor
   * @param {string} address - Node address.
   * @param {string} blockchain - Blockchain hash.
   * @param {string} appPubKey - Application Key associated with a client.
   * @param {BigInt} SBlockHeight - Session Block Height.
   * @param {BigInt} height - Height of session.
   */
  constructor(
    address: string,
    blockchain: string,
    appPubKey: string,
    SBlockHeight: BigInt,
    height: BigInt
  ) {
    this.address = address
    this.blockchain = blockchain
    this.appPubKey = appPubKey
    this.SBlockHeight = SBlockHeight
    this.height = height

    if (!this.isValid()) {
      throw new TypeError("Invalid NodeProof properties.")
    }
  }
  /**
   *
   * Creates a JSON object with the NodeProof properties
   * @returns {JSON} - JSON Object.
   * @memberof NodeProof
   */
  public toJSON() {
    return {
      address: this.address,
      app_pubkey: this.appPubKey,
      blockchain: this.blockchain,
      height: Number(this.height.toString()),
      session_block_height: Number(this.SBlockHeight.toString())
    }
  }
  /**
   *
   * Check if the NodeProof object is valid
   * @returns {boolean} - True or false.
   * @memberof NodeProof
   */
  public isValid(): boolean {
    return (
      Hex.isHex(this.address) && 
      Hex.byteLength(this.address) === 20 &&
      this.blockchain.length !== 0 &&
      Hex.isHex(this.appPubKey) &&
      Hex.byteLength(this.appPubKey) === 32 &&
      this.SBlockHeight !== undefined &&
      this.height !== undefined 
    )
  }
}
