"use strict";
exports.__esModule = true;
var pocket_params_1 = require("../pocket-params");
/**
 *
 *
 * @class QueryPocketParamsResponse
 */
var QueryPocketParamsResponse = /** @class */ (function () {
    /**
     * QueryPocketParamsResponse
     * @constructor
     * @param {PocketParams} applicationParams - Application params.
     */
    function QueryPocketParamsResponse(pocketParams) {
        this.pocketParams = pocketParams;
        if (!this.isValid()) {
            throw new TypeError("Invalid Pocket Params properties.");
        }
    }
    /**
     *
     * Creates a QueryPocketParamsResponse object using a JSON string
     * @param {String} json - JSON string.
     * @returns {QueryPocketParamsResponse} - QueryPocketParamsResponse object.
     * @memberof QueryPocketParamsResponse
     */
    QueryPocketParamsResponse.fromJSON = function (json) {
        try {
            var jsonObject = JSON.parse(json);
            return new QueryPocketParamsResponse(pocket_params_1.PocketParams.fromJSON(JSON.stringify(jsonObject)));
        }
        catch (error) {
            throw error;
        }
    };
    /**
     *
     * Creates a JSON object with the QueryPocketParamsResponse properties
     * @returns {JSON} - JSON Object.
     * @memberof QueryPocketParamsResponse
     */
    QueryPocketParamsResponse.prototype.toJSON = function () {
        return this.pocketParams.toJSON();
    };
    /**
     *
     * Check if the QueryPocketParamsResponse object is valid
     * @returns {boolean} - True or false.
     * @memberof QueryPocketParamsResponse
     */
    QueryPocketParamsResponse.prototype.isValid = function () {
        return this.pocketParams.isValid();
    };
    return QueryPocketParamsResponse;
}());
exports.QueryPocketParamsResponse = QueryPocketParamsResponse;
