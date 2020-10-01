"use strict";
exports.__esModule = true;
var session_header_1 = require("./session-header");
/**
 *
 *
 * @class DispatchRequest
 */
var DispatchRequest = /** @class */ (function () {
    /**
     * Dispatch Request.
     * @constructor
     * @param {SessionHeader} sessionHeader - Session header object.
     */
    function DispatchRequest(sessionHeader) {
        this.sessionHeader = sessionHeader;
        if (!this.isValid()) {
            throw new TypeError("Invalid properties length.");
        }
    }
    /**
     *
     * Creates a DispatchRequest object using a JSON string
     * @param {String} json - JSON string.
     * @returns {DispatchRequest} - DispatchRequest object.
     * @memberof DispatchRequest
     */
    DispatchRequest.fromJSON = function (json) {
        return new DispatchRequest(session_header_1.SessionHeader.fromJSON(json));
    };
    /**
     *
     * Creates a JSON object with the DispatchRequest properties
     * @returns {JSON} - JSON Object.
     * @memberof DispatchRequest
     */
    DispatchRequest.prototype.toJSON = function () {
        return this.sessionHeader.toJSON();
    };
    /**
     *
     * Check if the DispatchRequest object is valid
     * @returns {boolean} - True or false.
     * @memberof DispatchRequest
     */
    DispatchRequest.prototype.isValid = function () {
        return this.sessionHeader.isValid();
    };
    return DispatchRequest;
}());
exports.DispatchRequest = DispatchRequest;
