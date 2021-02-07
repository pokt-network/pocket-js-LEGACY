import { TxSignature } from './../models/tx-signature';
import { CoinDenom, TxMsg } from "../models";

export interface ITxSignerFactory {
    marshalStxDoc(entropy: string, chainID: string, msg: TxMsg, fee: string, feeDenom?: CoinDenom, memo?: string): Uint8Array
    marshalTx(signature: TxSignature): Uint8Array
}