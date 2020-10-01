"use strict";
exports.__esModule = true;
/**
 *
 *
 * @class QueryHeightResponse
 */
var QueryHeightResponse = /** @class */ (function () {
    /**
     * Query Height Response.
     * @constructor
     * @param {Bigint} height - Current network block height.
     */
    function QueryHeightResponse(height) {
        this.height = height;
        if (!this.isValid()) {
            throw new TypeError("Invalid properties length.");
        }
    }
    /**
     *
     * Creates a QueryHeightResponse object using a JSON string
     * @param {String} json - JSON string.
     * @returns {QueryHeightResponse} - QueryHeightResponse object.
     * @memberof QueryHeightResponse
     */
    QueryHeightResponse.fromJSON = function (json) {
        try {
            var jsonObject = JSON.parse(json);
            return new QueryHeightResponse(BigInt(jsonObject));
        }
        catch (error) {
            throw error;
        }
    };
    /**
     *
     * Creates a JSON object with the QueryHeightResponse properties
     * @returns {JSON} - JSON Object.
     * @memberof QueryHeightResponse
     */
    QueryHeightResponse.prototype.toJSON = function () {
        return { height: Number(this.height.toString()) };
    };
    /**
     *
     * Check if the QueryHeightResponse object is valid
     * @returns {boolean} - True or false.
     * @memberof QueryHeightResponse
     */
    QueryHeightResponse.prototype.isValid = function () {
        return this.height !== undefined;
    };
    return QueryHeightResponse;
}());
exports.QueryHeightResponse = QueryHeightResponse;
