import { typeGuard } from '../../utils'
import { RpcError } from '../../rpc'
import { TxSignature } from '../models/tx-signature'
import { StdTx } from '../models/std-tx'
import { CoinDenom } from '../models/coin-denom'
import { StdSignDoc } from '../models/std-sign-doc'
import { TxMsg } from '../models'
import { BaseTxEncoder } from './base-tx-encoder'

export class AminoTxEncoder extends BaseTxEncoder {

    private doc: StdSignDoc | undefined = undefined

    public marshalStdSignDoc(): Buffer {
        this.doc = new StdSignDoc(this.entropy, this.chainID, this.msg, this.fee, this.feeDenom, this.memo)
        return this.doc.marshalAmino()
    }

    public marshalStdTx(signature: TxSignature): Buffer {
        if (typeGuard(this.doc, StdSignDoc)) {
            const transaction = new StdTx(this.doc as StdSignDoc, signature)
            return transaction.marshalAmino()
        }

        throw new RpcError("500", "StdDoc not defined")
    }
    
}