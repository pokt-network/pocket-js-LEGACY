"use strict";
exports.__esModule = true;
/**
 *
 *
 * @class QueryBalanceResponse
 */
var QueryBalanceResponse = /** @class */ (function () {
    /**
     * Relay Response.
     * @constructor
     * @param {Bigint} balance - Current network block balance.
     */
    function QueryBalanceResponse(balance) {
        this.balance = balance;
        if (!this.isValid()) {
            throw new TypeError("Invalid QueryBalanceResponse properties.");
        }
    }
    /**
     *
     * Creates a QueryBalanceResponse object using a JSON string
     * @param {String} json - JSON string.
     * @returns {QueryBalanceResponse} - QueryBalanceResponse object.
     * @memberof QueryBalanceResponse
     */
    QueryBalanceResponse.fromJSON = function (json) {
        try {
            var jsonObject = JSON.parse(json);
            return new QueryBalanceResponse(BigInt(jsonObject));
        }
        catch (error) {
            throw error;
        }
    };
    /**
     *
     * Creates a JSON object with the QueryBalanceResponse properties
     * @returns {JSON} - JSON Object.
     * @memberof QueryBalanceResponse
     */
    QueryBalanceResponse.prototype.toJSON = function () {
        return { balance: Number(this.balance.toString()) };
    };
    /**
     *
     * Check if the QueryBalanceResponse object is valid
     * @returns {boolean} - True or false.
     * @memberof QueryBalanceResponse
     */
    QueryBalanceResponse.prototype.isValid = function () {
        return this.balance !== undefined;
    };
    return QueryBalanceResponse;
}());
exports.QueryBalanceResponse = QueryBalanceResponse;
