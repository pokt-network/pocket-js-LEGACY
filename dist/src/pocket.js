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
Object.defineProperty(exports, "__esModule", { value: true });
var configuration_1 = require("./configuration/configuration");
var models_1 = require("./models");
/**
 *
 *
 * @class Pocket
 */
var Pocket = /** @class */ (function () {
    /**
     * Creates an instance of Pocket.
     * @param {Object} opts - Options for the initializer, devID, networkName, netIDs, maxNodes, requestTimeOut.
     * @memberof Pocket
     */
    function Pocket(opts) {
        if (opts === void 0) { opts = {}; }
        var blockchains = [];
        if (opts.devID == null || opts.networkName == null || opts.netIDs == null) {
            throw new Error("Invalid number of arguments");
        }
        if (Array.isArray(opts.netIDs)) {
            opts.netIDs.forEach(function (element) {
                var blockchain = new models_1.Blockchain(opts.networkName, element);
                blockchains.push(blockchain.toJSON());
            });
        }
        else {
            var blockchain = new models_1.Blockchain(opts.networkName, opts.netIDs);
            blockchains.push(blockchain.toJSON());
        }
        this.configuration = new configuration_1.Configuration(opts.devID, blockchains, opts.maxNodes || 5, opts.requestTimeOut || 10000, opts.sslOnly || true);
    }
    /**
     *
     * Create a Relay instance
     * @param {Blockchain} blockchain - Blockchain object.
     * @param {String} data - String holding the json rpc call.
       * @param {string} httpMethod - (Optional) HTTP Method.
       * @param {string} path - (Optional) API path.
       * @param {Object} queryParams - (Optional) An object holding the query params.
       * @param {Object} headers - (Optional) An object holding the HTTP Headers.
     * @returns {Relay} - New Relay instance.
     * @memberof Pocket
     */
    Pocket.prototype.createRelay = function (blockchain, data, httpMethod, path, queryParams, headers) {
        if (httpMethod === void 0) { httpMethod = ""; }
        if (path === void 0) { path = ""; }
        if (queryParams === void 0) { queryParams = ""; }
        if (headers === void 0) { headers = {}; }
        // Check if data is a json tring
        if (typeof data == 'string') {
            return new models_1.Relay(blockchain, data, this.configuration, httpMethod, path, queryParams, headers);
        }
        return new models_1.Relay(blockchain, JSON.stringify(data), this.configuration, httpMethod, path, queryParams, headers);
    };
    /**
     *
     * Create a Report instance
     * @param {String} ip - Internet protocol address.
     * @param {String} message - Brief description for the report.
     * @returns {Report} - New Report instance.
     * @memberof Pocket
     */
    Pocket.prototype.createReport = function (ip, message) {
        return new models_1.Report(ip, message, this.configuration);
    };
    /**
     *
     * Get a Dispatch instance or creates one
     * @returns {Dispatch} - New or existing Dispatch instance.
     * @memberof Pocket
     */
    Pocket.prototype.getDispatch = function () {
        if (this.configuration.dispatcher == null) {
            this.configuration.dispatcher = new models_1.Dispatch(this.configuration);
        }
        return this.configuration.dispatcher;
    };
    /**
     *
     * Filter nodes by netID and blockchain name
     * @param {String} netID - Network Idenfifier.
     * @param {String} network - Network Name.
     * @returns {Node} - New Node instance.
     * @memberof Pocket
     */
    Pocket.prototype.getNode = function (blockchain) {
        return __awaiter(this, void 0, void 0, function () {
            var nodes_1, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        nodes_1 = [];
                        if (!this.configuration.nodesIsEmpty()) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.retrieveNodes()];
                    case 1:
                        response = _a.sent();
                        if (response instanceof Error === true) {
                            throw response;
                        }
                        else {
                            // Save the nodes to the configuration.
                            this.configuration.setNodes(response);
                        }
                        _a.label = 2;
                    case 2:
                        this.configuration.nodes.forEach(function (node) {
                            if (node.isEqual(blockchain)) {
                                nodes_1.push(node);
                            }
                        });
                        if (nodes_1.length <= 0) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, nodes_1[Math.floor(Math.random() * nodes_1.length)]];
                    case 3:
                        error_1 = _a.sent();
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * Send a report
     * @param {Report} report - Report instance with the information.
     * @param {callback} callback - callback handler.
     * @returns {String} - A String with the response.
     * @memberof Pocket
     */
    Pocket.prototype.sendReport = function (report, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        // Check for report
                        if (report == null) {
                            throw new Error("Report is null");
                        }
                        // Verify all report properties are set
                        if (!report.isValid()) {
                            throw new Error("One or more Report properties are empty.");
                        }
                        return [4 /*yield*/, report.send()];
                    case 1:
                        response = _a.sent();
                        // Response
                        if (response instanceof Error === false) {
                            if (callback) {
                                callback(null, response);
                                return [2 /*return*/];
                            }
                            else {
                                return [2 /*return*/, response];
                            }
                        }
                        else {
                            if (callback) {
                                callback(response);
                                return [2 /*return*/];
                            }
                            else {
                                return [2 /*return*/, response];
                            }
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        if (callback) {
                            callback(error_2);
                            return [2 /*return*/];
                        }
                        else {
                            return [2 /*return*/, error_2];
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * Send an already created Relay
     * @param {Relay} relay - Relay instance with the information.
     * @param {callback} callback - callback handler.
     * @returns {String} - A String with the response.
     * @memberof Pocket
     */
    Pocket.prototype.sendRelay = function (relay, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var node, response, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        // Check for relay
                        if (relay == null) {
                            if (callback) {
                                callback(undefined, new Error("Relay is null or data field is missing"));
                                return [2 /*return*/];
                            }
                            else {
                                return [2 /*return*/, new Error("Relay is null or data field is missing")];
                            }
                        }
                        // Verify all relay properties are set
                        if (!relay.isValid()) {
                            if (callback) {
                                callback(undefined, new Error("Relay is missing a property, please verify all properties."));
                                return [2 /*return*/];
                            }
                            else {
                                return [2 /*return*/, new Error("Relay is missing a property, please verify all properties.")];
                            }
                        }
                        return [4 /*yield*/, this.getNode(relay.blockchain)];
                    case 1:
                        node = _a.sent();
                        if (node == null) {
                            if (callback) {
                                callback(undefined, new Error("Node is empty."));
                                return [2 /*return*/];
                            }
                            else {
                                return [2 /*return*/, new Error("Node is empty.")];
                            }
                        }
                        return [4 /*yield*/, node.sendRelay(relay)];
                    case 2:
                        response = _a.sent();
                        // Response
                        if (response instanceof Error === false) {
                            if (callback) {
                                callback(response);
                                return [2 /*return*/];
                            }
                            else {
                                return [2 /*return*/, response];
                            }
                        }
                        else {
                            if (callback) {
                                callback(undefined, response);
                                return [2 /*return*/];
                            }
                            else {
                                return [2 /*return*/, response];
                            }
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        if (callback) {
                            callback(undefined, new Error("Failed to send relay with error: " + error_3));
                            return [2 /*return*/];
                        }
                        else {
                            return [2 /*return*/, new Error("Failed to send relay with error: " + error_3)];
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * Retrieve a list of service nodes from the Node Dispatcher
     * @param {callback} callback
     * @returns {Node} - A list of Nodes.
     * @memberof Pocket
     */
    Pocket.prototype.retrieveNodes = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var dispatch, nodes, response, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        dispatch = this.getDispatch();
                        nodes = [];
                        return [4 /*yield*/, dispatch.retrieveServiceNodes()];
                    case 1:
                        response = _a.sent();
                        if (!(response instanceof Error) && response !== undefined && response.length != 0) {
                            // Save the nodes to the configuration.
                            this.configuration.nodes = nodes;
                            // Return a list of nodes
                            if (callback) {
                                callback(this.configuration.nodes);
                                return [2 /*return*/];
                            }
                            else {
                                return [2 /*return*/, this.configuration.nodes];
                            }
                        }
                        else {
                            // Returns an Error;
                            if (callback) {
                                callback(null, new Error("Failed to retrieve a list of nodes."));
                                return [2 /*return*/];
                            }
                            else {
                                return [2 /*return*/, new Error("Failed to retrieve a list of nodes.")];
                            }
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        if (callback) {
                            callback(null, new Error("Failed to retrieve a list of nodes with error: " + error_4));
                            return [2 /*return*/];
                        }
                        else {
                            return [2 /*return*/, new Error("Failed to retrieve a list of nodes with error: " + error_4)];
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return Pocket;
}());
exports.Pocket = Pocket;
//# sourceMappingURL=pocket.js.map