import { CoinDenom } from "../models/coin-denom";
import { Configuration, RpcErrorResponse } from "../../lib/src";
import { RawTxResponse } from "../models/output/raw-tx-response";
import { Node } from "../models/node"

export interface ITransactionSender {
    submit(
        accountNumber: string,
        sequence: string,
        chainId: string,
        node: Node,
        fee: string,
        feeDenom?: CoinDenom,
        memo?: string,
        configuration?: Configuration
    ): Promise<RawTxResponse | RpcErrorResponse>;

    send(
        fromAddress: string,
        toAddress: string,
        amount: string,
        amountDenom?: CoinDenom
    ): ITransactionSender

    appStake(
        appPubKey: string,
        chains: string[],
        amount: string
    ): ITransactionSender

    appUnstake(
        address: string
    ): ITransactionSender

    appUnjail(
        address: string
    ): ITransactionSender

    nodeStake(
        nodePubKey: string,
        chains: string[],
        amount: string,
        serviceURL: URL
    ): ITransactionSender

    nodeUnstake(
        address: string
    ): ITransactionSender
    nodeUnjail(
        address: string
    ): ITransactionSender
}