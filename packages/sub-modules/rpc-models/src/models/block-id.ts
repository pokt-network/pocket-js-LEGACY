import { PartSetHeader } from "./part-set-header"
import { Hex } from "@pokt-network/pocket-js-utils"

/**
 *
 *
 * @class BlockID
 */
export class BlockID {
  /**
   *
   * Creates a BlockID object using a JSON string
   *
   * @param {string} json - JSON string.
   * @returns {BlockID} - BlockID object.
   * @memberof BlockID
   */
  public static fromJSON(json: string): BlockID {
    try {
      const jsonObject = JSON.parse(json)
      const parts = PartSetHeader.fromJSON(JSON.stringify(jsonObject.parts))
  
      return new BlockID(jsonObject.hash, parts)
    } catch (error) {
      throw error
    }
  }

  public readonly hash: string
  public readonly parts: PartSetHeader

  /**
   * BlockID.
   *
   * @constructor
   * @param {string} hash - BlockID hash.
   * @param {PartSetHeader} parts - PartSetHeader object.
   */
  constructor(hash: string, parts: PartSetHeader) {
    this.hash = hash
    this.parts = parts

    if (!this.isValid()) {
      throw new TypeError("Invalid BlockID properties.")
    }
  }
  /**
   *
   * Creates a JSON object with the BlockID properties
   *
   * @returns {any} - JSON Object.
   * @memberof BlockID
   */
  public toJSON(): any {
    return {
      hash: this.hash,
      parts: this.parts.toJSON()
    }
  }
  /**
   *
   * Check if the BlockID object is valid
   *
   * @returns {boolean} - True or false.
   * @memberof BlockID
   */
  public isValid(): boolean {
    let validHash = true

    if (this.hash) {
      validHash = Hex.isHex(this.hash)
    }
    return validHash && this.parts.isValid()
  }
}
