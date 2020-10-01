"use strict";
exports.__esModule = true;
var node_params_1 = require("../node-params");
/**
 *
 *
 * @class QueryNodeParamsResponse
 */
var QueryNodeParamsResponse = /** @class */ (function () {
    /**
     * QueryNodeParamsResponse
     * @constructor
     * @param {NodeParams} nodeParams - Node params.
     */
    function QueryNodeParamsResponse(nodeParams) {
        this.nodeParams = nodeParams;
        if (!this.isValid()) {
            throw new TypeError("Invalid QueryNodeParamsResponse properties.");
        }
    }
    /**
     *
     * Creates a QueryNodeParamsResponse object using a JSON string
     * @param {String} json - JSON string.
     * @returns {QueryNodeParamsResponse} - QueryNodeParamsResponse object.
     * @memberof QueryNodeParamsResponse
     */
    QueryNodeParamsResponse.fromJSON = function (json) {
        try {
            return new QueryNodeParamsResponse(node_params_1.NodeParams.fromJSON(json));
        }
        catch (error) {
            throw error;
        }
    };
    /**
     *
     * Creates a JSON object with the QueryNodeParamsResponse properties
     * @returns {JSON} - JSON Object.
     * @memberof QueryNodeParamsResponse
     */
    QueryNodeParamsResponse.prototype.toJSON = function () {
        return this.nodeParams.toJSON();
    };
    /**
     *
     * Check if the QueryNodeParamsResponse object is valid
     * @returns {boolean} - True or false.
     * @memberof QueryNodeParamsResponse
     */
    QueryNodeParamsResponse.prototype.isValid = function () {
        return this.nodeParams.isValid();
    };
    return QueryNodeParamsResponse;
}());
exports.QueryNodeParamsResponse = QueryNodeParamsResponse;
