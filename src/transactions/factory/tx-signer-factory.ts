import { ProtoTxSignerFactory } from './proto-tx-signer-factory'
import { AminoTxSignerFactory } from "./amino-tx-signer-factory"
import { ITxSignerFactory } from "./itx-signer-factory"

export class TxSignerFactory {
    public static createSigner(useLegacyTxSignature: boolean = true) : ITxSignerFactory {
        
        if(useLegacyTxSignature) {
            return new AminoTxSignerFactory()
        }
        
        return new ProtoTxSignerFactory()
    }
}