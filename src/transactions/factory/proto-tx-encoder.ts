import { TxSignature } from '../models/tx-signature'
import { CoinDenom } from '../models/coin-denom'
import { BaseTxEncoder } from './base-tx-encoder'
import { ProtoStdSignature, ProtoStdTx } from '../models/proto/generated/tx-signer'
import * as varint from "varint"
import { Any } from '../models/proto'
import { StdSignDoc } from '..'

export class ProtoTxEncoder extends BaseTxEncoder {

    public getFeeObj() {
        return [{
            amount: this.fee,
            denom: this.feeDenom !== undefined ? CoinDenom[this.feeDenom].toLowerCase() : 'upokt'
        }]
    }

    // Returns the bytes to be signed by the account sending the transaction
    public marshalStdSignDoc(): Buffer {
        const stdSignDoc = {
            chain_id: this.chainID, 
            entropy: this.entropy, 
            fee: this.getFeeObj(),
            memo: this.memo, 
            msg: this.msg.toStdSignDocMsgObj()
        }
        
        return Buffer.from(JSON.stringify(stdSignDoc), "utf-8")
    }

    // Returns the signed encoded transaction
    public marshalStdTx(signature: TxSignature): Buffer {
        const txSig: ProtoStdSignature = {
            publicKey: signature.pubKey, 
            Signature: signature.signature
        }
        const stdTx: ProtoStdTx = {
            msg: this.msg.toStdTxMsgObj(), 
            fee: this.getFeeObj(), 
            signature: txSig, 
            memo: this.memo ? this.memo : "", 
            entropy: parseInt(this.entropy, 10)
        }
        
        // Create the Proto Std Tx bytes
        const protoStdTxBytes: Buffer = Buffer.from(ProtoStdTx.encode(stdTx).finish())

        // Create the prefix
        const prefixBytes = varint.encode(protoStdTxBytes.length)
        const prefix = Buffer.from(prefixBytes)

        // Concatenate for the result
        return Buffer.concat([prefix, protoStdTxBytes])
    }
    
    // Returns the signed encoded transaction,
    // The key difference from the above is that this can be called with an external stdTxMsg object
    static marshalStdSignDoc(stdTxMsgObj: Any, stdSignDoc: StdSignDoc, signature: TxSignature) : Buffer {
        const txSig: ProtoStdSignature = {
            publicKey: signature.pubKey, 
            Signature: signature.signature
        }
        
        const stdTx: ProtoStdTx = {
            msg: stdTxMsgObj, 
            fee: [{ amount: stdSignDoc.fee, denom: stdSignDoc.feeDenom}],
            signature: txSig, 
            memo: stdSignDoc.memo, 
            entropy: parseInt(stdSignDoc.entropy, 10)
        }

        // Create the Proto Std Tx bytes
        const protoStdTxBytes: Buffer = Buffer.from(ProtoStdTx.encode(stdTx).finish())

        // Create the prefix
        const prefixBytes = varint.encode(protoStdTxBytes.length)
        const prefix = Buffer.from(prefixBytes)

        // Concatenate for the result
        return Buffer.concat([prefix, protoStdTxBytes])
    }


}