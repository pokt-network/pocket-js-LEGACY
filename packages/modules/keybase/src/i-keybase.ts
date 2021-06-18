import { Account } from "./models/account"
import { UnlockedAccount } from "./models/unlocked-account"

/**
 * Interface indicating all MsgTypes possible in a Pocket Network transaction and a function to submit the transaction to the network
 */
export interface IKeybase {
    
    /**
     * @description Creates an account and stores it in the keybase
     * @param {string} passphrase The passphrase for the account in this keybase
     * @returns {Promise<Account | Error>} The the new account or an Error
     * @memberof Keybase
     */
    createAccount(passphrase: string): Promise<Account | Error>
    
    /**
     * @description Lists all the accounts stored in this keybase
     * @returns {Account | Error} The the new account or an Error
     * @memberof Keybase
     */
    listAccounts(): Account[] | Error 

    /**
     * @description Retrieves a single account from this keybase
     * @param {string} addressHex - The address of the account to retrieve in hex string format
     * @returns {Account | Error} - The the new account or an Error
     * @memberof Keybase
     */
    getAccount(addressHex: string): Account | Error

    /**
     * Generates a one time use UnlockedAccount from a persisted Account
     *
     * @param {string} addressHex - The address hex for the account
     * @param {string} passphrase - The passphrase for the account
     * @returns {UnlockedAccount | Error} The UnlockedAccount object or an Error
     * @memberof Keybase
     */
    getUnlockedAccount(addressHex: string, passphrase: string): UnlockedAccount | Error

    /**
     * @description Deletes an account stored in the keybase
     * @param {string} addressHex - The address of the account to delete in hex string format
     * @param {string} passphrase - The passphrase for the account in this keybase
     * @returns {Error | undefined} undefined if the account was deleted or an Error
     * @memberof Keybase
     */
    deleteAccount(
        addressHex: string,
        passphrase: string
    ): Error | undefined

    /**
     *
     * @param {string} addressHex The address of the account to update in hex string format
     * @param {string} passphrase The passphrase of the account
     * @param {string} newPassphrase The new passphrase that the account will be updated to
     * @returns {Error | undefined} undefined if the account passphrase was updated or an Error
     * @memberof Keybase
     */
    updateAccountPassphrase(
        addressHex: string,
        passphrase: string,
        newPassphrase: string
    ): Error | undefined

    /**
     * @param {string} addressHex The address of the account that will sign the payload in hex string format
     * @param {string} passphrase The passphrase of the account
     * @param {Buffer} payload The payload to be signed
     * @returns {Promise<Buffer | Error>} Signature buffer or an Error
     * @memberof Keybase
     */
    sign(
        addressHex: string,
        passphrase: string,
        payload: Buffer
    ): Promise<Buffer | Error>

    /**
     * @description Signs a payload with an unlocked account stored in this keybase
     * @param {string} addressHex The address of the account that will sign the payload in hex string format
     * @param {Buffer} payload The payload to be signed
     * @returns {Promise<Buffer | Error>} Signature buffer or an Error
     * @memberof Keybase
     */
    signWithUnlockedAccount(
        addressHex: string,
        payload: Buffer
    ): Promise<Buffer | Error>

    /**
     * @description Verify the signature for a given payload signed by `signedPublicKey`
     * @param {Buffer} signerPublicKey The public key of the signer
     * @param {Buffer} payload The payload to be verified against the signature
     * @param {Buffer} signature The calculated signature for the payload
     * @returns {Promise<Buffer | Error>} Signature buffer or an Error
     * @memberof Keybase
     */
    verifySignature(
        signerPublicKey: Buffer,
        payload: Buffer,
        signature: Buffer
    ): Promise<boolean>

    /**
     * @description Unlock an account for passphrase free signing of arbitrary payloads using `signWithUnlockedAccount`
     * @param {string} addressHex The address of the account that will be unlocked in hex string format
     * @param {string} passphrase The passphrase of the account to unlock
     * @param {number} unlockPeriod The amount of time (in ms) the account is going to be unlocked, defaults to 10 minutes. Use 0 to keep it unlocked indefinetely
     * @returns {Error | undefined} Undefined if account got unlocked or an Error
     * @memberof Keybase
     */
    unlockAccount(
        addressHex: string,
        passphrase: string,
        unlockPeriod: number
    ): Error | undefined

    /**
     * @description Locks an unlocked account back so signing payloads with it will require a passphrase
     * @param {string} addressHex The address of the account that will be locked in hex string format
     * @returns {Error | undefined} Undefined if account got locked or an Error
     * @memberof Keybase
     */
    lockAccount(addressHex: string): Error | undefined

    /**
     * @description Returns whether or not the specified account is unlocked
     * @param {string} addressHex The address of the account that will be verified in hex string format
     * @returns {boolean} True or false if the account is unlocked
     * @memberof Keybase
     */
    isUnlocked(addressHex: string): boolean

    /**
     * @description Imports an account by using it's private key into this keybase
     * @param {Buffer} privateKey The private key of the account to be imported into this keybase
     * @param {string} passphrase The passphrase of the account to be imported into the keybase
     * @returns {Account | Error} Imported account or an Error
     * @memberof Keybase
     */
    importAccount(
        privateKey: Buffer,
        passphrase: string
    ): Account | Error

    /**
     * @description Exports an account's private key stored in this keybase
     * @param {string} addressHex The address of the account that will be exported in hex string format
     * @param {string} passphrase The passphrase for the account that will be exported
     * @returns {Buffer | Error} Exported account buffer or an Error
     * @memberof Keybase
     */
    exportAccount(
        addressHex: string,
        passphrase: string
    ): Buffer | Error 

    /**
     * @description Creates a Portable Private Key(PPK) using an Account
     * @param {string} addressHex - Account's address hex.
     * @param {string} password - Desired password for the PPK.
     * @param {string} hint - (Optional) Private key hint.
     * @param {string} passphrase - Passphrase to unlock the account in the keybase.
     * @returns {string | Error} 
     * @memberof Keybase
     */
    exportPPKfromAccount(
        addressHex: string,
        password: string,
        hint: string,
        passphrase: string
    ): string | Error

    /**
     * @description Creates a Portable Private Key(PPK) by exporting to an armored JSON
     * @param {string} privateKey - Account raw private key.
     * @param {string} password - Desired password for the PPK.
     * @param {string} hint - (Optional) Private key hint.
     * @returns {string | Error} 
     * @memberof Keybase
     */
    exportPPK(
        privateKey: string,
        password: string,
        hint: string
    ): string | Error

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
    importPPK(
        password: string,
        salt: string,
        secParam: number,
        hint: string,
        cipherText: string,
        passphrase: string
    ): Account | Error

    /**
     * @description Imports a Portable Private Key(PPK) an armored JSON and stores in the keybase
     * @param {string} password - Desired password for the PPK.
     * @param {string} jsonStr - Armored JSON with the PPK information.
     * @param {string} passphrase - Desired passphrase to store the account in the keybase.
     * @returns {Account | Error} 
     * @memberof Keybase
     */
    importPPKFromJSON(
        password: string,
        jsonStr: string,
        passphrase: string
    ): Account | Error 
}