import { TxSignature } from '../models/tx-signature'
import { CoinDenom, TxMsg } from "../models"

export abstract class BaseTxEncoder {
    entropy: string
    chainID: string
    msg: TxMsg
    fee: string
    feeDenom?: CoinDenom
    memo?: string = ""

    // Concrete constructor
    constructor(entropy: string, chainID: string, msg: TxMsg, fee: string, feeDenom?: CoinDenom, memo?: string) {
        this.entropy = entropy
        this.chainID = chainID
        this.msg = msg
        this.fee = fee
        this.feeDenom = feeDenom
        this.memo = memo ? memo : ""
    }

    // Abstract functions
    abstract marshalStdSignDoc(): Buffer
    abstract marshalStdTx(signature: TxSignature): Buffer
}