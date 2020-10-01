"use strict";
exports.__esModule = true;
var amino_js_1 = require("@pokt-network/amino-js");
/**
 * Represents a StdTx object to send a Transaction
 */
var StdTx = /** @class */ (function () {
    /**
     * @param stdSignDoc {StdSignDoc} The model form which the bytes for signature were produced
     * @param signatures {TxSignature[]} The list of signatures for this transaction
     */
    function StdTx(stdSignDoc, signatures) {
        this.AMINO_TYPE = "posmint/StdTx";
        this.stdSignDoc = stdSignDoc;
        this.signatures = signatures;
    }
    /**
     * Marshal the StdTx class properties with amino
     * @returns {Buffer} - Buffer representation of the marshal object.
     * @memberof StdTx
     */
    StdTx.prototype.marshalAmino = function () {
        // Parse PosmintMsg list
        var msgList = [];
        this.stdSignDoc.msgs.forEach(function (txMsg) {
            var stdSignMsgObj = txMsg.toStdSignDocMsgObj();
            msgList.push({
                type: stdSignMsgObj.type,
                value: stdSignMsgObj.value
            });
        });
        // Parse PosmintStdSignature list
        var signatureList = [];
        this.signatures.forEach(function (txSignature) {
            signatureList.push(txSignature.toPosmintStdSignature());
        });
        // Create StdTx object
        var stdTx = {
            fee: [{
                    amount: this.stdSignDoc.fee,
                    denom: this.stdSignDoc.feeDenom
                }],
            memo: this.stdSignDoc.memo,
            msg: msgList,
            signatures: signatureList
        };
        // Marshal PosmintTx
        var encodedPosmintTX = amino_js_1.marshalPosmintTx({
            type: this.AMINO_TYPE,
            value: stdTx
        });
        // Return buffer from marshaled PosmintTx
        return Buffer.from(encodedPosmintTX);
    };
    return StdTx;
}());
exports.StdTx = StdTx;
