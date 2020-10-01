"use strict";
exports.__esModule = true;
/**
 * Model representing a ECDSA signature result
 */
var TransactionSignature = /** @class */ (function () {
    function TransactionSignature(publicKey, signature) {
        this.publicKey = publicKey;
        this.signature = signature;
    }
    return TransactionSignature;
}());
exports.TransactionSignature = TransactionSignature;
