"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SessionNode_1 = require("./SessionNode");
var SessionHeader_1 = require("../input/SessionHeader");
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
     * @param {number[]} sessionKey - Chain.
     * @param {SessionNode[]} sessionNodes - Height of session.
     */
    function Session(sessionHeader, sessionKey, sessionNodes) {
        this.sessionHeader = sessionHeader;
        this.sessionKey = sessionKey;
        this.sessionNodes = sessionNodes;
    }
    Session.fromJSON = function (json) {
        var jsonObject = JSON.parse(json);
        var sessionHeader = SessionHeader_1.SessionHeader.fromJSON(jsonObject.header);
        var sessionNodes = [];
        for (var sessionNodeJson in jsonObject.nodes) {
            if (sessionNodeJson.hasOwnProperty("serviceurl")) {
                sessionNodes.push(SessionNode_1.SessionNode.fromJSON(sessionNodeJson));
            }
        }
        return new Session(sessionHeader, jsonObject.key, sessionNodes);
    };
    return Session;
}());
exports.Session = Session;
//# sourceMappingURL=Session.js.map