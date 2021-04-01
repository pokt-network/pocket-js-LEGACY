/**
 * @author Luis C. de León <luis@pokt.network>
 */
import { addressFromPublickey } from "../../utils/key-pair"

/**
 * @description Represents an account made from an ed25519 keypair using an encrypted private key
 */
export class Account {
  public readonly publicKey: Buffer
  public readonly encryptedPrivateKeyHex: string
  public readonly address: Buffer
  public readonly addressHex: string

  /**
   * @description Constructor for this class
   * @param {buffer} publicKey - Public key of the keypair
   * @param {string} encryptedPrivateKeyHex - The encrypted private key in hex string format
   */
  constructor(publicKey: Buffer, encryptedPrivateKeyHex: string) {
    this.publicKey = publicKey
    this.encryptedPrivateKeyHex = encryptedPrivateKeyHex
    this.address = addressFromPublickey(this.publicKey)
    this.addressHex = this.address.toString("hex")
  }
}
