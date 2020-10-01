"use strict";
exports.__esModule = true;
var session_header_1 = require("./input/session-header");
/**
 *
 *
 * @class StoredProof
 */
var StoredProof = /** @class */ (function () {
    /**
     * StoredProof.
     * @constructor
     * @param {SessionHeader} sessionHeader - Session Header.
     * @param {string} servicerAddress - Servicer address.
     * @param {BigInt} totalRelays - Total amount of relays.
     */
    function StoredProof(sessionHeader, servicerAddress, totalRelays) {
        this.sessionHeader = sessionHeader;
        this.servicerAddress = servicerAddress;
        this.totalRelays = totalRelays;
    }
    /**
     *
     * Creates a StoredProof object using a JSON string
     * @param {string} json - JSON string.
     * @returns {StoredProof} - StoredProof object.
     * @memberof StoredProof
     */
    StoredProof.fromJSON = function (json) {
        var jsonObject = JSON.parse(json);
        return new StoredProof(session_header_1.SessionHeader.fromJSON(JSON.stringify(jsonObject.session_header)), jsonObject.servicer_address, BigInt(jsonObject.total_relays));
    };
    /**
     *
     * Creates a JSON object with the StoredProof properties
     * @returns {JSON} - JSON Object.
     * @memberof StoredProof
     */
    StoredProof.prototype.toJSON = function () {
        return {
            servicer_address: this.servicerAddress,
            session_header: this.sessionHeader.toJSON(),
            total_relays: Number(this.totalRelays.toString())
        };
    };
    /**
     *
     * Check if the StoredProof object is valid
     * @returns {boolean} - True or false.
     * @memberof StoredProof
     */
    StoredProof.prototype.isValid = function () {
        return this.servicerAddress.length !== 0 &&
            Number(this.totalRelays.toString()) >= 0 &&
            this.sessionHeader.isValid();
    };
    return StoredProof;
}());
exports.StoredProof = StoredProof;
