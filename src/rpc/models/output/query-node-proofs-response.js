"use strict";
exports.__esModule = true;
var stored_proof_1 = require("../stored-proof");
/**
 *
 *
 * @class QueryNodeProofsResponse
 */
var QueryNodeProofsResponse = /** @class */ (function () {
    /**
     * QueryNodeProofsResponse.
     * @constructor
     * @param {StoredProof[]} stroredProofs - Stored proofs array.
     */
    function QueryNodeProofsResponse(stroredProofs) {
        this.stroredProofs = stroredProofs;
    }
    /**
     *
     * Creates a QueryNodeProofsResponse object using a JSON string
     * @param {String} json - JSON string.
     * @returns {QueryNodeProofsResponse} - QueryNodeProofsResponse object.
     * @memberof QueryNodeProofsResponse
     */
    QueryNodeProofsResponse.fromJSON = function (json) {
        try {
            var jsonObject = JSON.parse(json);
            var proofs_1 = [];
            jsonObject.forEach(function (proofJSON) {
                var proof = stored_proof_1.StoredProof.fromJSON(JSON.stringify(proofJSON));
                proofs_1.push(proof);
            });
            if (proofs_1 !== undefined) {
                return new QueryNodeProofsResponse(proofs_1);
            }
            else {
                throw new Error("Failed to parse QueryNodeProofsResponse");
            }
        }
        catch (error) {
            throw error;
        }
    };
    /**
     *
     * Creates a JSON object with the QueryNodeProofsResponse properties
     * @returns {JSON} - JSON Object.
     * @memberof QueryNodeProofsResponse
     */
    QueryNodeProofsResponse.prototype.toJSON = function () {
        var proofsListJSON = [];
        this.stroredProofs.forEach(function (proof) {
            proofsListJSON.push(proof);
        });
        return JSON.parse(JSON.stringify(proofsListJSON));
    };
    return QueryNodeProofsResponse;
}());
exports.QueryNodeProofsResponse = QueryNodeProofsResponse;
