import { RpcError } from "../errors/rpc-error"

/**
 * Describes a provider which will be used by the RPC class to reach out to the Pocket Core RPC interface
 */
export interface IRPCProvider {
    send(
        path: string,
        payload: string,
        timeout: number
    ): Promise<string | RpcError>
}