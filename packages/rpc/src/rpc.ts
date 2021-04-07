import { IRPCProvider } from "@pokt-network/pocket-js-http-provider"
import { ClientNamespace } from "@pokt-network/pocket-js-rpc-client"
import { QueryNamespace } from "@pokt-network/pocket-js-rpc-query"

/**
 * RPC Namespace
 */
export class RPC {

  public readonly rpcProvider: IRPCProvider
  public readonly client: ClientNamespace
  public readonly query: QueryNamespace
  /**
   * RPC Class for the query and client namespaces.
   * @param {IRPCProvider} rpcProvider - RPC Provider.
   */
  public constructor(rpcProvider: IRPCProvider) {
    this.rpcProvider = rpcProvider
    this.client = new ClientNamespace(this.rpcProvider)
    this.query = new QueryNamespace(this.rpcProvider)
  }
}
