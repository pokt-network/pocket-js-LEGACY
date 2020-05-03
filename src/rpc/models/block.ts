import { BlockHeader } from "./block-header"
import { Commit } from "./commit"

/**
 *
 *
 * @class Block
 */
export class Block {
  /**
   *
   * Creates a Block object using a JSON string
   * @param {String} json - JSON string.
   * @returns {Block} - Block object.
   * @memberof Block
   */
  public static fromJSON(json: string): Block {
    const jsonObject = JSON.parse(json)

    return new Block(
      BlockHeader.fromJSON(JSON.stringify(jsonObject.header)),
      JSON.stringify(jsonObject.data),
      JSON.stringify(jsonObject.evidence),
      Commit.fromJSON(JSON.stringify(jsonObject.last_commit))
    )
  }

  public readonly header: BlockHeader
  public readonly data: string
  public readonly evidence: string
  public readonly lastCommit: Commit

  /**
   * Block
   * @constructor
   * @param {BlockHeader} header - Block header.
   * @param {string} data - Data hash.
   * @param {string} evidence - Evidence hash.
   * @param {Commit} lastCommit - Last commit.
   */
  constructor(
    header: BlockHeader,
    data: string,
    evidence: string,
    lastCommit: Commit
  ) {
    this.header = header
    this.data = data
    this.evidence = evidence
    this.lastCommit = lastCommit

    if (!this.isValid()) {
      throw new TypeError("Invalid Block properties.")
    }
  }
  /**
   *
   * Creates a JSON object with the Block properties
   * @returns {JSON} - JSON Object.
   * @memberof Block
   */
  public toJSON() {
    return {
      data: this.data,
      evidence: this.evidence,
      header: this.header.toJSON(),
      last_commit: this.lastCommit.toJSON()
    }
  }
  /**
   *
   * Check if the Block object is valid
   * @returns {boolean} - True or false.
   * @memberof Block
   */
  public isValid(): boolean {
    return this.data.length !== 0 &&
      this.evidence.length !== 0 &&
      this.header.isValid() &&
      this.lastCommit.isValid()
  }
}
