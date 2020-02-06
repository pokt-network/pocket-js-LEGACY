// Possible request path lists.
export enum Routes {
  DISPATCH = "/v1/client/dispatch",
  RELAY = "/v1/client/relay",
  VERSION = "/v1"
}

export enum RPCRoutes {
  QueryBlock = Routes.VERSION + "/query/block",
  QueryTX = Routes.VERSION + "/query/tx",
  QueryHeight = Routes.VERSION + "/query/height",
  QueryBalance = Routes.VERSION + "/query/balance",
  QueryNodes = Routes.VERSION + "/query/nodes",
  QueryNode = Routes.VERSION + "/query/node",
  QueryNodeParams = Routes.VERSION + "/query/nodeparams",
  QueryNodeProofs = Routes.VERSION + "/query/nodeproofs",
  QueryNodeProof = Routes.VERSION + "/query/nodeproof",
  QueryApps = Routes.VERSION + "/query/apps",
  QueryApp = Routes.VERSION + "/query/app",
  QueryAppParams = Routes.VERSION + "/query/appparams",
  QueryPocketParams = Routes.VERSION + "/query/pocketparams",
  QuerySupportedChains = Routes.VERSION + "/query/supportedchains",
  QuerySupply = Routes.VERSION + "/query/supply",
  ClientRawTx = Routes.VERSION + "/client/rawtx"
}

export enum StakingStatus {
  Staked = "staked",
  Unstaked = "unstaked",
  Unstaking = "unstaking",
  None = ""
}
export namespace StakingStatus {
  export function getStatus(status: string): StakingStatus {
    switch (status) {
      case "staked":
        return StakingStatus.Staked
      case "unstaked":
        return StakingStatus.Unstaked
      case "unstaking":
        return StakingStatus.Unstaking
      case "":
        return StakingStatus.None
      default:
        return StakingStatus.None
    }
  }
}
