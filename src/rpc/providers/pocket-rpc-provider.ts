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
    public readonly enableConsensusRelay: boolean

    /**
     * Utility function to send requests.
     * @param {Pocket} pocket - Pocket Instance.
     * @param {PocketAAT} aat - Pocket AAT.
     * @param {string} blockchain - Blockchain Id.
     * @param {boolean} enableConsensusRelay - (Optional) True or false if the provider should so consensus relays or standard relays.
     */
    public constructor(pocket: Pocket, aat: PocketAAT, blockchain: string, enableConsensusRelay: boolean = false) {
        this.pocket = pocket
        this.aat = aat
        this.blockchain = blockchain
        this.enableConsensusRelay = enableConsensusRelay
    }
    /**
     * Utility function to send a request to the pocket blockchain.
     * @param {string} path - Request path
     * @param {string} payload - Request payload to send.
     * @returns {string | RpcError} Response string or RpcError
     * @memberof PocketRpcProvider
     */
    public async send(path: string, payload: string): Promise<string | RpcError> {
        try {
            if (this.enableConsensusRelay) {
                const relayResponse = await this.pocket.sendConsensusRelay(payload, this.blockchain, this.aat, undefined, undefined, HTTPMethod.NA, path, undefined)
                return this.handleReponse(relayResponse)
            }else {
                const relayResponse = await this.pocket.sendRelay(payload, this.blockchain, this.aat, undefined, undefined, HTTPMethod.NA, path, undefined, false)
                return this.handleReponse(relayResponse)
            }
        } catch (error) {
            if (error.response !== undefined && error.response.data !== undefined) {
                return RpcError.fromRelayError(error, JSON.stringify(error.response.data))
            }
            return RpcError.fromError(error)
        }
    }
    /**
     * @memberof PocketRpcProvider
     */
    private handleReponse(relayResponse: any): string | RpcError{
        // Check the relayResponse object type
        if (typeGuard(relayResponse, RelayResponse)) {
            // return relayResponse.payload
            let result = relayResponse.payload
            try {
                result = JSON.parse(result)
                
                for (let index = 0; index <= 10; index++) {
                    if (typeGuard(result, "string")) {
                        result = JSON.parse(result)
                    }
                }
                
                return JSON.stringify(result)
            } catch (error) {
                return RpcError.fromError(error)
            }
        } else {
            return relayResponse as RpcError
        }
    }

}