import { IAminoEncodable } from "./amino-encodable";
import { StdSignDoc } from "./std-sign-doc";
import { TxSignature } from "./tx-signature";
import { PosmintStdTx, PosmintMsg, PosmintStdSignature } from "@tendermint/amino-js/types/src/types/pocket";
import { marshalPosmintTx } from "@tendermint/amino-js";

/**
 * Represents a StdTx object to send a Transaction
 */
export class StdTx implements IAminoEncodable{
    private readonly AMINO_TYPE: string = "posmint/StdTx"
    private readonly stdSignDoc: StdSignDoc
    private readonly signatures: TxSignature[]

    /**
     * @param stdSignDoc {StdSignDoc} The model form which the bytes for signature were produced
     * @param signatures {TxSignature[]} The list of signatures for this transaction
     */
    public constructor(stdSignDoc: StdSignDoc, signatures: TxSignature[]) {
        this.stdSignDoc = stdSignDoc
        this.signatures = signatures
    }
    
    public marshalAmino(): Buffer {
        // Parse PosmintMsg list
        let msgList: PosmintMsg[] = []
        this.stdSignDoc.msgs.forEach(txMsg => {
            msgList.push({
                type: txMsg.getMsgTypeKey(),
                value: txMsg.getMsgValueObj()
            })
        })

        // Parse PosmintStdSignature list
        let signatureList: PosmintStdSignature[] = []
        this.signatures.forEach(txSignature => {
            signatureList.push(txSignature.toPosmintStdSignature())
        })

        // Create StdTx object
        const stdTx: PosmintStdTx = {
            msg: msgList,
            fee: [{
                denom: this.stdSignDoc.feeDenom,
                amount: this.stdSignDoc.fee
            }],
            signatures: signatureList,
            memo: this.stdSignDoc.memo
        }

        // Marshal PosmintTx
        const encodedPosmintTX = marshalPosmintTx({
            type: this.AMINO_TYPE,
            value: stdTx
        }, true)

        // Return buffer from marshaled PosmintTx
        return Buffer.from(encodedPosmintTX)
    }
}