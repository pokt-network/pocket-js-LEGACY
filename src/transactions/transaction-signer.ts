import { ProtoTxEncoder, StdSignDoc } from '.'
import { addressFromPublickey, RawTxRequest, RpcError, TxSignature } from '..'
import { Any } from './models/proto'
import { TransactionSignature } from './models/transaction-signature'
/**
 * Interface function for custom transaction signer object
 */
export type TransactionSigner = (encodedTxBytes: Buffer) => TransactionSignature | Error

export class ProtoTransactionSigner {
    /**
     * Sign an unsigned transaction with a valid ed25519 signature
     * @param {string} encodedMsg - stxTxMsgObj stringified
     * @param {string} bytesToSign - the unsigned transaction bytes
     * @param {TxSignature} txSignature - valid ed25519 signature and public key
     * @returns {Promise<RawTxRequest | RpcError>} - A Raw transaction Response object or Rpc error.
     * @memberof ProtoTransactionSigner
     */
     public signTransaction(
        encodedMsg: string,
        bytesToSign: string,
        txSignature: TxSignature
    ):  RawTxRequest | RpcError {
        try {
            const stdSignDoc = this.decodeUnsignedTxBytes(bytesToSign)
            const stdTxMsgObj = Any.fromJSON(JSON.parse(encodedMsg))
    
            const addressHex = addressFromPublickey(txSignature.pubKey)
            const encodedTxBytes = ProtoTxEncoder.marshalStdSignDoc(stdTxMsgObj, stdSignDoc, txSignature)
            
            return new RawTxRequest(addressHex.toString('hex'), encodedTxBytes.toString('hex'))
        } catch (error) {
            return RpcError.fromError(error as Error)
        }
    }
    
    // Converts unsigned transaction bytes (so called bytesToSign) into it's raw representation.
    decodeUnsignedTxBytes(unsignedTxBytes: string): StdSignDoc {
        return JSON.parse(Buffer.from(unsignedTxBytes, 'hex').toString('utf-8'))
    }
}
