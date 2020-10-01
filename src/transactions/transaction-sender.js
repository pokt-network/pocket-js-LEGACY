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
var models_1 = require("./models/");
var models_2 = require("../keybase/models");
var __1 = require("..");
var TransactionSender = /** @class */ (function () {
    /**
     * Constructor for this class. Requires either an unlockedAccount or txSigner
     * @param {Pocket} pocket - Pocket instance
     * @param {UnlockedAccount} unlockedAccount - Unlocked account
     * @param {TransactionSigner} txSigner - Transaction signer
     */
    function TransactionSender(pocket, unlockedAccount, txSigner) {
        this.txMgs = [];
        this.txMsgErrors = [];
        this.unlockedAccount = unlockedAccount;
        this.txSigner = txSigner;
        this.pocket = pocket;
        if (this.unlockedAccount === undefined && this.txSigner === undefined) {
            throw new Error("Need to define unlockedAccount or txSigner");
        }
    }
    /**
     * Signs and submits a transaction to the network given the parameters and called upon Msgs. Will empty the msg list after succesful submission
     * @param {BigInt} entropy - Random int64.
     * @param {string} chainId - The chainId of the network to be sent to
     * @param {string} fee - The amount to pay as a fee for executing this transaction
     * @param {CoinDenom | undefined} feeDenom - The denomination of the fee amount
     * @param {string | undefined} memo - The memo field for this account
     * @param {number | undefined} timeout - Request timeout
     * @returns {Promise<RawTxResponse | RpcError>} - A Raw transaction Response object or Rpc error.
     * @memberof TransactionSender
     */
    TransactionSender.prototype.submit = function (chainId, fee, entropy, feeDenom, memo, timeout) {
        return __awaiter(this, void 0, void 0, function () {
            var stdSignDoc, txSignatureOrError, bytesToSign, txSignature, addressHex, transaction, encodedTxBytes;
            return __generator(this, function (_a) {
                try {
                    if (entropy === undefined) {
                        entropy = BigInt(Math.floor(Math.random() * 99999999999999999));
                    }
                    if (this.txMsgErrors.length === 1) {
                        return [2 /*return*/, __1.RpcError.fromError(this.txMsgErrors[0])];
                    }
                    else if (this.txMsgErrors.length > 1) {
                        return [2 /*return*/, new __1.RpcError("0", this.txMsgErrors[0].message + " and another " + (this.txMsgErrors.length - 1) + " errors")];
                    }
                    if (this.txMgs.length === 0) {
                        return [2 /*return*/, new __1.RpcError("0", "No messages configured for this transaction")];
                    }
                    stdSignDoc = new models_1.StdSignDoc(entropy, chainId, this.txMgs, fee, feeDenom, memo);
                    txSignatureOrError = void 0;
                    bytesToSign = stdSignDoc.marshalAmino();
                    if (__1.typeGuard(this.unlockedAccount, models_2.UnlockedAccount)) {
                        txSignatureOrError = this.signWithUnlockedAccount(bytesToSign, this.unlockedAccount);
                    }
                    else if (this.txSigner !== undefined) {
                        txSignatureOrError = this.signWithTrasactionSigner(bytesToSign, this.txSigner);
                    }
                    else {
                        return [2 /*return*/, new __1.RpcError("0", "No account or TransactionSigner specified")];
                    }
                    if (!__1.typeGuard(txSignatureOrError, models_1.TxSignature)) {
                        return [2 /*return*/, new __1.RpcError("0", "Error generating signature for transaction")];
                    }
                    txSignature = txSignatureOrError;
                    addressHex = __1.addressFromPublickey(txSignature.pubKey);
                    transaction = new models_1.StdTx(stdSignDoc, [txSignature]);
                    encodedTxBytes = transaction.marshalAmino();
                    // Clean messages accumulated on submit
                    this.txMgs = [];
                    return [2 /*return*/, this.pocket.rpc().client.rawtx(addressHex, encodedTxBytes, timeout)];
                }
                catch (error) {
                    return [2 /*return*/, __1.RpcError.fromError(error)];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Adds a MsgSend TxMsg for this transaction
     * @param {string} fromAddress - Origin address
     * @param {string} toAddress - Destination address
     * @param {string} amount - Amount to be sent, needs to be a valid number greater than 0
     * @param {CoinDenom | undefined} amountDenom - Amoun denomination
     * @returns {ITransactionSender} - A transaction sender.
     * @memberof TransactionSender
     */
    TransactionSender.prototype.send = function (fromAddress, toAddress, amount) {
        try {
            this.txMgs.push(new models_1.MsgSend(fromAddress, toAddress, amount));
        }
        catch (error) {
            this.txMsgErrors.push(error);
        }
        return this;
    };
    /**
     * Adds a MsgAppStake TxMsg for this transaction
     * @param {string} appPubKey - Application Public Key
     * @param {string[]} chains - Network identifier list to be requested by this app
     * @param {string} amount - the amount to stake, must be greater than 0
     * @returns {ITransactionSender} - A transaction sender.
     * @memberof TransactionSender
     */
    TransactionSender.prototype.appStake = function (appPubKey, chains, amount) {
        try {
            this.txMgs.push(new models_1.MsgAppStake(Buffer.from(appPubKey, "hex"), chains, amount));
        }
        catch (error) {
            this.txMsgErrors.push(error);
        }
        return this;
    };
    /**
     * Adds a MsgBeginAppUnstake TxMsg for this transaction
     * @param {string} address - Address of the Application to unstake for
     * @returns {ITransactionSender} - A transaction sender.
     * @memberof TransactionSender
     */
    TransactionSender.prototype.appUnstake = function (address) {
        try {
            this.txMgs.push(new models_1.MsgAppUnstake(address));
        }
        catch (error) {
            this.txMsgErrors.push(error);
        }
        return this;
    };
    /**
     * Adds a MsgAppUnjail TxMsg for this transaction
     * @param {string} address - Address of the Application to unjail
     * @returns {ITransactionSender} - A transaction sender.
     * @memberof TransactionSender
     */
    TransactionSender.prototype.appUnjail = function (address) {
        try {
            this.txMgs.push(new models_1.MsgAppUnjail(address));
        }
        catch (error) {
            this.txMsgErrors.push(error);
        }
        return this;
    };
    /**
     * Adds a MsgAppStake TxMsg for this transaction
     * @param {string} nodePubKey - Node Public key
     * @param {string[]} chains - Network identifier list to be serviced by this node
     * @param {string} amount - the amount to stake, must be greater than 0
     * @param {URL} serviceURL - Node service url
     * @returns {ITransactionSender} - A transaction sender.
     * @memberof TransactionSender
     */
    TransactionSender.prototype.nodeStake = function (nodePubKey, chains, amount, serviceURL) {
        try {
            this.txMgs.push(new models_1.MsgNodeStake(Buffer.from(nodePubKey, "hex"), chains, amount, serviceURL));
        }
        catch (error) {
            this.txMsgErrors.push(error);
        }
        return this;
    };
    /**
     * Adds a MsgBeginUnstake TxMsg for this transaction
     * @param {string} address - Address of the Node to unstake for
     * @returns {ITransactionSender} - A transaction sender.
     * @memberof TransactionSender
     */
    TransactionSender.prototype.nodeUnstake = function (address) {
        try {
            this.txMgs.push(new models_1.MsgNodeUnstake(address));
        }
        catch (error) {
            this.txMsgErrors.push(error);
        }
        return this;
    };
    /**
     * Adds a MsgUnjail TxMsg for this transaction
     * @param {string} address - Address of the Node to unjail
     * @returns {ITransactionSender} - A transaction sender.
     * @memberof TransactionSender
     */
    TransactionSender.prototype.nodeUnjail = function (address) {
        try {
            this.txMgs.push(new models_1.MsgNodeUnjail(address));
        }
        catch (error) {
            this.txMsgErrors.push(error);
        }
        return this;
    };
    /**
     * Signs using the unlockedAccount attribute of this class
     * @param {Buffer} bytesToSign - Bytes to be signed
     * @param {UnlockedAccount} unlockedAccount - Unlocked account for signing
     * @returns {TxSignature | Error} - A transaction signature or error.
     * @memberof TransactionSender
     */
    TransactionSender.prototype.signWithUnlockedAccount = function (bytesToSign, unlockedAccount) {
        var signatureOrError = __1.Keybase.signWith(unlockedAccount.privateKey, bytesToSign);
        if (__1.typeGuard(signatureOrError, Error)) {
            return signatureOrError;
        }
        return new models_1.TxSignature(unlockedAccount.publicKey, signatureOrError);
    };
    /**
     * Signs using the txSigner attribute of this class
     * @param {Buffer} bytesToSign - Bytes to sign
     * @param {TransactionSigner} txSigner - Transaction signer
     * @returns {TxSignature | Error} - A transaction signature or error.
     * @memberof TransactionSender
     */
    TransactionSender.prototype.signWithTrasactionSigner = function (bytesToSign, txSigner) {
        var transactionSignatureOrError = txSigner(bytesToSign);
        if (__1.typeGuard(transactionSignatureOrError, Error)) {
            return transactionSignatureOrError;
        }
        var txSignature = transactionSignatureOrError;
        return new models_1.TxSignature(txSignature.publicKey, txSignature.signature);
    };
    return TransactionSender;
}());
exports.TransactionSender = TransactionSender;
