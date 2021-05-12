import { IRPCProvider } from "./i-rpc-provider"
import { RpcError } from "../errors"
import { typeGuard } from "../../utils/type-guard"
import { Pocket, PocketAAT, HTTPMethod } from "../../pocket"
import { RelayResponse, ConsensusRelayResponse, ChallengeResponse } from "../models"

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
                if (typeGuard(relayResponse, ConsensusRelayResponse)) {
                    if (relayResponse.majorityResponse && relayResponse.majorityResponse.relays.length > 0) {
                        return this.handleReponse(relayResponse.majorityResponse.relays[0])
                    }else{
                        return new RpcError("", "Failed to retrieve a majority response relay from the consensus response")
                    }
                }else if(typeGuard(relayResponse, ChallengeResponse)){
                    let result = JSON.parse(relayResponse.response)
                
                    for (let index = 0; index <= 10; index++) {
                        if (typeGuard(result, "string")) {
                            result = JSON.parse(result)
                        }
                    }
                    
                    return JSON.stringify(result)
                }else {
                    return RpcError.fromError(relayResponse)
                }
            }else {
                const relayResponse = await this.pocket.sendRelay(payload, this.blockchain, this.aat, undefined, undefined, HTTPMethod.NA, path, undefined, false)
                return this.handleReponse(relayResponse)
            }
        } catch (error) {
            if (error.response !== undefined && error.response.data !== undefined && error.response.data.error !== undefined) {
                const errorObj = error.response.data.error
                // Error code
                const code = errorObj.code || "0"
                let message = JSON.stringify(errorObj)
                // Error message
                if (errorObj.message) {
                    message = errorObj.message
                }

                // Does error contains session information and nodes?
                const dispatch = error.response.data.dispatch !== undefined ? error.response.data.dispatch : undefined
                
                return new RpcError(code.toString(), message, dispatch)
            } else if (error.response !== undefined && error.response.data !== undefined) {
                const regex = /Code: (\d+)/g
                const codeExtract = regex.exec(error.response.data.message)

                let code = "0"
                if (codeExtract) {
                    code = codeExtract[1]
                }
                
                return RpcError.fromRelayError(code, JSON.stringify(error.response.data))
            }

            return RpcError.fromError(error)
        }
    }
    /**
     * @memberof PocketRpcProvider
     */
    private handleReponse(relayResponseOrError: any): string | RpcError{
        // Check the relayResponse object type
        if (typeGuard(relayResponseOrError, RelayResponse)) {
            // return relayResponse.payload
            let result = relayResponseOrError.payload
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
            const rpcError = relayResponseOrError as RpcError
            return rpcError
        }
    }

}