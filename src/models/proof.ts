import { PocketAAT } from "pocket-aat-js"
import { Hex } from "../utils"

/**
 *
 *
 * @class Proof
 */
export class Proof {
  /**
   *
   * Creates a Proof object using a JSON string
   * @param {string} json - JSON string.
   * @returns {Proof} - Proof object.
   * @memberof Proof
   */
  public static fromJSON(json: string): Proof {
    try {
      const jsonObject = JSON.parse(json)

      let pocketAAT: PocketAAT

      if (jsonObject.token !== undefined) {
        pocketAAT = new PocketAAT(
          jsonObject.token.version,
          jsonObject.token.clientPublicKey,
          jsonObject.token.applicationPublicKey,
          jsonObject.token.applicationSignature
        )

        return new Proof(
          jsonObject.index,
          jsonObject.session_block_height,
          jsonObject.service_pub_key,
          jsonObject.blockchain,
          pocketAAT,
          jsonObject.signature
        )
      } else {
        throw new Error("Failed to retrieve PocketAAT, property is undefined")
      }
    } catch (error) {
      throw new Error("Failed to retrieve PocketAAT for Proof with error: " + error)
    }
  }

  public readonly index: BigInt
  public readonly sessionBlockHeight: BigInt
  public readonly servicePubKey: string
  public readonly blockchain: string
  public readonly token: PocketAAT
  public readonly signature: string

  /**
   * Proof.
   * @constructor
   * @param {BigInt} index - Index value.
   * @param {BigInt} sessionBlockHeight - Session Block Height.
   * @param {string} servicePubKey - Service Public Key.
   * @param {string} blockchain - Blockchain hash.
   * @param {PocketAAT} token - Application Authentication Token object.
   * @param {string} signature - Proof's signature.
   */
  constructor(
    index: BigInt,
    sessionBlockHeight: BigInt,
    servicePubKey: string,
    blockchain: string,
    token: PocketAAT,
    signature: string = ""
  ) {
    this.index = index
    this.sessionBlockHeight = sessionBlockHeight
    this.servicePubKey = servicePubKey
    this.blockchain = blockchain
    this.token = token
    this.signature = signature

    if (!this.isValid()) {
      throw new TypeError("Invalid Proof properties.")
    }
  }
  /**
   *
   * Creates a JSON object with the Proof properties
   * @returns {JSON} - JSON Object.
   * @memberof Proof
   */
  public toJSON() {
    return {
      blockchain: this.blockchain,
      index: this.index.toString(16),
      service_pub_key: this.servicePubKey,
      session_block_height: this.sessionBlockHeight.toString(16),
      signature: this.signature,
      token: JSON.parse(JSON.stringify(this.token))
    }
  }
  /**
   *
   * Check if the Proof object is valid
   * @returns {boolean} - True or false.
   * @memberof Proof
   */
  public isValid(): boolean {
    return this.blockchain.length !== 0 &&
      this.index !== undefined &&
      Hex.isHex(this.servicePubKey) &&
      this.sessionBlockHeight !== undefined &&
      this.token.isValid()
  }
}
