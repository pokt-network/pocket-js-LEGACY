import { IRPCProvider } from "@pokt-network/pocket-js-http-provider"
import { RawTxResponse, DispatchRequest, DispatchResponse } from "@pokt-network/pocket-js-rpc-models"
import { RpcError } from "@pokt-network/pocket-js-utils"
import { RelayRequest, RelayResponse, } from "@pokt-network/pocket-js-relay-models"

/**
 * Interface indicating all the possible RPC Query requests to the Pocket Network
 */
 export interface IClient {
    rpcProvider: IRPCProvider

    /**
     * Method to call the v1/client/rawtx endpoint of a given node
     *
     * @param {Buffer | string} fromAddress - The address of the sender
     * @param {Buffer | string} tx - The amino encoded transaction bytes
     * @param {number} timeout - (Optional) Request timeout, default should be 60000.
     * @param {boolean} rejectSelfSignedCertificates - (Optional) Force certificates to come from CAs, default should be true.
     * @returns {Promise<RawTxResponse | RpcError>} - A Raw transaction Response object or Rpc error.
     * @memberof IClient
     */
    rawtx(
        fromAddress: Buffer | string,
        tx: Buffer | string,
        timeout?: number,
        rejectSelfSignedCertificates?: boolean
    ): Promise<RawTxResponse | RpcError>

    /**
     *
     * Sends a relay
     *
     * @param {RelayRequest} request - Payload object containing the needed parameters.
     * @param {number} timeout - (Optional) Request timeout, default should be 60000.
     * @param {boolean} rejectSelfSignedCertificates - (Optional) Force certificates to come from CAs, default should be true.
     * @returns {Promise<RelayResponse | RpcError>} - A Relay Response object or Rpc error
     * @memberof IClient
     */
    relay(
        request: RelayRequest,
        validateResponse: boolean,
        timeout?: number,
        rejectSelfSignedCertificates?: boolean
    ): Promise<RelayResponse | RpcError>

    /**
     * Sends a dispatch request
     *
     * @param {DispatchRequest} request - Request object containing the needed parameters.
     * @param {number} timeout - (Optional) Request timeout, default should be 60000.
     * @param {boolean} rejectSelfSignedCertificates - (Optional) Force certificates to come from CAs, default should be true.
     * @returns {Promise<DispatchResponse | RpcError>} - A Dispatch Response object or Rpc error
     * @memberof IClient
     */
    dispatch(
        request: DispatchRequest,
        timeout?: number,
        rejectSelfSignedCertificates?: boolean
    ): Promise<DispatchResponse | RpcError>
}