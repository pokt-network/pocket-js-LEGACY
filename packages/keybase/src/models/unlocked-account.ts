/**
 * @author Luis C. de León <luis@pokt.network>
 */
import { Account } from "./account"

/**
 * @description Represents an account made from an ed25519 keypair using an encrypted private key and a plain one
 */
export class UnlockedAccount extends Account {
  public readonly privateKey: Buffer

  /**
   * @description Constructor for UnlockedAccount
   * @param {Account} account - The Account object on which to base this UnlockedAccount
   * @param {Buffer} privateKey - The raw private key of the Account object
   */
  constructor(account: Account, privateKey: Buffer) {
    super(account.publicKey, account.encryptedPrivateKeyHex)
    this.privateKey = privateKey
  }
}
