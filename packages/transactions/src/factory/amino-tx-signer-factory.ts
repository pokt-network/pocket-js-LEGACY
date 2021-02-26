import { RpcError, typeGuard } from '@pokt-network/pocket-js-utils'
import { TxSignature } from './../models/tx-signature'
import { StdTx } from './../models/std-tx'
import { CoinDenom } from './../models/coin-denom'
import { StdSignDoc } from './../models/std-sign-doc'
import { TxMsg } from '../models'
import { ITxSignerFactory } from './itx-signer-factory'

export class AminoTxSignerFactory implements ITxSignerFactory {

    private doc: StdSignDoc | undefined = undefined

    public marshalStxDoc(entropy: string, chainID: string, msg: TxMsg, fee: string, feeDenom?: CoinDenom, memo?: string): Buffer {
        this.doc = new StdSignDoc(entropy, chainID, msg, fee, feeDenom, memo)
        return this.doc.marshalAmino()
    }

    public marshalTx(signature: TxSignature): Buffer {
        if (typeGuard(this.doc, StdSignDoc)) {
            const transaction = new StdTx(this.doc as StdSignDoc, signature)
            return transaction.marshalAmino()
        }

        throw new RpcError("500", "StdDoc not defined")
    }
    
}