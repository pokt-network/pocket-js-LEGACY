import { TxSignature } from '../models/tx-signature'
import { CoinDenom, TxMsg } from "../models"

export interface ITxSignerFactory {
    marshalStxDoc(entropy: string, chainID: string, msg: TxMsg, fee: string, feeDenom?: CoinDenom, memo?: string): Buffer
    marshalTx(signature: TxSignature): Buffer
}