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
    private readonly signature: TxSignature

    /**
     * @param stdSignDoc {StdSignDoc} The model form which the bytes for signature were produced
     * @param signature {TxSignature} The signature for this transaction
     */
    public constructor(stdSignDoc: StdSignDoc, signature: TxSignature) {
        this.stdSignDoc = stdSignDoc
        this.signature = signature
    }

    /**
     * Marshal the StdTx class properties with amino
     * @returns {Buffer} - Buffer representation of the marshal object.
     * @memberof StdTx
     */
    public marshalAmino(): Buffer {
        // Get the txMsg object
        const txMsg = this.stdSignDoc.msg.toStdTxMsgObj()

        // Get the signature object
        const txSignature = this.signature.toPosmintStdSignature()

        // Create StdTx object
        const stdTx: PosmintStdTx = {
            msg: txMsg,
            fee: [{
                amount: this.stdSignDoc.fee,
                denom: this.stdSignDoc.feeDenom
            }],
            signature: txSignature,
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