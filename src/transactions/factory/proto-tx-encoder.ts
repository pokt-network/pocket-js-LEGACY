import { TxSignature } from '../models/tx-signature'
import { CoinDenom } from '../models/coin-denom'
import { BaseTxEncoder } from './base-tx-encoder'
import { ProtoStdSignature, ProtoStdTx } from '../models/proto/generated/tx-signer'
import * as varint from "varint"
import { Any } from '../models/proto'

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

    // Returns the bytes to be signed by the account sending the transaction
    // The key difference from the above is that this can be used to obtain 
    // the unsigned tx bytes without the use of a signer
    static marshalStdSignDoc(chainID: string, entropy: string, fee: string, msg: any, memo?: string, feeDenom?: "Upokt" | "Pokt"): Buffer {
        const stdSignDoc = {
            chain_id: chainID,
            entropy,
            fee: [{
                amount: fee,
                denom: feeDenom !== undefined ? CoinDenom[feeDenom].toLowerCase() : 'upokt'
            }],
            memo,
            msg
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
    static marshalStdTx(stdTxMsgObj: Any, stdSignDoc: any, signature: TxSignature) : Buffer {
        const txSig: ProtoStdSignature = {
            publicKey: signature.pubKey, 
            Signature: signature.signature
        }

        const stdTx: ProtoStdTx = {
            msg: stdTxMsgObj, 
            fee: stdSignDoc.fee,
            signature: txSig, 
            memo: stdSignDoc.memo, 
            entropy: parseInt(stdSignDoc.entropy, 10),
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