"use strict";
exports.__esModule = true;
var __1 = require("../");
/**
 *
 *
 * @class QueryNodeResponse
 */
var QueryNodeResponse = /** @class */ (function () {
    /**
     * Relay Response.
     * @constructor
     * @param {Node} node - Node object.
     */
    function QueryNodeResponse(node) {
        this.node = node;
        if (!this.isValid()) {
            throw new TypeError("Invalid properties length.");
        }
    }
    /**
     *
     * Creates a QueryNodeResponse object using a JSON string
     * @param {String} json - JSON string.
     * @returns {QueryNodeResponse} - QueryNodeResponse object.
     * @memberof QueryNodeResponse
     */
    QueryNodeResponse.fromJSON = function (json) {
        var jsonObject = JSON.parse(json);
        return new QueryNodeResponse(__1.Node.fromJSON(JSON.stringify(jsonObject)));
    };
    /**
     *
     * Creates a JSON object with the QueryNodeResponse properties
     * @returns {JSON} - JSON Object.
     * @memberof QueryNodeResponse
     */
    QueryNodeResponse.prototype.toJSON = function () {
        return this.node.toJSON();
    };
    /**
     *
     * Check if the QueryNodeResponse object is valid
     * @returns {boolean} - True or false.
     * @memberof QueryNodeResponse
     */
    QueryNodeResponse.prototype.isValid = function () {
        return this.node.isValid();
    };
    return QueryNodeResponse;
}());
exports.QueryNodeResponse = QueryNodeResponse;
