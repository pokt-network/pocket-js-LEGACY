"use strict";
exports.__esModule = true;
var node_1 = require("../node");
/**
 *
 *
 * @class QueryNodesResponse
 */
var QueryNodesResponse = /** @class */ (function () {
    /**
     * Relay Response.
     * @constructor
     * @param {Node[]} nodes - Node object array.
     */
    function QueryNodesResponse(nodes) {
        this.nodes = nodes;
        if (!this.isValid()) {
            throw new TypeError("Invalid QueryNodesResponse properties.");
        }
    }
    /**
     *
     * Creates a QueryNodesResponse object using a JSON string
     * @param {String} json - JSON string.
     * @returns {QueryNodesResponse} - QueryNodesResponse object.
     * @memberof QueryNodesResponse
     */
    QueryNodesResponse.fromJSON = function (json) {
        try {
            var jsonObject = JSON.parse(json);
            var nodes_1 = [];
            if (Array.isArray(jsonObject)) {
                jsonObject.forEach(function (nodeJSON) {
                    var node = node_1.Node.fromJSON(JSON.stringify(nodeJSON));
                    nodes_1.push(node);
                });
                if (nodes_1 !== undefined) {
                    return new QueryNodesResponse(nodes_1);
                }
                else {
                    throw new Error("Failed to parse the node list for QueryNodesResponse");
                }
            }
            else {
                var node = node_1.Node.fromJSON(JSON.stringify(jsonObject));
                return new QueryNodesResponse([node]);
            }
        }
        catch (error) {
            throw error;
        }
    };
    /**
     *
     * Creates a JSON object with the QueryNodesResponse properties
     * @returns {JSON} - JSON Object.
     * @memberof QueryNodesResponse
     */
    QueryNodesResponse.prototype.toJSON = function () {
        var nodeListJSON = [];
        this.nodes.forEach(function (node) {
            nodeListJSON.push(node);
        });
        return { nodes: JSON.parse(JSON.stringify(nodeListJSON)) };
    };
    /**
     *
     * Check if the QueryNodesResponse object is valid
     * @returns {boolean} - True or false.
     * @memberof QueryNodesResponse
     */
    QueryNodesResponse.prototype.isValid = function () {
        return this.nodes !== undefined;
    };
    return QueryNodesResponse;
}());
exports.QueryNodesResponse = QueryNodesResponse;
