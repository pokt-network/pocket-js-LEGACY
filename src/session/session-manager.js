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
var session_header_1 = require("../rpc/models/input/session-header");
var session_1 = require("../rpc/models/output/session");
var dispatch_response_1 = require("../rpc/models/output/dispatch-response");
var rpc_error_1 = require("../rpc/errors/rpc-error");
var rpc_1 = require("../rpc/rpc");
var dispatch_request_1 = require("../rpc/models/input/dispatch-request");
var type_guard_1 = require("../utils/type-guard");
var queue_1 = require("./queue");
var rpc_2 = require("../rpc");
var js_sha3_1 = require("js-sha3");
/**
 *
 *
 * @class SessionManager
 * This class provides a TypeScript implementation of the bech32 format specified in BIP 173 --> https://github.com/bitcoin/bips/blob/master/bip-0173.mediawiki.
 */
var SessionManager = /** @class */ (function () {
    /**
     * Creates an instance of SessionManager.
     * @param {RoutingTable} routingTable - Element that supplies a default list of node(s) .
     * @param {IKVStore} store - KVStore implementation.
     * @memberof SessionManager
     */
    function SessionManager(routingTable, store) {
        this.sessionMapKey = "SESSIONS_KEY";
        this.store = store;
        this.routingTable = routingTable;
        this.sessionMap = new Map();
        if (this.store.has(this.sessionMapKey)) {
            this.sessionMap = this.store.get(this.sessionMapKey);
        }
        else {
            this.sessionMap = new Map();
            this.store.add(this.sessionMapKey, this.sessionMap);
        }
    }
    /**
     * Request a new session object. Returns a Promise with the Session object or a RpcErrorResponse when something goes wrong.
     * @param {PocketAAT} pocketAAT - Pocket Authentication Token.
     * @param {string} chain - Name of the Blockchain.
     * @param {Configuration} configuration - Configuration object.
     * @param {BigInt} sessionBlockHeight - Session Block Height.
     * @returns {Promise}
     * @memberof SessionManager
     */
    SessionManager.prototype.requestCurrentSession = function (pocketAAT, chain, configuration, sessionBlockHeight) {
        if (sessionBlockHeight === void 0) { sessionBlockHeight = BigInt(0); }
        return __awaiter(this, void 0, void 0, function () {
            var dispatcher, key, rpc, header, dispatchRequest, result, sessionQueue, session;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dispatcher = this.routingTable.getDispatcher();
                        if (!type_guard_1.typeGuard(dispatcher, URL)) {
                            return [2 /*return*/, new rpc_error_1.RpcError("500", "You have reached the maximum number of sessions")];
                        }
                        key = this.getSessionKey(pocketAAT, chain);
                        if (!this.sessionMap.has(key)) {
                            this.sessionMap.set(key, new queue_1.Queue());
                        }
                        rpc = new rpc_1.RPC(new rpc_2.HttpRpcProvider(dispatcher));
                        header = new session_header_1.SessionHeader(pocketAAT.applicationPublicKey, chain, sessionBlockHeight);
                        dispatchRequest = new dispatch_request_1.DispatchRequest(header);
                        return [4 /*yield*/, rpc.client.dispatch(dispatchRequest, configuration.requestTimeOut)];
                    case 1:
                        result = _a.sent();
                        sessionQueue = this.sessionMap.get(key);
                        if (type_guard_1.typeGuard(result, dispatch_response_1.DispatchResponse)) {
                            session = session_1.Session.fromJSON(JSON.stringify(result.toJSON()));
                            if (sessionQueue.length < configuration.maxSessions || configuration.maxSessions === 0) {
                                sessionQueue.enqueue(session);
                                if (type_guard_1.typeGuard(session, session_1.Session)) {
                                    this.saveCurrentSession(pocketAAT, header, configuration);
                                }
                                return [2 /*return*/, this.getCurrentSession(pocketAAT, chain, configuration, sessionBlockHeight)];
                            }
                            return [2 /*return*/, new rpc_error_1.RpcError("500", "You have reached the maximum number of sessions")];
                        }
                        else {
                            return [2 /*return*/, result];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns the current session for an specific Blockchain. Request a new session object if there's no an active Session for the specified blockchain. Returns a Promise with the Session object or a RpcErrorResponse when something goes wrong.
     * @param {PocketAAT} pocketAAT - Pocket Authentication Token.
     * @param {string} chain - Name of the Blockchain.
     * @param {Configuration} configuration - Configuration object.
     * @param {BigInt} sessionBlockHeight - Session Block Height.
     * @returns {Promise}
     * @memberof SessionManager
     */
    SessionManager.prototype.getCurrentSession = function (pocketAAT, chain, configuration, sessionBlockHeight) {
        if (sessionBlockHeight === void 0) { sessionBlockHeight = BigInt(0); }
        return __awaiter(this, void 0, void 0, function () {
            var key, currentSession;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        key = this.getSessionKey(pocketAAT, chain);
                        if (!!this.sessionMap.has(key)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.requestCurrentSession(pocketAAT, chain, configuration, sessionBlockHeight)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        currentSession = this.sessionMap.get(key).front;
                        if (currentSession !== undefined) {
                            return [2 /*return*/, currentSession];
                        }
                        return [2 /*return*/, new rpc_error_1.RpcError("500", "Session not found")];
                }
            });
        });
    };
    /**
     * Creates an unique key using the PocketAAT object and the chain.
     * @param {PocketAAT} pocketAAT - Pocket Authentication Token.
     * @param {string} chain - Blockchain hash.
     * @memberof SessionManager
     */
    SessionManager.prototype.getSessionKey = function (pocketAAT, chain) {
        var hash = js_sha3_1.sha3_256.create();
        hash.update(JSON.stringify(pocketAAT).concat(chain));
        return hash.toString();
    };
    /**
     * Removes the first Session in the queue for the specified blockchain.
     * @param {PocketAAT} pocketAAT - Pocket Authentication Token.
     * @param {string} chain - Blockchain hash.
     * @memberof SessionManager
     */
    SessionManager.prototype.destroySession = function (pocketAAT, chain) {
        var key = this.getSessionKey(pocketAAT, chain);
        this.sessionMap.get(key).dequeue();
    };
    /**
     * Save every new Session inside of the KVStore object. All the Sessions saved using this method can be recover if the current execution of the application is terminated.
     * @param {PocketAAT} pocketAAT - Pocket Authentication Token.
     * @param {SessionHeader} header - SessionHeader object.
     * @param {Configuration} configuration - Configuration object
     * @memberof SessionManager
     */
    SessionManager.prototype.saveCurrentSession = function (pocketAAT, header, configuration) {
        return __awaiter(this, void 0, void 0, function () {
            var currentSession, key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCurrentSession(pocketAAT, header.chain, configuration, header.sessionBlockHeight)];
                    case 1:
                        currentSession = _a.sent();
                        key = this.getSessionKey(pocketAAT, header.chain);
                        if (type_guard_1.typeGuard(currentSession, session_1.Session)) {
                            if (!this.sessionMap.has(key)) {
                                this.sessionMap.set(key, new queue_1.Queue());
                            }
                            this.sessionMap.get(key).enqueue(currentSession);
                            return [2 /*return*/, undefined];
                        }
                        else {
                            return [2 /*return*/, currentSession];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return SessionManager;
}());
exports.SessionManager = SessionManager;
