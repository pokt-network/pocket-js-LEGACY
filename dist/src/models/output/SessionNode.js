"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BondStatus_1 = require("./BondStatus");
var Hex_1 = require("../../utils/Hex");
/**
 *
 *
 * @class SessionNode
 */
var SessionNode = /** @class */ (function () {
    /**
     * Create a Session Node.
     * @constructor
     * @param {string} address - the hex address of the validator
     * @param {string} consPubKey - the hex consensus public key of the validator.
     * @param {boolean} jailed - has the validator been jailed from staked status?
     * @param {BondStatus} status - validator status
     * @param {number} stakedTokens - how many staked tokens
     * @param {string} serviceURL - Service node url
     * @param {string[]} chains - chains
     * @param {number} unstakingCompletionTime - if unstaking, min time for the validator to complete unstaking
     */
    function SessionNode(address, consPubKey, jailed, status, stakedTokens, serviceURL, chains, unstakingCompletionTime) {
        if (stakedTokens === void 0) { stakedTokens = 0; }
        if (chains === void 0) { chains = []; }
        this.address = Hex_1.Hex.decodeString(address);
        this.consPubKey = consPubKey;
        this.jailed = jailed;
        this.status = status;
        this.stakedTokens = stakedTokens;
        this.serviceURL = serviceURL;
        this.chains = chains;
        this.unstakingCompletionTime = unstakingCompletionTime;
        if (!this.isValid()) {
            throw new TypeError("Invalid properties length.");
        }
    }
    SessionNode.fromJSON = function (json) {
        var jsonObject = JSON.parse(json);
        var status = BondStatus_1.BondStatus.getStatus(jsonObject.status);
        return new SessionNode(jsonObject.address, jsonObject.cons_pubkey, jsonObject.jailed, status, jsonObject.stakedTokens, jsonObject.serviceurl, jsonObject.chains, jsonObject.unstaking_time);
    };
    SessionNode.prototype.isValid = function () {
        return this.address.length !== 0 && this.serviceURL.length !== 0;
    };
    return SessionNode;
}());
exports.SessionNode = SessionNode;
//# sourceMappingURL=SessionNode.js.map