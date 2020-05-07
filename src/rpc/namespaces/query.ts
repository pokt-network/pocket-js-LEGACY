import { IRPCProvider } from "../providers"
import { typeGuard, Hex } from "../.."
import { QueryBlockResponse, RpcError, V1RPCRoutes, QueryTXResponse, QueryHeightResponse, QueryBalanceResponse, QueryNodeResponse, QueryNodeParamsResponse, QueryNodeReceiptsResponse, NodeReceipt, QueryNodeReceiptResponse, QueryAppsResponse, QueryAppResponse, QueryAppParamsResponse, QueryPocketParamsResponse, QuerySupportedChainsResponse, QuerySupplyResponse, QueryAccountResponse, StakingStatus } from ".."
import { ChallengeRequest } from "../models/input/challenge-request"
import { ChallengeResponse } from "../models/output/challenge-response"
import { QueryAccountTxsResponse } from "../models/output/query-account-txs-response"
import { JailedStatus } from "../models/jailed-status"
import { QueryValidatorsResponse } from "../models"
import { QueryBlockTxsResponse } from "../models/output/query-block-txs-response"

export class QueryNamespace {
    public readonly rpcProvider: IRPCProvider
    /**
     * @description Query namespace class
     * @param {IRPCProvider} rpcProvider - RPC Provider interface object.
     */
    public constructor(rpcProvider: IRPCProvider) {
        this.rpcProvider = rpcProvider
    }

    /**
     *
     * Query a Block information
     * @param {BigInt} blockHeight - Block's number.
     * @param {number} timeout - Request timeout.
     * @memberof QueryNamespace
     */
    public async getBlock(
        blockHeight: BigInt = BigInt(0),
        timeout: number = 60000
    ): Promise<QueryBlockResponse | RpcError> {
        try {
            if (Number(blockHeight.toString()) < 0) {
                return new RpcError("101", "block height can't be lower than 0")
            }
            const payload = JSON.stringify({ height: Number(blockHeight.toString()) })

            const response = await this.rpcProvider.send(
                V1RPCRoutes.QueryBlock.toString(),
                payload,
                timeout
            )
            // Check if response is an error
            if (!typeGuard(response, RpcError)) {
                const queryBlockResponse = QueryBlockResponse.fromJSON(
                    response
                )
                return queryBlockResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to retrieve the block information: " + response.message
                )
            }
        } catch (err) {
            return new RpcError("0", err)
        }
    }
    /**
     *
     * Query a Block transaction list
     * @param {BigInt} blockHeight - Block's number.
     * @param {boolean} prove - True or false to include the tx proof.
     * @param {number} page - Page number, default 1.
     * @param {number} perPage - Records count per page, default 30.
     * @param {number} timeout - Request timeout.
     * @memberof QueryNamespace
     */
    public async getBlockTxs(
        blockHeight: BigInt = BigInt(0),
        prove: boolean,
        page: number = 1,
        perPage: number = 30,
        timeout: number = 60000
    ): Promise<QueryBlockTxsResponse | RpcError> {
        try {
            if (Number(blockHeight.toString()) < 0) {
                return new RpcError("101", "block height can't be lower than 0")
            }
            const payload = JSON.stringify(
                {
                    height: Number(blockHeight.toString()),
                    prove: prove,
                    page: page,
                    per_page: perPage
                }
            )

            const response = await this.rpcProvider.send(
                V1RPCRoutes.QueryBlockTxs.toString(),
                payload,
                timeout
            )
            // Check if response is an error
            if (!typeGuard(response, RpcError)) {
                const queryBlockTxsResponse = QueryBlockTxsResponse.fromJSON(
                    response
                )
                return queryBlockTxsResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to retrieve the block information: " + response.message
                )
            }
        } catch (err) {
            return new RpcError("0", err)
        }
    }
    /**
     *
     * Retrieves a transaction information
     * @param {string} txHash - Transaction hash.
     * @param {number} timeout - Request timeout.
     * @memberof QueryNamespace
     */
    public async getTX(
        txHash: string,
        timeout: number = 60000
    ): Promise<QueryTXResponse | RpcError> {
        try {
            if (!Hex.isHex(txHash) && Hex.byteLength(txHash) !== 20) {
                return new RpcError("0", "Invalid Address Hex")
            }

            const payload = JSON.stringify({ hash: txHash })

            const response = await this.rpcProvider.send(
                V1RPCRoutes.QueryTX.toString(),
                payload,
                timeout
            )

            // Check if response is an error
            if (!typeGuard(response, RpcError)) {
                const queryTXResponse = QueryTXResponse.fromJSON(
                    response
                )
                return queryTXResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to retrieve the block information: " + response.message
                )
            }
        } catch (err) {
            return new RpcError("0", err)
        }
    }
    /**
     *
     * Get the current network block height
     * @param {number} timeout - Request timeout.
     * @memberof QueryNamespace
     */
    public async getHeight(
        timeout: number = 60000
    ): Promise<QueryHeightResponse | RpcError> {
        try {
            const response = await this.rpcProvider.send(
                V1RPCRoutes.QueryHeight.toString(),
                "",
                timeout
            )

            // Check if response is an error
            if (!typeGuard(response, RpcError)) {
                const queryHeightResponse = QueryHeightResponse.fromJSON(
                    response
                )
                return queryHeightResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to retrieve the network block height: " + response.message
                )
            }
        } catch (err) {
            return new RpcError("0", err)
        }
    }
    /**
     *
     * Retrieves an account balance
     * @param {string} address - Account's address.
     * @param {BigInt} blockHeight - Block's number.
     * @param {number} timeout - Request timeout.
     * @memberof QueryNamespace
     */
    public async getBalance(
        address: string,
        blockHeight: BigInt = BigInt(0),
        timeout: number = 60000
    ): Promise<QueryBalanceResponse | RpcError> {
        try {
            if (Number(blockHeight.toString()) < 0) {
                return new RpcError("101", "block height can't be lower than 0")
            }

            if (!Hex.isHex(address) && Hex.byteLength(address) !== 20) {
                return new RpcError("0", "Invalid Address Hex")
            }

            const payload = JSON.stringify({ "address": address, "height": Number(blockHeight.toString()) })

            const response = await this.rpcProvider.send(
                V1RPCRoutes.QueryBalance.toString(),
                payload,
                timeout
            )

            // Check if response is an error
            if (!typeGuard(response, RpcError)) {
                const queryBalanceResponse = QueryBalanceResponse.fromJSON(
                    response
                )
                return queryBalanceResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to retrieve current balance: " + response.message
                )
            }
        } catch (err) {
            return new RpcError("0", err)
        }
    }
    /**
     *
     * Retrieves a list of validator nodes
     * @param {StakingStatus} stakingStatus - Staking status.
     * @param {JailedStatus} jailedStatus - Jailed status.
     * @param {BigInt} blockHeight - Block's number.
     * @param {string} blockchain - (optional) Blockchain Identifier.
     * @param {number} page - (optional) Page number, default 1.
     * @param {number} perPage - (optional) Records count per page, default 30.
     * @param {number} timeout - (optional) Request timeout.
     * @memberof QueryNamespace
     */
    public async getValidators(
        stakingStatus: StakingStatus = StakingStatus.Staked,
        jailedStatus: JailedStatus = JailedStatus.Unjailed,
        blockHeight: BigInt = BigInt(0),
        blockchain: string = "",
        page: number = 1,
        perPage: number = 30,
        timeout: number = 60000
    ): Promise<QueryValidatorsResponse | RpcError> {
        try {
            if (Number(blockHeight.toString()) < 0) {
                return new RpcError("101", "block height can't be lower than 0")
            }

            const payload = JSON.stringify({
                height: Number(blockHeight.toString()),
                opts: {
                    staking_status: stakingStatus,
                    jailed_status: jailedStatus,
                    blockchain: blockchain,
                    page: page,
                    per_page: perPage
                }
            })

            const response = await this.rpcProvider.send(
                V1RPCRoutes.QueryNodes.toString(),
                payload,
                timeout
            )

            // Check if response is an error
            if (!typeGuard(response, RpcError)) {
                const queryValidatorsResponse = QueryValidatorsResponse.fromJSON(
                    response
                )
                return queryValidatorsResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to retrieve a list of validator nodes: " + response.message
                )
            }
        } catch (err) {
            return new RpcError("0", err)
        }
    }
    /**
     *
     * Query a Node information
     * @param {string} address - Node address.
     * @param {BigInt} blockHeight - Block's number.
     * @param {number} timeout - Request timeout.
     * @memberof QueryNamespace
     */
    public async getNode(
        address: string,
        blockHeight: BigInt = BigInt(0),
        timeout: number = 60000
    ): Promise<QueryNodeResponse | RpcError> {
        try {
            if (Number(blockHeight.toString()) < 0) {
                return new RpcError("101", "block height can't be lower than 0")
            }

            if (!Hex.isHex(address) && Hex.byteLength(address) !== 20) {
                return new RpcError("0", "Invalid Address Hex")
            }

            const payload = JSON.stringify({
                address: address,
                height: Number(blockHeight.toString())
            })

            const response = await this.rpcProvider.send(
                V1RPCRoutes.QueryNode.toString(),
                payload,
                timeout
            )

            // Check if response is an error
            if (!typeGuard(response, RpcError)) {
                const queryNodeResponse = QueryNodeResponse.fromJSON(
                    response
                )
                return queryNodeResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to retrieve the node information: " + response.message
                )
            }
        } catch (err) {
            return new RpcError("0", err)
        }
    }
    /**
     *
     * Retrieves the node params
     * @param {BigInt} blockHeight - Block's number.
     * @param {number} timeout - Request timeout.
     * @memberof QueryNamespace
     */
    public async getNodeParams(
        blockHeight: BigInt = BigInt(0),
        timeout: number = 60000
    ): Promise<QueryNodeParamsResponse | RpcError> {
        try {
            if (Number(blockHeight.toString()) < 0) {
                return new RpcError("101", "block height can't be lower than 0")
            }

            const payload = JSON.stringify({ height: Number(blockHeight.toString()) })

            const response = await this.rpcProvider.send(
                V1RPCRoutes.QueryNodeParams.toString(),
                payload,
                timeout
            )

            // Check if response is an error
            if (!typeGuard(response, RpcError)) {
                const queryNodeParamsResponse = QueryNodeParamsResponse.fromJSON(
                    response
                )
                return queryNodeParamsResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to retrieve the node params information: " + response.message
                )
            }
        } catch (err) {
            return new RpcError("0", err)
        }
    }
    /**
     *
     * Retrieves the node receipts information
     * @param {string} address - Node's address.
     * @param {BigInt} blockHeight - Block's number.
     * @param {number} timeout - Request timeout.
     * @memberof QueryNamespace
     */
    public async getNodeReceipts(
        address: string,
        blockHeight: BigInt = BigInt(0),
        timeout: number = 60000
    ): Promise<QueryNodeReceiptsResponse | RpcError> {
        try {
            if (Number(blockHeight.toString()) < 0) {
                return new RpcError("101", "block height can't be lower than 0")
            }

            if (!Hex.isHex(address) && Hex.byteLength(address) !== 20) {
                return new RpcError("0", "Invalid Address Hex")
            }

            const payload = JSON.stringify({
                address: address,
                height: Number(blockHeight.toString())
            })

            const response = await this.rpcProvider.send(
                V1RPCRoutes.QueryNodeReceipts.toString(),
                payload,
                timeout
            )

            // Check if response is an error
            if (!typeGuard(response, RpcError)) {

                const queryNodeReceiptsResponse = QueryNodeReceiptsResponse.fromJSON(
                    response
                )
                return queryNodeReceiptsResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to retrieve the node receipts: " + response.message
                )
            }
        } catch (err) {
            return new RpcError("0", err)
        }
    }
    /**
     *
     * Retrieves the node receipt information
     * @param {NodeReceipt} nodeReceipt - Node's address.
     * @param {number} timeout - Request timeout.
     * @memberof QueryNamespace
     */
    public async getNodeReceipt(
        nodeReceipt: NodeReceipt,
        timeout: number = 60000
    ): Promise<QueryNodeReceiptResponse | RpcError> {
        try {
            if (!nodeReceipt.isValid()) {
                return new RpcError("0", "Invalid Node Receipt")
            }

            const payload = JSON.stringify(nodeReceipt.toJSON())

            const response = await this.rpcProvider.send(
                V1RPCRoutes.QueryNodeReceipt.toString(),
                payload,
                timeout
            )

            // Check if response is an error
            if (!typeGuard(response, RpcError)) {

                const queryNodeReceiptResponse = QueryNodeReceiptResponse.fromJSON(
                    response
                )
                return queryNodeReceiptResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to retrieve the node receipt: " + response.message
                )
            }
        } catch (err) {
            return err
        }
    }
    /**
     *
     * Retrieves a list of apps
     * @param {StakingStatus} stakingStatus - Staking status.
     * @param {BigInt} blockHeight - Block's number.
     * @param {string} blockchain - (optional) Blockchain identifier.
     * @param {BigInt} page - (optional) Block's number.
     * @param {BigInt} perPage - (optional) Block's number.
     * @param {number} timeout - (optional) Request timeout.
     * @memberof QueryNamespace
     */
    public async getApps(
        stakingStatus: StakingStatus,
        blockHeight: BigInt = BigInt(0),
        blockchain: string = "",
        page: number = 1,
        perPage: number = 30,
        timeout: number = 60000
    ): Promise<QueryAppsResponse | RpcError> {
        try {
            if (Number(blockHeight.toString()) < 0) {
                return new RpcError("101", "block height can't be lower than 0")
            }

            const payload = JSON.stringify({
                height: Number(blockHeight.toString()),
                opts: {
                    staking_status: stakingStatus,
                    blockchain: blockchain,
                    page: page,
                    per_page: perPage
                }
            })

            const response = await this.rpcProvider.send(
                V1RPCRoutes.QueryApps.toString(),
                payload,
                timeout
            )

            // Check if response is an error
            if (!typeGuard(response, RpcError)) {
                const queryAppsResponse = QueryAppsResponse.fromJSON(
                    response
                )
                return queryAppsResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to retrieve the list of apps: " + response.message
                )
            }
        } catch (err) {
            return new RpcError("0", err)
        }
    }
    /**
     *
     * Retrieves an app information
     * @param {string} address - Address of the app.
     * @param {BigInt} blockHeight - Block's number.
     * @param {number} timeout - Request timeout.
     * @memberof QueryNamespace
     */
    public async getApp(
        address: string,
        blockHeight: BigInt = BigInt(0),
        timeout: number = 60000
    ): Promise<QueryAppResponse | RpcError> {
        try {
            if (!Hex.isHex(address) && Hex.byteLength(address) !== 20) {
                return new RpcError("0", "Invalid Address Hex")
            }

            if (Number(blockHeight.toString()) < 0) {
                return new RpcError("101", "block height can't be lower than 0")
            }

            const payload = JSON.stringify({
                address: address,
                height: Number(blockHeight.toString())
            })

            const response = await this.rpcProvider.send(
                V1RPCRoutes.QueryApp.toString(),
                payload,
                timeout
            )

            // Check if response is an error
            if (!typeGuard(response, RpcError)) {
                const queryAppResponse = QueryAppResponse.fromJSON(
                    response
                )
                return queryAppResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to retrieve the app infromation: " + response.message
                )
            }
        } catch (err) {
            return new RpcError("0", err)
        }
    }
    /**
     *
     * Retrieves app params.
     * @param {BigInt} blockHeight - Block's number.
     * @param {number} timeout - Request timeout.
     * @memberof QueryNamespace
     */
    public async getAppParams(
        blockHeight: BigInt = BigInt(0),
        timeout: number = 60000
    ): Promise<QueryAppParamsResponse | RpcError> {
        try {
            if (Number(blockHeight.toString()) < 0) {
                return new RpcError("101", "block height can't be lower than 0")
            }

            const payload = JSON.stringify({ height: Number(blockHeight.toString()) })

            const response = await this.rpcProvider.send(
                V1RPCRoutes.QueryAppParams.toString(),
                payload,
                timeout
            )

            // Check if response is an error
            if (!typeGuard(response, RpcError)) {
                const queryAppParamsResponse = QueryAppParamsResponse.fromJSON(
                    response
                )
                return queryAppParamsResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to retrieve the app params: " + response.message
                )
            }
        } catch (err) {
            return new RpcError("0", err)
        }
    }
    /**
     *
     * Retrieves the pocket params.
     * @param {BigInt} blockHeight - Block's number.
     * @param {number} timeout - Request timeout.
     * @memberof QueryNamespace
     */
    public async getPocketParams(
        blockHeight: BigInt = BigInt(0),
        timeout: number = 60000
    ): Promise<QueryPocketParamsResponse | RpcError> {
        try {
            if (Number(blockHeight.toString()) < 0) {
                return new RpcError("101", "block height can't be lower than 0")
            }

            const payload = JSON.stringify({ height: Number(blockHeight.toString()) })

            const response = await this.rpcProvider.send(
                V1RPCRoutes.QueryPocketParams.toString(),
                payload,
                timeout
            )

            // Check if response is an error
            if (!typeGuard(response, RpcError)) {

                const queryPocketParamsResponse = QueryPocketParamsResponse.fromJSON(
                    response
                )
                return queryPocketParamsResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to retrieve the pocket params: " + response.message
                )
            }
        } catch (err) {
            return new RpcError("0", err)
        }
    }
    /**
     *
     * Retrieves supported chains
     * @param {BigInt} blockHeight - Block's number.
     * @param {number} timeout - Request timeout.
     * @memberof QueryNamespace
     */
    public async getSupportedChains(
        blockHeight: BigInt = BigInt(0),
        timeout: number = 60000
    ): Promise<QuerySupportedChainsResponse | RpcError> {
        try {
            if (Number(blockHeight.toString()) < 0) {
                return new RpcError("101", "block height can't be lower than 0")
            }

            const payload = JSON.stringify({ height: Number(blockHeight.toString()) })

            const response = await this.rpcProvider.send(
                V1RPCRoutes.QuerySupportedChains.toString(),
                payload,
                timeout
            )

            // Check if response is an error
            if (!typeGuard(response, RpcError)) {

                const querySupportedChainsResponse = QuerySupportedChainsResponse.fromJSON(
                    response
                )
                return querySupportedChainsResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to retrieve the supported chains list: " + response.message
                )
            }
        } catch (err) {
            return new RpcError("0", err)
        }
    }

    /**
     *
     * Retrieves current supply information
     * @param {BigInt} blockHeight - Block's number.
     * @param {number} timeout - Request timeout.
     * @memberof QueryNamespace
     */
    public async getSupply(
        blockHeight: BigInt = BigInt(0),
        timeout: number = 60000
    ): Promise<QuerySupplyResponse | RpcError> {
        try {
            if (Number(blockHeight.toString()) < 0) {
                return new RpcError("101", "block height can't be lower than 0")
            }

            const payload = JSON.stringify(
                {
                    height: Number(blockHeight.toString())
                }
            )

            const response = await this.rpcProvider.send(
                V1RPCRoutes.QuerySupply.toString(),
                payload,
                timeout
            )

            // Check if response is an error
            if (!typeGuard(response, RpcError)) {
                const querySupplyResponse = QuerySupplyResponse.fromJSON(
                    response
                )
                return querySupplyResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to retrieve the supply information: " + response.message
                )
            }
        } catch (err) {
            return new RpcError("0", err)
        }
    }

    /**
     *
     * Retrieves current Account information
     * @param {string} address - Account's address.
     * @param {number} timeout - Request timeout.
     * @memberof QueryNamespace
     */
    public async getAccount(
        address: string,
        timeout: number = 60000
    ): Promise<QueryAccountResponse | RpcError> {
        try {
            if (!Hex.isHex(address) && Hex.byteLength(address) !== 20) {
                return new RpcError("0", "Invalid Address Hex")
            }

            const payload = JSON.stringify({ address: address })

            const response = await this.rpcProvider.send(
                V1RPCRoutes.QueryAccount.toString(),
                payload,
                timeout
            )

            // Check if response is an error
            if (!typeGuard(response, RpcError)) {
                const queryAccountResponse = QueryAccountResponse.fromJSON(
                    response
                )
                return queryAccountResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to retrieve the supply information: " + response.message
                )
            }
        } catch (err) {
            return new RpcError("0", err)
        }
    }
    /**
     *
     * Retrieves an account transaction list
     * @param {string} address - Account's address.
     * @param {boolean} received - Filters for received or sent txs.
     * @param {boolean} prove - True or false to include the tx proof.
     * @param {number} page - (optional) Page number, default 1.
     * @param {number} perPage - (optional) Records count per page, default 30.
     * @param {number} timeout - (optional) Request timeout.
     * @memberof QueryNamespace
     */
    public async getAccountTxs(
        address: string,
        received: boolean,
        prove: boolean,
        page: number = 1,
        perPage: number = 30,
        timeout: number = 60000
    ): Promise<QueryAccountTxsResponse | RpcError> {
        try {
            if (!Hex.isHex(address) && Hex.byteLength(address) !== 20) {
                return new RpcError("0", "Invalid Address Hex")
            }

            const payload = JSON.stringify(
                {
                    address: address,
                    prove: prove,
                    received: received,
                    page: page,
                    per_page: perPage
                }
            )

            const response = await this.rpcProvider.send(
                V1RPCRoutes.QueryAccountTxs.toString(),
                payload,
                timeout
            )

            // Check if response is an error
            if (!typeGuard(response, RpcError)) {
                const queryAccountTxsResponse = QueryAccountTxsResponse.fromJSON(
                    response
                )
                return queryAccountTxsResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to retrieve the supply information: " + response.message
                )
            }
        } catch (err) {
            return new RpcError("0", err)
        }
    }
    /**
     *
     * Retrieves a ChallengeResponse object.
     * @param {ChallengeRequest} request - The ChallengeRequest
     * @param {number} timeout - Request timeout.
     * @memberof QueryNamespace
     */
    public async requestChallenge(
        request: ChallengeRequest,
        timeout: number = 60000
    ): Promise<ChallengeResponse | RpcError> {
        try {
            const payload = JSON.stringify(request.toJSON())

            const response = await this.rpcProvider.send(
                V1RPCRoutes.ClientChallenge.toString(),
                payload,
                timeout
            )

            // Check if response is an error
            if (!typeGuard(response, RpcError)) {
                const challengeResponse = ChallengeResponse.fromJSON(
                    response
                )
                return challengeResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to retrieve the supply information: " + response.message
                )
            }
        } catch (err) {
            return new RpcError("0", err)
        }
    }
}