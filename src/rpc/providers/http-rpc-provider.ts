import { IRPCProvider } from "./i-rpc-provider"
import axios from "axios"
import { RpcError } from "../errors"
import { typeGuard } from "../../utils/type-guard"

/**
 * @author Luis C. de León <luis@pokt.network>
 * @description The HttpRpcProvider class implements the IRCProvider interface.
 */
export class HttpRpcProvider implements IRPCProvider{
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
     * @param {string} path - The private key to sign with
     * @param {string} payload - Request payload to send.
     * @param {number} timeout - Request timeout.
     * @returns {Buffer | Error} The signature or an Error
     * @memberof HttpRpcProvider
     */
    public async send(path: string, payload: string, timeout: number): Promise<string | RpcError> {
        try {
            const axiosInstance = axios.create({
                baseURL: this.baseURL.toString(),
                headers: {
                    "Content-Type": "application/json"
                },
                timeout: timeout
            })
            const response = await axiosInstance.post(path, payload)
            if (response.status === 200) {
                if (typeGuard(response.data, 'string')) {
                    return JSON.parse(response.data)
                }
                return JSON.stringify(response.data)
            } else {
                return new RpcError(response.status.toString(), JSON.stringify(response.data))
            }
        } catch (error) {
            return RpcError.fromError(error)
        }
    }

}