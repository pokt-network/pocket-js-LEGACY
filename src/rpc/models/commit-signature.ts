import { BlockID } from "./block-id"
import { Hex } from "../../utils/hex"

// CommitSig is a vote included in a Commit.
// For now, it is identical to a vote,
// but in the future it will contain fewer fields
// to eliminate the redundancy in commits.
// See https://github.com/tendermint/tendermint/issues/1648.
/**
 *
 *
 * @class CommitSignature
 */
export class CommitSignature {
  /**
   *
   * Creates a CommitSignature object using a JSON string
   * @param {String} json - JSON string.
   * @returns {CommitSignature} - CommitSignature object.
   * @memberof CommitSignature
   */
  public static fromJSON(json: string): CommitSignature {
    try {
      const jsonObject = JSON.parse(json)

      return new CommitSignature(
        jsonObject.type,
        BigInt(jsonObject.height),
        jsonObject.round,
        BlockID.fromJSON(JSON.stringify(jsonObject.block_id)),
        jsonObject.time_stamp,
        jsonObject.validator_address,
        jsonObject.validator_index,
        jsonObject.signature
      )
    } catch (error) {
      throw error
    }
  }

  public readonly type: string
  public readonly height: BigInt
  public readonly round: number
  public readonly blockID: BlockID
  public readonly timeStamp: string
  public readonly validatorAddress: string
  public readonly validatorIndex: number
  public readonly signature: string

  /**
   * CommitSignature.
   * @constructor
   * @param {string} hash - CommitSignature hash.
   * @param {PartSetHeader} parts - Session CommitSignature Height.
   */
  constructor(
    type: string,
    height: BigInt,
    round: number,
    blockID: BlockID,
    timeStamp: string,
    validatorAddress: string,
    validatorIndex: number,
    signature: string
  ) {
    this.type = type
    this.height = height
    this.round = round
    this.blockID = blockID
    this.timeStamp = timeStamp
    this.validatorAddress = validatorAddress
    this.validatorIndex = validatorIndex
    this.signature = signature

    if (!this.isValid()) {
      throw new TypeError("Invalid CommitSignature properties.")
    }
  }
  /**
   *
   * Creates a JSON object with the CommitSignature properties
   * @returns {JSON} - JSON Object.
   * @memberof CommitSignature
   */
  public toJSON() {
    return {
      block_id: this.blockID.toJSON(),
      height: Number(this.height.toString()),
      round: this.round,
      signature: this.signature,
      timestamp: this.timeStamp,
      type: this.type,
      validator_address: this.validatorAddress,
      validator_index: this.validatorIndex
    }
  }
  /**
   *
   * Check if the CommitSignature object is valid
   * @returns {boolean} - True or false.
   * @memberof CommitSignature
   */
  public isValid(): boolean {
    return this.blockID.isValid() &&
    Number(this.height.toString()) > 0 &&
    this.round >= 0 &&
    this.signature.length !== 0 &&
    this.timeStamp.length !== 0 &&
    Hex.isHex(this.validatorAddress) &&
    this.validatorIndex !== undefined
  }
}
