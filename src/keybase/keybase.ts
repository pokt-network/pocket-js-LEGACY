import { Account } from "../models/account"
import * as ed25519 from "ed25519"
import { UnlockedAccount } from "../models/unlocked-account"
import * as pbkdf2 from "pbkdf2"
import { sha256 } from "js-sha256"
import * as aesjs from "aes-js"
import seedrandom from "seedrandom"
import { typeGuard } from "../utils/type-guard"
import {
  addressFromPublickey,
  publicKeyFromPrivate,
  validatePrivateKey,
  validateAddressHex
} from "../utils/key-pair"

/**
 * @author Luis C. de León <luis@pokt.network>
 * @description The Keybase class allows storage, operations and persistence of accounts.
 */
export class Keybase {
  private accounts: Record<string, Account>
  private unlockedAccounts: Record<string, UnlockedAccount>

  /**
   * // TODO: Add persistence options
   */
  constructor() {
    this.accounts = {}
    this.unlockedAccounts = {}
  }

  /**
   * @description Creates an account and stores it in the keybase
   * @param passphrase The passphrase for the account in this keybase
   */
  public async createAccount(passphrase: string): Promise<Account | Error> {
    if (passphrase.length === 0) {
      return new Error("Empty passphrase")
    }

    try {
      // Create the keypair
      const rng = seedrandom(passphrase, { entropy: true })
      const seed = Buffer.from(sha256(rng().toString()), "hex")
      const keyPair = ed25519.MakeKeypair(seed)
      return await this.importAccount(keyPair.privateKey, passphrase)
    } catch (err) {
      return err
    }
  }

  /**
   * @description Lists all the accounts stored in this keybase
   */
  public async listAccounts(): Promise<Account[]> {
    const result = new Array<Account>()
    for (const addressHex in this.accounts) {
      if (this.accounts.hasOwnProperty(addressHex)) {
        result.push(this.accounts[addressHex])
      }
    }
    return result
  }

  /**
   * @description Retrieves a single account from this keybase
   * @param addressHex The address of the account to retrieve in hex string format
   */
  public async getAccount(addressHex: string): Promise<Account | Error> {
    // Validate the address
    const validationError = validateAddressHex(addressHex)
    if (validationError) {
      return validationError
    }
    const result = this.accounts[addressHex]
    if (result) {
      return result
    } else {
      return new Error("Account not found")
    }
  }

  /**
   * @description Deletes an account stored in the keybase
   * @param addressHex The address of the account to delete in hex string format
   * @param passphrase The passphrase for the account in this keybase
   */
  public async deleteAccount(
    addressHex: string,
    passphrase: string
  ): Promise<Error | undefined> {
    const validationError = validateAddressHex(addressHex)
    if (validationError) {
      return validationError
    }

    let error
    const unlockedAccountOrError = await this.unlockAccountFromPersistence(
      addressHex,
      passphrase
    )
    if (typeGuard(unlockedAccountOrError, UnlockedAccount)) {
      const unlockedAccount = unlockedAccountOrError as UnlockedAccount
      return this.removeAccountRecord(unlockedAccount)
    } else if (typeGuard(unlockedAccountOrError, Error)) {
      error = unlockedAccountOrError as Error
    } else {
      error = new Error("Unknown error decrypting Account")
    }
    return error
  }

  /**
   *
   * @param addressHex The address of the account to update in hex string format
   * @param passphrase The passphrase of the account
   * @param newPassphrase The new passphrase that the account will be updated to
   */
  public async updateAccountPassphrase(
    addressHex: string,
    passphrase: string,
    newPassphrase: string
  ): Promise<Error | undefined> {
    // Validate the address
    const validationError = validateAddressHex(addressHex)
    if (validationError) {
      return validationError
    }

    let error
    const unlockedAccountOrError = await this.unlockAccountFromPersistence(
      addressHex,
      passphrase
    )
    if (typeGuard(unlockedAccountOrError, UnlockedAccount)) {
      const unlockedAccount = unlockedAccountOrError as UnlockedAccount

      // Remove the account record with the existing passphrase
      const errorOrUndefined = await this.removeAccountRecord(unlockedAccount)
      if (typeGuard(errorOrUndefined, Error)) {
        error = errorOrUndefined as Error
      } else {
        const importedAccountOrError = this.importAccount(
          unlockedAccount.privateKey,
          newPassphrase
        )
        if (typeGuard(importedAccountOrError, Error)) {
          error = importedAccountOrError as Error
        }
      }
    } else if (typeGuard(unlockedAccountOrError, Error)) {
      error = unlockedAccountOrError as Error
    } else {
      error = new Error("Unknown error decrypting Account")
    }
    return error
  }

  // Keybase ECDSA functions
  /**
   * @param addressHex The address of the account that will sign the payload in hex string format
   * @param passphrase The passphrase of the account
   * @param payload The payload to be signed
   */
  public async sign(
    addressHex: string,
    passphrase: string,
    payload: Buffer
  ): Promise<Buffer | Error> {
    const unlockedAccountOrError = await this.unlockAccountFromPersistence(
      addressHex,
      passphrase
    )
    if (typeGuard(unlockedAccountOrError, Error)) {
      return unlockedAccountOrError as Error
    }
    const unlockedAccount = unlockedAccountOrError as UnlockedAccount
    try {
      return ed25519.Sign(payload, unlockedAccount.privateKey)
    } catch (err) {
      return err
    }
  }

  /**
   * @description Signs a payload with an unlocked account stored in this keybase
   * @param addressHex The address of the account that will sign the payload in hex string format
   * @param payload The payload to be signed
   */
  public async signWithUnlockedAccount(
    addressHex: string,
    payload: Buffer
  ): Promise<Buffer | Error> {
    const isUnlocked = await this.isUnlocked(addressHex)
    if (!isUnlocked) {
      return new Error("Account is not unlocked")
    }
    try {
      const unlockedAccount = this.unlockedAccounts[addressHex]
      return ed25519.Sign(payload, unlockedAccount.privateKey)
    } catch (err) {
      return err
    }
  }

  /**
   * @description Verify the signature for a given payload signed by `signedPublicKey`
   * @param signerPublicKey The public key of the signer
   * @param payload The payload to be verified against the signature
   * @param signature The calculated signature for the payload
   */
  public async verifySignature(
    signerPublicKey: Buffer,
    payload: Buffer,
    signature: Buffer
  ): Promise<boolean> {
    try {
      return ed25519.Verify(payload, signature, signerPublicKey)
    } catch (err) {
      return false
    }
  }

  /**
   * @description Unlock an account for passphrase free signing of arbitrary payloads using `signWithUnlockedAccount`
   * @param addressHex The address of the account that will be unlocked in hex string format
   * @param passphrase The passphrase of the account to unlock
   */
  public async unlockAccount(
    addressHex: string,
    passphrase: string
  ): Promise<Error | undefined> {
    const unlockedAccountOrError = await this.unlockAccountFromPersistence(
      addressHex,
      passphrase
    )

    // Return errors if any
    if (typeGuard(unlockedAccountOrError, Error)) {
      return unlockedAccountOrError as Error
    }

    // Cast to unlocked account
    const unlockedAccount = unlockedAccountOrError as UnlockedAccount
    this.unlockedAccounts[unlockedAccount.addressHex] = unlockedAccount
    return undefined
  }

  /**
   * @description Locks an unlocked account back so signing payloads with it will require a passphrase
   * @param addressHex The address of the account that will be locked in hex string format
   */
  public async lockAccount(addressHex: string): Promise<Error | undefined> {
    const isUnlocked = await this.isUnlocked(addressHex)
    if (!isUnlocked) {
      return new Error("Account is not unlocked")
    }
    delete this.unlockedAccounts[addressHex]
    return undefined
  }

  /**
   * @description Returns whether or not the specified account is unlocked
   * @param addressHex The address of the account that will be verified in hex string format
   */
  public async isUnlocked(addressHex: string): Promise<boolean> {
    return this.unlockedAccounts[addressHex] ? true : false
  }

  // Import/export of accounts
  /**
   * @description Imports an account by using it's private key into this keybase
   * @param privateKey The private key of the account to be imported into this keybase
   * @param passphrase The passphrase of the account to be imported into the keybase
   */
  public async importAccount(
    privateKey: Buffer,
    passphrase: string
  ): Promise<Account | Error> {
    if (passphrase.length === 0) {
      return new Error("Empty passphrase")
    }

    if (!validatePrivateKey(privateKey)) {
      return new Error("Invalid private key")
    }
    try {
      // Parse public key
      const publicKey = publicKeyFromPrivate(privateKey)

      // Generate AES key
      const key = pbkdf2.pbkdf2Sync(passphrase, sha256(passphrase), 1, 256 / 8)

      // Generate encryptedBytes Hex
      const encryptedPKHex = aesjs.utils.hex.fromBytes(
        new aesjs.ModeOfOperation.ctr(key, undefined).encrypt(privateKey)
      )
      const account = new Account(publicKey, encryptedPKHex)
      const errorOrUndefined = await this.persistAccount(account)
      if (typeGuard(errorOrUndefined, Error)) {
        return errorOrUndefined as Error
      } else {
        return account
      }
    } catch (err) {
      return err
    }
  }

  /**
   * @description Exports an account's private key stored in this keybase
   * @param addressHex The address of the account that will be exported in hex string format
   * @param passphrase The passphrase for the account that will be exported
   */
  public async exportAccount(
    addressHex: string,
    passphrase: string
  ): Promise<Buffer | Error> {
    const unlockedAccountOrError = await this.unlockAccountFromPersistence(
      addressHex,
      passphrase
    )
    if (typeGuard(unlockedAccountOrError, Error)) {
      return unlockedAccountOrError as Error
    }
    const unlockedAccount = unlockedAccountOrError as UnlockedAccount
    return unlockedAccount.privateKey
  }

  // Private interface
  /**
   * Returns an `UnlockedAccount` object corresponding to the `Account` object stored in this keybase
   * @param addressHex The address of the account that will be used to create an `UnlockedAccount` in hex string format
   * @param passphrase The passphrase for the account that will be used
   */
  private async unlockAccountFromPersistence(
    addressHex: string,
    passphrase: string
  ): Promise<UnlockedAccount | Error> {
    let error
    const accountOrError = await this.getAccount(addressHex)
    if (typeGuard(accountOrError, Account)) {
      const account = accountOrError as Account
      try {
        // Generate decryption key
        const key = pbkdf2.pbkdf2Sync(
          passphrase,
          sha256(passphrase),
          1,
          256 / 8
        )

        // Generate encryptedBytes Hex
        const encryptedPKBytes = aesjs.utils.hex.toBytes(
          account.encryptedPrivateKeyHex
        )

        // Decrypt the private key in hex format
        const decryptedPKHex = aesjs.utils.hex.fromBytes(
          new aesjs.ModeOfOperation.ctr(key, undefined).decrypt(
            encryptedPKBytes
          )
        )

        // Extract the public key from the decrypted private key
        const decryptedPublicKey = decryptedPKHex.slice(
          decryptedPKHex.length / 2,
          decryptedPKHex.length
        )

        // Get the address from the public key
        const decryptedAddress = addressFromPublickey(
          Buffer.from(decryptedPublicKey, "hex")
        )

        // Check addresses to make sure the decrypted account matches the intended account
        if (account.addressHex !== decryptedAddress.toString("hex")) {
          return new Error("Wrong passphrase for account")
        }

        // Create the corresponding UnlockedAccount object
        const unlockedAccount = new UnlockedAccount(
          account,
          Buffer.from(decryptedPKHex, "hex")
        )
        return unlockedAccount
      } catch (err) {
        return err
      }
    } else if (typeGuard(accountOrError, Error)) {
      error = accountOrError as Error
    } else {
      error = new Error("Unknown error getting account")
    }
    return error
  }

  // Internal persistence interface
  /**
   * // TODO: Refactor this with actual persistence mechanism
   * Persists an account in the storage of this keybase
   * @param account
   */
  private async persistAccount(account: Account): Promise<Error | undefined> {
    this.accounts[account.addressHex] = account
    return undefined
  }

  /**
   * // TODO: Refactor this with actual persistence mechanism
   * Removes an account from the storage of this keybase
   * @param account
   */
  private async removeAccountRecord(
    account: Account
  ): Promise<Error | undefined> {
    delete this.accounts[account.addressHex]
    return undefined
  }
}
