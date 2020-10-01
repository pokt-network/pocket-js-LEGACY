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
 * Model representing a MsgNodeUnjail to unjail as an Node in the Pocket Network
 */
var MsgNodeUnjail = /** @class */ (function (_super) {
    __extends(MsgNodeUnjail, _super);
    /**
     * @param {string} address - Address value
     */
    function MsgNodeUnjail(address) {
        var _this = _super.call(this) || this;
        _this.AMINO_KEY = "pos/MsgUnjail";
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
     * @memberof MsgNodeUnjail
     */
    MsgNodeUnjail.prototype.toStdSignDocMsgObj = function () {
        return {
            type: this.AMINO_KEY,
            value: {
                address: this.address.toLowerCase()
            }
        };
    };
    return MsgNodeUnjail;
}(tx_msg_1.TxMsg));
exports.MsgNodeUnjail = MsgNodeUnjail;
