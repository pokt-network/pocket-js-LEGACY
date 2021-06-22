/* eslint-disable @typescript-eslint/naming-convention */
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
   *
   * @param {String} json - JSON string.
   * @returns {Commit} - Commit object.
   * @memberof Commit
   */
  public static fromJSON(json: string): Commit {
    try {
      const jsonObject = JSON.parse(json)
      const signatureList: CommitSignature[] = []
      const blockID = BlockID.fromJSON(JSON.stringify(jsonObject.block_id))
      
      if (jsonObject.precommits) {
        jsonObject.precommits.forEach((commit: any) => {
          if (commit !== null) {
            const commitSignature = new CommitSignature(
              commit.type,
              BigInt(commit.height),
              commit.round,
              BlockID.fromJSON(JSON.stringify(commit.block_id)),
              commit.timestamp,
              commit.validator_address,
              commit.validator_index,
              commit.signature
            )
            signatureList.push(commitSignature)
          }
        })
      }
        return new Commit(blockID, signatureList) 
    } catch (error) {
      throw error
    }
  }

  public readonly blockID: BlockID
  public readonly precommits: CommitSignature[]

  /**
   * Commit.
   *
   * @constructor
   * @param {BlockID} blockID - Commit blockID.
   * @param {CommitSignature} precommits - Commits signature.
   */
  constructor(blockID: BlockID, precommits: CommitSignature[]) {
    this.blockID = blockID
    this.precommits = precommits

    if (!this.isValid()) {
      throw new TypeError("Invalid Commit properties.")
    }
  }
  /**
   *
   * Creates a JSON object with the Commit properties
   *
   * @returns {JSON} - JSON Object.
   * @memberof Commit
   */
  public toJSON(): any {
    const signatureList: object[] = []

    if (this.precommits.length > 0) {
      this.precommits.forEach(signature => {
        signatureList.push(signature.toJSON())
      })
    }

    return {
      block_id: this.blockID.toJSON(),
      precommits: signatureList
    }
  }
  /**
   *
   * Check if the Commit object is valid
   *
   * @returns {boolean} - True or false.
   * @memberof Commit
   */
  public isValid(): boolean {
    return this.blockID.isValid()
  }
}
