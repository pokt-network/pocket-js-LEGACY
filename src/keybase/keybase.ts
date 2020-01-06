import { Account } from "../models/account"
import * as ed25519 from "ed25519"
import { UnlockedAccount } from "../models/unlocked-account"
import * as pbkdf2 from "pbkdf2"
import { sha256 } from "js-sha256"
import * as aesjs from "aes-js"
import * as seedrandom from "seedrandom"
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
            let rng = seedrandom(passphrase, { entropy: true })
            var seed = Buffer.from(sha256(rng().toString()), "hex")
            let keyPair = ed25519.MakeKeypair(seed)
            return await this.importAccount(keyPair.privateKey, passphrase)
        } catch (err) {
            return err
        }
    }

    /**
     * @description Lists all the accounts stored in this keybase
     */
    public async listAccounts(): Promise<Array<Account>> {
        var result = new Array<Account>()
        for (let addressHex in this.accounts) {
            result.push(this.accounts[addressHex])
        }
        return result
    }

    /**
     * @description Retrieves a single account from this keybase
     * @param addressHex The address of the account to retrieve in hex string format
     */
    public async getAccount(addressHex: string): Promise<Account | Error> {
        // Validate the address
        let validationError = validateAddressHex(addressHex)
        if (validationError) {
            return validationError
        }
        let result = this.accounts[addressHex]
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
        let validationError = validateAddressHex(addressHex)
        if (validationError) {
            return validationError
        }

        var error = undefined
        let unlockedAccountOrError = await this.unlockAccountFromPersistence(
            addressHex,
            passphrase
        )
        if (typeGuard(unlockedAccountOrError, UnlockedAccount)) {
            let unlockedAccount = <UnlockedAccount>unlockedAccountOrError
            return this.removeAccountRecord(unlockedAccount)
        } else if (typeGuard(unlockedAccountOrError, Error)) {
            error = <Error>unlockedAccountOrError
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
        let validationError = validateAddressHex(addressHex)
        if (validationError) {
            return validationError
        }

        var error = undefined
        let unlockedAccountOrError = await this.unlockAccountFromPersistence(
            addressHex,
            passphrase
        )
        if (typeGuard(unlockedAccountOrError, UnlockedAccount)) {
            let unlockedAccount = <UnlockedAccount>unlockedAccountOrError

            // Remove the account record with the existing passphrase
            let errorOrUndefined = await this.removeAccountRecord(
                unlockedAccount
            )
            if (typeGuard(errorOrUndefined, Error)) {
                error = <Error>errorOrUndefined
            } else {
                let importedAccountOrError = this.importAccount(
                    unlockedAccount.privateKey,
                    newPassphrase
                )
                if (typeGuard(importedAccountOrError, Error)) {
                    error = <Error>importedAccountOrError
                }
            }
        } else if (typeGuard(unlockedAccountOrError, Error)) {
            error = <Error>unlockedAccountOrError
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
        let unlockedAccountOrError = await this.unlockAccountFromPersistence(
            addressHex,
            passphrase
        )
        if (typeGuard(unlockedAccountOrError, Error)) {
            return <Error>unlockedAccountOrError
        }
        let unlockedAccount = <UnlockedAccount>unlockedAccountOrError
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
        let isUnlocked = await this.isUnlocked(addressHex)
        if (!isUnlocked) {
            return new Error("Account is not unlocked")
        }
        try {
            let unlockedAccount = this.unlockedAccounts[addressHex]
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
        let unlockedAccountOrError = await this.unlockAccountFromPersistence(
            addressHex,
            passphrase
        )

        // Return errors if any
        if (typeGuard(unlockedAccountOrError, Error)) {
            return <Error>unlockedAccountOrError
        }

        // Cast to unlocked account
        let unlockedAccount = <UnlockedAccount>unlockedAccountOrError
        this.unlockedAccounts[unlockedAccount.addressHex] = unlockedAccount
        return undefined
    }

    /**
     * @description Locks an unlocked account back so signing payloads with it will require a passphrase
     * @param addressHex The address of the account that will be locked in hex string format
     */
    public async lockAccount(addressHex: string): Promise<Error | undefined> {
        let isUnlocked = await this.isUnlocked(addressHex)
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
            let publicKey = publicKeyFromPrivate(privateKey)

            // Generate AES key
            let key = pbkdf2.pbkdf2Sync(
                passphrase,
                sha256(passphrase),
                1,
                256 / 8
            )

            // Generate encryptedBytes Hex
            let encryptedPKHex = aesjs.utils.hex.fromBytes(
                new aesjs.ModeOfOperation.ctr(key, undefined).encrypt(
                    privateKey
                )
            )
            let account = new Account(publicKey, encryptedPKHex)
            let errorOrUndefined = await this.persistAccount(account)
            if (typeGuard(errorOrUndefined, Error)) {
                return <Error>errorOrUndefined
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
        let unlockedAccountOrError = await this.unlockAccountFromPersistence(
            addressHex,
            passphrase
        )
        if (typeGuard(unlockedAccountOrError, Error)) {
            return <Error>unlockedAccountOrError
        }
        let unlockedAccount = <UnlockedAccount>unlockedAccountOrError
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
        var error = undefined
        let account
        let accountOrError = await this.getAccount(addressHex)
        if (typeGuard(accountOrError, Account)) {
            account = <Account>accountOrError
            try {
                // Generate decryption key
                let key = pbkdf2.pbkdf2Sync(
                    passphrase,
                    sha256(passphrase),
                    1,
                    256 / 8
                )

                // Generate encryptedBytes Hex
                let encryptedPKBytes = aesjs.utils.hex.toBytes(
                    account.encryptedPrivateKeyHex
                )

                // Decrypt the private key in hex format
                let decryptedPKHex = aesjs.utils.hex.fromBytes(
                    new aesjs.ModeOfOperation.ctr(key, undefined).decrypt(
                        encryptedPKBytes
                    )
                )

                // Extract the public key from the decrypted private key
                let decryptedPublicKey = decryptedPKHex.slice(
                    decryptedPKHex.length / 2,
                    decryptedPKHex.length
                )

                // Get the address from the public key
                let decryptedAddress = addressFromPublickey(
                    Buffer.from(decryptedPublicKey, "hex")
                )

                // Check addresses to make sure the decrypted account matches the intended account
                if (account.addressHex !== decryptedAddress.toString("hex")) {
                    return new Error("Wrong passphrase for account")
                }

                // Create the corresponding UnlockedAccount object
                let unlockedAccount = new UnlockedAccount(
                    account,
                    Buffer.from(decryptedPKHex, "hex")
                )
                return unlockedAccount
            } catch (err) {
                return err
            }
        } else if (typeGuard(accountOrError, Error)) {
            error = <Error>accountOrError
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
