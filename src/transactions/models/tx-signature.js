"use strict";
exports.__esModule = true;
var belt_1 = require("@tendermint/belt");
/**
 * Represents a given signature for a Transaction
 */
var TxSignature = /** @class */ (function () {
    /**
     * @param pubKey {Buffer} public key of the signer
     * @param signature {Buffer} the signature
     */
    function TxSignature(pubKey, signature) {
        this.PUBLIC_KEY_TYPE = "crypto/ed25519_public_key";
        this.pubKey = pubKey;
        this.signature = signature;
    }
    /**
     * Encodes the object to it's Amino encodable form
     */
    TxSignature.prototype.toPosmintStdSignature = function () {
        return {
            pub_key: {
                type: this.PUBLIC_KEY_TYPE,
                value: belt_1.bytesToBase64(this.pubKey).toString()
            },
            signature: belt_1.bytesToBase64(this.signature).toString()
        };
    };
    return TxSignature;
}());
exports.TxSignature = TxSignature;
