"use strict";
exports.__esModule = true;
/**
 *
 * StakingStatus enum with the possible Staking status values
 */
var StakingStatus;
(function (StakingStatus) {
    StakingStatus["Staked"] = "staked";
    StakingStatus["Unstaked"] = "unstaked";
    StakingStatus["Unstaking"] = "unstaking";
    StakingStatus["None"] = "";
})(StakingStatus = exports.StakingStatus || (exports.StakingStatus = {}));
/**
 *
 * StakingStatus enum utility
 */
(function (StakingStatus) {
    /**
     *
     * Returns the StakingStatus by passing an string
     * @param {string} status - Staking status string.
     * @returns {StakingStatus} - StakingStatus object.
     * @memberof StakingStatus
     */
    function getStatus(status) {
        switch (status) {
            case "staked":
                return StakingStatus.Staked;
            case "unstaked":
                return StakingStatus.Unstaked;
            case "unstaking":
                return StakingStatus.Unstaking;
            case "":
                return StakingStatus.None;
            default:
                return StakingStatus.None;
        }
    }
    StakingStatus.getStatus = getStatus;
})(StakingStatus = exports.StakingStatus || (exports.StakingStatus = {}));
