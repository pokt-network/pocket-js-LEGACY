import { IRPCProvider } from "../providers"
import { Configuration, typeGuard, Hex } from "../.."
import { QueryBlockResponse, RpcError, RPC, V1RPCRoutes, QueryTXResponse, QueryHeightResponse, QueryBalanceResponse, StakingStatus, QueryNodesResponse, QueryNodeResponse, QueryNodeParamsResponse, QueryNodeProofsResponse, NodeProof, QueryNodeProofResponse, QueryAppsResponse, QueryAppResponse, QueryAppParamsResponse, QueryPocketParamsResponse, QuerySupportedChainsResponse, QuerySupplyResponse, QueryAccountResponse } from ".."

export class QueryNamespace {
    public readonly rpcProvider: IRPCProvider

    public constructor(rpcProvider: IRPCProvider) {
        this.rpcProvider = rpcProvider
    }

    /**
     *
     * Query a Block information
     * @param {BigInt} blockHeight - Block's number.
     * @param {Node} node - Node that will receive the relay.
     * @param {Configuration} configuration - Configuration object containing preferences information.
     * @memberof RequestManager
     */
    public async getBlock(
        blockHeight: BigInt = BigInt(0), timeout: number = 60000
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
     * Retrieves a transaction information
     * @param {string} txHash - Transaction hash.
     * @param {Node} node - Node that will receive the relay.
     * @param {Configuration} configuration - Configuration object containing preferences information.
     * @memberof RequestManager
     */
    public async getTX(
        txHash: string, timeout: number = 60000
    ): Promise<QueryTXResponse | RpcError> {
        try {
            if (!Hex.isHex(txHash) && Hex.byteLength(txHash) !== 20) {
                return new RpcError("0", "Invalid Address Hex")
            }

            const payload = JSON.stringify({ hash: txHash })

            const response = await this.rpcProvider.send(
                V1RPCRoutes.QueryTX.toString().toString(),
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
     * @param {Node} node - Node that will receive the relay.
     * @param {Configuration} configuration - Configuration object containing preferences information.
     * @memberof RequestManager
     */
    public async getHeight(timeout: number = 60000
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
     * @param {Node} node - Node that will receive the relay.
     * @param {Configuration} configuration - Configuration object containing preferences information.
     * @memberof RequestManager
     */
    public async getBalance(
        address: string,
        blockHeight: BigInt = BigInt(0), timeout: number = 60000
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
     * Retrieves a list of nodes
     * @param {StakingStatus} stakingStatus - Staking status.
     * @param {BigInt} blockHeight - Block's number.
     * @param {Node} node - Node that will receive the relay.
     * @param {Configuration} configuration - Configuration object containing preferences information.
     * @memberof RequestManager
     */
    public async getNodes(
        stakingStatus: StakingStatus,
        blockHeight: BigInt = BigInt(0), timeout: number = 60000
    ): Promise<QueryNodesResponse | RpcError> {
        try {
            if (Number(blockHeight.toString()) < 0) {
                return new RpcError("101", "block height can't be lower than 0")
            }

            const payload = JSON.stringify({
                height: Number(blockHeight.toString()),
                staking_status: stakingStatus
            })

            const response = await this.rpcProvider.send(
                V1RPCRoutes.QueryNodes.toString(),
                payload,
                timeout
            )

            // Check if response is an error
            if (!typeGuard(response, RpcError)) {
                const queryNodesResponse = QueryNodesResponse.fromJSON(
                    response
                )
                return queryNodesResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to retrieve a list of nodes: " + response.message
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
     * @param {Node} node - Node that will receive the relay.
     * @param {Configuration} configuration - Configuration object containing preferences information.
     * @memberof RequestManager
     */
    public async getNode(
        address: string,
        blockHeight: BigInt = BigInt(0), timeout: number = 60000
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
     * @param {Node} node - Node that will receive the relay.
     * @param {Configuration} configuration - Configuration object containing preferences information.
     * @memberof RequestManager
     */
    public async getNodeParams(
        blockHeight: BigInt = BigInt(0), timeout: number = 60000
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
     * Retrieves the node proofs information
     * @param {string} address - Node's address.
     * @param {BigInt} blockHeight - Block's number.
     * @param {Node} node - Node that will receive the relay.
     * @param {Configuration} configuration - Configuration object containing preferences information.
     * @memberof RequestManager
     */
    public async getNodeProofs(
        address: string,
        blockHeight: BigInt = BigInt(0), timeout: number = 60000
    ): Promise<QueryNodeProofsResponse | RpcError> {
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
                V1RPCRoutes.QueryNodeProofs.toString(),
                payload,
                timeout
            )

            // Check if response is an error
            if (!typeGuard(response, RpcError)) {

                const queryNodeProofsResponse = QueryNodeProofsResponse.fromJSON(
                    response
                )
                return queryNodeProofsResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to retrieve the node proofs: " + response.message
                )
            }
        } catch (err) {
            return new RpcError("0", err)
        }
    }
    /**
     *
     * Retrieves the node proof information
     * @param {NodeProof} nodeProof - Node's address.
     * @param {Node} node - Node that will receive the relay.
     * @param {Configuration} configuration - Configuration object containing preferences information.
     * @memberof RequestManager
     */
    public async getNodeProof(
        nodeProof: NodeProof, timeout: number = 60000
    ): Promise<QueryNodeProofResponse | RpcError> {
        try {
            if (!nodeProof.isValid()) {
                return new RpcError("0", "Invalid Node Proof")
            }

            const payload = JSON.stringify(nodeProof.toJSON())

            const response = await this.rpcProvider.send(
                V1RPCRoutes.QueryNodeProof.toString(),
                payload,
                timeout
            )

            // Check if response is an error
            if (!typeGuard(response, RpcError)) {

                const queryNodeProofResponse = QueryNodeProofResponse.fromJSON(
                    response
                )
                return queryNodeProofResponse
            } else {
                return new RpcError(
                    response.code,
                    "Failed to retrieve the node proof: " + response.message
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
     * @param {Node} node - Node that will receive the relay.
     * @param {Configuration} configuration - Configuration object containing preferences information.
     * @memberof RequestManager
     */
    public async getApps(
        stakingStatus: StakingStatus,
        blockHeight: BigInt = BigInt(0), timeout: number = 60000
    ): Promise<QueryAppsResponse | RpcError> {
        try {
            if (Number(blockHeight.toString()) < 0) {
                return new RpcError("101", "block height can't be lower than 0")
            }

            const payload = JSON.stringify({
                height: Number(blockHeight.toString()),
                staking_status: stakingStatus
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
     * @param {Node} node - Node that will receive the relay.
     * @param {Configuration} configuration - Configuration object containing preferences information.
     * @memberof RequestManager
     */
    public async getApp(
        address: string,
        blockHeight: BigInt = BigInt(0), timeout: number = 60000
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
     * @param {Node} node - Node that will receive the relay.
     * @param {Configuration} configuration - Configuration object containing preferences information.
     * @memberof RequestManager
     */
    public async getAppParams(
        blockHeight: BigInt = BigInt(0), timeout: number = 60000
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
     * @param {Node} node - Node that will receive the relay.
     * @param {Configuration} configuration - Configuration object containing preferences information.
     * @memberof RequestManager
     */
    public async getPocketParams(
        blockHeight: BigInt = BigInt(0), timeout: number = 60000
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
     * @param {Node} node - Node that will receive the relay.
     * @param {Configuration} configuration - Configuration object containing preferences information.
     * @memberof RequestManager
     */
    public async getSupportedChains(
        blockHeight: BigInt = BigInt(0), timeout: number = 60000
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
     * @param {Node} node - Node that will receive the relay.
     * @param {Configuration} configuration - Configuration object containing preferences information.
     * @memberof RequestManager
     */
    public async getSupply(
        blockHeight: BigInt = BigInt(0), timeout: number = 60000
    ): Promise<QuerySupplyResponse | RpcError> {
        try {
            if (Number(blockHeight.toString()) < 0) {
                return new RpcError("101", "block height can't be lower than 0")
            }

            const payload = JSON.stringify({ height: Number(blockHeight.toString()) })

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
     * Retrieves current supply information
     * @param {BigInt} blockHeight - Block's number.
     * @param {Node} node - Node that will receive the relay.
     * @param {Configuration} configuration - Configuration object containing preferences information.
     * @memberof RequestManager
     */
    public async getAccount(
        address: string, timeout: number = 60000
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
}