import { BlockID } from "./block-id"
import { CommitSignature } from "./commit-signature"

/**
 *
 *
 * @class Commit
 */
export class Commit {
  /**
   *
   * Creates a Commit object using a JSON string
   * @param {String} json - JSON string.
   * @returns {Commit} - Commit object.
   * @memberof Commit
   */
  public static fromJSON(json: string): Commit {
    const jsonObject = JSON.parse(json)

    return new Commit(
      BlockID.fromJSON(jsonObject.block_id),
      CommitSignature.fromJSON(jsonObject.precommits)
    )
  }

  public readonly blockID: BlockID
  public readonly precommits: CommitSignature

  /**
   * Commit.
   * @constructor
   * @param {BlockID} blockID - Commit blockID.
   * @param {CommitSignature} precommits - Commits signature.
   */
  constructor(blockID: BlockID, precommits: CommitSignature) {
    this.blockID = blockID
    this.precommits = precommits

    if (!this.isValid()) {
      throw new TypeError("Invalid properties length.")
    }
  }
  /**
   *
   * Creates a JSON object with the Commit properties
   * @returns {JSON} - JSON Object.
   * @memberof Commit
   */
  public toJSON() {
    return {
      block_id: this.blockID.toJSON(),
      precommits: this.precommits.toJSON()
    }
  }
  /**
   *
   * Check if the Commit object is valid
   * @returns {boolean} - True or false.
   * @memberof Commit
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
