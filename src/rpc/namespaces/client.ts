import { IRPCProvider } from "../providers"
import { typeGuard } from "../.."
import { RawTxResponse, RpcError, RawTxRequest, V1RPCRoutes, RelayRequest, RelayResponse, DispatchRequest, DispatchResponse } from ".."

export class ClientNamespace {

    public readonly rpcProvider: IRPCProvider

    public constructor(rpcProvider: IRPCProvider) {
        this.rpcProvider = rpcProvider
    }

    /**
     * Method to call the v1/client/rawtx endpoint of a given node
     * @param fromAddress {Buffer | string} The address of the sender
     * @param tx {Buffer | string} The amino encoded transaction bytes
     * @param node {Node}
     * @param configuration {Configuration}
     */
    public async rawtx(
        fromAddress: Buffer | string,
        tx: Buffer | string,
        timeout: number = 60000
    ): Promise<RawTxResponse | RpcError> {
        try {
            const request = new RawTxRequest(fromAddress.toString('hex'), tx.toString('hex'))
            const payload = JSON.stringify(request.toJSON())
            const response = await this.rpcProvider.send(V1RPCRoutes.ClientRawTx.toString(), payload, timeout)

            // Check if response is an error
            if (typeGuard(response, RpcError)) {
                return response as RpcError
            } else {
                const rawTxResponse = RawTxResponse.fromJSON(response)
                if (typeGuard(rawTxResponse, Error)) {
                    return RpcError.fromError(rawTxResponse as Error)
                } else {
                    return rawTxResponse as RawTxResponse
                }
            }
        } catch (err) {
            return RpcError.fromError(err)
        }
    }

    /**
     *
     * Sends a relay
     * @param {Object} payload - Payload object containing the needed parameters.
     * @param {Node} node - Node that will receive the relay.
     * @param {Configuration} configuration - Configuration object containing preferences information.
     * @memberof RequestManager
     */
    public async relay(
        request: RelayRequest,
        timeout: number = 6000
    ): Promise<RelayResponse | RpcError> {
        try {
            const payload = JSON.stringify(request.toJSON())
            const response = await this.rpcProvider.send(V1RPCRoutes.ClientRelay.toString(), payload, timeout)

            // Check if response is an error
            if (!typeGuard(response, RpcError)) {
                const relayResponse = RelayResponse.fromJSON(
                    response
                )
                return relayResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to send relay request with error: " + response.message
                )
            }
        } catch (err) {
            console.dir(err, { colors: true, depth: null })
            return new RpcError("0", err)
        }
    }
    /**
     * Sends a dispatch request
     * @param {Object} payload - Payload object containing the needed parameters.
     * @param {Node} node - Node that will receive the relay.
     * @param {Configuration} configuration - Configuration object containing preferences information.
     * @memberof RequestManager
     */
    public async dispatch(
        request: DispatchRequest,
        timeout: number = 60000
    ): Promise<DispatchResponse | RpcError> {
        try {
            const response = await this.rpcProvider.send(
                V1RPCRoutes.ClientDispatch.toString(),
                JSON.stringify(request.toJSON()),
                timeout
            )

            // Check if response is an error
            if (!typeGuard(response, RpcError)) {
                const dispatchResponse = DispatchResponse.fromJSON(
                    response
                )
                return dispatchResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to send dispatch request with error: " + response.message
                )
            }
        } catch (err) {
            return new RpcError("0", err)
        }
    }

}