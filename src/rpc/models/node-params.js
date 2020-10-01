"use strict";
exports.__esModule = true;
/**
 *
 *
 * @class NodeParams
 */
var NodeParams = /** @class */ (function () {
    /**
     * NodeParams.
     * @constructor
     * @param {Hex} hash - NodeParams hash.
     * @param {PartSetHeader} parts - Session NodeParams Height.
     */
    function NodeParams(daoAllocation, maxValidators, proposerAllocation, sessionBlockFrequency, unstakingTime, stakeDenom, stakeMinimum, maxEvidenceAge, signedBlocksWindow, minSignedPerWindow, downtimeJailDuration, slashFractionDoubleSign, slashFractionDowntime) {
        this.daoAllocation = daoAllocation;
        this.maxValidators = maxValidators;
        this.proposerAllocation = proposerAllocation;
        this.sessionBlockFrequency = sessionBlockFrequency;
        this.unstakingTime = unstakingTime;
        this.stakeDenom = stakeDenom;
        this.stakeMinimum = stakeMinimum;
        this.maxEvidenceAge = maxEvidenceAge;
        this.signedBlocksWindow = signedBlocksWindow;
        this.minSignedPerWindow = minSignedPerWindow;
        this.downtimeJailDuration = downtimeJailDuration;
        this.slashFractionDoubleSign = slashFractionDoubleSign;
        this.slashFractionDowntime = slashFractionDowntime;
        if (!this.isValid()) {
            throw new TypeError("Invalid NodeParams properties.");
        }
    }
    /**
     *
     * Creates a NodeParams object using a JSON string
     * @param {String} json - JSON string.
     * @returns {NodeParams} - NodeParams object.
     * @memberof NodeParams
     */
    NodeParams.fromJSON = function (json) {
        try {
            var jsonObject = JSON.parse(json);
            return new NodeParams(BigInt(jsonObject.dao_allocation), BigInt(jsonObject.max_validators), BigInt(jsonObject.proposer_allocation), BigInt(jsonObject.session_block_frequency), BigInt(jsonObject.unstaking_time), jsonObject.stake_denom, BigInt(jsonObject.stake_minimum), BigInt(jsonObject.max_evidence_age), BigInt(jsonObject.signed_blocks_window), Number(jsonObject.min_signed_per_window), BigInt(jsonObject.downtime_jail_duration), Number(jsonObject.slash_fraction_double_sign), Number(jsonObject.slash_fraction_downtime));
        }
        catch (error) {
            throw error;
        }
    };
    /**
     *
     * Creates a JSON object with the NodeParams properties
     * @returns {JSON} - JSON Object.
     * @memberof NodeParams
     */
    NodeParams.prototype.toJSON = function () {
        return {
            dao_allocation: Number(this.daoAllocation.toString()),
            max_validators: Number(this.maxValidators.toString()),
            proposer_allocation: Number(this.proposerAllocation.toString()),
            session_block_frequency: Number(this.sessionBlockFrequency.toString()),
            downtime_jail_duration: Number(this.downtimeJailDuration.toString()),
            max_evidence_age: Number(this.maxEvidenceAge.toString()),
            min_signed_per_window: Number(this.minSignedPerWindow.toString()),
            signed_blocks_window: Number(this.signedBlocksWindow.toString()),
            slash_fraction_double_sign: Number(this.slashFractionDoubleSign.toString()),
            slash_fraction_downtime: Number(this.slashFractionDowntime.toString()),
            stake_denom: this.stakeDenom,
            stake_minimum: Number(this.stakeMinimum.toString()),
            unstaking_time: Number(this.unstakingTime.toString())
        };
    };
    /**
     *
     * Check if the NodeParams object is valid
     * @returns {boolean} - True or false.
     * @memberof NodeParams
     */
    NodeParams.prototype.isValid = function () {
        return this.stakeDenom.length > 0;
    };
    return NodeParams;
}());
exports.NodeParams = NodeParams;
