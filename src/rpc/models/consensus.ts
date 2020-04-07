/**
 *
 *
 * @class Consensus
 */
export class Consensus {
  /**
   *
   * Creates a Consensus object using a JSON string
   * @param {String} json - JSON string.
   * @returns {Consensus} - Consensus object.
   * @memberof Consensus
   */
  public static fromJSON(json: string): Consensus {
    const jsonObject = JSON.parse(json)

    return new Consensus(
      jsonObject.block,
      jsonObject.app
    )
  }

  public readonly block: BigInt
  public readonly app: BigInt

  /**
   * Consensus.
   * @constructor
   * @param {BigInt} block - Block height.
   * @param {BigInt} app - App count.
   */
  constructor(block: BigInt, app: BigInt) {
    this.block = block
    this.app = app

    if (!this.isValid()) {
      throw new TypeError("Invalid Consensus properties .")
    }
  }
  /**
   *
   * Creates a JSON object with the Consensus properties
   * @returns {JSON} - JSON Object.
   * @memberof Consensus
   */
  public toJSON() {
    return {
      app: this.app.toString(16),
      block: this.block.toString(16)
    }
  }
  /**
   *
   * Check if the Consensus object is valid
   * @returns {boolean} - True or false.
   * @memberof Consensus
   */
  public isValid(): boolean {
    return this.block !== undefined && this.app !== undefined
  }
}
