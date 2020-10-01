"use strict";
exports.__esModule = true;
var block_id_1 = require("./block-id");
var commit_signature_1 = require("./commit-signature");
/**
 *
 *
 * @class Commit
 */
var Commit = /** @class */ (function () {
    /**
     * Commit.
     * @constructor
     * @param {BlockID} blockID - Commit blockID.
     * @param {CommitSignature} precommits - Commits signature.
     */
    function Commit(blockID, precommits) {
        this.blockID = blockID;
        this.precommits = precommits;
        if (!this.isValid()) {
            throw new TypeError("Invalid Commit properties.");
        }
    }
    /**
     *
     * Creates a Commit object using a JSON string
     * @param {String} json - JSON string.
     * @returns {Commit} - Commit object.
     * @memberof Commit
     */
    Commit.fromJSON = function (json) {
        try {
            var jsonObject = JSON.parse(json);
            var signatureList_1 = [];
            if (Array.isArray(jsonObject.precommits)) {
                jsonObject.precommits.forEach(function (commit) {
                    if (commit !== null) {
                        var commitSignature = new commit_signature_1.CommitSignature(commit.type, BigInt(commit.height), commit.round, block_id_1.BlockID.fromJSON(JSON.stringify(commit.block_id)), commit.timestamp, commit.validator_address, commit.validator_index, commit.signature);
                        signatureList_1.push(commitSignature);
                    }
                });
                return new Commit(block_id_1.BlockID.fromJSON(JSON.stringify(jsonObject.block_id)), signatureList_1);
            }
            else {
                return new Commit(block_id_1.BlockID.fromJSON(JSON.stringify(jsonObject.block_id)), [commit_signature_1.CommitSignature.fromJSON(JSON.stringify(jsonObject.precommits))]);
            }
        }
        catch (error) {
            throw error;
        }
    };
    /**
     *
     * Creates a JSON object with the Commit properties
     * @returns {JSON} - JSON Object.
     * @memberof Commit
     */
    Commit.prototype.toJSON = function () {
        var signatureList = [];
        this.precommits.forEach(function (signature) {
            signatureList.push(signature.toJSON());
        });
        return {
            block_id: this.blockID.toJSON(),
            precommits: signatureList
        };
    };
    /**
     *
     * Check if the Commit object is valid
     * @returns {boolean} - True or false.
     * @memberof Commit
     */
    Commit.prototype.isValid = function () {
        return this.blockID.isValid();
    };
    return Commit;
}());
exports.Commit = Commit;
