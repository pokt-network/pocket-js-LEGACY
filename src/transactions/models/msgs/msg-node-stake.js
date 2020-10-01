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
 * Model representing a MsgNodeStake to stake as an Node in the Pocket Network
 */
var MsgNodeStake = /** @class */ (function (_super) {
    __extends(MsgNodeStake, _super);
    /**
     * @param {string} pubKey - Public key
     * @param {string[]} chains - String array containing a list of blockchain hashes
     * @param {string} amount - Amount to be sent, has to be a valid number and cannot be lesser than 0
     * @param {URL} serviceURL - Service node URL, needs to be https://
     */
    function MsgNodeStake(pubKey, chains, amount, serviceURL) {
        var _this = _super.call(this) || this;
        _this.AMINO_KEY = "pos/MsgStake";
        _this.pubKey = pubKey;
        _this.chains = chains;
        _this.amount = amount;
        _this.serviceURL = serviceURL;
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
        else if (!__1.validateServiceURL(_this.serviceURL)) {
            throw new Error("Invalid Service URL");
        }
        return _this;
    }
    /**
     * Converts an Msg Object to StdSignDoc
     * @returns {any} - Msg type key value.
     * @memberof MsgAppUnstake
     */
    MsgNodeStake.prototype.toStdSignDocMsgObj = function () {
        return {
            type: this.AMINO_KEY,
            value: {
                chains: this.chains,
                public_key: {
                    type: "crypto/ed25519_public_key",
                    value: belt_1.bytesToBase64(this.pubKey)
                },
                service_url: this.serviceURL.toString(),
                value: this.amount
            }
        };
    };
    return MsgNodeStake;
}(tx_msg_1.TxMsg));
exports.MsgNodeStake = MsgNodeStake;
