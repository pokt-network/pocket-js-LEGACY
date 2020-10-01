"use strict";
exports.__esModule = true;
/**
 * @author Luis C. de León <luis@pokt.network>
 * @description Utility functions for ed25519 keypairs
 */
var js_sha256_1 = require("js-sha256");
var hex_1 = require("./hex");
/**
 * @description Calculates the address from a given public key
 * @param {Buffer} publicKey - Public key from which we're going to calculate the address for
 * @returns {Buffer} - Address buffer.
 */
function addressFromPublickey(publicKey) {
    var hash = js_sha256_1.sha256.create();
    hash.update(publicKey);
    return Buffer.from(hash.hex(), "hex").slice(0, 20);
}
exports.addressFromPublickey = addressFromPublickey;
/**
 * Extracts the public key from a 64-byte long ed25519 private key
 * @param {Buffer} privateKey - Private key buffer.
 * @returns {Buffer} - Public Key buffer.
 */
function publicKeyFromPrivate(privateKey) {
    return Buffer.from(privateKey.slice(32, privateKey.length));
}
exports.publicKeyFromPrivate = publicKeyFromPrivate;
/**
 * Validates an ed25519 private key structure
 * @param {Buffer} privateKey - Private key buffer.
 * @returns {boolean} - True or false if the private key is valid.
 */
function validatePrivateKey(privateKey) {
    return privateKey.length === 64;
}
exports.validatePrivateKey = validatePrivateKey;
/**
 * Validates the address for a hex string encoded representing an ed25519 keypair
 * @param {string} addressHex - Address hex.
 * @returns {Error | undefined} - Address buffer.
 */
function validateAddressHex(addressHex) {
    if (!hex_1.Hex.isHex(addressHex)) {
        return new Error("Invalid string is not hex: " + addressHex);
    }
    else if (addressHex.length !== 40) {
        return new Error("Invalid address length (should be 20 bytes)");
    }
    return undefined;
}
exports.validateAddressHex = validateAddressHex;
/**
 * Validates an ed25519 public key structure
 * @param {Buffer} pubKey - Public key buffer.
 * @returns {boolean} - True or false if the public key is valid.
 */
function validatePublicKey(pubKey) {
    return pubKey.length === 32;
}
exports.validatePublicKey = validatePublicKey;
