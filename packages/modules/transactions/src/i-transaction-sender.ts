import { CoinDenom } from "./models/coin-denom"
import { RawTxResponse, RawTxRequest } from "@pokt-network/pocket-js-rpc-models"
import { RpcError } from "@pokt-network/pocket-js-utils"

/**
 * Interface indicating all MsgTypes possible in a Pocket Network transaction and a function to submit the transaction to the network
 */
export interface ITransactionSender {
    /**
     * Signs and submits a transaction to the network given the parameters and called upon Msgs. Will empty the msg list after succesful submission
     *
     * @param {string} chainID - The chainID of the network to be sent to
     * @param {string} fee - The amount to pay as a fee for executing this transaction
     * @param {CoinDenom | undefined} feeDenom - The denomination of the fee amount
     * @param {string | undefined} memo - The memo field for this account
     * @param {number | undefined} timeout - The timeout in milliseconds
     * @returns {Promise<RawTxResponse | RpcError>} - A Raw Tx Response object or Rpc error
     * @memberof ITransactionSender
     */
    submit(
        chainID: string,
        fee: string,
        feeDenom?: CoinDenom,
        memo?: string,
        timeout?: number
    ): Promise<RawTxResponse | RpcError>

    /**
     * Signs and creates a transaction object that can be submitted to the network given the parameters and called upon Msgs. 
     * Will empty the msg list after succesful creation
     *
     * @param {string} chainID - The chainID of the network to be sent to
     * @param {string} fee - The amount to pay as a fee for executing this transaction
     * @param {CoinDenom | undefined} feeDenom - The denomination of the fee amount
     * @param {string | undefined} memo - The memo field for this account
     * @returns {Promise<RawTxRequest | RpcError>} - A Raw Tx Request object or Rpc error
     * @memberof ITransactionSender
     */
    createTransaction(
        chainID: string,
        fee: string,
        feeDenom?: CoinDenom,
        memo?: string
    ): Promise<RawTxRequest | RpcError>

    /**
     * Adds a MsgSend TxMsg for this transaction
     *
     * @param {string} fromAddress - Origin address
     * @param {string} toAddress - Destination address
     * @param {string} amount - The amount to send in uPOKT. Needs to be a valid number greater than 0
     * @returns {ITransactionSender} - Transaction signer
     * @memberof ITransactionSender
     */
    send(
        fromAddress: string,
        toAddress: string,
        amount: string
    ): ITransactionSender

    /**
     * Adds a MsgAppStake TxMsg for this transaction
     *
     * @param {string} appPubKey - Application Public Key
     * @param {string[]} chains - Network identifier list to be requested by this app
     * @param {string} amount - the amount to stake, must be greater than 0
     * @returns {ITransactionSender} - Transaction signer
     * @memberof ITransactionSender
     */
    appStake(
        appPubKey: string,
        chains: string[],
        amount: string
    ): ITransactionSender

    /**
     * Adds a MsgBeginAppUnstake TxMsg for this transaction
     *
     * @param {string} address - Address of the Application to unstake for
     * @returns {ITransactionSender} - Transaction signer
     * @memberof ITransactionSender
     */
    appUnstake(
        address: string
    ): ITransactionSender

    /**
     * Adds a MsgAppUnjail TxMsg for this transaction
     *
     * @param {string} address - Address of the Application to unjail
     * @returns {ITransactionSender} - Transaction signer
     * @memberof ITransactionSender
     */
    appUnjail(
        address: string
    ): ITransactionSender

    /**
     * Adds a MsgAppStake TxMsg for this transaction
     *
     * @param nodePubKey {string}
     * @param {string[]} chains - Network identifier list to be serviced by this node
     * @param {string} amount - The amount to stake, must be greater than 0
     * @param {URL} serviceURL - Service Url
     * @returns {ITransactionSender} - Transaction signer
     * @memberof ITransactionSender
     */
    nodeStake(
        nodePubKey: string,
        chains: string[],
        amount: string,
        serviceURL: URL
    ): ITransactionSender

    /**
     * Adds a MsgBeginUnstake TxMsg for this transaction
     *
     * @param {string} address - Address of the Node to unstake for
     * @returns {ITransactionSender} - Transaction signer
     * @memberof ITransactionSender
     */
    nodeUnstake(
        address: string
    ): ITransactionSender

    /**
     * Adds a MsgUnjail TxMsg for this transaction
     *
     * @param {string} address - Address of the Node to unjail
     * @returns {ITransactionSender} - Transaction signer
     * @memberof ITransactionSender
     */
    nodeUnjail(
        address: string
    ): ITransactionSender
}