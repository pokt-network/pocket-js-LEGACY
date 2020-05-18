import { IAminoEncodable } from "./amino-encodable"
import { StdSignDoc } from "./std-sign-doc"
import { TxSignature } from "./tx-signature"
import { PosmintStdTx, PosmintMsg, PosmintStdSignature } from "@pokt-network/amino-js/types/src/types/pocket"
import { marshalPosmintTx } from "@pokt-network/amino-js"

/**
 * Represents a StdTx object to send a Transaction
 */
export class StdTx implements IAminoEncodable {
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

    /**
     * Marshal the StdTx class properties with amino
     * @returns {Buffer} - Buffer representation of the marshal object.
     * @memberof StdTx
     */
    public marshalAmino(): Buffer {
        // Parse PosmintMsg list
        const msgList: PosmintMsg[] = []
        this.stdSignDoc.msgs.forEach(txMsg => {
            const stdSignMsgObj = txMsg.toStdTxMsgObj()
            msgList.push({
                type: stdSignMsgObj.type,
                value: stdSignMsgObj.value
            })
        })

        // Parse PosmintStdSignature list
        const signatureList: PosmintStdSignature[] = []
        this.signatures.forEach(txSignature => {
            signatureList.push(txSignature.toPosmintStdSignature())
        })

        // Create StdTx object
        const stdTx: PosmintStdTx = {
            msg: msgList,
            fee: [{
                amount: this.stdSignDoc.fee,
                denom: this.stdSignDoc.feeDenom
            }],
            signatures: signatureList,
            memo: this.stdSignDoc.memo,
            entropy: this.stdSignDoc.entropy
        }

        // Marshal PosmintTx
        const encodedPosmintTX = marshalPosmintTx({
            type: this.AMINO_TYPE,
            value: stdTx
        })

        // Return buffer from marshaled PosmintTx
        return Buffer.from(encodedPosmintTX)
    }
}