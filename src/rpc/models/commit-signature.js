"use strict";
exports.__esModule = true;
var block_id_1 = require("./block-id");
var hex_1 = require("../../utils/hex");
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
var CommitSignature = /** @class */ (function () {
    /**
     * CommitSignature.
     * @constructor
     * @param {string} hash - CommitSignature hash.
     * @param {PartSetHeader} parts - Session CommitSignature Height.
     */
    function CommitSignature(type, height, round, blockID, timeStamp, validatorAddress, validatorIndex, signature) {
        this.type = type;
        this.height = height;
        this.round = round;
        this.blockID = blockID;
        this.timeStamp = timeStamp;
        this.validatorAddress = validatorAddress;
        this.validatorIndex = validatorIndex;
        this.signature = signature;
        if (!this.isValid()) {
            throw new TypeError("Invalid CommitSignature properties.");
        }
    }
    /**
     *
     * Creates a CommitSignature object using a JSON string
     * @param {String} json - JSON string.
     * @returns {CommitSignature} - CommitSignature object.
     * @memberof CommitSignature
     */
    CommitSignature.fromJSON = function (json) {
        try {
            var jsonObject = JSON.parse(json);
            return new CommitSignature(jsonObject.type, BigInt(jsonObject.height), jsonObject.round, block_id_1.BlockID.fromJSON(JSON.stringify(jsonObject.block_id)), jsonObject.time_stamp, jsonObject.validator_address, jsonObject.validator_index, jsonObject.signature);
        }
        catch (error) {
            throw error;
        }
    };
    /**
     *
     * Creates a JSON object with the CommitSignature properties
     * @returns {JSON} - JSON Object.
     * @memberof CommitSignature
     */
    CommitSignature.prototype.toJSON = function () {
        return {
            block_id: this.blockID.toJSON(),
            height: Number(this.height.toString()),
            round: this.round,
            signature: this.signature,
            timestamp: this.timeStamp,
            type: this.type,
            validator_address: this.validatorAddress,
            validator_index: this.validatorIndex
        };
    };
    /**
     *
     * Check if the CommitSignature object is valid
     * @returns {boolean} - True or false.
     * @memberof CommitSignature
     */
    CommitSignature.prototype.isValid = function () {
        return this.blockID.isValid() &&
            Number(this.height.toString()) > 0 &&
            this.round >= 0 &&
            this.signature.length !== 0 &&
            this.timeStamp.length !== 0 &&
            hex_1.Hex.isHex(this.validatorAddress) &&
            this.validatorIndex !== undefined;
    };
    return CommitSignature;
}());
exports.CommitSignature = CommitSignature;
