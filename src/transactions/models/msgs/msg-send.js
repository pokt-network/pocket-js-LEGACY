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
/**
 * Model representing a MsgSend to send POKT from one account to another
 */
var MsgSend = /** @class */ (function (_super) {
    __extends(MsgSend, _super);
    /**
     * Constructor this message
     * @param {string} fromAddress - Origin address
     * @param {string} toAddress - Destination address
     * @param {string} amount - Amount to be sent, needs to be a valid number greater than 0
     * @param {CoinDenom | undefined} amountDenom  - Amount value denomination
     */
    function MsgSend(fromAddress, toAddress, amount) {
        var _this = _super.call(this) || this;
        _this.AMINO_KEY = "pos/Send";
        _this.fromAddress = fromAddress;
        _this.toAddress = toAddress;
        _this.amount = amount;
        var amountNumber = Number(_this.amount) || -1;
        if (isNaN(amountNumber)) {
            throw new Error("Fee is not a valid number");
        }
        else if (amountNumber < 0) {
            throw new Error("Amount < 0");
        }
        return _this;
    }
    /**
     * Converts an Msg Object to StdSignDoc
     * @returns {any} - Msg type key value.
     * @memberof MsgSend
     */
    MsgSend.prototype.toStdSignDocMsgObj = function () {
        return {
            type: this.AMINO_KEY,
            value: {
                Amount: this.amount,
                FromAddress: this.fromAddress.toLowerCase(),
                ToAddress: this.toAddress.toLowerCase()
            }
        };
    };
    return MsgSend;
}(tx_msg_1.TxMsg));
exports.MsgSend = MsgSend;
