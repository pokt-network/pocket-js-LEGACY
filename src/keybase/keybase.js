"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var account_1 = require("./models/account");
var ed25519 = require("ed25519");
var unlocked_account_1 = require("./models/unlocked-account");
var pbkdf2 = require("pbkdf2");
var js_sha256_1 = require("js-sha256");
var aesjs = require("aes-js");
var seedrandom_1 = require("seedrandom");
var type_guard_1 = require("../utils/type-guard");
var key_pair_1 = require("../utils/key-pair");
/**
 * @author Luis C. de León <luis@pokt.network>
 * @description The Keybase class allows storage, operations and persistence of accounts.
 */
var Keybase = /** @class */ (function () {
    /**
     * @description Constructor for the Keybase class
     * @param {IKVStore} store - The IKVStore to use to store encrypted accounts
     * @memberof Keybase
     */
    function Keybase(store) {
        this.ACCOUNT_STORE_PREFIX = "account_";
        this.ACCOUNT_INDEX_KEY = "account_index";
        this.store = store;
        this.unlockedAccounts = {};
    }
    /**
     * Utility function to sign an arbitrary payload with a valid ed25519 private key
     * @param {Buffer} privateKey - The private key to sign with
     * @param {Buffer} payload - Arbitrary payload to sign
     * @returns {Buffer | Error} The signature or an Error
     * @memberof Keybase
     */
    Keybase.signWith = function (privateKey, payload) {
        try {
            return ed25519.Sign(payload, privateKey);
        }
        catch (err) {
            return err;
        }
    };
    /**
     * @description Creates an account and stores it in the keybase
     * @param {string} passphrase The passphrase for the account in this keybase
     * @returns {Account | Error} The the new account or an Error
     * @memberof Keybase
     */
    Keybase.prototype.createAccount = function (passphrase) {
        return __awaiter(this, void 0, void 0, function () {
            var rng, seed, keyPair, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (passphrase.length === 0) {
                            return [2 /*return*/, new Error("Empty passphrase")];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        rng = seedrandom_1["default"](passphrase, { entropy: true });
                        seed = Buffer.from(js_sha256_1.sha256(rng().toString()), "hex");
                        keyPair = ed25519.MakeKeypair(seed);
                        return [4 /*yield*/, this.importAccount(keyPair.privateKey, passphrase)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        err_1 = _a.sent();
                        return [2 /*return*/, err_1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @description Lists all the accounts stored in this keybase
     * @returns {Account | Error} The the new account or an Error
     * @memberof Keybase
     */
    Keybase.prototype.listAccounts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, accountIndex, _a, _b, _i, index, accountOrError;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        result = new Array();
                        accountIndex = this.store.get(this.ACCOUNT_INDEX_KEY);
                        if (type_guard_1.typeGuard(accountIndex, Array)) {
                            accountIndex = accountIndex;
                        }
                        else if (accountIndex === undefined) {
                            accountIndex = [];
                        }
                        else {
                            return [2 /*return*/, new Error("Error fetching account index")];
                        }
                        _a = [];
                        for (_b in accountIndex)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        index = _a[_i];
                        return [4 /*yield*/, this.getAccount(accountIndex[index])];
                    case 2:
                        accountOrError = _c.sent();
                        if (type_guard_1.typeGuard(accountOrError, account_1.Account)) {
                            result.push(accountOrError);
                        }
                        else {
                            return [2 /*return*/, accountOrError];
                        }
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * @description Retrieves a single account from this keybase
     * @param {string} addressHex - The address of the account to retrieve in hex string format
     * @returns {Account | Error} - The the new account or an Error
     * @memberof Keybase
     */
    Keybase.prototype.getAccount = function (addressHex) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.getAccountFromStore(addressHex)];
            });
        });
    };
    /**
     * Generates a one time use UnlockedAccount from a persisted Account
     * @param {string} addressHex - The address hex for the account
     * @param {string} passphrase - The passphrase for the account
     * @returns {Promise<UnlockedAccount | Error>} The UnlockedAccount object or an Error
     * @memberof Keybase
     */
    Keybase.prototype.getUnlockedAccount = function (addressHex, passphrase) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.unlockAccountFromPersistence(addressHex, passphrase)];
            });
        });
    };
    /**
     * @description Deletes an account stored in the keybase
     * @param {string} addressHex - The address of the account to delete in hex string format
     * @param {string} passphrase - The passphrase for the account in this keybase
     * @returns {Promise<Error | undefined>} undefined if the account was deleted or an Error
     * @memberof Keybase
     */
    Keybase.prototype.deleteAccount = function (addressHex, passphrase) {
        return __awaiter(this, void 0, void 0, function () {
            var validationError, error, unlockedAccountOrError, unlockedAccount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validationError = key_pair_1.validateAddressHex(addressHex);
                        if (validationError) {
                            return [2 /*return*/, validationError];
                        }
                        return [4 /*yield*/, this.unlockAccountFromPersistence(addressHex, passphrase)];
                    case 1:
                        unlockedAccountOrError = _a.sent();
                        if (type_guard_1.typeGuard(unlockedAccountOrError, unlocked_account_1.UnlockedAccount)) {
                            unlockedAccount = unlockedAccountOrError;
                            return [2 /*return*/, this.removeAccountRecord(unlockedAccount)];
                        }
                        else if (type_guard_1.typeGuard(unlockedAccountOrError, Error)) {
                            error = unlockedAccountOrError;
                        }
                        else {
                            error = new Error("Unknown error decrypting Account");
                        }
                        return [2 /*return*/, error];
                }
            });
        });
    };
    /**
     *
     * @param {string} addressHex The address of the account to update in hex string format
     * @param {string} passphrase The passphrase of the account
     * @param {string} newPassphrase The new passphrase that the account will be updated to
     * @returns {Promise<Error | undefined>} undefined if the account passphrase was updated or an Error
     * @memberof Keybase
     */
    Keybase.prototype.updateAccountPassphrase = function (addressHex, passphrase, newPassphrase) {
        return __awaiter(this, void 0, void 0, function () {
            var validationError, error, unlockedAccountOrError, unlockedAccount, errorOrUndefined, importedAccountOrError;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validationError = key_pair_1.validateAddressHex(addressHex);
                        if (validationError) {
                            return [2 /*return*/, validationError];
                        }
                        return [4 /*yield*/, this.unlockAccountFromPersistence(addressHex, passphrase)];
                    case 1:
                        unlockedAccountOrError = _a.sent();
                        if (!type_guard_1.typeGuard(unlockedAccountOrError, unlocked_account_1.UnlockedAccount)) return [3 /*break*/, 3];
                        unlockedAccount = unlockedAccountOrError;
                        return [4 /*yield*/, this.removeAccountRecord(unlockedAccount)];
                    case 2:
                        errorOrUndefined = _a.sent();
                        if (type_guard_1.typeGuard(errorOrUndefined, Error)) {
                            error = errorOrUndefined;
                        }
                        else {
                            importedAccountOrError = this.importAccount(unlockedAccount.privateKey, newPassphrase);
                            if (type_guard_1.typeGuard(importedAccountOrError, Error)) {
                                error = importedAccountOrError;
                            }
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        if (type_guard_1.typeGuard(unlockedAccountOrError, Error)) {
                            error = unlockedAccountOrError;
                        }
                        else {
                            error = new Error("Unknown error decrypting Account");
                        }
                        _a.label = 4;
                    case 4: return [2 /*return*/, error];
                }
            });
        });
    };
    // Keybase ECDSA functions
    /**
     * @param {string} addressHex The address of the account that will sign the payload in hex string format
     * @param {string} passphrase The passphrase of the account
     * @param {Buffer} payload The payload to be signed
     * @returns {Promise<Buffer | Error>} Signature buffer or an Error
     * @memberof Keybase
     */
    Keybase.prototype.sign = function (addressHex, passphrase, payload) {
        return __awaiter(this, void 0, void 0, function () {
            var unlockedAccountOrError, unlockedAccount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.unlockAccountFromPersistence(addressHex, passphrase)];
                    case 1:
                        unlockedAccountOrError = _a.sent();
                        if (type_guard_1.typeGuard(unlockedAccountOrError, Error)) {
                            return [2 /*return*/, unlockedAccountOrError];
                        }
                        unlockedAccount = unlockedAccountOrError;
                        try {
                            return [2 /*return*/, ed25519.Sign(payload, unlockedAccount.privateKey)];
                        }
                        catch (err) {
                            return [2 /*return*/, err];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @description Signs a payload with an unlocked account stored in this keybase
     * @param {string} addressHex The address of the account that will sign the payload in hex string format
     * @param {Buffer} payload The payload to be signed
     * @returns {Promise<Buffer | Error>} Signature buffer or an Error
     * @memberof Keybase
     */
    Keybase.prototype.signWithUnlockedAccount = function (addressHex, payload) {
        return __awaiter(this, void 0, void 0, function () {
            var validationError, isUnlocked, unlockedAccount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validationError = key_pair_1.validateAddressHex(addressHex);
                        if (validationError) {
                            return [2 /*return*/, validationError];
                        }
                        return [4 /*yield*/, this.isUnlocked(addressHex)];
                    case 1:
                        isUnlocked = _a.sent();
                        if (!isUnlocked) {
                            return [2 /*return*/, new Error("Account is not unlocked")];
                        }
                        try {
                            unlockedAccount = this.unlockedAccounts[addressHex];
                            return [2 /*return*/, ed25519.Sign(payload, unlockedAccount.privateKey)];
                        }
                        catch (err) {
                            return [2 /*return*/, err];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @description Verify the signature for a given payload signed by `signedPublicKey`
     * @param {Buffer} signerPublicKey The public key of the signer
     * @param {Buffer} payload The payload to be verified against the signature
     * @param {Buffer} signature The calculated signature for the payload
     * @returns {Promise<Buffer | Error>} Signature buffer or an Error
     * @memberof Keybase
     */
    Keybase.prototype.verifySignature = function (signerPublicKey, payload, signature) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, ed25519.Verify(payload, signature, signerPublicKey)];
                }
                catch (err) {
                    return [2 /*return*/, false];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * @description Unlock an account for passphrase free signing of arbitrary payloads using `signWithUnlockedAccount`
     * @param {string} addressHex The address of the account that will be unlocked in hex string format
     * @param {string} passphrase The passphrase of the account to unlock
     * @param {number} unlockPeriod The amount of time (in ms) the account is going to be unlocked, defaults to 10 minutes. Use 0 to keep it unlocked indefinetely
     * @returns {Promise<Error | undefined>} Undefined if account got unlocked or an Error
     * @memberof Keybase
     */
    Keybase.prototype.unlockAccount = function (addressHex, passphrase, unlockPeriod) {
        if (unlockPeriod === void 0) { unlockPeriod = 600000; }
        return __awaiter(this, void 0, void 0, function () {
            var unlockedAccountOrError, unlockedAccount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.unlockAccountFromPersistence(addressHex, passphrase)
                        // Return errors if any
                    ];
                    case 1:
                        unlockedAccountOrError = _a.sent();
                        // Return errors if any
                        if (type_guard_1.typeGuard(unlockedAccountOrError, Error)) {
                            return [2 /*return*/, unlockedAccountOrError];
                        }
                        if (unlockPeriod > 0) {
                            setTimeout(function (keybase, addressHex) {
                                keybase.lockAccount(addressHex);
                            }, unlockPeriod, this, addressHex);
                        }
                        unlockedAccount = unlockedAccountOrError;
                        this.unlockedAccounts[unlockedAccount.addressHex] = unlockedAccount;
                        return [2 /*return*/, undefined];
                }
            });
        });
    };
    /**
     * @description Locks an unlocked account back so signing payloads with it will require a passphrase
     * @param {string} addressHex The address of the account that will be locked in hex string format
     * @returns {Promise<Error | undefined>} Undefined if account got locked or an Error
     * @memberof Keybase
     */
    Keybase.prototype.lockAccount = function (addressHex) {
        return __awaiter(this, void 0, void 0, function () {
            var validationError, isUnlocked;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validationError = key_pair_1.validateAddressHex(addressHex);
                        if (validationError) {
                            return [2 /*return*/, validationError];
                        }
                        return [4 /*yield*/, this.isUnlocked(addressHex)];
                    case 1:
                        isUnlocked = _a.sent();
                        if (!isUnlocked) {
                            return [2 /*return*/, new Error("Account is not unlocked")];
                        }
                        delete this.unlockedAccounts[addressHex];
                        return [2 /*return*/, undefined];
                }
            });
        });
    };
    /**
     * @description Returns whether or not the specified account is unlocked
     * @param {string} addressHex The address of the account that will be verified in hex string format
     * @returns {Promise<boolean>} True or false if the account is unlocked
     * @memberof Keybase
     */
    Keybase.prototype.isUnlocked = function (addressHex) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.unlockedAccounts[addressHex] ? true : false];
            });
        });
    };
    // Import/export of accounts
    /**
     * @description Imports an account by using it's private key into this keybase
     * @param {Buffer} privateKey The private key of the account to be imported into this keybase
     * @param {string} passphrase The passphrase of the account to be imported into the keybase
     * @returns {Promise<Account | Error>} Imported account or an Error
     * @memberof Keybase
     */
    Keybase.prototype.importAccount = function (privateKey, passphrase) {
        return __awaiter(this, void 0, void 0, function () {
            var publicKey, key, encryptedPKHex, account, errorOrUndefined, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (passphrase.length === 0) {
                            return [2 /*return*/, new Error("Empty passphrase")];
                        }
                        if (!key_pair_1.validatePrivateKey(privateKey)) {
                            return [2 /*return*/, new Error("Invalid private key")];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        publicKey = key_pair_1.publicKeyFromPrivate(privateKey);
                        key = pbkdf2.pbkdf2Sync(passphrase, js_sha256_1.sha256(passphrase), 1, 256 / 8);
                        encryptedPKHex = aesjs.utils.hex.fromBytes(new aesjs.ModeOfOperation.ctr(key, undefined).encrypt(privateKey));
                        account = new account_1.Account(publicKey, encryptedPKHex);
                        return [4 /*yield*/, this.persistAccount(account)];
                    case 2:
                        errorOrUndefined = _a.sent();
                        if (type_guard_1.typeGuard(errorOrUndefined, Error)) {
                            return [2 /*return*/, errorOrUndefined];
                        }
                        else {
                            return [2 /*return*/, account];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        return [2 /*return*/, err_2];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @description Exports an account's private key stored in this keybase
     * @param {string} addressHex The address of the account that will be exported in hex string format
     * @param {string} passphrase The passphrase for the account that will be exported
     * @returns {Promise<Buffer | Error>} Exported account buffer or an Error
     * @memberof Keybase
     */
    Keybase.prototype.exportAccount = function (addressHex, passphrase) {
        return __awaiter(this, void 0, void 0, function () {
            var unlockedAccountOrError, unlockedAccount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.unlockAccountFromPersistence(addressHex, passphrase)];
                    case 1:
                        unlockedAccountOrError = _a.sent();
                        if (type_guard_1.typeGuard(unlockedAccountOrError, Error)) {
                            return [2 /*return*/, unlockedAccountOrError];
                        }
                        unlockedAccount = unlockedAccountOrError;
                        return [2 /*return*/, unlockedAccount.privateKey];
                }
            });
        });
    };
    // Private interface
    /**
     * Returns an `UnlockedAccount` object corresponding to the `Account` object stored in this keybase
     * @param {string} addressHex The address of the account that will be used to create an `UnlockedAccount` in hex string format
     * @param {string} passphrase The passphrase for the account that will be used
     * @returns {Promise<UnlockedAccount | Error>} Unlocked account or an Error
     * @memberof Keybase
     */
    Keybase.prototype.unlockAccountFromPersistence = function (addressHex, passphrase) {
        return __awaiter(this, void 0, void 0, function () {
            var validationError, error, accountOrError, account, key, encryptedPKBytes, decryptedPKHex, decryptedPublicKey, decryptedAddress, unlockedAccount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validationError = key_pair_1.validateAddressHex(addressHex);
                        if (validationError) {
                            return [2 /*return*/, validationError];
                        }
                        return [4 /*yield*/, this.getAccount(addressHex)];
                    case 1:
                        accountOrError = _a.sent();
                        if (type_guard_1.typeGuard(accountOrError, account_1.Account)) {
                            account = accountOrError;
                            try {
                                key = pbkdf2.pbkdf2Sync(passphrase, js_sha256_1.sha256(passphrase), 1, 256 / 8);
                                encryptedPKBytes = aesjs.utils.hex.toBytes(account.encryptedPrivateKeyHex);
                                decryptedPKHex = aesjs.utils.hex.fromBytes(new aesjs.ModeOfOperation.ctr(key, undefined).decrypt(encryptedPKBytes));
                                decryptedPublicKey = decryptedPKHex.slice(decryptedPKHex.length / 2, decryptedPKHex.length);
                                decryptedAddress = key_pair_1.addressFromPublickey(Buffer.from(decryptedPublicKey, "hex"));
                                // Check addresses to make sure the decrypted account matches the intended account
                                if (account.addressHex !== decryptedAddress.toString("hex")) {
                                    return [2 /*return*/, new Error("Wrong passphrase for account")];
                                }
                                unlockedAccount = new unlocked_account_1.UnlockedAccount(account, Buffer.from(decryptedPKHex, "hex"));
                                return [2 /*return*/, unlockedAccount];
                            }
                            catch (err) {
                                return [2 /*return*/, err];
                            }
                        }
                        else if (type_guard_1.typeGuard(accountOrError, Error)) {
                            error = accountOrError;
                        }
                        else {
                            error = new Error("Unknown error getting account");
                        }
                        return [2 /*return*/, error];
                }
            });
        });
    };
    // Internal persistence interface
    /**
     * Persists an account in the storage of this keybase
     * @param {Account} account
     * @returns {Promise<Buffer | Error>} Signature buffer or an Error
     * @memberof Keybase
     */
    Keybase.prototype.persistAccount = function (account) {
        return __awaiter(this, void 0, void 0, function () {
            var accountKey, accountIndex;
            return __generator(this, function (_a) {
                accountKey = this.generateAccountStoreKey(account);
                // Add the account to the store
                this.store.add(accountKey, account);
                accountIndex = this.store.get(this.ACCOUNT_INDEX_KEY);
                if (type_guard_1.typeGuard(accountIndex, Array)) {
                    accountIndex = accountIndex;
                }
                else if (accountIndex === undefined) {
                    accountIndex = [];
                }
                else {
                    return [2 /*return*/, new Error("Error fetching the account index")];
                }
                // Push the address hex into the index
                accountIndex.push(account.addressHex);
                // Persist the index to the store
                this.store.add(this.ACCOUNT_INDEX_KEY, accountIndex);
                // Return undefined for no errors
                return [2 /*return*/, undefined];
            });
        });
    };
    /**
     * Removes an account from the storage of this keybase
     * @param {Account} account
     * @returns {Promise<Error | undefined>} Undefined if the account was removed or an Error
     * @memberof Keybase
     */
    Keybase.prototype.removeAccountRecord = function (account) {
        return __awaiter(this, void 0, void 0, function () {
            var accountKey, accountIndex, index;
            return __generator(this, function (_a) {
                accountKey = this.generateAccountStoreKey(account);
                // Remove the account from the store
                this.store.remove(accountKey);
                accountIndex = this.store.get(this.ACCOUNT_INDEX_KEY);
                if (type_guard_1.typeGuard(accountIndex, Array)) {
                    accountIndex = accountIndex;
                    index = accountIndex.indexOf(account.addressHex, 0);
                    if (index > -1) {
                        accountIndex.splice(index, 1);
                    }
                    // Persist the index to the store
                    this.store.add(this.ACCOUNT_INDEX_KEY, accountIndex);
                }
                // Return undefined for no errors
                return [2 /*return*/, undefined];
            });
        });
    };
    /**
     * Gets a properly parsed Account object from the store
     * @param {string} addressHex The address of the account in hex format
     * @returns {Promise<Account | Error>} Account from store or an Error
     * @memberof Keybase
     */
    Keybase.prototype.getAccountFromStore = function (addressHex) {
        return __awaiter(this, void 0, void 0, function () {
            var result, validationError, account;
            return __generator(this, function (_a) {
                validationError = key_pair_1.validateAddressHex(addressHex);
                if (validationError) {
                    return [2 /*return*/, validationError];
                }
                account = this.store.get(this.generateAccountStoreKeyFromAddressHex(addressHex));
                // Verify the account fetched if any
                if (account === undefined) {
                    result = new Error("Account not found");
                }
                else if (type_guard_1.typeGuard(account, account_1.Account)) {
                    result = account;
                }
                else {
                    result = new Error("Error fetching account from store");
                }
                return [2 /*return*/, result];
            });
        });
    };
    /**
     * Generates a key to be used in the IKVStore for this keybase instance
     * @param {Account} account The account for which the key wants to be generated for
     * @returns {string} Account store key value
     * @memberof Keybase
     */
    Keybase.prototype.generateAccountStoreKey = function (account) {
        return this.ACCOUNT_STORE_PREFIX + account.addressHex;
    };
    /**
     * Generates a key to be used in the IKVStore for this keybase instance from the address of
     * the account in hex format
     * @param {string} addressHex The account for which the key wants to be generated for
     * @returns {string} Generated Account store key.
     * @memberof Keybase
     */
    Keybase.prototype.generateAccountStoreKeyFromAddressHex = function (addressHex) {
        return this.ACCOUNT_STORE_PREFIX + addressHex;
    };
    return Keybase;
}());
exports.Keybase = Keybase;
