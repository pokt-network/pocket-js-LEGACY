import { IRPCProvider } from "./i-rpc-provider"
import axios from "axios"
import { RpcError, typeGuard } from "@pokt-network/pocket-js-utils"
import { Session } from "@pokt-network/pocket-js-rpc-models"
import * as https from 'https'

/**
 * @author Luis C. de León <luis@pokt.network>
 * @description The HttpRpcProvider class implements the IRCProvider interface.
 */
export class HttpRpcProvider implements IRPCProvider {
    public readonly baseURL: URL
    /**
     * Utility function to send requests.
     * @param {URL} baseURL - Base URL.
     */
    public constructor(baseURL: URL) {
        this.baseURL = baseURL
    }
    /**
     * Utility function to send a request.
     * @param {string} path - Request path
     * @param {string} payload - Request payload to send.
     * @param {number} timeout - Request timeout.
     * @param {boolean} rejectSelfSignedCertificates - force certificates to come from CAs
     * @returns {string | RpcError} Response string or RpcError
     * @memberof HttpRpcProvider
     */
    public async send(path: string, payload: string, timeout: number = 10000, rejectSelfSignedCertificates: boolean = true): Promise<string | RpcError> {
        try {
            const axiosInstance = axios.create({
                httpsAgent: new https.Agent({  
                    rejectUnauthorized: rejectSelfSignedCertificates
                  }),
                baseURL: this.baseURL.toString(),
                headers: {
                    "Content-Type": "application/json"
                },
                timeout: timeout
            })
            const response = await axiosInstance.post(path, payload)
            if (response.status === 200) {
                
                for (let index = 0; index <= 10; index++) {
                    if (typeGuard(response.data, "string")) {
                        response.data = JSON.parse(response.data)
                    }
                }

                return JSON.stringify(response.data)
            } else {
                return this.handleResponseError(response)
            }
        } catch (error) {  
            if (error.response !== undefined && error.response.data !== undefined) {
                return this.handleResponseError(error.response)
            }

            return RpcError.fromError(error)
        }
    }
    /**
     * Utility function to handle any response error.
     * @param {any} response - Http request response object.
     * @returns {RpcError} - RpcError object.
     * @memberof HttpRpcProvider
     */
     handleResponseError(response: any): RpcError {
        if (response.data.error !== undefined) {
            const errorObj = response.data.error
            // Error code
            const code = errorObj.code || "0"
            let message = JSON.stringify(errorObj)
            // Error message
            if (errorObj.message) {
                message = errorObj.message
            }

            // Does error contains the dispatch information?
            const dispatch = response.data.dispatch !== undefined ? response.data.dispatch : undefined
            
            // Generate a Session
            let session
            if (dispatch !== undefined && dispatch !== null) {
                session = Session.fromJSON(JSON.stringify(dispatch))
            }

            return new RpcError(code.toString(), message, session)
        } else {
            const regex = /Code: (\d+)/g
            const codeExtract = regex.exec(response.data.message)

            let code = "0"
            if (codeExtract) {
                code = codeExtract[1]
            }
            
            return RpcError.fromRelayError(code, JSON.stringify(response.data))
        }
    }
}