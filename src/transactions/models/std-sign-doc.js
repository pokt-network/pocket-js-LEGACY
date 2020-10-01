"use strict";
exports.__esModule = true;
var coin_denom_1 = require("./coin-denom");
/**
 * Model to represent a StdSignDoc which produces the bytes to sign for a given Transaction
 */
var StdSignDoc = /** @class */ (function () {
    /**
     * Constructor for the StdSignDoc class
     * @throws {Error} Throws an error if the msgs list is empty or the fee is not a number
     * @param {BigInt} entropy - Random int64.
     * @param {string} chainId - The chainId of the network to be sent to
     * @param {string} fee - The amount to pay as a fee for executing this transaction
     * @param {CoinDenom | undefined} feeDenom - The denomination of the fee amount
     * @param {string | undefined} memo - The memo field for this account
     */
    function StdSignDoc(entropy, chaindId, msgs, fee, feeDenom, memo) {
        this.AMINO_TYPE = "posmint/StdSignDoc";
        this.entropy = entropy;
        this.chaindId = chaindId;
        this.msgs = msgs;
        this.fee = fee;
        this.feeDenom = feeDenom ? feeDenom : coin_denom_1.CoinDenom.Upokt;
        this.memo = memo ? memo : "";
        // Number parsing
        var feeNumber = Number(this.fee) || -1;
        if (isNaN(feeNumber) || feeNumber < 0) {
            throw new Error("Invalid fee or < 0");
        }
        else if (msgs.length === 0) {
            throw new Error("No messages found in the msgs list");
        }
        else if (this.chaindId.length === 0) {
            throw new Error("Empty chain id");
        }
    }
    /**
     * Marshals using Amino
     * @returns {Buffer} - Buffer representation of the class properties
     * @memberof StdSignDoc
     */
    StdSignDoc.prototype.marshalAmino = function () {
        var stdSignDocValue = {
            entropy: Number(this.entropy.toString()),
            chain_id: this.chaindId,
            fee: [{
                    amount: this.fee,
                    denom: this.feeDenom
                }],
            memo: this.memo,
            msgs: this.msgs.map(function (value) {
                return value.toStdSignDocMsgObj();
            })
        };
        try {
            return Buffer.from(JSON.stringify(stdSignDocValue).replace(/\\/g, ""), "utf8");
        }
        catch (err) {
            throw err;
        }
    };
    return StdSignDoc;
}());
exports.StdSignDoc = StdSignDoc;
