"use strict";
exports.__esModule = true;
/**
 *
 *
 * @class Consensus
 */
var Consensus = /** @class */ (function () {
    /**
     * Consensus.
     * @constructor
     * @param {BigInt} block - Consensus hash.
     * @param {BigInt} app - Session Consensus Height.
     */
    function Consensus(block, app) {
        this.block = block;
        this.app = app;
        if (!this.isValid()) {
            throw new TypeError("Invalid Consensus properties .");
        }
    }
    /**
     *
     * Creates a Consensus object using a JSON string
     * @param {String} json - JSON string.
     * @returns {Consensus} - Consensus object.
     * @memberof Consensus
     */
    Consensus.fromJSON = function (json) {
        var jsonObject = JSON.parse(json);
        return new Consensus(jsonObject.block, jsonObject.app);
    };
    /**
     *
     * Creates a JSON object with the Consensus properties
     * @returns {JSON} - JSON Object.
     * @memberof Consensus
     */
    Consensus.prototype.toJSON = function () {
        return {
            app: this.app.toString(16),
            block: this.block.toString(16)
        };
    };
    /**
     *
     * Check if the Consensus object is valid
     * @returns {boolean} - True or false.
     * @memberof Consensus
     */
    Consensus.prototype.isValid = function () {
        return this.block !== undefined && this.app !== undefined;
    };
    return Consensus;
}());
exports.Consensus = Consensus;
