"use strict";
exports.__esModule = true;
var application_params_1 = require("../application-params");
/**
 *
 *
 * @class QueryAppParamsResponse
 */
var QueryAppParamsResponse = /** @class */ (function () {
    /**
     * QueryAppParamsResponse
     * @constructor
     * @param {ApplicationParams} applicationParams - Application params.
     */
    function QueryAppParamsResponse(applicationParams) {
        this.applicationParams = applicationParams;
        if (!this.isValid()) {
            throw new TypeError("Invalid QueryAppParamsResponse properties.");
        }
    }
    /**
     *
     * Creates a QueryAppParamsResponse object using a JSON string
     * @param {String} json - JSON string.
     * @returns {QueryAppParamsResponse} - QueryAppParamsResponse object.
     * @memberof QueryAppParamsResponse
     */
    QueryAppParamsResponse.fromJSON = function (json) {
        try {
            return new QueryAppParamsResponse(application_params_1.ApplicationParams.fromJSON(json));
        }
        catch (error) {
            throw error;
        }
    };
    /**
     *
     * Creates a JSON object with the QueryAppParamsResponse properties
     * @returns {JSON} - JSON Object.
     * @memberof QueryAppParamsResponse
     */
    QueryAppParamsResponse.prototype.toJSON = function () {
        return this.applicationParams.toJSON();
    };
    /**
     *
     * Check if the QueryAppParamsResponse object is valid
     * @returns {boolean} - True or false.
     * @memberof QueryAppParamsResponse
     */
    QueryAppParamsResponse.prototype.isValid = function () {
        return this.applicationParams.isValid();
    };
    return QueryAppParamsResponse;
}());
exports.QueryAppParamsResponse = QueryAppParamsResponse;
