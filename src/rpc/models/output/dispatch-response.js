"use strict";
exports.__esModule = true;
var __1 = require("../");
var input_1 = require("../input");
/**
 *
 *
 * @class DispatchResponse
 */
var DispatchResponse = /** @class */ (function () {
    /**
     * Dispatch Response.
     * @constructor
     * @param {SessionHeader} header -
     * @param {string} key -
     * @param {Node[]} nodes -
     */
    function DispatchResponse(header, key, nodes) {
        this.header = header;
        this.key = key;
        this.nodes = nodes;
        if (!this.isValid()) {
            throw new TypeError("Invalid DispatchResponse properties.");
        }
    }
    /**
     *
     * Creates a DispatchResponse object using a JSON string
     * @param {String} json - JSON string.
     * @returns {DispatchResponse} - DispatchResponse object.
     * @memberof DispatchResponse
     */
    DispatchResponse.fromJSON = function (json) {
        try {
            var jsonObject = JSON.parse(json);
            var sessionHeader = input_1.SessionHeader.fromJSON(JSON.stringify(jsonObject.header));
            // Handle nodes
            var nodes_1 = [];
            jsonObject.nodes.forEach(function (nodeJSON) {
                var node = __1.Node.fromJSON(JSON.stringify(nodeJSON));
                nodes_1.push(node);
            });
            return new DispatchResponse(sessionHeader, jsonObject.key, nodes_1);
        }
        catch (error) {
            throw error;
        }
    };
    /**
     *
     * Creates a JSON object with the DispatchResponse properties
     * @returns {JSON} - JSON Object.
     * @memberof DispatchResponse
     */
    DispatchResponse.prototype.toJSON = function () {
        return {
            header: this.header.toJSON(),
            key: this.key,
            nodes: JSON.parse(JSON.stringify(this.nodes))
        };
    };
    /**
     *
     * Check if the DispatchResponse object is valid
     * @returns {boolean} - True or false.
     * @memberof DispatchResponse
     */
    DispatchResponse.prototype.isValid = function () {
        return this.header.isValid() && this.key.length !== 0;
    };
    return DispatchResponse;
}());
exports.DispatchResponse = DispatchResponse;
