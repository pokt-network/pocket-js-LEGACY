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
var constants = require("../utils/constants");
var httpsRequestProtocol = "https://";
var httpRequestProtocol = "http://";
// Dispatch
/**
 *
 *
 * @class Node
 */
var Node = /** @class */ (function () {
    /**
     * Creates an instance of Node.
     * @param {Blockchain} blockchain - Blockchain object.
     * @param {string} ipPort - Ip and port string ("127.0.0.1:80")
     * @memberof Node
     */
    function Node(blockchain, ipPort) {
        this.blockchain = blockchain;
        var ipPortArr = ipPort.split(":");
        this.ip = ipPortArr[0];
        this.port = ipPortArr[1];
        if (ipPort.indexOf(httpsRequestProtocol) > -1 ||
            ipPort.indexOf(httpRequestProtocol) > -1) {
            this.ipPort = ipPort;
        }
        else {
            if (this.port === "443") {
                this.ipPort = httpsRequestProtocol + ipPort;
            }
            else {
                this.ipPort = httpRequestProtocol + ipPort;
            }
        }
    }
    /**
     *
     * Verify if all properties are valid
     * @returns {boolean} - True or false.
     * @memberof Node
     */
    Node.prototype.isValid = function () {
        for (var property in this) {
            if (!this.hasOwnProperty(property) || property === "") {
                return false;
            }
        }
        return true;
    };
    /**
     *
     * Checks if params are equal to stored properties
     * @param {String} netID - Network Identifier.
     * @param {String} network - Network name.
     * @returns {boolean} - True or false.
     * @memberof Node
     */
    Node.prototype.isEqual = function (blockchain) {
        if (this.blockchain === blockchain) {
            return true;
        }
        return false;
    };
    /**
     *
     * Sends a relay to a service node
     * @param {Relay} relay - Relay object with the information.
     * @param {callback} callback - callback handler.
     * @returns {Object} - Object with the response.
     * @memberof Node
     */
    Node.prototype.sendRelay = function (relay, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var axiosInstance, response, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        axiosInstance = axios_1.default.create({
                            baseURL: this.ipPort,
                            headers: {
                                "Content-Type": "application/json"
                            },
                            timeout: relay.configuration.requestTimeOut
                        });
                        return [4 /*yield*/, axiosInstance.post(constants.relayPath, relay.toJSON())];
                    case 1:
                        response = _a.sent();
                        if (response.status === 200 && response.data !== null) {
                            result = response.data;
                            if (callback) {
                                callback(result);
                                return [2 /*return*/];
                            }
                            else {
                                return [2 /*return*/, result];
                            }
                        }
                        else {
                            if (callback) {
                                callback(null, new Error("Failed to send relay with error: " + response.data));
                                return [2 /*return*/];
                            }
                            else {
                                return [2 /*return*/, new Error("Failed to send relay with error: " + response.data)];
                            }
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        if (callback) {
                            callback(null, new Error("Failed to send relay with error: " + error_1));
                            return [2 /*return*/];
                        }
                        else {
                            return [2 /*return*/, new Error("Failed to send relay with error: " + error_1)];
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return Node;
}());
exports.Node = Node;
//# sourceMappingURL=node.js.map