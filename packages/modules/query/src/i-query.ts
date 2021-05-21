import { QueryBlockResponse, QueryBlockTxsResponse, QueryTXResponse,
    QueryHeightResponse, QueryBalanceResponse, StakingStatus, JailedStatus,
    QueryNodesResponse, QueryNodeResponse, QueryNodeParamsResponse, QueryAppsResponse,
    QueryAppResponse, QueryAppParamsResponse, QueryPocketParamsResponse,
    QuerySupportedChainsResponse, QuerySupplyResponse, QueryAccountResponse,
    QueryAccountTxsResponse, QueryNodeClaimResponse, QueryNodeClaimsResponse, 
    QueryAllParamsResponse, ChallengeRequest, ChallengeResponse} from "@pokt-network/pocket-js-rpc-models"
import { RpcError } from "@pokt-network/pocket-js-utils"
import { IRPCProvider } from "@pokt-network/pocket-js-http-provider"

/**
 * Interface indicating all the possible RPC Query requests to the Pocket Network
 */
 export interface IQuery {
    rpcProvider: IRPCProvider

    /**
     *
     * Query a Block information
     * @param {BigInt} blockHeight - Block's number.
     * @param {number} timeout - (Optional) Request timeout, default should be 60000.
     * @param {boolean} rejectSelfSignedCertificates - (Optional) Force certificates to come from CAs, default should be true.
     * @returns {Promise<QueryBlockResponse | RpcError>} - A QueryBlockResponse object or Rpc error
     * @memberof QueryNamespace
     */
    getBlock(
        blockHeight: BigInt,
        timeout?: number, 
        rejectSelfSignedCertificates?: boolean
    ): Promise<QueryBlockResponse | RpcError> 

    /**
     *
     * Query a Block transaction list
     * @param {BigInt} blockHeight - Block's number.
     * @param {boolean} prove - True or false to include the tx proof.
     * @param {number} page - (Optional) Page number, default should be 1.
     * @param {number} perPage - (Optional) Records count per page, default should be 30.
     * @param {number} timeout - (Optional) Request timeout, default should be 60000.
     * @param {boolean} rejectSelfSignedCertificates - (Optional) Force certificates to come from CAs, default should be true.
     * @returns {Promise<QueryBlockTxsResponse | RpcError>} - A QueryBlockResponse object or Rpc error
     * @memberof QueryNamespace
     */
    getBlockTxs(
        blockHeight: BigInt,
        prove: boolean,
        page?: number,
        perPage?: number,
        timeout?: number, 
        rejectSelfSignedCertificates?: boolean
    ): Promise<QueryBlockTxsResponse | RpcError>

    /**
     *
     * Retrieves a transaction information
     * @param {string} txHash - Transaction hash.
     * @param {number} timeout - (Optional) Request timeout, default should be 60000.
     * @param {boolean} rejectSelfSignedCertificates - (Optional) Force certificates to come from CAs, default should be true.
     * @returns {Promise<QueryTXResponse | RpcError>} - A QueryBlockResponse object or Rpc error
     * @memberof QueryNamespace
     */
    getTX(
        txHash: string,
        timeout: number, 
        rejectSelfSignedCertificates: boolean
    ): Promise<QueryTXResponse | RpcError>

    /**
     *
     * Get the current network block height
     * @param {number} timeout - (Optional) Request timeout, default should be 60000.
     * @param {boolean} rejectSelfSignedCertificates - (Optional) Force certificates to come from CAs, default should be true.
     * @returns {Promise<QueryHeightResponse | RpcError>} - A QueryBlockResponse object or Rpc error
     * @memberof QueryNamespace
     */
    getHeight(
        timeout: number, 
        rejectSelfSignedCertificates: boolean
    ): Promise<QueryHeightResponse | RpcError>

    /**
     *
     * Retrieves an account balance
     * @param {string} address - Account's address.
     * @param {BigInt} blockHeight - Block's number.
     * @param {number} timeout - (Optional) Request timeout, default should be 60000.
     * @param {boolean} rejectSelfSignedCertificates - (Optional) Force certificates to come from CAs, default should be true.
     * @returns {Promise<QueryBalanceResponse | RpcError>} - A QueryBlockResponse object or Rpc error
     * @memberof QueryNamespace
     */
     getBalance(
        address: string,
        blockHeight: BigInt,
        timeout: number, 
        rejectSelfSignedCertificates: boolean
    ): Promise<QueryBalanceResponse | RpcError>


    /**
     *
     * Retrieves a list of validator nodes
     * @param {StakingStatus} stakingStatus - Staking status.
     * @param {JailedStatus} jailedStatus - Jailed status.
     * @param {BigInt} blockHeight - Block's number.
     * @param {string} blockchain - (optional) Blockchain Identifier.
     * @param {number} page - (optional) Page number, default 1.
     * @param {number} perPage - (optional) Records count per page, default 30.
     * @param {number} timeout - (Optional) Request timeout, default should be 60000.
     * @param {boolean} rejectSelfSignedCertificates - (Optional) Force certificates to come from CAs, default should be true.
     * @returns {Promise<QueryNodesResponse | RpcError>} - A QueryBlockResponse object or Rpc error
     * @memberof QueryNamespace
     */
     getNodes(
        stakingStatus: StakingStatus,
        jailedStatus: JailedStatus,
        blockHeight: BigInt,
        blockchain: string,
        page: number,
        perPage: number,
        timeout: number, 
        rejectSelfSignedCertificates: boolean
    ): Promise<QueryNodesResponse | RpcError>

    /**
     *
     * Query a Node information
     * @param {string} address - Node address.
     * @param {BigInt} blockHeight - Block's number.
     * @param {number} timeout - (Optional) Request timeout, default should be 60000.
     * @param {boolean} rejectSelfSignedCertificates - (Optional) Force certificates to come from CAs, default should be true.
     * @returns {Promise<QueryNodeResponse | RpcError>} - A QueryBlockResponse object or Rpc error
     * @memberof QueryNamespace
     */
    getNode(
        address: string,
        blockHeight: BigInt,
        timeout: number, 
        rejectSelfSignedCertificates: boolean
    ): Promise<QueryNodeResponse | RpcError> 

    /**
     *
     * Retrieves the node params
     * @param {BigInt} blockHeight - Block's number.
     * @param {number} timeout - (Optional) Request timeout, default should be 60000.
     * @param {boolean} rejectSelfSignedCertificates - (Optional) Force certificates to come from CAs, default should be true.
     * @returns {Promise<QueryNodeParamsResponse | RpcError>} - A QueryBlockResponse object or Rpc error
     * @memberof QueryNamespace
     */
    getNodeParams(
        blockHeight: BigInt,
        timeout: number, 
        rejectSelfSignedCertificates: boolean
    ): Promise<QueryNodeParamsResponse | RpcError>


    /**
     *
     * Retrieves a list of apps
     * @param {StakingStatus} stakingStatus - Staking status.
     * @param {BigInt} blockHeight - Block's number.
     * @param {string} blockchain - (optional) Blockchain identifier.
     * @param {BigInt} page - (optional) Block's number.
     * @param {BigInt} perPage - (optional) Block's number.
     * @param {number} timeout - (Optional) Request timeout, default should be 60000.
     * @param {boolean} rejectSelfSignedCertificates - (Optional) Force certificates to come from CAs, default should be true.
     * @returns {Promise<QueryAppsResponse | RpcError>} - A QueryBlockResponse object or Rpc error
     * @memberof QueryNamespace
     */
    getApps(
        stakingStatus: StakingStatus,
        blockHeight: BigInt,
        blockchain: string,
        page: number,
        perPage: number,
        timeout: number, 
        rejectSelfSignedCertificates: boolean
    ): Promise<QueryAppsResponse | RpcError>

    /**
     *
     * Retrieves an app information
     * @param {string} address - Address of the app.
     * @param {BigInt} blockHeight - Block's number.
     * @param {number} timeout - (Optional) Request timeout, default should be 60000.
     * @param {boolean} rejectSelfSignedCertificates - (Optional) Force certificates to come from CAs, default should be true.
     * @returns {Promise<QueryAppResponse | RpcError>} - A QueryBlockResponse object or Rpc error
     * @memberof QueryNamespace
     */
    getApp(
        address: string,
        blockHeight: BigInt,
        timeout: number, 
        rejectSelfSignedCertificates: boolean
    ): Promise<QueryAppResponse | RpcError>


    /**
     *
     * Retrieves app params.
     * @param {BigInt} blockHeight - Block's number.
     * @param {number} timeout - (Optional) Request timeout, default should be 60000.
     * @param {boolean} rejectSelfSignedCertificates - (Optional) Force certificates to come from CAs, default should be true.
     * @returns {Promise<QueryAppParamsResponse | RpcError>} - A QueryBlockResponse object or Rpc error
     * @memberof QueryNamespace
     */
    getAppParams(
        blockHeight: BigInt,
        timeout: number, 
        rejectSelfSignedCertificates: boolean
    ): Promise<QueryAppParamsResponse | RpcError>

    /**
     *
     * Retrieves the pocket params.
     * @param {BigInt} blockHeight - Block's number.
     * @param {number} timeout - (Optional) Request timeout, default should be 60000.
     * @param {boolean} rejectSelfSignedCertificates - (Optional) Force certificates to come from CAs, default should be true.
     * @returns {Promise<QueryPocketParamsResponse | RpcError>} - A QueryBlockResponse object or Rpc error
     * @memberof QueryNamespace
     */
    getPocketParams(
        blockHeight: BigInt,
        timeout: number, 
        rejectSelfSignedCertificates: boolean
    ): Promise<QueryPocketParamsResponse | RpcError>

    /**
     *
     * Retrieves supported chains
     * @param {BigInt} blockHeight - Block's number.
     * @param {number} timeout - (Optional) Request timeout, default should be 60000.
     * @param {boolean} rejectSelfSignedCertificates - (Optional) Force certificates to come from CAs, default should be true.
     * @returns {Promise<QuerySupportedChainsResponse | RpcError>} - A QueryBlockResponse object or Rpc error
     * @memberof QueryNamespace
     */
     getSupportedChains(
        blockHeight: BigInt,
        timeout: number, 
        rejectSelfSignedCertificates: boolean
    ): Promise<QuerySupportedChainsResponse | RpcError>

    /**
     *
     * Retrieves current supply information
     * @param {BigInt} blockHeight - Block's number.
     * @param {number} timeout - (Optional) Request timeout, default should be 60000.
     * @param {boolean} rejectSelfSignedCertificates - (Optional) Force certificates to come from CAs, default should be true.
     * @returns {Promise<QuerySupplyResponse | RpcError>} - A QueryBlockResponse object or Rpc error
     * @memberof QueryNamespace
     */
    getSupply(
        blockHeight: BigInt,
        timeout: number, 
        rejectSelfSignedCertificates: boolean
    ): Promise<QuerySupplyResponse | RpcError>

    /**
     *
     * Retrieves current Account information
     * @param {string} address - Account's address.
     * @param {number} timeout - (Optional) Request timeout, default should be 60000.
     * @param {boolean} rejectSelfSignedCertificates - (Optional) Force certificates to come from CAs, default should be true.
     * @returns {Promise<QueryAccountResponse | RpcError>} - A QueryBlockResponse object or Rpc error
     * @memberof QueryNamespace
     */
    getAccount(
        address: string,
        timeout: number, 
        rejectSelfSignedCertificates: boolean
    ): Promise<QueryAccountResponse | RpcError>

    /**
     *
     * Retrieves an account transaction list
     * @param {string} address - Account's address.
     * @param {boolean} received - Filters for received or sent txs.
     * @param {boolean} prove - True or false to include the tx proof.
     * @param {number} page - (optional) Page number, default 1.
     * @param {number} perPage - (optional) Records count per page, default 30.
     * @param {number} timeout - (Optional) Request timeout, default should be 60000.
     * @param {boolean} rejectSelfSignedCertificates - (Optional) Force certificates to come from CAs, default should be true.
     * @returns {Promise<QueryAccountTxsResponse | RpcError>} - A QueryBlockResponse object or Rpc error
     * @memberof QueryNamespace
     */
    getAccountTxs(
        address: string,
        received: boolean,
        prove: boolean,
        page: number,
        perPage: number,
        timeout: number, 
        rejectSelfSignedCertificates: boolean
    ): Promise<QueryAccountTxsResponse | RpcError>


    /**
     * Returns the list of all pending claims submitted by node address at height,  height = 0 is used as latest
     * @param {string} address - Node's address.
     * @param {BigInt} appPubKey - Application public key.
     * @param {nuber} blockchain - Blockchain hash.
     * @param {nuber} height - Block height.
     * @param {nuber} sessionBlockHeight - Session block height.
     * @param {nuber} receiptType - Receipt type, can be "relay" or "challenge".
     * @param {number} timeout - (Optional) Request timeout, default should be 60000.
     * @param {boolean} rejectSelfSignedCertificates - (Optional) Force certificates to come from CAs, default should be true.
     * @returns {Promise<QueryNodeClaimResponse | RpcError>} - A QueryBlockResponse object or Rpc error
     * @memberof QueryNamespace
     */
    getNodeClaim(
        address: string,
        appPubKey: string,
        blockchain: string,
        height: BigInt,
        sessionBlockHeight: BigInt,
        receiptType: string,
        timeout: number, 
        rejectSelfSignedCertificates: boolean
    ): Promise<QueryNodeClaimResponse | RpcError>

    /**
     * Returns the node pending claim for specific session
     * @param {string} address - Node's address.
     * @param {BigInt} height - Block height.
     * @param {nuber} page - (Optional) Page number, default 1.
     * @param {nuber} perPage - (Optional) Per page amount of records, default 30.
     * @param {number} timeout - (Optional) Request timeout, default should be 60000.
     * @param {boolean} rejectSelfSignedCertificates - (Optional) Force certificates to come from CAs, default should be true.
     * @returns {Promise<QueryNodeClaimsResponse | RpcError>} - A QueryBlockResponse object or Rpc error
     * @memberof QueryNamespace
     */
    getNodeClaims(
        address: string,
        height: BigInt,
        page: number,
        perPage: number,
        timeout: number, 
        rejectSelfSignedCertificates: boolean
    ): Promise<QueryNodeClaimsResponse | RpcError>


    /**
     * Returns the node parameters at the specified height,  height = 0 is used as latest
     * @param {nuber} height - Block height.
     * @param {number} timeout - (Optional) Request timeout, default should be 60000.
     * @param {boolean} rejectSelfSignedCertificates - (Optional) Force certificates to come from CAs, default should be true.
     * @returns {Promise<QueryAllParamsResponse | RpcError>} - A QueryBlockResponse object or Rpc error
     * @memberof QueryNamespace
     */
    getAllParams(
        height: BigInt,
        timeout: number, 
        rejectSelfSignedCertificates: boolean
    ): Promise<QueryAllParamsResponse | RpcError>
}