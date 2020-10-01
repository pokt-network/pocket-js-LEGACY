"use strict";
exports.__esModule = true;
var node_1 = require("../node");
var session_header_1 = require("../input/session-header");
/**
 *
 *
 * @class Session
 */
var Session = /** @class */ (function () {
    /**
     * Request for Session.
     * @constructor
     * @param {SessionHeader} sessionHeader - Application Key associated with a client.
     * @param {string} sessionKey - Chain.
     * @param {SessionNode[]} sessionNodes - Height of session.
     */
    function Session(sessionHeader, sessionKey, sessionNodes) {
        this.relayCount = 0;
        this.sessionHeader = sessionHeader;
        this.sessionKey = sessionKey;
        this.sessionNodes = sessionNodes;
    }
    /**
     *
     * Creates a Session object using a JSON string
     * @param {String} json - JSON string.
     * @returns {Session} - Session object.
     * @memberof Session
     */
    Session.fromJSON = function (json) {
        var jsonObject = JSON.parse(json);
        var sessionHeader = session_header_1.SessionHeader.fromJSON(JSON.stringify(jsonObject.header));
        var sessionNodes = [];
        if (jsonObject.nodes !== undefined && Array.isArray(jsonObject.nodes)) {
            for (var i = 0; i < jsonObject.nodes.length; i++) {
                sessionNodes.push(node_1.Node.fromJSON(JSON.stringify(jsonObject.nodes[i])));
            }
        }
        return new Session(sessionHeader, jsonObject.key, sessionNodes);
    };
    Session.prototype.relayPlus = function (v) {
        this.relayCount = this.relayCount + v;
    };
    /**
     * Returns whether or not a node is part of this session
     * @param {Node} node the node to check
     * @returns {boolean} whether or not the node is part of this session
     * @memberof Session
     */
    Session.prototype.isNodeInSession = function (node) {
        for (var i = 0; i < this.sessionNodes.length; i++) {
            var sessionNode = this.sessionNodes[i];
            if (sessionNode.address.toUpperCase() === node.address.toUpperCase()) {
                return true;
            }
        }
        return false;
    };
    /**
     * Returns a random session node
     * @memberof Session
     */
    Session.prototype.getSessionNode = function () {
        var nodes = this.sessionNodes;
        if (nodes !== undefined && nodes.length > 0) {
            return nodes[Math.floor(Math.random() * nodes.length)];
        }
        return new Error("Failed to retrieve a Session node, list is empty");
    };
    /**
     *
     * Creates a JSON object with the Session properties
     * @returns {JSON} - JSON Object.
     * @memberof Session
     */
    Session.prototype.toJSON = function () {
        return {
            header: this.sessionHeader.toJSON(),
            key: this.sessionKey,
            nodes: JSON.parse(JSON.stringify(this.sessionNodes))
        };
    };
    /**
     *
     * Check if the Session object is valid
     * @returns {boolean} - True or false.
     * @memberof Session
     */
    Session.prototype.isValid = function () {
        return (this.sessionHeader.isValid() &&
            this.sessionKey !== undefined &&
            this.sessionNodes !== undefined);
    };
    return Session;
}());
exports.Session = Session;
