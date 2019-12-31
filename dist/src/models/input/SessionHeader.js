"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 *
 * @class SessionHeader
 */
var SessionHeader = /** @class */ (function () {
    /**
     * Request for Session.
     * @constructor
     * @param {string} applicationPubKey - Application Key associated with a client.
     * @param {string} chain - Chain.
     * @param {number} sessionBlockHeight - Height of session.
     */
    function SessionHeader(applicationPubKey, chain, sessionBlockHeight) {
        this.applicationPubKey = applicationPubKey;
        this.chain = chain;
        this.sessionBlockHeight = sessionBlockHeight;
        if (!this.isValid()) {
            throw new TypeError("Invalid properties length.");
        }
    }
    SessionHeader.fromJSON = function (json) {
        var jsonObject = JSON.parse(json);
        return new SessionHeader(jsonObject.app_pub_key, jsonObject.chain, jsonObject.session_height);
    };
    SessionHeader.prototype.isValid = function () {
        return this.applicationPubKey.length !== 0 && this.chain.length !== 0;
    };
    return SessionHeader;
}());
exports.SessionHeader = SessionHeader;
//# sourceMappingURL=SessionHeader.js.map