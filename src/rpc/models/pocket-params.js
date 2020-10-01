"use strict";
exports.__esModule = true;
/**
 *
 *
 * @class PocketParams
 */
var PocketParams = /** @class */ (function () {
    /**
     * PocketParams.
     * @constructor
     * @param {BigInt} sessionNodeCount - Session node count.
     * @param {BigInt} proofWaitingPeriod - Proof waiting period.
     * @param {string[]} supportedBlockchains - Supported blockchain hash array.
     * @param {BigInt} claimExpiration - Claim expiration.
     */
    function PocketParams(sessionNodeCount, proofWaitingPeriod, supportedBlockchains, claimExpiration) {
        this.sessionNodeCount = sessionNodeCount;
        this.proofWaitingPeriod = proofWaitingPeriod;
        this.supportedBlockchains = supportedBlockchains;
        this.claimExpiration = claimExpiration;
        if (!this.isValid()) {
            throw new TypeError("Invalid PocketParams properties.");
        }
    }
    /**
     *
     * Creates a PocketParams object using a JSON string
     * @param {String} json - JSON string.
     * @returns {PocketParams} - PocketParams object.
     * @memberof PocketParams
     */
    PocketParams.fromJSON = function (json) {
        try {
            var jsonObject = JSON.parse(json);
            return new PocketParams(BigInt(jsonObject.session_node_count), BigInt(jsonObject.proof_waiting_period), jsonObject.supported_blockchains, BigInt(jsonObject.claim_expiration));
        }
        catch (error) {
            throw error;
        }
    };
    /**
     *
     * Creates a JSON object with the PocketParams properties
     * @returns {JSON} - JSON Object.
     * @memberof PocketParams
     */
    PocketParams.prototype.toJSON = function () {
        return {
            claim_expiration: Number(this.claimExpiration.toString()),
            proof_waiting_period: Number(this.proofWaitingPeriod.toString()),
            session_node_count: Number(this.sessionNodeCount.toString()),
            supported_blockchains: this.supportedBlockchains
        };
    };
    /**
     *
     * Check if the PocketParams object is valid
     * @returns {boolean} - True or false.
     * @memberof PocketParams
     */
    PocketParams.prototype.isValid = function () {
        return Number(this.claimExpiration.toString()) >= 0 &&
            Number(this.proofWaitingPeriod.toString()) >= 0 &&
            Number(this.sessionNodeCount.toString()) >= 0;
    };
    return PocketParams;
}());
exports.PocketParams = PocketParams;
