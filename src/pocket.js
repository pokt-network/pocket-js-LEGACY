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
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
exports.__esModule = true;
var config_1 = require("./config");
var models_1 = require("./rpc/models");
var utils_1 = require("./utils");
var session_manager_1 = require("./session/session-manager");
var rpc_1 = require("./rpc");
var keybase_1 = require("./keybase/keybase");
var models_2 = require("./keybase/models");
var routing_table_1 = require("./routing-table/routing-table");
var _1 = require("./");
/**
 *
 *
 * @class Pocket
 */
var Pocket = /** @class */ (function () {
    /**
     * Creates an instance of Pocket.
     * @param {URL} dispatchers - Array holding the initial dispatcher url(s).
     * @param {IRPCProvider} rpcProvider - Provider which will be used to reach out to the Pocket Core RPC interface.
     * @param {Configuration} configuration - Configuration object.
     * @param {IKVStore} store - Save data using a Key/Value relationship. This object save information in memory.
     * @memberof Pocket
     */
    function Pocket(dispatchers, rpcProvider, configuration, store) {
        if (configuration === void 0) { configuration = new config_1.Configuration(); }
        if (store === void 0) { store = new _1.InMemoryKVStore(); }
        this.configuration = configuration;
        try {
            this.routingTable = new routing_table_1.RoutingTable(dispatchers, configuration, store);
            this.sessionManager = new session_manager_1.SessionManager(this.routingTable, store);
            this.keybase = new keybase_1.Keybase(store);
        }
        catch (error) {
            throw error;
        }
        if (rpcProvider !== undefined) {
            this.innerRpc = new rpc_1.RPC(rpcProvider);
        }
    }
    /**
     * Creates a new instance of RPC if you set an IRPCProvider or return the previous existing instance
     * @param {IRPCProvider} rpcProvider - Provider which will be used to reach out to the Pocket Core RPC interface.
     * @returns {RPC} - A RPC object.
     * @memberof Pocket
     */
    Pocket.prototype.rpc = function (rpcProvider) {
        if (rpcProvider !== undefined) {
            this.innerRpc = new rpc_1.RPC(rpcProvider);
        }
        if (this.innerRpc !== undefined) {
            return this.innerRpc;
        }
    };
    /**
     *
     * Sends a Relay Request
     * @param {string} data - string holding the json rpc call.
     * @param {string} blockchain - Blockchain hash.
     * @param {PocketAAT} pocketAAT - Pocket Authentication Token.
     * @param {Configuration} configuration - Pocket configuration object.
     * @param {RelayHeaders} headers - (Optional) An object holding the HTTP Headers.
     * @param {string} method - (Optional) HTTP method for REST API calls.
     * @param {string} path - (Optional) REST API path.
     * @param {Node} node - (Optional) Session node which will receive the Relay.
     * @returns {RelayResponse} - A Relay Response object.
     * @memberof Pocket
     */
    Pocket.prototype.sendRelay = function (data, blockchain, pocketAAT, configuration, headers, method, path, node) {
        if (configuration === void 0) { configuration = this.configuration; }
        if (method === void 0) { method = ""; }
        if (path === void 0) { path = ""; }
        return __awaiter(this, void 0, void 0, function () {
            var currentSessionOrError, currentSession, serviceNode, serviceNodeOrError, serviceProvider, relayPayload, clientAddressHex, isUnlocked, entropy, proofBytes, signatureOrError, signature, signatureHex, relayProof, relay, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.sessionManager.getCurrentSession(pocketAAT, blockchain, configuration)];
                    case 1:
                        currentSessionOrError = _a.sent();
                        if (utils_1.typeGuard(currentSessionOrError, rpc_1.RpcError)) {
                            return [2 /*return*/, currentSessionOrError];
                        }
                        currentSession = currentSessionOrError;
                        serviceNode = void 0;
                        // Provide a random service node from the session
                        if (node !== undefined) {
                            if (currentSession.isNodeInSession(node)) {
                                serviceNode = node;
                            }
                            else {
                                return [2 /*return*/, new rpc_1.RpcError("0", "Provided Node is not part of the current session for this application, check your PocketAAT")];
                            }
                        }
                        else {
                            serviceNodeOrError = currentSession.getSessionNode();
                            if (utils_1.typeGuard(serviceNodeOrError, Error)) {
                                return [2 /*return*/, rpc_1.RpcError.fromError(serviceNodeOrError)];
                            }
                            serviceNode = serviceNodeOrError;
                        }
                        // Final Service Node check
                        if (serviceNode === undefined) {
                            return [2 /*return*/, new rpc_1.RpcError("0", "Could not determine a Service Node to submit this relay")];
                        }
                        serviceProvider = new rpc_1.HttpRpcProvider(serviceNode.serviceURL);
                        this.rpc(serviceProvider);
                        relayPayload = new models_1.RelayPayload(data, method, path, headers);
                        clientAddressHex = utils_1.addressFromPublickey(Buffer.from(pocketAAT.clientPublicKey, 'hex')).toString("hex");
                        return [4 /*yield*/, this.keybase.isUnlocked(clientAddressHex)];
                    case 2:
                        isUnlocked = _a.sent();
                        if (!isUnlocked) {
                            return [2 /*return*/, new rpc_1.RpcError("0", "Client account " + clientAddressHex + " for this AAT is not unlocked")];
                        }
                        entropy = BigInt(Math.floor(Math.random() * 99999999999999999));
                        proofBytes = models_1.RelayProof.bytes(entropy, currentSession.sessionHeader.sessionBlockHeight, serviceNode.publicKey, blockchain, pocketAAT);
                        return [4 /*yield*/, this.keybase.signWithUnlockedAccount(clientAddressHex, proofBytes)];
                    case 3:
                        signatureOrError = _a.sent();
                        if (utils_1.typeGuard(signatureOrError, Error)) {
                            return [2 /*return*/, new rpc_1.RpcError("0", "Error signing Relay proof")];
                        }
                        signature = signatureOrError;
                        signatureHex = signature.toString("hex");
                        relayProof = new models_1.RelayProof(entropy, currentSession.sessionHeader.sessionBlockHeight, serviceNode.publicKey, blockchain, pocketAAT, signatureHex);
                        relay = new models_1.RelayRequest(relayPayload, relayProof);
                        // Send relay
                        return [2 /*return*/, this.innerRpc.client.relay(relay)];
                    case 4:
                        error_1 = _a.sent();
                        return [2 /*return*/, error_1];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Creates an ITransactionSender given a private key
     * @param {Buffer | string} privateKey
     * @returns {ITransactionSender} - Interface with all the possible MsgTypes in a Pocket Network transaction and a function to submit the transaction to the network.
     * @memberof Pocket
     */
    Pocket.prototype.withPrivateKey = function (privateKey) {
        try {
            var privKeyBuffer = utils_1.typeGuard(privateKey, Buffer) ? privateKey : Buffer.from(privateKey, 'hex');
            if (!utils_1.validatePrivateKey(privKeyBuffer)) {
                throw new Error("Invalid private key");
            }
            var pubKey = utils_1.publicKeyFromPrivate(privKeyBuffer);
            var unlockedAccount = new models_2.UnlockedAccount(new models_2.Account(pubKey, ''), privKeyBuffer);
            return new _1.TransactionSender(this, unlockedAccount);
        }
        catch (err) {
            return err;
        }
    };
    /**
     * Creates an ITransactionSender given an already imported account into this instanc keybase
     * @param {Buffer | string} address - address of the account
     * @param {string} passphrase - passphrase for the account
     * @returns {ITransactionSender} - Interface with all the possible MsgTypes in a Pocket Network transaction and a function to submit the transaction to the network.
     * @memberof Pocket
     */
    Pocket.prototype.withImportedAccount = function (address, passphrase) {
        return __awaiter(this, void 0, void 0, function () {
            var unlockedAccountOrError;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.keybase.getUnlockedAccount(utils_1.typeGuard(address, "string") ? address : address.toString("hex"), passphrase)];
                    case 1:
                        unlockedAccountOrError = _a.sent();
                        if (utils_1.typeGuard(unlockedAccountOrError, Error)) {
                            return [2 /*return*/, unlockedAccountOrError];
                        }
                        else {
                            return [2 /*return*/, new _1.TransactionSender(this, unlockedAccountOrError)];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Creates an ITransactionSender given a {TransactionSigner} function
     * @param {TransactionSigner} txSigner - Function which will sign the transaction bytes
     * @returns {ITransactionSender} - Interface with all the possible MsgTypes in a Pocket Network transaction and a function to submit the transaction to the network.
     * @memberof Pocket
     */
    Pocket.prototype.withTxSigner = function (txSigner) {
        try {
            return new _1.TransactionSender(this, undefined, txSigner);
        }
        catch (err) {
            return err;
        }
    };
    return Pocket;
}());
exports.Pocket = Pocket;
__export(require("@pokt-network/aat-js"));
