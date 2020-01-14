import { Hex } from "../utils/hex"
import { SimpleProof } from "./simple-proof"

/**
 *
 *
 * @class TxProof
 */
export class TxProof {
  /**
   *
   * Creates a TxProof object using a JSON string
   * @param {string} json - JSON string.
   * @returns {TxProof} - TxProof object.
   * @memberof TxProof
   */
  public static fromJSON(json: string): TxProof {
    const jsonObject = JSON.parse(json)

    return new TxProof(jsonObject.root_hash, jsonObject.data, jsonObject.proof)
  }

  public readonly rootHash: Hex
  public readonly data: Hex
  public readonly proof: SimpleProof

  /**
   * TxProof.
   * @constructor
   * @param {Hex} rootHash - Root hash.
   * @param {Hex} data - Hash holding the current tx proof data.
   * @param {SimpleProof} proof - Simple proof object.
   */
  constructor(rootHash: Hex, data: Hex, proof: SimpleProof) {
    this.rootHash = rootHash
    this.data = data
    this.proof = proof

    if (!this.isValid()) {
      throw new TypeError("Invalid properties length.")
    }
  }
  /**
   *
   * Creates a JSON object with the TxProof properties
   * @returns {JSON} - JSON Object.
   * @memberof TxProof
   */
  public toJSON() {
    return {
      data: this.data,
      proof: this.proof.toJSON(),
      root_hash: this.rootHash
    }
  }
  /**
   *
   * Check if the TxProof object is valid
   * @returns {boolean} - True or false.
   * @memberof TxProof
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
