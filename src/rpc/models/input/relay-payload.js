"use strict";
exports.__esModule = true;
/**
 *
 *
 * @class RelayPayload
 */
var RelayPayload = /** @class */ (function () {
    /**
     * Relay Payload.
     * @constructor
     * @param {string} data - The actual data string for the external chain.
     * @param {string} method - The http CRUD method.
     * @param {string} path - The REST pathx.
     * @param {RelayHeaders} headers - Http headers.
     */
    function RelayPayload(data, method, path, headers) {
        this.data = data;
        this.method = method;
        this.path = path;
        this.headers = headers;
    }
    /**
     *
     * Creates a RelayPayload object using a JSON string
     * @param {string} json - JSON string.
     * @returns {RelayPayload} - RelayPayload object.
     * @memberof RelayPayload
     */
    RelayPayload.fromJSON = function (json) {
        try {
            var jsonObject = JSON.parse(json);
            return new RelayPayload(jsonObject.data, jsonObject.method, jsonObject.path, jsonObject.headers);
        }
        catch (error) {
            throw error;
        }
    };
    /**
     *
     * Creates a JSON object with the RelayPayload properties
     * @returns {JSON} - JSON Object.
     * @memberof RelayPayload
     */
    RelayPayload.prototype.toJSON = function () {
        return {
            data: this.data,
            headers: this.headers,
            method: this.method,
            path: this.path
        };
    };
    /**
     *
     * Check if the RelayPayload object is valid
     * @returns {boolean} - True or false.
     * @memberof RelayPayload
     */
    RelayPayload.prototype.isValid = function () {
        return (this.data.length !== undefined &&
            this.method.length !== undefined &&
            this.path.length !== undefined);
    };
    return RelayPayload;
}());
exports.RelayPayload = RelayPayload;
