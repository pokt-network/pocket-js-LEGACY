"use strict";
exports.__esModule = true;
/**
 * Enum listing versions supported by this SDK
 */
var Versions;
(function (Versions) {
    Versions["V1"] = "/v1";
})(Versions || (Versions = {}));
/**
 * Enum indicating all the routes in the V1 RPC Interface
 */
var V1RPCRoutes;
(function (V1RPCRoutes) {
    V1RPCRoutes["QueryAccount"] = "/v1/query/account";
    V1RPCRoutes["QueryBlock"] = "/v1/query/block";
    V1RPCRoutes["QueryTX"] = "/v1/query/tx";
    V1RPCRoutes["QueryHeight"] = "/v1/query/height";
    V1RPCRoutes["QueryBalance"] = "/v1/query/balance";
    V1RPCRoutes["QueryNodes"] = "/v1/query/nodes";
    V1RPCRoutes["QueryNode"] = "/v1/query/node";
    V1RPCRoutes["QueryNodeParams"] = "/v1/query/nodeparams";
    V1RPCRoutes["QueryNodeProofs"] = "/v1/query/nodeproofs";
    V1RPCRoutes["QueryNodeProof"] = "/v1/query/nodeproof";
    V1RPCRoutes["QueryApps"] = "/v1/query/apps";
    V1RPCRoutes["QueryApp"] = "/v1/query/app";
    V1RPCRoutes["QueryAppParams"] = "/v1/query/appparams";
    V1RPCRoutes["QueryPocketParams"] = "/v1/query/pocketparams";
    V1RPCRoutes["QuerySupportedChains"] = "/v1/query/supportedchains";
    V1RPCRoutes["QuerySupply"] = "/v1/query/supply";
    V1RPCRoutes["ClientRawTx"] = "/v1/client/rawtx";
    V1RPCRoutes["ClientDispatch"] = "/v1/client/dispatch";
    V1RPCRoutes["ClientRelay"] = "/v1/client/relay";
})(V1RPCRoutes = exports.V1RPCRoutes || (exports.V1RPCRoutes = {}));
