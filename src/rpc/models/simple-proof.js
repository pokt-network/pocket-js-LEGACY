"use strict";
exports.__esModule = true;
/**
 *
 *
 * @class SimpleProof
 */
var SimpleProof = /** @class */ (function () {
    /**
     * SimpleProof.
     * @constructor
     * @param {BigInt} total - Total number of items.
     * @param {BigInt} index - Index of item to prove.
     * @param {Hex} leafHash - Hash of item value.
     * @param {Hex[]} aunts - Hashes from leaf's sibling to a root's child.
     */
    function SimpleProof(total, index, leafHash, aunts) {
        this.total = total;
        this.index = index;
        this.leafHash = leafHash;
        this.aunts = aunts;
        if (!this.isValid()) {
            throw new TypeError("Invalid SimpleProof properties.");
        }
    }
    /**
     *
     * Creates a SimpleProof object using a JSON string
     * @param {string} json - JSON string.
     * @returns {SimpleProof} - SimpleProof object.
     * @memberof SimpleProof
     */
    SimpleProof.fromJSON = function (json) {
        var jsonObject = JSON.parse(json);
        return new SimpleProof(jsonObject.total, jsonObject.index, jsonObject.leaf_hash, jsonObject.aunts);
    };
    /**
     *
     * Creates a JSON object with the SimpleProof properties
     * @returns {JSON} - JSON Object.
     * @memberof SimpleProof
     */
    SimpleProof.prototype.toJSON = function () {
        return {
            aunts: this.aunts,
            index: Number(this.index.toString()),
            leaf_hash: this.leafHash,
            total: Number(this.total.toString())
        };
    };
    /**
     *
     * Check if the SimpleProof object is valid
     * @returns {boolean} - True or false.
     * @memberof SimpleProof
     */
    SimpleProof.prototype.isValid = function () {
        return true;
    };
    return SimpleProof;
}());
exports.SimpleProof = SimpleProof;
