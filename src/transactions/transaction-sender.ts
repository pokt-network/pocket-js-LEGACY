import { CoinDenom } from "../models/coin-denom"
import { RawTxResponse } from "../models/output/raw-tx-response"
import { Node } from "../models/node"
import { Configuration, RpcErrorResponse } from "../models"

export interface ITransactionSender {
    /**
     * Signs and submits a transaction to the network given the parameters and called upon Msgs. Will empty the msg list after succesful submission
     * @param accountNumber {string} Account number for this account
     * @param sequence {string} Sequence of transactions (or Nonce)
     * @param chainId {string} The chainId of the network to be sent to
     * @param node {Node} the Node object to send the transaction to
     * @param fee {string} The amount to pay as a fee for executing this transaction
     * @param feeDenom {CoinDenom | undefined} The denomination of the fee amount
     * @param memo {string | undefined} The memo field for this account
     * @param configuration {Configuration | undefined} Alternative configuration to be used
     */
    submit(
        accountNumber: string,
        sequence: string,
        chainId: string,
        node: Node,
        fee: string,
        feeDenom?: CoinDenom,
        memo?: string,
        configuration?: Configuration
    ): Promise<RawTxResponse | RpcErrorResponse>

    /**
     * Adds a MsgSend TxMsg for this transaction
     * @param fromAddress {string}
     * @param toAddress {string}
     * @param amount {string} Needs to be a valid number greater than 0
     * @param amountDenom {CoinDenom | undefined}
     */
    send(
        fromAddress: string,
        toAddress: string,
        amount: string,
        amountDenom?: CoinDenom
    ): ITransactionSender

    /**
     * Adds a MsgAppStake TxMsg for this transaction
     * @param appPubKey {string}
     * @param chains {string[]} Network identifier list to be requested by this app
     * @param amount {string} the amount to stake, must be greater than 0
     */
    appStake(
        appPubKey: string,
        chains: string[],
        amount: string
    ): ITransactionSender

    /**
     * Adds a MsgBeginAppUnstake TxMsg for this transaction
     * @param address {string} Address of the Application to unstake for
     */
    appUnstake(
        address: string
    ): ITransactionSender

    /**
     * Adds a MsgAppUnjail TxMsg for this transaction
     * @param address {string} Address of the Application to unjail
     */
    appUnjail(
        address: string
    ): ITransactionSender

    /**
     * Adds a MsgAppStake TxMsg for this transaction
     * @param nodePubKey {string}
     * @param chains {string[]} Network identifier list to be serviced by this node
     * @param amount {string} the amount to stake, must be greater than 0
     * @param serviceURL {URL}
     */
    nodeStake(
        nodePubKey: string,
        chains: string[],
        amount: string,
        serviceURL: URL
    ): ITransactionSender

    /**
     * Adds a MsgBeginUnstake TxMsg for this transaction
     * @param address {string} Address of the Node to unstake for
     */
    nodeUnstake(
        address: string
    ): ITransactionSender

    /**
     * Adds a MsgUnjail TxMsg for this transaction
     * @param address {string} Address of the Node to unjail
     */
    nodeUnjail(
        address: string
    ): ITransactionSender
}