import { Hex } from "../../utils/hex"
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
    try {
      const jsonObject = JSON.parse(json)

      return new TxProof(
        jsonObject.root_hash,
        jsonObject.data, 
        SimpleProof.fromJSON(JSON.stringify(jsonObject.proof))
      )
    } catch (error) {
      throw error
    }
  }

  public readonly rootHash: string
  public readonly data: string | null
  public readonly proof: SimpleProof

  /**
   * TxProof.
   * @constructor
   * @param {string} rootHash - Root hash.
   * @param {string | null} data - Hash holding the current tx proof data.
   * @param {SimpleProof} proof - Simple proof object.
   */
  constructor(rootHash: string, data: string | null, proof: SimpleProof) {
    this.rootHash = rootHash
    this.data = data
    this.proof = proof

    if (!this.isValid()) {
      throw new TypeError("Invalid TxProof properties.")
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
    return true
  }
}
