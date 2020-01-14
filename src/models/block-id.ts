import { Hex } from "../utils/hex"
import { PartSetHeader } from "./part-set-header"

/**
 *
 *
 * @class BlockID
 */
export class BlockID {
  /**
   *
   * Creates a BlockID object using a JSON string
   * @param {String} json - JSON string.
   * @returns {BlockID} - BlockID object.
   * @memberof BlockID
   */
  public static fromJSON(json: string): BlockID {
    const jsonObject = JSON.parse(json)
    const parts = PartSetHeader.fromJSON(jsonObject.parts)

    return new BlockID(jsonObject.hash, parts)
  }

  public readonly hash: Hex
  public readonly parts: PartSetHeader

  /**
   * BlockID.
   * @constructor
   * @param {Hex} hash - BlockID hash.
   * @param {PartSetHeader} parts - Session BlockID Height.
   */
  constructor(hash: Hex, parts: PartSetHeader) {
    this.hash = hash
    this.parts = parts

    if (!this.isValid()) {
      throw new TypeError("Invalid properties length.")
    }
  }
  /**
   *
   * Creates a JSON object with the BlockID properties
   * @returns {JSON} - JSON Object.
   * @memberof BlockID
   */
  public toJSON() {
    return {
      hash: this.hash,
      parts: this.parts.toJSON()
    }
  }
  /**
   *
   * Check if the BlockID object is valid
   * @returns {boolean} - True or false.
   * @memberof BlockID
   */
  public isValid(): boolean {
    for (const key in this) {
      if (!this.hasOwnProperty(key)) {
        return false
      }
    }
    return true
  }
}
