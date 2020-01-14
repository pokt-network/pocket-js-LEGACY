import { Hex } from "../utils/hex"

/**
 *
 *
 * @class PartSetHeader
 */
export class PartSetHeader {
  /**
   *
   * Creates a PartSetHeader object using a JSON string
   * @param {String} json - JSON string.
   * @returns {PartSetHeader} - PartSetHeader object.
   * @memberof PartSetHeader
   */
  public static fromJSON(json: string): PartSetHeader {
    const jsonObject = JSON.parse(json)

    return new PartSetHeader(jsonObject.total, jsonObject.hash)
  }

  public readonly total: BigInt
  public readonly hash: Hex

  /**
   * PartSetHeader.
   * @constructor
   * @param {BigInt} total - Total count.
   * @param {Hex} hash - Part hash.
   */
  constructor(total: BigInt, hash: Hex) {
    this.total = total
    this.hash = hash

    if (!this.isValid()) {
      throw new TypeError("Invalid properties length.")
    }
  }
  /**
   *
   * Creates a JSON object with the PartSetHeader properties
   * @returns {JSON} - JSON Object.
   * @memberof PartSetHeader
   */
  public toJSON() {
    return {
      hash: this.hash,
      total: this.total
    }
  }
  /**
   *
   * Check if the PartSetHeader object is valid
   * @returns {boolean} - True or false.
   * @memberof PartSetHeader
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
