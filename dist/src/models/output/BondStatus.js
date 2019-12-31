"use strict";
/**
 *
 *
 * @class BondStatus
 */
Object.defineProperty(exports, "__esModule", { value: true });
var BondStatus;
(function (BondStatus) {
    BondStatus[BondStatus["bonded"] = 0] = "bonded";
    BondStatus[BondStatus["unbonding"] = 1] = "unbonding";
    BondStatus[BondStatus["unbonded"] = 2] = "unbonded";
})(BondStatus = exports.BondStatus || (exports.BondStatus = {}));
(function (BondStatus) {
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
    BondStatus.getStatus = getStatus;
})(BondStatus = exports.BondStatus || (exports.BondStatus = {}));
//# sourceMappingURL=BondStatus.js.map