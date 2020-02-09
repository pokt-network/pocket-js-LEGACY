// import axios from "axios"
// import { Configuration } from "../config"
// import { typeGuard } from "../utils/type-guard"
// import { Node, StakingStatus, V1RPCRoutes } from "./models"
// import { DispatchRequest, NodeProof, RawTxRequest, RelayRequest } from "./models/input"
// import { DispatchResponse, QueryAccountResponse, QueryAppParamsResponse, QueryAppResponse, QueryAppsResponse, QueryBalanceResponse, QueryBlockResponse, QueryHeightResponse, QueryNodeParamsResponse, QueryNodeProofResponse, QueryNodeProofsResponse, QueryNodeResponse, QueryNodesResponse, QueryPocketParamsResponse, QuerySupplyResponse, QuerySupportedChainsResponse, QueryTXResponse, RawTxResponse, RelayResponse, RpcError, SendResponse } from "./models/output"
// import { Hex } from ".."
import { IRPCProvider } from "./providers"
import { ClientNamespace } from "./namespaces/client"
import { QueryNamespace } from "./namespaces/query"

/**
 * RPC Namespace
 */
export class RPC {

  public readonly rpcProvider: IRPCProvider
  public readonly client: ClientNamespace
  public readonly query: QueryNamespace

  public constructor(rpcProvider: IRPCProvider) {
    this.rpcProvider = rpcProvider
    this.client = new ClientNamespace(this.rpcProvider)
    this.query = new QueryNamespace(this.rpcProvider)
  }
}
