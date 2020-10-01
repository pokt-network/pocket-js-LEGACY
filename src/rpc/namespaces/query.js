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
var QueryNamespace = /** @class */ (function () {
    /**
     * @description Query namespace class
     * @param {IRPCProvider} rpcProvider - RPC Provider interface object.
     */
    function QueryNamespace(rpcProvider) {
        this.rpcProvider = rpcProvider;
    }
    /**
     *
     * Query a Block information
     * @param {BigInt} blockHeight - Block's number.
     * @param {number} timeout - Request timeout.
     * @memberof QueryNamespace
     */
    QueryNamespace.prototype.getBlock = function (blockHeight, timeout) {
        if (blockHeight === void 0) { blockHeight = BigInt(0); }
        if (timeout === void 0) { timeout = 60000; }
        return __awaiter(this, void 0, void 0, function () {
            var payload, response, queryBlockResponse, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (Number(blockHeight.toString()) < 0) {
                            return [2 /*return*/, new __2.RpcError("101", "block height can't be lower than 0")];
                        }
                        payload = JSON.stringify({ height: Number(blockHeight.toString()) });
                        return [4 /*yield*/, this.rpcProvider.send(__2.V1RPCRoutes.QueryBlock.toString(), payload, timeout)
                            // Check if response is an error
                        ];
                    case 1:
                        response = _a.sent();
                        // Check if response is an error
                        if (!__1.typeGuard(response, __2.RpcError)) {
                            queryBlockResponse = __2.QueryBlockResponse.fromJSON(response);
                            return [2 /*return*/, queryBlockResponse];
                        }
                        else {
                            return [2 /*return*/, new __2.RpcError(response.code, "Failed to retrieve the block information: " + response.message)];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        return [2 /*return*/, new __2.RpcError("0", err_1)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * Retrieves a transaction information
     * @param {string} txHash - Transaction hash.
     * @param {number} timeout - Request timeout.
     * @memberof QueryNamespace
     */
    QueryNamespace.prototype.getTX = function (txHash, timeout) {
        if (timeout === void 0) { timeout = 60000; }
        return __awaiter(this, void 0, void 0, function () {
            var payload, response, queryTXResponse, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!__1.Hex.isHex(txHash) && __1.Hex.byteLength(txHash) !== 20) {
                            return [2 /*return*/, new __2.RpcError("0", "Invalid Address Hex")];
                        }
                        payload = JSON.stringify({ hash: txHash });
                        return [4 /*yield*/, this.rpcProvider.send(__2.V1RPCRoutes.QueryTX.toString(), payload, timeout)
                            // Check if response is an error
                        ];
                    case 1:
                        response = _a.sent();
                        // Check if response is an error
                        if (!__1.typeGuard(response, __2.RpcError)) {
                            queryTXResponse = __2.QueryTXResponse.fromJSON(response);
                            return [2 /*return*/, queryTXResponse];
                        }
                        else {
                            return [2 /*return*/, new __2.RpcError(response.code, "Failed to retrieve the block information: " + response.message)];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        return [2 /*return*/, new __2.RpcError("0", err_2)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * Get the current network block height
     * @param {number} timeout - Request timeout.
     * @memberof QueryNamespace
     */
    QueryNamespace.prototype.getHeight = function (timeout) {
        if (timeout === void 0) { timeout = 60000; }
        return __awaiter(this, void 0, void 0, function () {
            var response, queryHeightResponse, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.rpcProvider.send(__2.V1RPCRoutes.QueryHeight.toString(), "", timeout)
                            // Check if response is an error
                        ];
                    case 1:
                        response = _a.sent();
                        // Check if response is an error
                        if (!__1.typeGuard(response, __2.RpcError)) {
                            queryHeightResponse = __2.QueryHeightResponse.fromJSON(response);
                            return [2 /*return*/, queryHeightResponse];
                        }
                        else {
                            return [2 /*return*/, new __2.RpcError(response.code, "Failed to retrieve the network block height: " + response.message)];
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
    /**
     *
     * Retrieves an account balance
     * @param {string} address - Account's address.
     * @param {BigInt} blockHeight - Block's number.
     * @param {number} timeout - Request timeout.
     * @memberof QueryNamespace
     */
    QueryNamespace.prototype.getBalance = function (address, blockHeight, timeout) {
        if (blockHeight === void 0) { blockHeight = BigInt(0); }
        if (timeout === void 0) { timeout = 60000; }
        return __awaiter(this, void 0, void 0, function () {
            var payload, response, queryBalanceResponse, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (Number(blockHeight.toString()) < 0) {
                            return [2 /*return*/, new __2.RpcError("101", "block height can't be lower than 0")];
                        }
                        if (!__1.Hex.isHex(address) && __1.Hex.byteLength(address) !== 20) {
                            return [2 /*return*/, new __2.RpcError("0", "Invalid Address Hex")];
                        }
                        payload = JSON.stringify({ "address": address, "height": Number(blockHeight.toString()) });
                        return [4 /*yield*/, this.rpcProvider.send(__2.V1RPCRoutes.QueryBalance.toString(), payload, timeout)
                            // Check if response is an error
                        ];
                    case 1:
                        response = _a.sent();
                        // Check if response is an error
                        if (!__1.typeGuard(response, __2.RpcError)) {
                            queryBalanceResponse = __2.QueryBalanceResponse.fromJSON(response);
                            return [2 /*return*/, queryBalanceResponse];
                        }
                        else {
                            return [2 /*return*/, new __2.RpcError(response.code, "Failed to retrieve current balance: " + response.message)];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_4 = _a.sent();
                        return [2 /*return*/, new __2.RpcError("0", err_4)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * Retrieves a list of nodes
     * @param {StakingStatus} stakingStatus - Staking status.
     * @param {BigInt} blockHeight - Block's number.
     * @param {number} timeout - Request timeout.
     * @memberof QueryNamespace
     */
    QueryNamespace.prototype.getNodes = function (stakingStatus, blockHeight, timeout) {
        if (blockHeight === void 0) { blockHeight = BigInt(0); }
        if (timeout === void 0) { timeout = 60000; }
        return __awaiter(this, void 0, void 0, function () {
            var payload, response, queryNodesResponse, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (Number(blockHeight.toString()) < 0) {
                            return [2 /*return*/, new __2.RpcError("101", "block height can't be lower than 0")];
                        }
                        payload = JSON.stringify({
                            height: Number(blockHeight.toString()),
                            staking_status: stakingStatus
                        });
                        return [4 /*yield*/, this.rpcProvider.send(__2.V1RPCRoutes.QueryNodes.toString(), payload, timeout)
                            // Check if response is an error
                        ];
                    case 1:
                        response = _a.sent();
                        // Check if response is an error
                        if (!__1.typeGuard(response, __2.RpcError)) {
                            queryNodesResponse = __2.QueryNodesResponse.fromJSON(response);
                            return [2 /*return*/, queryNodesResponse];
                        }
                        else {
                            return [2 /*return*/, new __2.RpcError(response.code, "Failed to retrieve a list of nodes: " + response.message)];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_5 = _a.sent();
                        return [2 /*return*/, new __2.RpcError("0", err_5)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * Query a Node information
     * @param {string} address - Node address.
     * @param {BigInt} blockHeight - Block's number.
     * @param {number} timeout - Request timeout.
     * @memberof QueryNamespace
     */
    QueryNamespace.prototype.getNode = function (address, blockHeight, timeout) {
        if (blockHeight === void 0) { blockHeight = BigInt(0); }
        if (timeout === void 0) { timeout = 60000; }
        return __awaiter(this, void 0, void 0, function () {
            var payload, response, queryNodeResponse, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (Number(blockHeight.toString()) < 0) {
                            return [2 /*return*/, new __2.RpcError("101", "block height can't be lower than 0")];
                        }
                        if (!__1.Hex.isHex(address) && __1.Hex.byteLength(address) !== 20) {
                            return [2 /*return*/, new __2.RpcError("0", "Invalid Address Hex")];
                        }
                        payload = JSON.stringify({
                            address: address,
                            height: Number(blockHeight.toString())
                        });
                        return [4 /*yield*/, this.rpcProvider.send(__2.V1RPCRoutes.QueryNode.toString(), payload, timeout)
                            // Check if response is an error
                        ];
                    case 1:
                        response = _a.sent();
                        // Check if response is an error
                        if (!__1.typeGuard(response, __2.RpcError)) {
                            queryNodeResponse = __2.QueryNodeResponse.fromJSON(response);
                            return [2 /*return*/, queryNodeResponse];
                        }
                        else {
                            return [2 /*return*/, new __2.RpcError(response.code, "Failed to retrieve the node information: " + response.message)];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_6 = _a.sent();
                        return [2 /*return*/, new __2.RpcError("0", err_6)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * Retrieves the node params
     * @param {BigInt} blockHeight - Block's number.
     * @param {number} timeout - Request timeout.
     * @memberof QueryNamespace
     */
    QueryNamespace.prototype.getNodeParams = function (blockHeight, timeout) {
        if (blockHeight === void 0) { blockHeight = BigInt(0); }
        if (timeout === void 0) { timeout = 60000; }
        return __awaiter(this, void 0, void 0, function () {
            var payload, response, queryNodeParamsResponse, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (Number(blockHeight.toString()) < 0) {
                            return [2 /*return*/, new __2.RpcError("101", "block height can't be lower than 0")];
                        }
                        payload = JSON.stringify({ height: Number(blockHeight.toString()) });
                        return [4 /*yield*/, this.rpcProvider.send(__2.V1RPCRoutes.QueryNodeParams.toString(), payload, timeout)
                            // Check if response is an error
                        ];
                    case 1:
                        response = _a.sent();
                        // Check if response is an error
                        if (!__1.typeGuard(response, __2.RpcError)) {
                            queryNodeParamsResponse = __2.QueryNodeParamsResponse.fromJSON(response);
                            return [2 /*return*/, queryNodeParamsResponse];
                        }
                        else {
                            return [2 /*return*/, new __2.RpcError(response.code, "Failed to retrieve the node params information: " + response.message)];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_7 = _a.sent();
                        return [2 /*return*/, new __2.RpcError("0", err_7)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * Retrieves the node proofs information
     * @param {string} address - Node's address.
     * @param {BigInt} blockHeight - Block's number.
     * @param {number} timeout - Request timeout.
     * @memberof QueryNamespace
     */
    QueryNamespace.prototype.getNodeProofs = function (address, blockHeight, timeout) {
        if (blockHeight === void 0) { blockHeight = BigInt(0); }
        if (timeout === void 0) { timeout = 60000; }
        return __awaiter(this, void 0, void 0, function () {
            var payload, response, queryNodeProofsResponse, err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (Number(blockHeight.toString()) < 0) {
                            return [2 /*return*/, new __2.RpcError("101", "block height can't be lower than 0")];
                        }
                        if (!__1.Hex.isHex(address) && __1.Hex.byteLength(address) !== 20) {
                            return [2 /*return*/, new __2.RpcError("0", "Invalid Address Hex")];
                        }
                        payload = JSON.stringify({
                            address: address,
                            height: Number(blockHeight.toString())
                        });
                        return [4 /*yield*/, this.rpcProvider.send(__2.V1RPCRoutes.QueryNodeProofs.toString(), payload, timeout)
                            // Check if response is an error
                        ];
                    case 1:
                        response = _a.sent();
                        // Check if response is an error
                        if (!__1.typeGuard(response, __2.RpcError)) {
                            queryNodeProofsResponse = __2.QueryNodeProofsResponse.fromJSON(response);
                            return [2 /*return*/, queryNodeProofsResponse];
                        }
                        else {
                            return [2 /*return*/, new __2.RpcError(response.code, "Failed to retrieve the node proofs: " + response.message)];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_8 = _a.sent();
                        return [2 /*return*/, new __2.RpcError("0", err_8)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * Retrieves the node proof information
     * @param {NodeProof} nodeProof - Node's address.
     * @param {number} timeout - Request timeout.
     * @memberof QueryNamespace
     */
    QueryNamespace.prototype.getNodeProof = function (nodeProof, timeout) {
        if (timeout === void 0) { timeout = 60000; }
        return __awaiter(this, void 0, void 0, function () {
            var payload, response, queryNodeProofResponse, err_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!nodeProof.isValid()) {
                            return [2 /*return*/, new __2.RpcError("0", "Invalid Node Proof")];
                        }
                        payload = JSON.stringify(nodeProof.toJSON());
                        return [4 /*yield*/, this.rpcProvider.send(__2.V1RPCRoutes.QueryNodeProof.toString(), payload, timeout)
                            // Check if response is an error
                        ];
                    case 1:
                        response = _a.sent();
                        // Check if response is an error
                        if (!__1.typeGuard(response, __2.RpcError)) {
                            queryNodeProofResponse = __2.QueryNodeProofResponse.fromJSON(response);
                            return [2 /*return*/, queryNodeProofResponse];
                        }
                        else {
                            return [2 /*return*/, new __2.RpcError(response.code, "Failed to retrieve the node proof: " + response.message)];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_9 = _a.sent();
                        return [2 /*return*/, err_9];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * Retrieves a list of apps
     * @param {StakingStatus} stakingStatus - Staking status.
     * @param {BigInt} blockHeight - Block's number.
     * @param {number} timeout - Request timeout.
     * @memberof QueryNamespace
     */
    QueryNamespace.prototype.getApps = function (stakingStatus, blockHeight, timeout) {
        if (blockHeight === void 0) { blockHeight = BigInt(0); }
        if (timeout === void 0) { timeout = 60000; }
        return __awaiter(this, void 0, void 0, function () {
            var payload, response, queryAppsResponse, err_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (Number(blockHeight.toString()) < 0) {
                            return [2 /*return*/, new __2.RpcError("101", "block height can't be lower than 0")];
                        }
                        payload = JSON.stringify({
                            height: Number(blockHeight.toString()),
                            staking_status: stakingStatus
                        });
                        return [4 /*yield*/, this.rpcProvider.send(__2.V1RPCRoutes.QueryApps.toString(), payload, timeout)
                            // Check if response is an error
                        ];
                    case 1:
                        response = _a.sent();
                        // Check if response is an error
                        if (!__1.typeGuard(response, __2.RpcError)) {
                            queryAppsResponse = __2.QueryAppsResponse.fromJSON(response);
                            return [2 /*return*/, queryAppsResponse];
                        }
                        else {
                            return [2 /*return*/, new __2.RpcError(response.code, "Failed to retrieve the list of apps: " + response.message)];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_10 = _a.sent();
                        return [2 /*return*/, new __2.RpcError("0", err_10)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * Retrieves an app information
     * @param {string} address - Address of the app.
     * @param {BigInt} blockHeight - Block's number.
     * @param {number} timeout - Request timeout.
     * @memberof QueryNamespace
     */
    QueryNamespace.prototype.getApp = function (address, blockHeight, timeout) {
        if (blockHeight === void 0) { blockHeight = BigInt(0); }
        if (timeout === void 0) { timeout = 60000; }
        return __awaiter(this, void 0, void 0, function () {
            var payload, response, queryAppResponse, err_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!__1.Hex.isHex(address) && __1.Hex.byteLength(address) !== 20) {
                            return [2 /*return*/, new __2.RpcError("0", "Invalid Address Hex")];
                        }
                        if (Number(blockHeight.toString()) < 0) {
                            return [2 /*return*/, new __2.RpcError("101", "block height can't be lower than 0")];
                        }
                        payload = JSON.stringify({
                            address: address,
                            height: Number(blockHeight.toString())
                        });
                        return [4 /*yield*/, this.rpcProvider.send(__2.V1RPCRoutes.QueryApp.toString(), payload, timeout)
                            // Check if response is an error
                        ];
                    case 1:
                        response = _a.sent();
                        // Check if response is an error
                        if (!__1.typeGuard(response, __2.RpcError)) {
                            queryAppResponse = __2.QueryAppResponse.fromJSON(response);
                            return [2 /*return*/, queryAppResponse];
                        }
                        else {
                            return [2 /*return*/, new __2.RpcError(response.code, "Failed to retrieve the app infromation: " + response.message)];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_11 = _a.sent();
                        return [2 /*return*/, new __2.RpcError("0", err_11)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * Retrieves app params.
     * @param {BigInt} blockHeight - Block's number.
     * @param {number} timeout - Request timeout.
     * @memberof QueryNamespace
     */
    QueryNamespace.prototype.getAppParams = function (blockHeight, timeout) {
        if (blockHeight === void 0) { blockHeight = BigInt(0); }
        if (timeout === void 0) { timeout = 60000; }
        return __awaiter(this, void 0, void 0, function () {
            var payload, response, queryAppParamsResponse, err_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (Number(blockHeight.toString()) < 0) {
                            return [2 /*return*/, new __2.RpcError("101", "block height can't be lower than 0")];
                        }
                        payload = JSON.stringify({ height: Number(blockHeight.toString()) });
                        return [4 /*yield*/, this.rpcProvider.send(__2.V1RPCRoutes.QueryAppParams.toString(), payload, timeout)
                            // Check if response is an error
                        ];
                    case 1:
                        response = _a.sent();
                        // Check if response is an error
                        if (!__1.typeGuard(response, __2.RpcError)) {
                            queryAppParamsResponse = __2.QueryAppParamsResponse.fromJSON(response);
                            return [2 /*return*/, queryAppParamsResponse];
                        }
                        else {
                            return [2 /*return*/, new __2.RpcError(response.code, "Failed to retrieve the app params: " + response.message)];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_12 = _a.sent();
                        return [2 /*return*/, new __2.RpcError("0", err_12)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * Retrieves the pocket params.
     * @param {BigInt} blockHeight - Block's number.
     * @param {number} timeout - Request timeout.
     * @memberof QueryNamespace
     */
    QueryNamespace.prototype.getPocketParams = function (blockHeight, timeout) {
        if (blockHeight === void 0) { blockHeight = BigInt(0); }
        if (timeout === void 0) { timeout = 60000; }
        return __awaiter(this, void 0, void 0, function () {
            var payload, response, queryPocketParamsResponse, err_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (Number(blockHeight.toString()) < 0) {
                            return [2 /*return*/, new __2.RpcError("101", "block height can't be lower than 0")];
                        }
                        payload = JSON.stringify({ height: Number(blockHeight.toString()) });
                        return [4 /*yield*/, this.rpcProvider.send(__2.V1RPCRoutes.QueryPocketParams.toString(), payload, timeout)
                            // Check if response is an error
                        ];
                    case 1:
                        response = _a.sent();
                        // Check if response is an error
                        if (!__1.typeGuard(response, __2.RpcError)) {
                            queryPocketParamsResponse = __2.QueryPocketParamsResponse.fromJSON(response);
                            return [2 /*return*/, queryPocketParamsResponse];
                        }
                        else {
                            return [2 /*return*/, new __2.RpcError(response.code, "Failed to retrieve the pocket params: " + response.message)];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_13 = _a.sent();
                        return [2 /*return*/, new __2.RpcError("0", err_13)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * Retrieves supported chains
     * @param {BigInt} blockHeight - Block's number.
     * @param {number} timeout - Request timeout.
     * @memberof QueryNamespace
     */
    QueryNamespace.prototype.getSupportedChains = function (blockHeight, timeout) {
        if (blockHeight === void 0) { blockHeight = BigInt(0); }
        if (timeout === void 0) { timeout = 60000; }
        return __awaiter(this, void 0, void 0, function () {
            var payload, response, querySupportedChainsResponse, err_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (Number(blockHeight.toString()) < 0) {
                            return [2 /*return*/, new __2.RpcError("101", "block height can't be lower than 0")];
                        }
                        payload = JSON.stringify({ height: Number(blockHeight.toString()) });
                        return [4 /*yield*/, this.rpcProvider.send(__2.V1RPCRoutes.QuerySupportedChains.toString(), payload, timeout)
                            // Check if response is an error
                        ];
                    case 1:
                        response = _a.sent();
                        // Check if response is an error
                        if (!__1.typeGuard(response, __2.RpcError)) {
                            querySupportedChainsResponse = __2.QuerySupportedChainsResponse.fromJSON(response);
                            return [2 /*return*/, querySupportedChainsResponse];
                        }
                        else {
                            return [2 /*return*/, new __2.RpcError(response.code, "Failed to retrieve the supported chains list: " + response.message)];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_14 = _a.sent();
                        return [2 /*return*/, new __2.RpcError("0", err_14)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * Retrieves current supply information
     * @param {BigInt} blockHeight - Block's number.
     * @param {number} timeout - Request timeout.
     * @memberof QueryNamespace
     */
    QueryNamespace.prototype.getSupply = function (blockHeight, timeout) {
        if (blockHeight === void 0) { blockHeight = BigInt(0); }
        if (timeout === void 0) { timeout = 60000; }
        return __awaiter(this, void 0, void 0, function () {
            var payload, response, querySupplyResponse, err_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (Number(blockHeight.toString()) < 0) {
                            return [2 /*return*/, new __2.RpcError("101", "block height can't be lower than 0")];
                        }
                        payload = JSON.stringify({ height: Number(blockHeight.toString()) });
                        return [4 /*yield*/, this.rpcProvider.send(__2.V1RPCRoutes.QuerySupply.toString(), payload, timeout)
                            // Check if response is an error
                        ];
                    case 1:
                        response = _a.sent();
                        // Check if response is an error
                        if (!__1.typeGuard(response, __2.RpcError)) {
                            querySupplyResponse = __2.QuerySupplyResponse.fromJSON(response);
                            return [2 /*return*/, querySupplyResponse];
                        }
                        else {
                            return [2 /*return*/, new __2.RpcError(response.code, "Failed to retrieve the supply information: " + response.message)];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_15 = _a.sent();
                        return [2 /*return*/, new __2.RpcError("0", err_15)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * Retrieves current supply information
     * @param {string} address - Account's address.
     * @param {number} timeout - Request timeout.
     * @memberof QueryNamespace
     */
    QueryNamespace.prototype.getAccount = function (address, timeout) {
        if (timeout === void 0) { timeout = 60000; }
        return __awaiter(this, void 0, void 0, function () {
            var payload, response, queryAccountResponse, err_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!__1.Hex.isHex(address) && __1.Hex.byteLength(address) !== 20) {
                            return [2 /*return*/, new __2.RpcError("0", "Invalid Address Hex")];
                        }
                        payload = JSON.stringify({ address: address });
                        return [4 /*yield*/, this.rpcProvider.send(__2.V1RPCRoutes.QueryAccount.toString(), payload, timeout)
                            // Check if response is an error
                        ];
                    case 1:
                        response = _a.sent();
                        // Check if response is an error
                        if (!__1.typeGuard(response, __2.RpcError)) {
                            queryAccountResponse = __2.QueryAccountResponse.fromJSON(response);
                            return [2 /*return*/, queryAccountResponse];
                        }
                        else {
                            return [2 /*return*/, new __2.RpcError(response.code, "Failed to retrieve the supply information: " + response.message)];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_16 = _a.sent();
                        return [2 /*return*/, new __2.RpcError("0", err_16)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return QueryNamespace;
}());
exports.QueryNamespace = QueryNamespace;
