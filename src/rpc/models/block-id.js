"use strict";
exports.__esModule = true;
var part_set_header_1 = require("./part-set-header");
var hex_1 = require("../../utils/hex");
/**
 *
 *
 * @class BlockID
 */
var BlockID = /** @class */ (function () {
    /**
     * BlockID.
     * @constructor
     * @param {string} hash - BlockID hash.
     * @param {PartSetHeader} parts - Session BlockID Height.
     */
    function BlockID(hash, parts) {
        this.hash = hash;
        this.parts = parts;
        if (!this.isValid()) {
            throw new TypeError("Invalid BlockID properties.");
        }
    }
    /**
     *
     * Creates a BlockID object using a JSON string
     * @param {string} json - JSON string.
     * @returns {BlockID} - BlockID object.
     * @memberof BlockID
     */
    BlockID.fromJSON = function (json) {
        try {
            var jsonObject = JSON.parse(json);
            var parts = part_set_header_1.PartSetHeader.fromJSON(JSON.stringify(jsonObject.parts));
            return new BlockID(jsonObject.hash, parts);
        }
        catch (error) {
            throw error;
        }
    };
    /**
     *
     * Creates a JSON object with the BlockID properties
     * @returns {JSON} - JSON Object.
     * @memberof BlockID
     */
    BlockID.prototype.toJSON = function () {
        return {
            hash: this.hash,
            parts: this.parts.toJSON()
        };
    };
    /**
     *
     * Check if the BlockID object is valid
     * @returns {boolean} - True or false.
     * @memberof BlockID
     */
    BlockID.prototype.isValid = function () {
        return hex_1.Hex.isHex(this.hash) && this.parts.isValid();
    };
    return BlockID;
}());
exports.BlockID = BlockID;
