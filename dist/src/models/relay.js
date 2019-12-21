"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 *
 * @class Relay
 */
var Relay = /** @class */ (function () {
    /**
     * Creates an instance of Relay.
     * @param {Blockchain} blockchain - A blockchain object.
     * @param {string} data - Data string.
     * @param {Configuration} configuration - Configuration object.
     * @param {string} httpMethod - (Optional) HTTP Method.
     * @param {string} path - (Optional) API path.
     * @param {Object} queryParams - (Optional) An object holding the query params.
     * @param {Object} headers - (Optional) An object holding the HTTP Headers.
     * @memberof Relay
     */
    function Relay(blockchain, data, configuration, httpMethod, path, queryParams, headers) {
        this.queryParams = {};
        this.headers = {};
        this.blockchain = blockchain;
        this.data = data;
        this.configuration = configuration;
        this.httpMethod = httpMethod;
        this.path = path;
        this.appendQueryParams(queryParams);
        this.headers = headers;
    }
    /**
     *
     * Parse properties to a JSON Object.
     * @returns {JSON} - A JSON Object.
     * @memberof Relay
     */
    Relay.prototype.toJSON = function () {
        return {
            Blockchain: this.blockchain.name,
            Data: this.data,
            DevID: this.configuration.devID,
            HEADERS: this.headers,
            METHOD: this.httpMethod,
            NetID: this.blockchain.netID,
            PATH: this.path
        };
    };
    /**
     *
     * Verifies if the Relay is valid
     * @returns {boolean} - True or false
     * @memberof Relay
     */
    Relay.prototype.isValid = function () {
        if (this.blockchain != null &&
            this.blockchain.isValid() &&
            this.configuration != null) {
            return true;
        }
        return false;
    };
    /**
     *
     * Appends the Query parameters to the "path" property string.
     * @param {Object} queryParams - Object containing one or multiple query parameters.
     * @memberof Relay
     */
    Relay.prototype.appendQueryParams = function (queryParams) {
        var paramsStr = "";
        if (typeof queryParams === "object") {
            for (var k in queryParams) {
                if (queryParams.hasOwnProperty(k)) {
                    paramsStr += k + "=" + queryParams[k] + "&";
                }
            }
            // Append the query params to the path
            this.path += "?" + paramsStr;
        }
    };
    return Relay;
}());
exports.Relay = Relay;
//# sourceMappingURL=relay.js.map