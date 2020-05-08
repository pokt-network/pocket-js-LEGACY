import { IRPCProvider } from "../providers"
import { typeGuard, validateRelayResponse } from "../.."
import { RawTxResponse, RpcError, RawTxRequest, V1RPCRoutes, RelayRequest, RelayResponse, DispatchRequest, DispatchResponse } from ".."

export class ClientNamespace {

    public readonly rpcProvider: IRPCProvider
    /**
     * @description Client namespace class
     * @param {IRPCProvider} rpcProvider - RPC Provider interface object.
     */
    public constructor(rpcProvider: IRPCProvider) {
        this.rpcProvider = rpcProvider
    }

    /**
     * Method to call the v1/client/rawtx endpoint of a given node
     * @param {Buffer | string} fromAddress - The address of the sender
     * @param {Buffer | string} tx - The amino encoded transaction bytes
     * @param {number} timeout - Request timeout.
     * @returns {Promise<RawTxResponse | RpcError>} - A Raw transaction Response object or Rpc error.
     * @memberof ClientNamespace
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
                const rawTxResponse = RawTxResponse.fromJSON(JSON.stringify(response))

                if (typeGuard(rawTxResponse, RawTxResponse)) {
                    if (rawTxResponse.logs && rawTxResponse.logs.length > 0) {
                        if (rawTxResponse.logs[0].success) {
                            return rawTxResponse
                        } else {
                            return new RpcError("", JSON.stringify(rawTxResponse.logs[0]))
                        }
                    }
                    return rawTxResponse
                }

                return RpcError.fromError(rawTxResponse as Error)
            }
        } catch (err) {
            return RpcError.fromError(err)
        }
    }
    /**
     *
     * Sends a relay
     * @param {RelayRequest} request - Payload object containing the needed parameters.
     * @param {number} timeout - Request timeout.
     * @returns {Promise<RelayResponse | RpcError>} - A Relay Response object or Rpc error
     * @memberof ClientNamespace
     */
    public async relay(
        request: RelayRequest,
        validateResponse: boolean,
        timeout: number = 60000
    ): Promise<RelayResponse | RpcError> {
        try {
            const payload = JSON.stringify(request.toJSON())
            const response = await this.rpcProvider.send(V1RPCRoutes.ClientRelay.toString(), payload, timeout)

            // Check if response is an error
            if (!typeGuard(response, RpcError)) {
                const relayResponse = RelayResponse.fromJSON(
                    JSON.stringify({request: request, response: JSON.parse(response)})
                )
                // Check if the relay response
                if (validateResponse) {
                    if (validateRelayResponse(relayResponse) !== undefined){
                        return new RpcError(
                            "912",
                            "Relay response validation failed due to a missmatch between the relay request and relay response"
                        )
                    }
                }
                return relayResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to send relay request with error: " + response.message
                )
            }
        } catch (err) {
            return new RpcError("0", err)
        }
    }
    /**
     * Sends a dispatch request
     * @param {DispatchRequest} request - Request object containing the needed parameters.
     * @param {number} timeout - Request timeout.
     * @returns {Promise<DispatchResponse | RpcError>} - A Dispatch Response object or Rpc error
     * @memberof ClientNamespace
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