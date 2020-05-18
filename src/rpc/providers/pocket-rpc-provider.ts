import { IRPCProvider } from "./i-rpc-provider"
import { RpcError } from "../errors"
import { typeGuard } from "../../utils/type-guard"
import { Pocket, PocketAAT, HTTPMethod } from "../../pocket"
import { RelayResponse } from "../models"

/**
 * @author Pabel Nunez L. <pabel@pokt.network>
 * @description The PocketRpcProvider class implements the IRCProvider interface.
 */
export class PocketRpcProvider implements IRPCProvider {
    public readonly pocket: Pocket
    public readonly aat: PocketAAT
    public readonly blockchain: string

    /**
     * Utility function to send requests.
     * @param {Pocket} pocket - Pocket Instance.
     * @param {PocketAAT} aat - Pocket AAT.
     * @param {string} blockchain - Blockchain Id.
     */
    public constructor(pocket: Pocket, aat: PocketAAT, blockchain: string) {
        this.pocket = pocket
        this.aat = aat
        this.blockchain = blockchain
    }
    /**
     * Utility function to send a request to the pocket blockchain.
     * @param {string} path - Request path
     * @param {string} payload - Request payload to send.
     * @param {number} timeout - Request timeout.
     * @returns {string | RpcError} Response string or RpcError
     * @memberof PocketRpcProvider
     */
    public async send(path: string, payload: string): Promise<string | RpcError> {
        try {
            const relayResponse = await this.pocket.sendRelay(payload, this.blockchain, this.aat, undefined, undefined, HTTPMethod.NA, path, undefined, false)

            if (typeGuard(relayResponse, RelayResponse)) {
                return relayResponse.payload
            } else {
                return relayResponse as RpcError
            }
        } catch (error) {
            if (error.response !== undefined && error.response.data !== undefined) {
                return RpcError.fromRelayError(error, JSON.stringify(error.response.data))
            }
            return RpcError.fromError(error)
        }
    }

}