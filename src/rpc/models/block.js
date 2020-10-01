"use strict";
exports.__esModule = true;
var block_header_1 = require("./block-header");
var commit_1 = require("./commit");
/**
 *
 *
 * @class Block
 */
var Block = /** @class */ (function () {
    /**
     * Block
     * @constructor
     * @param {BlockHeader} header - Block header.
     * @param {string} data - Data hash.
     * @param {string} evidence - Evidence hash.
     * @param {Commit} lastCommit - Last commit.
     */
    function Block(header, data, evidence, lastCommit) {
        this.header = header;
        this.data = data;
        this.evidence = evidence;
        this.lastCommit = lastCommit;
        if (!this.isValid()) {
            throw new TypeError("Invalid Block properties.");
        }
    }
    /**
     *
     * Creates a Block object using a JSON string
     * @param {String} json - JSON string.
     * @returns {Block} - Block object.
     * @memberof Block
     */
    Block.fromJSON = function (json) {
        var jsonObject = JSON.parse(json);
        return new Block(block_header_1.BlockHeader.fromJSON(JSON.stringify(jsonObject.header)), JSON.stringify(jsonObject.data), JSON.stringify(jsonObject.evidence), commit_1.Commit.fromJSON(JSON.stringify(jsonObject.last_commit)));
    };
    /**
     *
     * Creates a JSON object with the Block properties
     * @returns {JSON} - JSON Object.
     * @memberof Block
     */
    Block.prototype.toJSON = function () {
        return {
            data: this.data,
            evidence: this.evidence,
            header: this.header.toJSON(),
            last_commit: this.lastCommit.toJSON()
        };
    };
    /**
     *
     * Check if the Block object is valid
     * @returns {boolean} - True or false.
     * @memberof Block
     */
    Block.prototype.isValid = function () {
        return this.data.length !== 0 &&
            this.evidence.length !== 0 &&
            this.header.isValid() &&
            this.lastCommit.isValid();
    };
    return Block;
}());
exports.Block = Block;
