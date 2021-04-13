import { IRPCProvider } from "./i-rpc-provider"
import axios from "axios"
import { RpcError } from "../errors"
import { typeGuard } from "../../utils/type-guard"
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
                return new RpcError(response.status.toString(), JSON.stringify(response.data))
            }
        } catch (error) {
            if (error.response !== undefined && error.response.data !== undefined && error.response.data.error !== undefined) {
                const errorObj = error.response.data.error
                // Error code
                const code = errorObj.code || "0"
                let message = error.response.data.error
                // Error message
                if (errorObj.message) {
                    message = errorObj.message
                }

                // Does error contains session information and nodes?
                const dispatch = error.response.data.dispatch !== undefined ? error.response.data.dispatch : undefined

                return new RpcError(code.toString(), message, dispatch)
            }
            return RpcError.fromError(error)
        }
    }

}