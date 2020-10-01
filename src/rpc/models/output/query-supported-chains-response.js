"use strict";
exports.__esModule = true;
/**
 *
 *
 * @class QuerySupportedChainsResponse
 */
var QuerySupportedChainsResponse = /** @class */ (function () {
    /**
     * QuerySupportedChainsResponse
     * @constructor
     * @param {string[]} supportedChains - Application params.
     */
    function QuerySupportedChainsResponse(supportedChains) {
        this.supportedChains = supportedChains;
        if (!this.isValid()) {
            throw new TypeError("Invalid SupportedShainsResponse properties.");
        }
    }
    /**
     *
     * Creates a QuerySupportedChainsResponse object using a JSON string
     * @param {String} json - JSON string.
     * @returns {QuerySupportedChainsResponse} - QuerySupportedChainsResponse object.
     * @memberof QuerySupportedChainsResponse
     */
    QuerySupportedChainsResponse.fromJSON = function (json) {
        try {
            var chains_1 = [];
            if (Array.isArray(json)) {
                json.forEach(function (chain) {
                    chains_1.push(chain);
                });
            }
            return new QuerySupportedChainsResponse(chains_1);
        }
        catch (error) {
            throw error;
        }
    };
    /**
     *
     * Creates a JSON object with the QuerySupportedChainsResponse properties
     * @returns {JSON} - JSON Object.
     * @memberof QuerySupportedChainsResponse
     */
    QuerySupportedChainsResponse.prototype.toJSON = function () {
        var chainsJSON = [];
        this.supportedChains.forEach(function (chain) {
            chainsJSON.push(chain);
        });
        return JSON.parse(JSON.stringify(chainsJSON));
    };
    /**
     *
     * Check if the QuerySupportedChainsResponse object is valid
     * @returns {boolean} - True or false.
     * @memberof QuerySupportedChainsResponse
     */
    QuerySupportedChainsResponse.prototype.isValid = function () {
        return this.supportedChains !== undefined;
    };
    return QuerySupportedChainsResponse;
}());
exports.QuerySupportedChainsResponse = QuerySupportedChainsResponse;
