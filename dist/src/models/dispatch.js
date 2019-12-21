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
var axios_1 = require("axios");
var node_1 = require("./node");
var blockchain_1 = require("./blockchain");
var constants = require("../utils/constants");
// Dispatch
/**
 *
 *
 * @class Dispatch
 */
var Dispatch = /** @class */ (function () {
    /**
     * Creates an instance of Dispatch.
     * @param {Configuration} configuration - Configuration object.
     * @memberof Dispatch
     */
    function Dispatch(configuration) {
        this.configuration = configuration;
        this.axiosInstance = axios_1.default.create({
            headers: {
                "Content-Type": "application/json"
            },
            timeout: this.configuration.requestTimeOut,
            url: constants.dispatchNodeURL + constants.dispatchPath
        });
    }
    /**
     *
     * blockchain object to JSON
     * @returns {JSON} - JSON Array with the blockchain list.
     * @memberof Dispatch
     */
    Dispatch.prototype.blockchainsJSON = function () {
        var blockchainArray = [];
        this.configuration.blockchains.forEach(function (element) {
            blockchainArray.push(element);
        });
        return blockchainArray;
    };
    /**
     *
     * Retrieves a list of service nodes
     * @param {callback} callback
     * @returns {Node} - A Node object list.
     * @memberof Dispatch
     */
    Dispatch.prototype.retrieveServiceNodes = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var dispatch, response, nodes, filteredNodes, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        dispatch = this;
                        response = null;
                        return [4 /*yield*/, this.axiosInstance.post(constants.dispatchPath, {
                                Blockchains: dispatch.blockchainsJSON(),
                                DevID: dispatch.configuration.devID
                            })];
                    case 1:
                        response = _a.sent();
                        if (response !== null &&
                            response.status === 200 &&
                            response.data !== null) {
                            nodes = this.parseDispatchResponse(response.data);
                            filteredNodes = nodes;
                            // Check if SSL only nodes are requested
                            if (this.configuration.sslOnly) {
                                filteredNodes = this.sslOnlyNodes(nodes);
                            }
                            // Check if filteredNodes is an error
                            if (filteredNodes instanceof Error === false) {
                                if (callback) {
                                    callback(filteredNodes);
                                    return [2 /*return*/];
                                }
                                else {
                                    return [2 /*return*/, filteredNodes];
                                }
                            }
                            else {
                                if (callback) {
                                    callback(undefined, filteredNodes);
                                    return [2 /*return*/];
                                }
                                else {
                                    return [2 /*return*/, filteredNodes];
                                }
                            }
                        }
                        else {
                            if (callback) {
                                callback(undefined, new Error("Failed to retrieve service nodes with error: " + response.data));
                                return [2 /*return*/];
                            }
                            else {
                                return [2 /*return*/, new Error("Failed to retrieve service nodes with error: " + response.data)];
                            }
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        if (callback) {
                            callback(undefined, new Error("Failed to retrieve service nodes with error: " + err_1));
                            return [2 /*return*/];
                        }
                        else {
                            return [2 /*return*/, new Error("Failed to retrieve service nodes with error: " + err_1)];
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * Parse the response from the dispatcher
     * @param {Object} response
     * @returns {Node} - A Node object list.
     * @memberof Dispatch
     */
    Dispatch.prototype.parseDispatchResponse = function (response) {
        if (response === void 0) { response = {}; }
        try {
            // Variables
            var nodes_1 = [];
            if (Array.isArray(response)) {
                // Iterate through the array for different networks results
                response.forEach(function (element) {
                    var blockchain = new blockchain_1.Blockchain(element.name, element.netID);
                    if (element.ips) {
                        // Create a Node object for each item inside the dataKey object, IP:PORT
                        element.ips.forEach(function (ipPort) {
                            var node = new node_1.Node(blockchain, ipPort);
                            nodes_1.push(node);
                        });
                    }
                });
            }
            return nodes_1;
        }
        catch (error) {
            return new Error("Failed to parsed service nodes with error: " + error);
        }
    };
    /**
     *
     * Filters a list of service nodes that supports SSL Only
     * @param {Node} node - A list of Nodes from the Dispatcher
     * @returns {Node} - A list of nodes with SSL Support
     * @memberof Dispatch
     */
    Dispatch.prototype.sslOnlyNodes = function (nodes) {
        var result = [];
        nodes.forEach(function (node) {
            if (node.port === "443") {
                result.push(node);
            }
        });
        if (result.length === 0) {
            return new Error("Failed to retrieve a list of nodes with SSL Support.");
        }
        return result;
    };
    return Dispatch;
}());
exports.Dispatch = Dispatch;
//# sourceMappingURL=dispatch.js.map