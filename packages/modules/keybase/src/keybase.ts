import { IKeybase } from './i-keybase';
import { Account } from "./models/account"
import Sodium from 'libsodium-wrappers'
import { UnlockedAccount } from "./models/unlocked-account"
import pbkdf2 from "pbkdf2"
import { sha256 } from "js-sha256"
import aesjs from "aes-js"
import {
    typeGuard,
    Hex,
    addressFromPublickey,
    publicKeyFromPrivate,
    validatePrivateKey,
    validateAddressHex
} from "@pokt-network/pocket-js-utils"
import { IKVStore, InMemoryKVStore } from "@pokt-network/pocket-js-storage"
import * as cryptoLib from 'crypto'
import scrypt from "scrypt-js"

/**
 * @author Luis C. de León <luis@pokt.network>
 * @description The Keybase class allows storage, operations and persistence of accounts.
 */
export class Keybase implements IKeybase {
    /**
     * Utility function to sign an arbitrary payload with a valid ed25519 private key
     *
     * @param {Buffer} privateKey - The private key to sign with
     * @param {Buffer} payload - Arbitrary payload to sign
     * @returns {Buffer | Error} The signature or an Error
     * @memberof Keybase
     */
    public static async signWith(
        privateKey: Buffer,
        payload: Buffer
    ): Promise<Buffer | Error> {
        try {
            // We first wait for Sodium to be ready
            await Sodium.ready
            return Buffer.from(Sodium.crypto_sign_detached(payload, privateKey))
        } catch (err) {
            return err as Error
        }
    }
    /* eslint-disable */
    private ACCOUNT_STORE_PREFIX = "account_"
    private ACCOUNT_INDEX_KEY = "account_index"
    private store: IKVStore
    private unlockedAccounts: Record<string, UnlockedAccount>
    /* eslint-enable */

    /**
     * @description Constructor for the Keybase class
     * @param {IKVStore} store - (Optional) The IKVStore to use to store encrypted accounts
     * @memberof Keybase
     */
    constructor(store?: IKVStore) {
        this.store = store ?? new InMemoryKVStore()
        this.unlockedAccounts = {}
    }

    /**
     * @description Creates an account and stores it in the keybase
     * @param {string} passphrase The passphrase for the account in this keybase
     * @returns {Promise<Account | Error>} The the new account or an Error
     * @memberof Keybase
     */
    public async createAccount(passphrase: string): Promise<Account | Error> {
        if (passphrase.length === 0) {
            return new Error("Empty passphrase")
        }

        try {
            // Create the keypair
            await Sodium.ready
            const keypair = Sodium.crypto_sign_keypair()
            return this.importAccount(Buffer.from(keypair.privateKey), passphrase)
        } catch (err) {
            return err as Error
        }
    }

    /**
     * @description Lists all the accounts stored in this keybase
     * @returns {Account | Error} The the new account or an Error
     * @memberof Keybase
     */
    public listAccounts(): Account[] | Error {
        const result = new Array<Account>()
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        let accountIndex = this.store.get(this.ACCOUNT_INDEX_KEY)
        if (typeGuard(accountIndex, Array)) {
            accountIndex = accountIndex as string[]
        } else if (accountIndex === undefined) {
            accountIndex = []
        } else {
            return new Error("Error fetching account index")
        }
        for (const index in accountIndex) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            const accountOrError = this.getAccount(accountIndex[index])
            if (typeGuard(accountOrError, Account)) {
                result.push(accountOrError )
            } else {
                return accountOrError 
            }
        }
        return result
    }

    /**
     * @description Retrieves a single account from this keybase
     * @param {string} addressHex - The address of the account to retrieve in hex string format
     * @returns {Account | Error} - The the new account or an Error
     * @memberof Keybase
     */
    public getAccount(addressHex: string): Account | Error {
        return this.getAccountFromStore(addressHex)
    }

    /**
     * Generates a one time use UnlockedAccount from a persisted Account
     *
     * @param {string} addressHex - The address hex for the account
     * @param {string} passphrase - The passphrase for the account
     * @returns {UnlockedAccount | Error} The UnlockedAccount object or an Error
     * @memberof Keybase
     */
    public getUnlockedAccount(addressHex: string, passphrase: string): UnlockedAccount | Error {
        return this.unlockAccountFromPersistence(addressHex, passphrase)
    }

    /**
     * @description Deletes an account stored in the keybase
     * @param {string} addressHex - The address of the account to delete in hex string format
     * @param {string} passphrase - The passphrase for the account in this keybase
     * @returns {Error | undefined} undefined if the account was deleted or an Error
     * @memberof Keybase
     */
    public deleteAccount(
        addressHex: string,
        passphrase: string
    ): Error | undefined {
        const validationError = validateAddressHex(addressHex)
        if (validationError) {
            return validationError
        }

        let error
        const unlockedAccountOrError = this.unlockAccountFromPersistence(
            addressHex,
            passphrase
        )
        if (typeGuard(unlockedAccountOrError, UnlockedAccount)) {
            const unlockedAccount = unlockedAccountOrError 
            return this.removeAccountRecord(unlockedAccount)
        } else if (typeGuard(unlockedAccountOrError, Error)) {
            error = unlockedAccountOrError 
        } else {
            error = new Error("Unknown error decrypting Account")
        }
        return error
    }

    /**
     *
     * @param {string} addressHex The address of the account to update in hex string format
     * @param {string} passphrase The passphrase of the account
     * @param {string} newPassphrase The new passphrase that the account will be updated to
     * @returns {Error | undefined} undefined if the account passphrase was updated or an Error
     * @memberof Keybase
     */
    public updateAccountPassphrase(
        addressHex: string,
        passphrase: string,
        newPassphrase: string
    ): Error | undefined {
        // Validate the address
        const validationError = validateAddressHex(addressHex)
        if (validationError) {
            return validationError
        }

        let error
        const unlockedAccountOrError = this.unlockAccountFromPersistence(
            addressHex,
            passphrase
        )
        if (typeGuard(unlockedAccountOrError, UnlockedAccount)) {
            const unlockedAccount = unlockedAccountOrError 

            // Remove the account record with the existing passphrase
            const errorOrUndefined = this.removeAccountRecord(
                unlockedAccount
            )
            if (typeGuard(errorOrUndefined, Error)) {
                error = errorOrUndefined 
            } else {
                const importedAccountOrError = this.importAccount(
                    unlockedAccount.privateKey,
                    newPassphrase
                )
                if (typeGuard(importedAccountOrError, Error)) {
                    error = importedAccountOrError
                }
            }
        } else if (typeGuard(unlockedAccountOrError, Error)) {
            error = unlockedAccountOrError 
        } else {
            error = new Error("Unknown error decrypting Account")
        }
        return error
    }

    // Keybase ECDSA functions
    /**
     * @param {string} addressHex The address of the account that will sign the payload in hex string format
     * @param {string} passphrase The passphrase of the account
     * @param {Buffer} payload The payload to be signed
     * @returns {Promise<Buffer | Error>} Signature buffer or an Error
     * @memberof Keybase
     */
    public async sign(
        addressHex: string,
        passphrase: string,
        payload: Buffer
    ): Promise<Buffer | Error> {
        const unlockedAccountOrError = this.unlockAccountFromPersistence(
            addressHex,
            passphrase
        )
        if (typeGuard(unlockedAccountOrError, Error)) {
            return unlockedAccountOrError 
        }
        const unlockedAccount = unlockedAccountOrError 
        try {
            await Sodium.ready
            return Buffer.from(Sodium.crypto_sign_detached(payload, unlockedAccount.privateKey))
        } catch (err) {
            return err as Error
        }
    }

    /**
     * @description Signs a payload with an unlocked account stored in this keybase
     * @param {string} addressHex The address of the account that will sign the payload in hex string format
     * @param {Buffer} payload The payload to be signed
     * @returns {Promise<Buffer | Error>} Signature buffer or an Error
     * @memberof Keybase
     */
    public async signWithUnlockedAccount(
        addressHex: string,
        payload: Buffer
    ): Promise<Buffer | Error> {
        // Validate the address
        const validationError = validateAddressHex(addressHex)
        if (validationError) {
            return validationError
        }

        const isUnlocked = this.isUnlocked(addressHex)
        if (!isUnlocked) {
            return new Error("Account is not unlocked")
        }
        try {
            const unlockedAccount = this.unlockedAccounts[addressHex]
            await Sodium.ready
            return Buffer.from(Sodium.crypto_sign_detached(payload, unlockedAccount.privateKey))
        } catch (err) {
            return err as Error
        }
    }

    /**
     * @description Verify the signature for a given payload signed by `signedPublicKey`
     * @param {Buffer} signerPublicKey The public key of the signer
     * @param {Buffer} payload The payload to be verified against the signature
     * @param {Buffer} signature The calculated signature for the payload
     * @returns {Promise<Buffer | Error>} Signature buffer or an Error
     * @memberof Keybase
     */
    public async verifySignature(
        signerPublicKey: Buffer,
        payload: Buffer,
        signature: Buffer
    ): Promise<boolean> {
        try {
            await Sodium.ready
            return Sodium.crypto_sign_verify_detached(signature, payload, signerPublicKey)
        } catch (err) {
            return false
        }
    }

    /**
     * @description Unlock an account for passphrase free signing of arbitrary payloads using `signWithUnlockedAccount`
     * @param {string} addressHex The address of the account that will be unlocked in hex string format
     * @param {string} passphrase The passphrase of the account to unlock
     * @param {number} unlockPeriod The amount of time (in ms) the account is going to be unlocked, defaults to 10 minutes. Use 0 to keep it unlocked indefinetely
     * @returns {Error | undefined} Undefined if account got unlocked or an Error
     * @memberof Keybase
     */
    public unlockAccount(
        addressHex: string,
        passphrase: string,
        unlockPeriod = 600000
    ): Error | undefined {
        const unlockedAccountOrError = this.unlockAccountFromPersistence(
            addressHex,
            passphrase
        )

        // Return errors if any
        if (typeGuard(unlockedAccountOrError, Error)) {
            return unlockedAccountOrError 
        }

        if (unlockPeriod > 0) {
            setTimeout(
                function (keybase, addressHex) {
                    keybase.lockAccount(addressHex)
                },
                unlockPeriod,
                this,
                addressHex
            )
        }

        // Cast to unlocked account
        const unlockedAccount = unlockedAccountOrError 
        this.unlockedAccounts[unlockedAccount.addressHex] = unlockedAccount
        return undefined
    }

    /**
     * @description Locks an unlocked account back so signing payloads with it will require a passphrase
     * @param {string} addressHex The address of the account that will be locked in hex string format
     * @returns {Error | undefined} Undefined if account got locked or an Error
     * @memberof Keybase
     */
    public lockAccount(addressHex: string): Error | undefined {
        // Validate the address
        const validationError = validateAddressHex(addressHex)
        if (validationError) {
            return validationError
        }

        const isUnlocked = this.isUnlocked(addressHex)
        if (!isUnlocked) {
            return new Error("Account is not unlocked")
        }
        delete this.unlockedAccounts[addressHex]
        return undefined
    }

    /**
     * @description Returns whether or not the specified account is unlocked
     * @param {string} addressHex The address of the account that will be verified in hex string format
     * @returns {boolean} True or false if the account is unlocked
     * @memberof Keybase
     */
    public isUnlocked(addressHex: string): boolean {
        return this.unlockedAccounts[addressHex] ? true : false
    }

    // Import/export of accounts

    /**
     * @description Imports an account by using it's private key into this keybase
     * @param {Buffer} privateKey The private key of the account to be imported into this keybase
     * @param {string} passphrase The passphrase of the account to be imported into the keybase
     * @returns {Account | Error} Imported account or an Error
     * @memberof Keybase
     */
    public importAccount(
        privateKey: Buffer,
        passphrase: string
    ): Account | Error {
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
            const key = pbkdf2.pbkdf2Sync(
                passphrase,
                sha256(passphrase),
                1,
                256 / 8
            )

            // Generate encryptedBytes Hex
            const encryptedPKHex = aesjs.utils.hex.fromBytes(
                new aesjs.ModeOfOperation.ctr(key, undefined).encrypt(
                    privateKey
                )
            )
            const account = new Account(publicKey, encryptedPKHex)
            const errorOrUndefined = this.persistAccount(account)
            if (typeGuard(errorOrUndefined, Error)) {
                return errorOrUndefined 
            } else {
                return account
            }
        } catch (err) {
            return err
        }
    }

    /**
     * @description Imports and Unlocks an account by using it's private key
     * @param {Buffer} privateKey The private key of the account to be imported into this keybase
     * @param {string} passphrase The passphrase for the account to be imported into the keybase
     * @returns {Promise<UnlockedAccount | Error>} Unlocked account or an Error
     * @memberof Keybase
     */
     public async importAndUnlockAccount(
        privateKey: Buffer,
        passphrase: string
    ): Promise<UnlockedAccount | Error> {
        if (passphrase.length === 0) {
            return new Error("Empty passphrase")
        }

        if (!validatePrivateKey(privateKey)) {
            return new Error("Invalid private key")
        }
        try {
            const importedAccountOrError = await this.importAccount(privateKey, passphrase)

            if (typeGuard(importedAccountOrError, Error)) {
                return importedAccountOrError
            }

            const unlockedAccountOrError = await this.getUnlockedAccount(importedAccountOrError.addressHex, passphrase)

            if (typeGuard(unlockedAccountOrError, Error)) {
                return unlockedAccountOrError
            }

            return unlockedAccountOrError
        } catch (err) {
            return err
        }
    }

    /**
     * @description Exports an account's private key stored in this keybase
     * @param {string} addressHex The address of the account that will be exported in hex string format
     * @param {string} passphrase The passphrase for the account that will be exported
     * @returns {Buffer | Error} Exported account buffer or an Error
     * @memberof Keybase
     */
    public exportAccount(
        addressHex: string,
        passphrase: string
    ): Buffer | Error {
        const unlockedAccountOrError = this.unlockAccountFromPersistence(
            addressHex,
            passphrase
        )
        if (typeGuard(unlockedAccountOrError, Error)) {
            return unlockedAccountOrError 
        }
        const unlockedAccount = unlockedAccountOrError 
        return unlockedAccount.privateKey
    }
    /**
     * @description Creates a Portable Private Key(PPK) using an Account
     * @param {string} addressHex - Account's address hex.
     * @param {string} password - Desired password for the PPK.
     * @param {string} hint - (Optional) Private key hint.
     * @param {string} passphrase - Passphrase to unlock the account in the keybase.
     * @returns {string | Error} 
     * @memberof Keybase
     */
    public exportPPKfromAccount(
        addressHex: string,
        password: string,
        hint = "",
        passphrase: string
    ): string | Error {
        // Verify mandatory parameters
        if (password.length <= 0 || passphrase.length <= 0) {
            return new Error("Wrong password or passphrase format, please try again with valid information.")
        }
        // Unlock the account
        const unlockedAccountOrError = this.getUnlockedAccount(addressHex, passphrase)
        if (!typeGuard(unlockedAccountOrError, Error)) {
            // Get the PPK
            const ppkStrOrError = this.exportPPK(unlockedAccountOrError.privateKey.toString("hex"), password, hint)
            // Return the ppk or error
            return ppkStrOrError
        }else {
            return unlockedAccountOrError
        }
    }
    /**
     * @description Creates a Portable Private Key(PPK) by exporting to an armored JSON
     * @param {string} privateKey - Account raw private key.
     * @param {string} password - Desired password for the PPK.
     * @param {string} hint - (Optional) Private key hint.
     * @returns {string | Error} 
     * @memberof Keybase
     */
    public exportPPK(
        privateKey: string,
        password: string,
        hint = ""
    ): string | Error {
        // Check parameters
        if (privateKey.length <= 0 || password.length <= 0) {
            return new Error("Invalid export PPK properties, please try again with valid information.")
        }
        // Constants
        const scryptHashLength = 32
        const scryptOptions = {
            n: 32768,
            r: 8,
            p: 1,
            maxmem: 4294967290
        }
        const secParam = 12
        const algorithm = "aes-256-gcm"
        try {
            // Generate the salt using the secParam
            const salt = cryptoLib.randomBytes(16)
            const scryptHash = scrypt.syncScrypt(Buffer.from(password, "utf8"), salt, scryptOptions.n, scryptOptions.r, scryptOptions.p, scryptHashLength)
            // Create the nonce from the first 12 bytes of the sha256 Scrypt hash
            const scryptHashBuffer = Buffer.from(scryptHash)
            const iv = Buffer.allocUnsafe(secParam)
            scryptHashBuffer.copy(iv, 0, 0, secParam)
            // Generate ciphertext by using the privateKey, nonce and sha256 Scrypt hash
            const cipher = cryptoLib.createCipheriv(algorithm, scryptHashBuffer, iv)
            let cipherText = cipher.update(privateKey, "utf8", "hex")
            cipherText += cipher.final("hex")
            // Concatenate the ciphertext final + auth tag
            cipherText = cipherText + cipher.getAuthTag().toString("hex")
            // Returns the Armored JSON string
            return JSON.stringify({
                kdf: "scrypt",
                salt: salt.toString("hex"),
                secparam: secParam.toString(),
                hint: hint,
                ciphertext: Buffer.from(cipherText, "hex").toString("base64")
            })
        } catch (error) {
            return error
        }
    }
    /**
     * @description Imports a Portable Private Key(PPK) an armored JSON and stores in the keybase
     * @param {string} password - Desired password for the PPK.
     * @param {string} salt - Salt hex value.
     * @param {string} secParam - Security param.
     * @param {string} hint - (Optional) ppk hint
     * @param {string} cipherText - Generated ciphertext.
     * @param {string} passphrase - Passphrase to store in the keybase.
     * @returns {Account | Error} 
     * @memberof Keybase
     */
    public importPPK(
        password: string,
        salt: string,
        secParam = 12,
        hint = "",
        cipherText: string,
        passphrase: string
    ): Account | Error {
        const kdf = "scrypt"
        // Check the parameters
        if (password.length === 0 ||
            passphrase.length === 0
        ) {
            return new Error("The password or passphrase is invalid.")
        }else {
            // Create a JSON string using the parameters
            const jsonStr = JSON.stringify({
                kdf: kdf,
                salt: salt,
                secparam: secParam,
                hint: hint,
                ciphertext: cipherText
            })
            // Validate the jsonStr
            if (!this.validatePPKJSON(jsonStr)) return new Error("Failed to validate the ppk information, please try again with valid information.")
            // Create ppk
            const ppkOrError = this.importPPKFromJSON(password, jsonStr, passphrase)
            // Return PPK or Error
            return ppkOrError
        }
    }
    /**
     * @description Imports a Portable Private Key(PPK) an armored JSON and stores in the keybase
     * @param {string} password - Desired password for the PPK.
     * @param {string} jsonStr - Armored JSON with the PPK information.
     * @param {string} passphrase - Desired passphrase to store the account in the keybase.
     * @returns {Account | Error} 
     * @memberof Keybase
     */
    public importPPKFromJSON(
        password: string,
        jsonStr: string,
        passphrase: string
    ): Account | Error {
        if (password.length === 0 || 
            !this.validatePPKJSON(jsonStr) || 
            passphrase.length === 0) {
            return new Error("One or more parameters are empty strings.")
        }
        try {
            // Constants
            const jsonObject = JSON.parse(jsonStr)
            const scryptHashLength = 32
            const ivLength = Number(jsonObject.secparam)
            const tagLength = 16
            const algorithm = "aes-256-gcm"
            const scryptOptions = {
                n: 32768,
                r: 8,
                p: 1,
                maxmem: 4294967290
            }
            // Retrieve the salt
            const decryptSalt = Buffer.from(jsonObject.salt, "hex")
            // Scrypt hash
            const scryptHash = scrypt.syncScrypt(Buffer.from(password, "utf8"), decryptSalt, scryptOptions.n, scryptOptions.r, scryptOptions.p, scryptHashLength)
            // Create a buffer from the ciphertext
            const inputBuffer = Buffer.from(jsonObject.ciphertext, 'base64')

            // Create empty iv, tag and data constants
            const iv = scryptHash.slice(0, ivLength)
            const tag = inputBuffer.slice(inputBuffer.length - tagLength)
            const data = inputBuffer.slice(0, inputBuffer.length - tagLength)

            // Create the decipher
            const decipher = cryptoLib.createDecipheriv(algorithm, Buffer.from(scryptHash), iv)
            // Set the auth tag
            decipher.setAuthTag(tag)
            // Update the decipher with the data to utf8
            let result = decipher.update(data, undefined, "utf8")
            result += decipher.final("utf8")

            // Return the imported account or error
            return this.importAccount(Buffer.from(result, "hex"), passphrase)
        } catch (error) {
            return error
        }
    }

    // Private interface
    /**
     * Returns an `UnlockedAccount` object corresponding to the `Account` object stored in this keybase
     *
     * @param {string} addressHex The address of the account that will be used to create an `UnlockedAccount` in hex string format
     * @param {string} passphrase The passphrase for the account that will be used
     * @returns {UnlockedAccount | Error} Unlocked account or an Error
     * @memberof Keybase
     */
    private unlockAccountFromPersistence(
        addressHex: string,
        passphrase: string
    ): UnlockedAccount | Error {
        // Validate the address
        const validationError = validateAddressHex(addressHex)
        if (validationError) {
            return validationError
        }

        let error
        const accountOrError = this.getAccount(addressHex)
        if (typeGuard(accountOrError, Account)) {
            const account = accountOrError 
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
            error = accountOrError 
        } else {
            error = new Error("Unknown error getting account")
        }
        return error
    }

    // Internal persistence interface
    /**
     * Persists an account in the storage of this keybase
     *
     * @param {Account} account
     * @returns {Buffer | Error} Signature buffer or an Error
     * @memberof Keybase
     */
    private persistAccount(account: Account): Error | undefined {
        // Create the store key
        const accountKey = this.generateAccountStoreKey(account)

        // Add the account to the store
        this.store.add(accountKey, account)

        // Add the new key into the index
        let accountIndex = this.store.get(this.ACCOUNT_INDEX_KEY)
        if (typeGuard(accountIndex, Array)) {
            accountIndex = accountIndex as string[]
        } else if (accountIndex === undefined) {
            accountIndex = []
        } else {
            return new Error("Error fetching the account index")
        }

        // Push the address hex into the index
        accountIndex.push(account.addressHex)

        // Persist the index to the store
        this.store.add(this.ACCOUNT_INDEX_KEY, accountIndex)

        // Return undefined for no errors
        return undefined
    }

    /**
     * Removes an account from the storage of this keybase
     *
     * @param {Account} account
     * @returns {Error | undefined} Undefined if the account was removed or an Error
     * @memberof Keybase
     */
    private removeAccountRecord(
        account: Account
    ): Error | undefined {
        // Create the store key
        const accountKey = this.generateAccountStoreKey(account)

        // Remove the account from the store
        this.store.remove(accountKey)

        // Remove the account key from the index
        let accountIndex = this.store.get(this.ACCOUNT_INDEX_KEY)
        if (typeGuard(accountIndex, Array)) {
            accountIndex = accountIndex as string[]
            const index = accountIndex.indexOf(account.addressHex, 0)
            if (index > -1) {
                accountIndex.splice(index, 1)
            }

            // Persist the index to the store
            this.store.add(this.ACCOUNT_INDEX_KEY, accountIndex)
        }

        // Return undefined for no errors
        return undefined
    }

    /**
     * Gets a properly parsed Account object from the store
     *
     * @param {string} addressHex The address of the account in hex format
     * @returns {Account | Error} Account from store or an Error
     * @memberof Keybase
     */
    private getAccountFromStore(
        addressHex: string
    ): Account | Error {
        let result: Account | Error

        // Validate the address
        const validationError = validateAddressHex(addressHex)
        if (validationError) {
            return validationError
        }

        // Attempt to fetch the account from the store
        const account = this.store.get(
            this.generateAccountStoreKeyFromAddressHex(addressHex)
        )

        // Verify the account fetched if any
        if (account === undefined) {
            result = new Error("Account not found")
        } else if (typeGuard(account, Account)) {
            result = account 
        } else {
            result = new Error("Error fetching account from store")
        }

        return result
    }

    /**
     * Generates a key to be used in the IKVStore for this keybase instance
     *
     * @param {Account} account The account for which the key wants to be generated for
     * @returns {string} Account store key value
     * @memberof Keybase
     */
    private generateAccountStoreKey(account: Account): string {
        return this.ACCOUNT_STORE_PREFIX + account.addressHex
    }

    /**
     * Generates a key to be used in the IKVStore for this keybase instance from the address of
     * the account in hex format
     *
     * @param {string} addressHex The account for which the key wants to be generated for
     * @returns {string} Generated Account store key.
     * @memberof Keybase
     */
    private generateAccountStoreKeyFromAddressHex(addressHex: string): string {
        return this.ACCOUNT_STORE_PREFIX + addressHex
    }

    /**
     * Validates the PPK json string properties
     *
     * @param {string} jsonStr - JSON String holding the ppk information.
     * @returns {boolean} True or false.
     * @memberof Keybase
     */
    private validatePPKJSON(jsonStr: string): boolean{
        const jsonObject = JSON.parse(jsonStr)
        // Check if undefined
        if (jsonObject.kdf === undefined ||
            jsonObject.salt === undefined ||
            jsonObject.secparam === undefined ||
            jsonObject.ciphertext === undefined
        ) {
            return false
        }
        // Validate the properties
        if (jsonObject.kdf !== "scrypt" ||
            !Hex.isHex(jsonObject.salt) ||
            jsonObject.secparam <= 0 ||
            jsonObject.ciphertext.length <= 0
        ) {
            return false
        }
        return true
    }
}
