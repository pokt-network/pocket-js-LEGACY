/**
 * Enum listing versions supported by this SDK
 */
enum Versions {
  V1 = "/v1"
}

/**
 * Enum indicating all the routes in the V1 RPC Interface
 */
export enum V1RPCRoutes {
  QueryAccount = Versions.V1 + "/query/account",
  QueryAccountTxs = Versions.V1 + "/query/accounttxs",
  QueryBlock = Versions.V1 + "/query/block",
  QueryBlockTxs = Versions.V1 + "/query/blocktxs",
  QueryTX = Versions.V1 + "/query/tx",
  QueryHeight = Versions.V1 + "/query/height",
  QueryBalance = Versions.V1 + "/query/balance",
  QueryNodes = Versions.V1 + "/query/nodes",
  QueryNode = Versions.V1 + "/query/node",
  QueryNodeParams = Versions.V1 + "/query/nodeparams",
  QueryApps = Versions.V1 + "/query/apps",
  QueryApp = Versions.V1 + "/query/app",
  QueryAppParams = Versions.V1 + "/query/appparams",
  QueryPocketParams = Versions.V1 + "/query/pocketparams",
  QuerySupportedChains = Versions.V1 + "/query/supportedchains",
  QuerySupply = Versions.V1 + "/query/supply",
  QueryNodeClaim = Versions.V1 + "/query/nodeclaim",
  QueryNodeClaims = Versions.V1 + "/query/nodeclaims",
  QueryAllParams = Versions.V1 + "/query/allparams",
  QueryUpgrade = Versions.V1 + "/query/upgrade",
  ClientRawTx = Versions.V1 + "/client/rawtx",
  ClientDispatch = Versions.V1 + "/client/dispatch",
  ClientRelay = Versions.V1 + "/client/relay",
  ClientChallenge = Versions.V1 + "/client/challenge"
}