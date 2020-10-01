"use strict";
exports.__esModule = true;
/**
 *
 * BondStatus enum with the possible Bond status values
 */
var BondStatus;
(function (BondStatus) {
    BondStatus[BondStatus["bonded"] = 0] = "bonded";
    BondStatus[BondStatus["unbonding"] = 1] = "unbonding";
    BondStatus[BondStatus["unbonded"] = 2] = "unbonded";
})(BondStatus = exports.BondStatus || (exports.BondStatus = {}));
/**
 *
 * BondStatus enum utility
 */
var BondStatusUtil;
(function (BondStatusUtil) {
    /**
     *
     * Returns the BondStatus by passing an string
     * @param {string} status - Bond status string.
     * @returns {BondStatus} - BondStatus object.
     * @memberof BondStatusUtil
     */
    function getStatus(status) {
        switch (status) {
            case "bonded":
                return BondStatus.bonded;
            case "unbonding":
                return BondStatus.unbonding;
            default:
                return BondStatus.unbonded;
        }
    }
    BondStatusUtil.getStatus = getStatus;
})(BondStatusUtil = exports.BondStatusUtil || (exports.BondStatusUtil = {}));
