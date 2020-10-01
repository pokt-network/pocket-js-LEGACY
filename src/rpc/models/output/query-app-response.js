"use strict";
exports.__esModule = true;
var application_1 = require("../application");
/**
 *
 *
 * @class QueryAppResponse
 */
var QueryAppResponse = /** @class */ (function () {
    /**
     * Relay Response.
     * @constructor
     * @param {Application} application - Application object.
     */
    function QueryAppResponse(application) {
        this.application = application;
        if (!this.isValid()) {
            throw new TypeError("Invalid properties length.");
        }
    }
    /**
     *
     * Creates a QueryAppResponse object using a JSON string
     * @param {String} json - JSON string.
     * @returns {QueryAppResponse} - QueryAppResponse object.
     * @memberof QueryAppResponse
     */
    QueryAppResponse.fromJSON = function (json) {
        try {
            var jsonObject = JSON.parse(json);
            return new QueryAppResponse(application_1.Application.fromJSON(JSON.stringify(jsonObject)));
        }
        catch (error) {
            throw error;
        }
    };
    /**
     *
     * Creates a JSON object with the QueryAppResponse properties
     * @returns {JSON} - JSON Object.
     * @memberof QueryAppResponse
     */
    QueryAppResponse.prototype.toJSON = function () {
        return this.application.toJSON();
    };
    /**
     *
     * Check if the QueryAppResponse object is valid
     * @returns {boolean} - True or false.
     * @memberof QueryAppResponse
     */
    QueryAppResponse.prototype.isValid = function () {
        return this.application.isValid();
    };
    return QueryAppResponse;
}());
exports.QueryAppResponse = QueryAppResponse;
