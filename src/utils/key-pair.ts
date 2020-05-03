/**
 * @author Luis C. de León <luis@pokt.network>
 * @description Utility functions for ed25519 keypairs
 */
import { sha256 } from "js-sha256"
import { Hex } from "./hex"
import { typeGuard } from "./type-guard"

/**
 * @description Calculates the address from a given public key
 * @param {Buffer} publicKey - Public key from which we're going to calculate the address for
 * @returns {Buffer} - Address buffer.
 */
export function addressFromPublickey(publicKey: Buffer): Buffer {
  const hash = sha256.create()
  hash.update(publicKey)
  return Buffer.from(hash.hex(), "hex").slice(0, 20)
}

/**
 * Extracts the public key from a 64-byte long ed25519 private key
 * @param {Buffer} privateKey - Private key buffer.
 * @returns {Buffer} - Public Key buffer.
 */
export function publicKeyFromPrivate(privateKey: Buffer): Buffer {
  return Buffer.from(privateKey.slice(32, privateKey.length))
}

/**
 * Validates an ed25519 private key structure
 * @param {Buffer} privateKey - Private key buffer.
 * @returns {boolean} - True or false if the private key is valid.
 */
export function validatePrivateKey(privateKey: Buffer): boolean {
  return privateKey.length === 64
}

/**
 * Validates the address for a hex string encoded representing an ed25519 keypair
 * @param {string} addressHex - Address hex.
 * @returns {Error | undefined} - Address buffer.
 */
export function validateAddressHex(addressHex: string): Error | undefined {

  if (!Hex.isHex(addressHex)) {
    return new Error("Invalid string is not hex: " + addressHex)
  } else if (addressHex.length !== 40) {
    return new Error("Invalid address length (should be 20 bytes)")
  }
  return undefined
}

/**
 * Validates an ed25519 public key structure
 * @param {Buffer | string} pubKey - Public key buffer or string.
 * @returns {boolean} - True or false if the public key is valid.
 */
export function validatePublicKey(pubKey: Buffer | string): boolean {
  if (typeGuard(pubKey, Buffer)) {
    return pubKey.length === 32
  }
  return Buffer.from(pubKey, "hex").length === 32
}
