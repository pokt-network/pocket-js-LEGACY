"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var tx_msg_1 = require("./tx-msg");
var __1 = require("../../..");
/**
 * Model representing a MsgAppUnjail to unjail an Application in the Pocket Network
 */
var MsgAppUnjail = /** @class */ (function (_super) {
    __extends(MsgAppUnjail, _super);
    /**
     *
     * @param {string} address - The address of the Application to unjail
     */
    function MsgAppUnjail(address) {
        var _this = _super.call(this) || this;
        _this.AMINO_KEY = "apps/MsgAppUnjail";
        _this.address = address;
        var errorOrUndefined = __1.validateAddressHex(_this.address);
        if (__1.typeGuard(errorOrUndefined, Error)) {
            throw errorOrUndefined;
        }
        return _this;
    }
    /**
     * Converts an Msg Object to StdSignDoc
     * @returns {any} - Msg type key value.
     * @memberof MsgAppUnjail
     */
    MsgAppUnjail.prototype.toStdSignDocMsgObj = function () {
        return {
            type: this.AMINO_KEY,
            value: {
                address: this.address.toLowerCase()
            }
        };
    };
    return MsgAppUnjail;
}(tx_msg_1.TxMsg));
exports.MsgAppUnjail = MsgAppUnjail;
