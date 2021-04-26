import { RpcError } from "@pokt-network/pocket-js-utils"

/**
 * Describes a provider which will be used by the RPC class to reach out to the Pocket Core RPC interface
 */
export interface IRPCProvider {
    send(
        path: string,
        payload: string,
        timeout: number, 
        rejectSelfSignedCertificates: boolean
    ): Promise<string | RpcError>
}