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

  /**
   * Sends a request
   * @param {string} path - Path.
   * @param {Object} payload - Payload object with the parameters.
   * @param {Node} node - Node that will receive the relay.
   * @param {Configuration} configuration - Configuration object containing preferences information.
   * @memberof RequestManager
   */
  // export async function send(
  //   path: string = "",
  //   payload: {},
  //   node: Node,
  //   configuration: Configuration
  // ): Promise<SendResponse | RpcError> {
  //   try {
  //     const axiosInstance = axios.create({
  //       baseURL: node.serviceURL,
  //       headers: {
  //         "Content-Type": "application/json"
  //       },
  //       timeout: configuration.requestTimeOut
  //     })
  //     // Await response
  //     const response = await axiosInstance.post(path, payload)
  //     // Create SendResponse object
  //     const sendResponse = SendResponse.fromAxiosResponse(response)
  //     // If successs 200
  //     if (sendResponse.status === 200) {
  //       return sendResponse
  //     } else {
  //       return new RpcError(
  //         sendResponse.status.toString(),
  //         JSON.stringify(sendResponse.data)
  //       )
  //     }
  //   } catch (error) {
  //     console.dir(error, { colors: true, depth: null })
  //     throw error
  //   }
  // }

  /**
  * Namespace mapping all of the /query namespace endpoints
  */
  // export namespace Query {
    
  // }
}
