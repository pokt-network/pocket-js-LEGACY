"use strict";
exports.__esModule = true;
var transaction_1 = require("../transaction");
/**
 *
 *
 * @class QueryTXResponse
 */
var QueryTXResponse = /** @class */ (function () {
    /**
     * Query Transaction Response.
     * @constructor
     * @param {Transaction} transaction - Transaction object.
     */
    function QueryTXResponse(transaction) {
        this.transaction = transaction;
        if (!this.isValid()) {
            throw new TypeError("Invalid properties length.");
        }
    }
    /**
     *
     * Creates a QueryTXResponse object using a JSON string
     * @param {String} json - JSON string.
     * @returns {QueryTXResponse} - QueryTXResponse object.
     * @memberof QueryTXResponse
     */
    QueryTXResponse.fromJSON = function (json) {
        return new QueryTXResponse(transaction_1.Transaction.fromJSON(json));
    };
    /**
     *
     * Creates a JSON object with the QueryTXResponse properties
     * @returns {JSON} - JSON Object.
     * @memberof QueryTXResponse
     */
    QueryTXResponse.prototype.toJSON = function () {
        return this.transaction.toJSON();
    };
    /**
     *
     * Check if the QueryTXResponse object is valid
     * @returns {boolean} - True or false.
     * @memberof QueryTXResponse
     */
    QueryTXResponse.prototype.isValid = function () {
        return this.transaction.isValid();
    };
    return QueryTXResponse;
}());
exports.QueryTXResponse = QueryTXResponse;
