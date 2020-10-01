"use strict";
exports.__esModule = true;
var client_1 = require("./namespaces/client");
var query_1 = require("./namespaces/query");
/**
 * RPC Namespace
 */
var RPC = /** @class */ (function () {
    /**
     * RPC Class for the query and client namespaces.
     * @param {IRPCProvider} rpcProvider - RPC Provider.
     */
    function RPC(rpcProvider) {
        this.rpcProvider = rpcProvider;
        this.client = new client_1.ClientNamespace(this.rpcProvider);
        this.query = new query_1.QueryNamespace(this.rpcProvider);
    }
    return RPC;
}());
exports.RPC = RPC;
