import { IRPCProvider } from "./i-rpc-provider"
import axios from "axios"
import { RpcError } from "../errors"

export class HttpRpcProvider implements IRPCProvider{
    public readonly baseURL: URL

    public constructor(baseURL: URL) {
        this.baseURL = baseURL
    }

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
                return JSON.stringify(response.data.data)
            } else {
                return new RpcError(response.status.toString(), JSON.stringify(response.data))
            }
        } catch (error) {
            return RpcError.fromError(error)
        }
    }

}