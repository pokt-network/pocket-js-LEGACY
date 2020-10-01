"use strict";
exports.__esModule = true;
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
     * @param {BigInt} sessionBlockHeight - Height of session.
     */
    function SessionHeader(applicationPubKey, chain, sessionBlockHeight) {
        this.applicationPubKey = applicationPubKey;
        this.chain = chain;
        this.sessionBlockHeight = sessionBlockHeight;
        if (!this.isValid()) {
            throw new TypeError("Invalid SessionHeader properties.");
        }
    }
    /**
     *
     * Creates a SessionHeader object using a JSON string
     * @param {string} json - JSON string.
     * @returns {SessionHeader} - SessionHeader object.
     * @memberof SessionHeader
     */
    SessionHeader.fromJSON = function (json) {
        try {
            var jsonObject = JSON.parse(json);
            return new SessionHeader(jsonObject.app_public_key, jsonObject.chain, BigInt(jsonObject.session_height));
        }
        catch (error) {
            throw error;
        }
    };
    /**
     *
     * Creates a JSON object with the SessionHeader properties
     * @returns {JSON} - JSON Object.
     * @memberof SessionHeader
     */
    SessionHeader.prototype.toJSON = function () {
        return {
            app_public_key: this.applicationPubKey,
            chain: this.chain,
            session_height: Number(this.sessionBlockHeight.toString())
        };
    };
    /**
     *
     * Check if the SessionHeader is valid
     * @returns {boolean} - True or false.
     * @memberof Session
     */
    SessionHeader.prototype.isValid = function () {
        return (this.applicationPubKey.length !== 0 &&
            this.chain.length !== 0 &&
            Number(this.sessionBlockHeight.toString()) >= 0);
    };
    return SessionHeader;
}());
exports.SessionHeader = SessionHeader;
