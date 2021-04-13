import { typeGuard, RpcError } from '@pokt-network/pocket-js-utils'
import { TxSignature } from '../models/tx-signature'
import { StdTx } from '../models/std-tx'
import { StdSignDoc } from '../models/std-sign-doc'
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