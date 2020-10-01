"use strict";
exports.__esModule = true;
var input_1 = require("../input");
/**
 *
 *
 * @class QueryNodeProofResponse
 */
var QueryNodeProofResponse = /** @class */ (function () {
    /**
     * QueryNodeProofResponse.
     * @constructor
     * @param {StoredProof} nodeProof - Amount staked by the node.
     */
    function QueryNodeProofResponse(nodeProof) {
        this.nodeProof = nodeProof;
    }
    /**
     *
     * Creates a QueryNodeProofResponse object using a JSON string
     * @param {String} json - JSON string.
     * @returns {QueryNodeProofResponse} - QueryNodeProofResponse object.
     * @memberof QueryNodeProofResponse
     */
    QueryNodeProofResponse.fromJSON = function (json) {
        try {
            var jsonObject = JSON.parse(json);
            var storedProof = input_1.NodeProof.fromJSON(JSON.stringify(jsonObject));
            return new QueryNodeProofResponse(storedProof);
        }
        catch (error) {
            throw error;
        }
    };
    /**
     *
     * Creates a JSON object with the QueryNodeProofResponse properties
     * @returns {JSON} - JSON Object.
     * @memberof QueryNodeProofResponse
     */
    QueryNodeProofResponse.prototype.toJSON = function () {
        return this.nodeProof.toJSON();
    };
    return QueryNodeProofResponse;
}());
exports.QueryNodeProofResponse = QueryNodeProofResponse;
