"use strict";
exports.__esModule = true;
var hex_1 = require("../../utils/hex");
/**
 *
 *
 * @class PartSetHeader
 */
var PartSetHeader = /** @class */ (function () {
    /**
     * PartSetHeader.
     * @constructor
     * @param {BigInt} total - Total count.
     * @param {string} hash - Part hash.
     */
    function PartSetHeader(total, hash) {
        this.total = total;
        this.hash = hash;
        if (!this.isValid()) {
            throw new TypeError("Invalid PartSetHeader properties.");
        }
    }
    /**
     *
     * Creates a PartSetHeader object using a JSON string
     * @param {String} json - JSON string.
     * @returns {PartSetHeader} - PartSetHeader object.
     * @memberof PartSetHeader
     */
    PartSetHeader.fromJSON = function (json) {
        try {
            var jsonObject = JSON.parse(json);
            return new PartSetHeader(BigInt(jsonObject.total), jsonObject.hash);
        }
        catch (error) {
            throw error;
        }
    };
    /**
     *
     * Creates a JSON object with the PartSetHeader properties
     * @returns {JSON} - JSON Object.
     * @memberof PartSetHeader
     */
    PartSetHeader.prototype.toJSON = function () {
        return {
            hash: this.hash,
            total: Number(this.total.toString())
        };
    };
    /**
     *
     * Check if the PartSetHeader object is valid
     * @returns {boolean} - True or false.
     * @memberof PartSetHeader
     */
    PartSetHeader.prototype.isValid = function () {
        return hex_1.Hex.isHex(this.hash) && Number(this.total.toString()) >= 0;
    };
    return PartSetHeader;
}());
exports.PartSetHeader = PartSetHeader;
