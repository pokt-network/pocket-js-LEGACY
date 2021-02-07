import { RpcError } from './../../rpc/errors/rpc-error';
import { TxSignature } from './../models/tx-signature';
import { StdTx } from './../models/std-tx';
import { CoinDenom } from './../models/coin-denom';
import { TxMsg } from '../models';
import { typeGuard } from '../../utils';
import { ITxSignerFactory } from './itx-signer-factory';
import { Coin, ProtoStdSignature, ProtoStdTx, StdSignDoc } from '../models/proto/generated/tx-signer';

export class ProtoTxSignerFactory implements ITxSignerFactory {

    private txMessage: any;
    private coin: Coin = {amount: '', denom: ''};
    private doc: StdSignDoc = { ChainID: '', fee: new Uint8Array(255), memo: '', msg: new Uint8Array(255), entropy: 0};

    public marshalStxDoc(entropy: string, chainID: string, msg: TxMsg, fee: string, feeDenom?: CoinDenom, memo?: string): Buffer {
        var enc = new TextEncoder();
        let memoString: string = "";

        if(typeGuard(memo, String)) {
            memoString = memo
        }

        this.txMessage = msg.toStdTxMsgObj()
        this.coin = {amount: fee, denom: feeDenom !== undefined ? CoinDenom[feeDenom] : 'pokt'}
    
        this.doc = {ChainID: chainID, fee: enc.encode(fee), memo: memoString, msg: msg.toStdSignDocMsgObj(), entropy: parseInt(entropy)}
        return Buffer.from(StdSignDoc.encode(this.doc).finish())
    }

    public marshalTx(signature: TxSignature): Buffer {
        if(this.coin.amount === '') {
            throw new RpcError("500", "StdDoc not defined")
        }

        const txSig: ProtoStdSignature = {publicKey: signature.pubKey, Signature: signature.signature}
        const stdTx: ProtoStdTx = {msg: this.txMessage, fee: [this.coin], signature: txSig, memo: this.doc.memo, entropy: this.doc.entropy}

        return Buffer.from(ProtoStdTx.encode(stdTx).finish())
    }

    /*
        export interface ProtoStdTx {
  msg: Any | undefined;
  fee: Coin[];
  signature: ProtoStdSignature | undefined;
  memo: string;
  entropy: number;
}
    */

}