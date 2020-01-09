import { Hex } from "../utils/Hex";
import { BlockID } from "./block_id";

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
        const jsonObject = JSON.parse(json);
        
        return new CommitSignature(
            jsonObject.type,
            jsonObject.height,
            jsonObject.round,
            BlockID.fromJSON(jsonObject.block_id),
            jsonObject.timestamp,
            jsonObject.validator_address,
            jsonObject.validator_index,
            jsonObject.signature
        );
    }

    public readonly type: Hex;
    public readonly height: BigInt;
    public readonly round: number;
    public readonly blockID: BlockID;
    public readonly timeStamp: string;
    public readonly validatorAddress: Hex;
    public readonly validatorIndex: number;
    public readonly signature: Hex;

    /**
     * CommitSignature.
     * @constructor
     * @param {Hex} hash - CommitSignature hash.
     * @param {PartSetHeader} parts - Session CommitSignature Height.
     */
    constructor(
        type: Hex,
        height: BigInt,
        round: number,
        blockID: BlockID,
        timeStamp: string,
        validatorAddress: Hex,
        validatorIndex: number,
        signature: Hex
    ) {
       this.type = type;
       this.height = height;
       this.round = round;
       this.blockID = blockID;
       this.timeStamp = timeStamp;
       this.validatorAddress = validatorAddress;
       this.validatorIndex = validatorIndex;
       this.signature = signature;

        if (!this.isValid()) {
            throw new TypeError("Invalid properties length.");
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
            "type": this.type,
            "height": this.height,
            "round": this.round,
            "block_id": this.blockID,
            "time_stamp": this.timeStamp,
            "validator_address": this.validatorAddress,
            "validator_index": this.validatorIndex,
            "signature": this.signature
        }
    }
    /**
   *
   * Check if the CommitSignature object is valid
   * @returns {boolean} - True or false.
   * @memberof CommitSignature
   */
    public isValid(): boolean {
        for (let key in this) {
            if (!this.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }
}