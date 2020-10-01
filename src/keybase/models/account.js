"use strict";
exports.__esModule = true;
/**
 * @author Luis C. de León <luis@pokt.network>
 */
var key_pair_1 = require("../../utils/key-pair");
/**
 * @description Represents an account made from an ed25519 keypair using an encrypted private key
 */
var Account = /** @class */ (function () {
    /**
     * @description Constructor for this class
     * @param publicKey Public key of the keypair
     * @param encryptedPrivateKeyHex The encrypted private key in hex string format
     */
    function Account(publicKey, encryptedPrivateKeyHex) {
        this.publicKey = publicKey;
        this.encryptedPrivateKeyHex = encryptedPrivateKeyHex;
        this.address = key_pair_1.addressFromPublickey(this.publicKey);
        this.addressHex = this.address.toString("hex");
    }
    return Account;
}());
exports.Account = Account;
