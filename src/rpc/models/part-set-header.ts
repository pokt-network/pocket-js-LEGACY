import { Hex } from "../../utils/hex"

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
    try {
      const jsonObject = JSON.parse(json)

      return new PartSetHeader(BigInt(jsonObject.total), jsonObject.hash)
    } catch (error) {
      throw error
    }
  }

  public readonly total: BigInt
  public readonly hash: string

  /**
   * PartSetHeader.
   * @constructor
   * @param {BigInt} total - Total count.
   * @param {string} hash - Part hash.
   */
  constructor(total: BigInt, hash: string) {
    this.total = total
    this.hash = hash

    if (!this.isValid()) {
      throw new TypeError("Invalid PartSetHeader properties.")
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
      total: Number(this.total.toString())
    }
  }
  /**
   *
   * Check if the PartSetHeader object is valid
   * @returns {boolean} - True or false.
   * @memberof PartSetHeader
   */
  public isValid(): boolean {
    return Hex.isHex(this.hash) && Number(this.total.toString()) >= 0
  }
}
