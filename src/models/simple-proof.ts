import { Hex } from "../utils/hex"
/**
 *
 *
 * @class SimpleProof
 */
export class SimpleProof {
  /**
   *
   * Creates a SimpleProof object using a JSON string
   * @param {string} json - JSON string.
   * @returns {SimpleProof} - SimpleProof object.
   * @memberof SimpleProof
   */
  public static fromJSON(json: string): SimpleProof {
    const jsonObject = JSON.parse(json)

    return new SimpleProof(
      jsonObject.total,
      jsonObject.index,
      jsonObject.leaf_hash,
      jsonObject.aunts
    )
  }

  public readonly total: BigInt
  public readonly index: BigInt
  public readonly leafHash: Hex
  public readonly aunts: Hex[]

  /**
   * SimpleProof.
   * @constructor
   * @param {BigInt} total - Total number of items.
   * @param {BigInt} index - Index of item to prove.
   * @param {Hex} leafHash - Hash of item value.
   * @param {Hex[]} aunts - Hashes from leaf's sibling to a root's child.
   */
  constructor(total: BigInt, index: BigInt, leafHash: Hex, aunts: Hex[]) {
    this.total = total
    this.index = index
    this.leafHash = leafHash
    this.aunts = aunts

    if (!this.isValid()) {
      throw new TypeError("Invalid properties length.")
    }
  }
  /**
   *
   * Creates a JSON object with the SimpleProof properties
   * @returns {JSON} - JSON Object.
   * @memberof SimpleProof
   */
  public toJSON() {
    return {
      aunts: this.aunts,
      index: this.index,
      leaf_hash: this.leafHash,
      total: this.total
    }
  }
  /**
   *
   * Check if the SimpleProof object is valid
   * @returns {boolean} - True or false.
   * @memberof SimpleProof
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
