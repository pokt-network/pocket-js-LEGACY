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
