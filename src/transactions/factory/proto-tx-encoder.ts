import { typeGuard } from '../../utils'
import { RpcError } from '../../rpc'
import { TxSignature } from '../models/tx-signature'
import { CoinDenom } from '../models/coin-denom'
import { TxMsg } from '../models'
import { BaseTxEncoder } from './base-tx-encoder'
import { Coin, ProtoStdSignature, ProtoStdTx } from '../models/proto/generated/tx-signer'
import * as varint from "varint"

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

    // Returns the encoded transaction
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
}