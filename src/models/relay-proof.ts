import { PocketAAT } from "pocket-aat-js"
import { Hex } from "../utils"
import { sha3_256 } from "js-sha3"

/**
 *
 *
 * @class Proof
 */
export class RelayProof {
  /**
   *
   * Creates a Proof object using a JSON string
   * @param {string} json - JSON string.
   * @returns {RelayProof} - Proof object.
   * @memberof Proof
   */
  public static fromJSON(json: string): RelayProof {
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

        return new RelayProof(
          jsonObject.entropy,
          jsonObject.session_block_height,
          jsonObject.servicer_pub_key,
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

  public static bytes(
    entropy: BigInt,
    sessionBlockHeight: BigInt,
    servicePubKey: string,
    blockchain: string,
    token: PocketAAT
  ): Buffer {
    const proofJSON = {
      entropy: Number(entropy.toString()),
      session_block_height: Number(sessionBlockHeight.toString()),
      servicer_pub_key: servicePubKey,
      blockchain: blockchain,
      signature: "",
      token: RelayProof.hashAAT(token)
    }
    const proofJSONStr = JSON.stringify(proofJSON)
    // Hash proofJSONStr
    const hash = sha3_256.create()
    hash.update(proofJSONStr)
    return Buffer.from(hash.hex(), "hex")
  }

  private static hashAAT(aat: PocketAAT): string {
    const aatObj = {
      version: aat.version,
      app_address: aat.applicationPublicKey,
      client_pub_key: aat.clientPublicKey,
      signature: ""
    }
    // Generate sha3 hash of the aat payload object
    const hash = sha3_256.create()
    hash.update(JSON.stringify(aatObj))
    return hash.hex()
  }

  

  public readonly entropy: BigInt
  public readonly sessionBlockHeight: BigInt
  public readonly servicePubKey: string
  public readonly blockchain: string
  public readonly token: PocketAAT
  public readonly signature: string

  /**
   * Proof.
   * @constructor
   * @param {BigInt} entropy - Index entropy value.
   * @param {BigInt} sessionBlockHeight - Session Block Height.
   * @param {string} servicePubKey - Service Public Key.
   * @param {string} blockchain - Blockchain hash.
   * @param {PocketAAT} token - Application Authentication Token object.
   * @param {string} signature - Proof's signature.
   */
  constructor(
    entropy: BigInt,
    sessionBlockHeight: BigInt,
    servicePubKey: string,
    blockchain: string,
    token: PocketAAT,
    signature: string
  ) {
    this.entropy = entropy
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
      entropy: Number(this.entropy.toString()),
      session_block_height: Number(this.sessionBlockHeight.toString()),
      servicer_pub_key: this.servicePubKey,
      blockchain: this.blockchain,
      aat: {
        version: this.token.version,
        app_address: this.token.applicationPublicKey,
        client_pub_key: this.token.clientPublicKey,
        signature: this.token.applicationSignature
      },
      signature: this.signature
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
      Hex.isHex(this.servicePubKey) &&
      Number(this.sessionBlockHeight) > 0 &&
      this.token.isValid()
  }
}
