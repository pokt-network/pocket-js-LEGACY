import { ProtoTxEncoder } from './proto-tx-encoder'
import { BaseTxEncoder } from "./base-tx-encoder"
import { TxMsg } from '../models/msgs'
import { CoinDenom } from '../models/coin-denom'

export class TxEncoderFactory {
    public static createEncoder(entropy: string, chainID: string, msg: TxMsg, fee: string, feeDenom?: CoinDenom, memo?: string) : BaseTxEncoder {
        return new ProtoTxEncoder(entropy, chainID, msg, fee, feeDenom, memo)
    }
}