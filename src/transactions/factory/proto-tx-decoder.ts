import { MsgSend, ProtoStdTx } from '../models/proto/generated/tx-signer'

export class ProtoTxDecoder {
    // Returns partially decoded transaction
    public unmarshalStdTx(encodedTxBytes: Buffer, length: number = encodedTxBytes.length): ProtoStdTx {
        return ProtoStdTx.decode(encodedTxBytes.subarray(2), length - 2)
    }

    // Returns decoded transaction message data
    public decodeStdTxData(protoStdTx: ProtoStdTx) {
        switch(protoStdTx.msg?.typeUrl) {
            case '/x.nodes.MsgSend':
                const msgSendData = MsgSend.decode(protoStdTx.msg.value)

                const decodedStdTxData = {
                    memo: protoStdTx.memo,
                    entropy: protoStdTx.entropy,
                    fee: protoStdTx.fee,
                    msg: {
                        typeUrl: protoStdTx.msg.typeUrl,
                        value: {
                            amount: msgSendData.amount,
                            FromAddress: Buffer.from(msgSendData.FromAddress).toString('hex'),
                            ToAddress: Buffer.from(msgSendData.ToAddress).toString('hex') 
                        }
                    },
                    signature: protoStdTx.signature ? {
                        publicKey: Buffer.from(protoStdTx.signature.publicKey).toString('hex'),
                        Signature: Buffer.from(protoStdTx.signature.Signature).toString('hex')
                    } : protoStdTx.signature
                }
                
                return decodedStdTxData
            default:
                throw Error('Decoding for transaction type not supported yet.')
        }
    }
}