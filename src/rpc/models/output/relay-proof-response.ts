import { PocketAAT } from "@pokt-network/aat-js"
import { Hex } from "../../../utils/hex"

/**
 *
 *
 * @class Proof
 */
export class RelayProofResponse {
  /**
   *
   * Creates a Proof object using a JSON string
   * @param {string} json - JSON string.
   * @returns {RelayProofResponse} - Proof object.
   * @memberof Proof
   */
  public static fromJSON(json: string): RelayProofResponse {
    try {
      const jsonObject = JSON.parse(json)

      let pocketAAT: PocketAAT

      if (jsonObject.aat !== undefined) {
        pocketAAT = new PocketAAT(
          jsonObject.aat.version,
          jsonObject.aat.client_pub_key,
          jsonObject.aat.app_pub_key,
          jsonObject.aat.signature
        )

        return new RelayProofResponse(
            jsonObject.entropy,
            jsonObject.session_block_height,
            jsonObject.servicer_pub_key,
            jsonObject.blockchain,
            pocketAAT,
            jsonObject.signature,
            jsonObject.request_hash
        )
      } else {
        throw new Error("Failed to retrieve PocketAAT, property is undefined")
      }
    } catch (error) {
      throw new Error("Failed to retrieve PocketAAT for Proof with error: " + error)
    }
  }

  
  public readonly entropy: BigInt
  public readonly sessionBlockHeight: BigInt
  public readonly servicerPubKey: string
  public readonly blockchain: string
  public readonly token: PocketAAT
  public readonly signature: string
  public readonly requestHash: string

  /**
   * Proof.
   * @constructor
   * @param {BigInt} entropy - Index entropy value.
   * @param {BigInt} sessionBlockHeight - Session Block Height.
   * @param {string} servicerPubKey - Service PublicKey.
   * @param {string} blockchain - Blockchain hash.
   * @param {PocketAAT} token - Application Authentication Token object.
   * @param {string} signature - Proof's signature.
   * @param {string} requestHash - RequestHash string.
   */
  constructor(
      entropy: BigInt,
      sessionBlockHeight: BigInt,
      servicerPubKey: string,
      blockchain: string,
      token: PocketAAT,
      signature: string,
      requestHash: string
  ) {
    this.entropy = entropy
    this.sessionBlockHeight = sessionBlockHeight
    this.servicerPubKey = servicerPubKey
    this.blockchain = blockchain
    this.token = token
    this.signature = signature
    this.requestHash = requestHash

    if (!this.isValid()) {
      throw new TypeError("Invalid Relay Proof response properties.")
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
      entropy: Number(this.entropy.toString()),
      session_block_height: Number(this.sessionBlockHeight.toString()),
      servicer_pub_key: this.servicerPubKey,
      blockchain: this.blockchain,
      aat: {
        version: this.token.version,
        app_pub_key: this.token.applicationPublicKey,
        client_pub_key: this.token.clientPublicKey,
        signature: this.token.applicationSignature
      },
      signature: this.signature,
      request_hash: this.requestHash
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
        Number(this.entropy.toString()) !== undefined &&
        Hex.isHex(this.servicerPubKey) &&
        Number(this.sessionBlockHeight) > 0 &&
        this.token.isValid()
  }
}
