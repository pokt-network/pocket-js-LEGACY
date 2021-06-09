import { HttpRpcProvider, IRPCProvider } from "@pokt-network/pocket-js-http-provider"
import { typeGuard, RpcError } from "@pokt-network/pocket-js-utils"
import { RawTxResponse, RawTxRequest, V1RPCRoutes, DispatchRequest, DispatchResponse, validateRelayResponse } from "@pokt-network/pocket-js-rpc-models"
import { RelayRequest, RelayResponse } from "@pokt-network/pocket-js-relay-models"
import { IClient } from "./i-client"


export class Client implements IClient {

    public readonly rpcProvider: IRPCProvider
    /**
     * @description Client namespace class
     * @param {IRPCProvider} rpcProvider - RPC Provider or the provider URL.
     */
    public constructor(rpcProvider: IRPCProvider | URL) {
        if (typeGuard(rpcProvider, URL)) {
            this.rpcProvider = new HttpRpcProvider(rpcProvider)
        } else {
            this.rpcProvider = rpcProvider
        }
    }

    /**
     * Method to call the v1/client/rawtx endpoint of a given node
     * @param {Buffer | string} fromAddress - The address of the sender
     * @param {Buffer | string} tx - The amino encoded transaction bytes
     * @param {number} timeout - Request timeout.
     * @param {boolean} rejectSelfSignedCertificates - force certificates to come from CAs
     * @returns {Promise<RawTxResponse | RpcError>} - A Raw transaction Response object or Rpc error.
     * @memberof Client
     */
    public async rawtx(
        fromAddress: Buffer | string,
        tx: Buffer | string,
        timeout: number = 60000,
        rejectSelfSignedCertificates: boolean = true
    ): Promise<RawTxResponse | RpcError> {
        try {
            const request = new RawTxRequest(fromAddress.toString('hex'), tx.toString('hex'))
            const payload = JSON.stringify(request.toJSON())
            const response = await this.rpcProvider.send(V1RPCRoutes.ClientRawTx.toString(), payload, timeout, rejectSelfSignedCertificates)

            // Check if response is an error
            if (typeGuard(response, RpcError)) {
                return response as RpcError
            } else {
                const rawTxResponse = RawTxResponse.fromJSON(response)

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
     * @param {boolean} rejectSelfSignedCertificates - force certificates to come from CAs
     * @returns {Promise<RelayResponse | RpcError>} - A Relay Response object or Rpc error
     * @memberof Client
     */
    public async relay(
        request: RelayRequest,
        validateResponse: boolean,
        timeout: number = 60000,
        rejectSelfSignedCertificates: boolean = true
    ): Promise<RelayResponse | RpcError> {
        try {
            const payload = JSON.stringify(request.toJSON())
            const response = await this.rpcProvider.send(V1RPCRoutes.ClientRelay.toString(), payload, timeout, rejectSelfSignedCertificates)

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
                return response
            }
        } catch (err) {
            return new RpcError("NA", err)
        }
    }
    /**
     * Sends a dispatch request
     * @param {DispatchRequest} request - Request object containing the needed parameters.
     * @param {number} timeout - Request timeout.
     * @param {boolean} rejectSelfSignedCertificates - force certificates to come from CAs
     * @returns {Promise<DispatchResponse | RpcError>} - A Dispatch Response object or Rpc error
     * @memberof Client
     */
    public async dispatch(
        request: DispatchRequest,
        timeout: number = 60000,
        rejectSelfSignedCertificates: boolean = true
    ): Promise<DispatchResponse | RpcError> {
        try {
            const response = await this.rpcProvider.send(
                V1RPCRoutes.ClientDispatch.toString(),
                JSON.stringify(request.toJSON()),
                timeout, 
                rejectSelfSignedCertificates
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