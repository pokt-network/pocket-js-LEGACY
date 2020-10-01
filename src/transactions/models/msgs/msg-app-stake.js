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
var belt_1 = require("@tendermint/belt");
var tx_msg_1 = require("./tx-msg");
var __1 = require("../../..");
/**
 * Model representing a MsgAppStake to stake as an Application in the Pocket Network
 */
var MsgAppStake = /** @class */ (function (_super) {
    __extends(MsgAppStake, _super);
    /**
     * Constructor for this class
     * @param {Buffer} pubKey - Public key buffer
     * @param {string[]} chains - Network identifier list to be requested by this app
     * @param {string} amount - The amount to stake, must be greater than 0
     */
    function MsgAppStake(pubKey, chains, amount) {
        var _this = _super.call(this) || this;
        _this.AMINO_KEY = "apps/MsgAppStake";
        _this.pubKey = pubKey;
        _this.chains = chains;
        _this.amount = amount;
        var amountNumber = Number(_this.amount) || -1;
        if (isNaN(amountNumber)) {
            throw new Error("Amount is not a valid number");
        }
        else if (amountNumber < 0) {
            throw new Error("Amount < 0");
        }
        else if (_this.chains.length === 0) {
            throw new Error("Chains is empty");
        }
        else if (!__1.validatePublicKey(_this.pubKey)) {
            throw new Error("Invalid public key");
        }
        return _this;
    }
    /**
     * Returns the msg type key
     * @returns {string} - Msg type key value.
     * @memberof MsgAppStake
     */
    MsgAppStake.prototype.getMsgTypeKey = function () {
        return this.AMINO_KEY;
    };
    /**
     * Converts an Msg Object to StdSignDoc
     * @returns {any} - Msg type key value.
     * @memberof MsgAppStake
     */
    MsgAppStake.prototype.toStdSignDocMsgObj = function () {
        return {
            type: this.AMINO_KEY,
            value: {
                chains: this.chains,
                pubkey: {
                    type: "crypto/ed25519_public_key",
                    value: belt_1.bytesToBase64(this.pubKey)
                },
                value: this.amount
            }
        };
    };
    return MsgAppStake;
}(tx_msg_1.TxMsg));
exports.MsgAppStake = MsgAppStake;
