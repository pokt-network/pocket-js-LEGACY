// Possible request path lists.
export enum Routes {
  DISPATCH = "/v1/client/dispatch",
  RELAY = "/v1/client/relay",
  VERSION = "/v1"
}

export enum RPCRoutes {
  QueryBlock = "/v1/query/block",
  QueryTX = "/v1/query/tx",
  QueryHeight = "/v1/query/height",
  QueryBalance = "/v1/query/balance",
  QueryNodes = "/v1/query/nodes",
  QueryNode = "/v1/query/node",
  QueryNodeParams = "/v1/query/nodeparams",
  QueryNodeProofs = "/v1/query/nodeproofs",
  QueryNodeProof = "/v1/query/nodeproof",
  QueryApps = "/v1/query/apps",
  QueryApp = "/v1/query/app",
  QueryAppParams = "/v1/query/appparams",
  QueryPocketParams = "/v1/query/pocketparams",
  QuerySupportedChains = "/v1/query/supportedchains",
  QuerySupply = "/v1/query/supply",
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
        return StakingStatus.Staked;
      case "unstaked":
        return StakingStatus.Unstaked;
      case "unstaking":
        return StakingStatus.Unstaking;
      case "":
        return StakingStatus.None;
      default:
        return StakingStatus.None;
    }
  }
}
