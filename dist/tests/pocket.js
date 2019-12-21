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
/**
 * @author Pabel Nunez Landestoy <pabel@pokt.network>
 * @description Unit test for the Pocket Core
 */
// Config
var config = require("../config.json");
// Constants
var chai_1 = require("chai");
var pocket_1 = require("../src/pocket");
var DEV_ID = config.dev_id;
describe('Pocket Class tests', function () {
    it('should instantiate a Pocket instance', function () {
        // Pocket options object
        var opts = {
            devID: DEV_ID,
            netIDs: [4],
            networkName: "ETH"
        };
        // New Pocket instance
        var pocket = new pocket_1.Pocket(opts);
        chai_1.expect(pocket).to.not.be.an.instanceof(Error);
        chai_1.expect(pocket).to.be.an.instanceof(pocket_1.Pocket);
    }).timeout(0);
    it('should fail to instantiate a Pocket instance', function () {
        // Pocket options object
        var opts = {
            netIDs: [4],
            networkName: "ETH"
        };
        // New Pocket instance
        var pocket = new pocket_1.Pocket(opts);
        chai_1.expect(pocket).to.be.an.instanceof(Error);
        chai_1.expect(pocket).to.not.be.an.instanceof(pocket_1.Pocket);
    }).timeout(0);
    it('should retrieve a list of nodes from the Node Dispatcher', function () { return __awaiter(void 0, void 0, void 0, function () {
        var opts, pocket, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    opts = {
                        devID: DEV_ID,
                        netIDs: [4],
                        networkName: "ETH"
                    };
                    pocket = new pocket_1.Pocket(opts);
                    return [4 /*yield*/, pocket.retrieveNodes()];
                case 1:
                    result = _a.sent();
                    chai_1.expect(result).to.not.be.an.instanceof(Error);
                    chai_1.expect(result).to.be.a('array');
                    return [2 /*return*/];
            }
        });
    }); }).timeout(0);
    it('should retrieve a list of SSL only nodes from the Node Dispatcher', function () { return __awaiter(void 0, void 0, void 0, function () {
        var opts, pocket, nodes, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    opts = {
                        devID: DEV_ID,
                        netIDs: [4],
                        networkName: "ETH",
                        sslOnly: true
                    };
                    pocket = new pocket_1.Pocket(opts);
                    return [4 /*yield*/, pocket.retrieveNodes()];
                case 1:
                    nodes = _a.sent();
                    chai_1.expect(nodes).to.not.be.an.instanceof(Error);
                    result = [];
                    nodes.forEach(function (node) {
                        if (node.port === "443") {
                            result.push(node);
                        }
                        else {
                            result.push(node);
                        }
                    });
                    return [2 /*return*/];
            }
        });
    }); }).timeout(0);
    it('should fail to retrieve a list of nodes from the Node Dispatcher', function () { return __awaiter(void 0, void 0, void 0, function () {
        var opts, pocket, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    opts = {
                        devID: DEV_ID,
                        netIDs: [40],
                        networkName: "ETH2" // Wrong network name for intentional error scenario
                    };
                    pocket = new pocket_1.Pocket(opts);
                    return [4 /*yield*/, pocket.retrieveNodes()];
                case 1:
                    result = _a.sent();
                    chai_1.expect(result).to.be.an.instanceof(Error);
                    return [2 /*return*/];
            }
        });
    }); }).timeout(0);
    it('should send a relay to a node in the network', function () { return __awaiter(void 0, void 0, void 0, function () {
        var opts, pocket, data, relay, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    opts = {
                        devID: DEV_ID,
                        netIDs: [4],
                        networkName: "ETH",
                        requestTimeOut: 40000
                    };
                    pocket = new pocket_1.Pocket(opts);
                    data = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f\",\"latest\"],\"id\":67}';
                    relay = pocket.createRelay(pocket.configuration.blockchains[0], data);
                    return [4 /*yield*/, pocket.sendRelay(relay)];
                case 1:
                    response = _a.sent();
                    chai_1.expect(response).to.not.be.an.instanceof(Error);
                    chai_1.expect(response).to.be.a('string');
                    return [2 /*return*/];
            }
        });
    }); }).timeout(0);
    it('should fail to send a relay to a node in the network with bad network ID', function () { return __awaiter(void 0, void 0, void 0, function () {
        var opts, pocket, data, relay, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    opts = {
                        devID: DEV_ID,
                        netIDs: [10],
                        networkName: "ETH",
                        requestTimeOut: 40000
                    };
                    pocket = new pocket_1.Pocket(opts);
                    data = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f\",\"latest\"],\"id\":67}';
                    relay = pocket.createRelay(pocket.configuration.blockchains[0], data);
                    return [4 /*yield*/, pocket.sendRelay(relay)];
                case 1:
                    response = _a.sent();
                    chai_1.expect(response).to.be.an.instanceof(Error);
                    return [2 /*return*/];
            }
        });
    }); }).timeout(0);
    it('should send a relay to a node with REST API support in the network', function () { return __awaiter(void 0, void 0, void 0, function () {
        var opts, pocket, httpMethod, path, headers, relay, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    opts = {
                        devID: DEV_ID,
                        netIDs: ["MAINNET"],
                        networkName: "TEZOS",
                        requestTimeOut: 40000
                    };
                    pocket = new pocket_1.Pocket(opts);
                    httpMethod = "GET";
                    path = "/network/version";
                    headers = { "Content-Type": "application/json" };
                    relay = pocket.createRelay(pocket.configuration.blockchains[0], "", httpMethod, path, "", headers);
                    return [4 /*yield*/, pocket.sendRelay(relay)];
                case 1:
                    response = _a.sent();
                    chai_1.expect(response).to.not.be.an.instanceof(Error);
                    chai_1.expect(response).to.be.a('string');
                    return [2 /*return*/];
            }
        });
    }); }).timeout(0);
    it('should send a report of a node to the Node Dispatcher', function () { return __awaiter(void 0, void 0, void 0, function () {
        var opts, pocket, nodes, node, report, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    opts = {
                        devID: DEV_ID,
                        netIDs: [4],
                        networkName: "ETH"
                    };
                    pocket = new pocket_1.Pocket(opts);
                    return [4 /*yield*/, pocket.retrieveNodes()];
                case 1:
                    nodes = _a.sent();
                    // Should return a list of nodes
                    chai_1.expect(nodes).to.be.a('array');
                    node = pocket.configuration.nodes[0];
                    // TODO: Check if is a Node type object
                    chai_1.expect(node).to.be.an('object');
                    report = pocket.createReport(node.ip, "test please ignore");
                    return [4 /*yield*/, pocket.sendReport(report)];
                case 2:
                    response = _a.sent();
                    chai_1.expect(response).to.not.be.an.instanceof(Error);
                    chai_1.expect(response).to.be.a('string');
                    return [2 /*return*/];
            }
        });
    }); }).timeout(0);
    it('should fail to send a report of a node to the Node Dispatcher with no Node IP', function () { return __awaiter(void 0, void 0, void 0, function () {
        var opts, pocket, nodes, node, report, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    opts = {
                        devID: DEV_ID,
                        netIDs: [4],
                        networkName: "ETH"
                    };
                    pocket = new pocket_1.Pocket(opts);
                    return [4 /*yield*/, pocket.retrieveNodes()];
                case 1:
                    nodes = _a.sent();
                    // Should return a list of nodes
                    chai_1.expect(nodes).to.be.a('array');
                    node = pocket.configuration.nodes[0];
                    // TODO: Check if is a Node type object
                    chai_1.expect(node).to.be.an('object');
                    report = pocket.createReport("", "test please ignore");
                    return [4 /*yield*/, pocket.sendReport(report)];
                case 2:
                    response = _a.sent();
                    chai_1.expect(response).to.be.an.instanceof(Error);
                    return [2 /*return*/];
            }
        });
    }); }).timeout(0);
});
//# sourceMappingURL=pocket.js.map