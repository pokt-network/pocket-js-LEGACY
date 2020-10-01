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
var __1 = require("../..");
var __2 = require("..");
var ClientNamespace = /** @class */ (function () {
    /**
     * @description Client namespace class
     * @param {IRPCProvider} rpcProvider - RPC Provider interface object.
     */
    function ClientNamespace(rpcProvider) {
        this.rpcProvider = rpcProvider;
    }
    /**
     * Method to call the v1/client/rawtx endpoint of a given node
     * @param {Buffer | string} fromAddress - The address of the sender
     * @param {Buffer | string} tx - The amino encoded transaction bytes
     * @param {number} timeout - Request timeout.
     * @returns {Promise<RawTxResponse | RpcError>} - A Raw transaction Response object or Rpc error.
     * @memberof ClientNamespace
     */
    ClientNamespace.prototype.rawtx = function (fromAddress, tx, timeout) {
        if (timeout === void 0) { timeout = 60000; }
        return __awaiter(this, void 0, void 0, function () {
            var request, payload, response, rawTxResponse, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        request = new __2.RawTxRequest(fromAddress.toString('hex'), tx.toString('hex'));
                        payload = JSON.stringify(request.toJSON());
                        return [4 /*yield*/, this.rpcProvider.send(__2.V1RPCRoutes.ClientRawTx.toString(), payload, timeout)
                            // Check if response is an error
                        ];
                    case 1:
                        response = _a.sent();
                        // Check if response is an error
                        if (__1.typeGuard(response, __2.RpcError)) {
                            return [2 /*return*/, response];
                        }
                        else {
                            rawTxResponse = __2.RawTxResponse.fromJSON(JSON.stringify(response));
                            if (__1.typeGuard(rawTxResponse, Error)) {
                                return [2 /*return*/, __2.RpcError.fromError(rawTxResponse)];
                            }
                            else {
                                return [2 /*return*/, rawTxResponse];
                            }
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        return [2 /*return*/, __2.RpcError.fromError(err_1)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * Sends a relay
     * @param {Object} request - Payload object containing the needed parameters.
     * @param {number} timeout - Request timeout.
     * @returns {Promise<RelayResponse | RpcError>} - A Relay Response object or Rpc error
     * @memberof ClientNamespace
     */
    ClientNamespace.prototype.relay = function (request, timeout) {
        if (timeout === void 0) { timeout = 6000; }
        return __awaiter(this, void 0, void 0, function () {
            var payload, response, relayResponse, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        payload = JSON.stringify(request.toJSON());
                        return [4 /*yield*/, this.rpcProvider.send(__2.V1RPCRoutes.ClientRelay.toString(), payload, timeout)
                            // Check if response is an error
                        ];
                    case 1:
                        response = _a.sent();
                        // Check if response is an error
                        if (!__1.typeGuard(response, __2.RpcError)) {
                            relayResponse = __2.RelayResponse.fromJSON(response);
                            return [2 /*return*/, relayResponse];
                        }
                        else {
                            return [2 /*return*/, new __2.RpcError(response.code, "Failed to send relay request with error: " + response.message)];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        console.dir(err_2, { colors: true, depth: null });
                        return [2 /*return*/, new __2.RpcError("0", err_2)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Sends a dispatch request
     * @param {DispatchRequest} request - Request object containing the needed parameters.
     * @param {number} timeout - Request timeout.
     * @returns {Promise<DispatchResponse | RpcError>} - A Dispatch Response object or Rpc error
     * @memberof ClientNamespace
     */
    ClientNamespace.prototype.dispatch = function (request, timeout) {
        if (timeout === void 0) { timeout = 60000; }
        return __awaiter(this, void 0, void 0, function () {
            var response, dispatchResponse, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.rpcProvider.send(__2.V1RPCRoutes.ClientDispatch.toString(), JSON.stringify(request.toJSON()), timeout)
                            // Check if response is an error
                        ];
                    case 1:
                        response = _a.sent();
                        // Check if response is an error
                        if (!__1.typeGuard(response, __2.RpcError)) {
                            dispatchResponse = __2.DispatchResponse.fromJSON(response);
                            return [2 /*return*/, dispatchResponse];
                        }
                        else {
                            return [2 /*return*/, new __2.RpcError(response.code, "Failed to send dispatch request with error: " + response.message)];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_3 = _a.sent();
                        return [2 /*return*/, new __2.RpcError("0", err_3)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return ClientNamespace;
}());
exports.ClientNamespace = ClientNamespace;
