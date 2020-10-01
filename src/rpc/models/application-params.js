"use strict";
exports.__esModule = true;
/**
 *
 *
 * @class ApplicationParams
 */
var ApplicationParams = /** @class */ (function () {
    /**
     * ApplicationParams.
     * @constructor
     * @param {Hex} hash - ApplicationParams hash.
     * @param {PartSetHeader} parts - Session ApplicationParams Height.
     */
    function ApplicationParams(unstakingTime, maxApplications, appStakeMin, baseRelaysPerPokt, stabilityAdjustment, participationRateOn) {
        this.unstakingTime = unstakingTime;
        this.maxApplications = maxApplications;
        this.appStakeMin = appStakeMin;
        this.baseRelaysPerPokt = baseRelaysPerPokt;
        this.stabilityAdjustment = stabilityAdjustment;
        this.participationRateOn = participationRateOn;
        if (!this.isValid()) {
            throw new TypeError("Invalid ApplicationParams properties.");
        }
    }
    /**
     *
     * Creates a ApplicationParams object using a JSON string
     * @param {String} json - JSON string.
     * @returns {ApplicationParams} - ApplicationParams object.
     * @memberof ApplicationParams
     */
    ApplicationParams.fromJSON = function (json) {
        try {
            var jsonObject = JSON.parse(json);
            return new ApplicationParams(jsonObject.unstaking_time, BigInt(jsonObject.max_applications), BigInt(jsonObject.app_stake_minimum), BigInt(jsonObject.base_relays_per_pokt), BigInt(jsonObject.stability_adjustment), jsonObject.participation_rate_on);
        }
        catch (error) {
            throw error;
        }
    };
    /**
     *
     * Creates a JSON object with the ApplicationParams properties
     * @returns {JSON} - JSON Object.
     * @memberof ApplicationParams
     */
    ApplicationParams.prototype.toJSON = function () {
        return {
            app_stake_minimum: Number(this.appStakeMin.toString()),
            base_relays_per_pokt: Number(this.baseRelaysPerPokt.toString()),
            max_applications: Number(this.maxApplications.toString()),
            participation_rate_on: this.participationRateOn,
            stability_adjustment: Number(this.stabilityAdjustment.toString()),
            unstaking_time: this.unstakingTime
        };
    };
    /**
     *
     * Check if the ApplicationParams object is valid
     * @returns {boolean} - True or false.
     * @memberof ApplicationParams
     */
    ApplicationParams.prototype.isValid = function () {
        return Number(this.appStakeMin.toString()) >= 0 &&
            Number(this.baseRelaysPerPokt.toString()) >= 0 &&
            Number(this.maxApplications.toString()) >= 0 &&
            Number(this.stabilityAdjustment.toString()) >= 0 &&
            this.unstakingTime.length >= 0 &&
            this.participationRateOn !== undefined;
    };
    return ApplicationParams;
}());
exports.ApplicationParams = ApplicationParams;
