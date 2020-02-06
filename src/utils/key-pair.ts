/**
 * @author Luis C. de León <luis@pokt.network>
 * @description Utility functions for ed25519 keypairs
 */
import { sha256 } from "js-sha256"
import { Hex } from "./hex"

/**
 * @description Calculates the address from a given public key
 * @param publicKey Public key from which we're going to calculate the address for
 */
export function addressFromPublickey(publicKey: Buffer): Buffer {
  const hash = sha256.create()
  hash.update(publicKey)
  return Buffer.from(hash.hex(), "hex").slice(0, 20)
}

/**
 * Extracts the public key from a 64-byte long ed25519 private key
 * @param privateKey
 */
export function publicKeyFromPrivate(privateKey: Buffer): Buffer {
  return Buffer.from(privateKey.slice(32, privateKey.length))
}

/**
 * Validates an ed25519 private key structure
 * @param privateKey
 */
export function validatePrivateKey(privateKey: Buffer): boolean {
  return privateKey.length === 64
}

/**
 * Validates the address for a hex string encoded representing an ed25519 keypair
 * @param addressHex
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
 * @param pubKey 
 */
export function validatePublicKey(pubKey: Buffer): boolean {
  return pubKey.length === 32
}
