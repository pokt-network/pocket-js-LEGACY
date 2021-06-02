import { bytesToBase64 } from "@tendermint/belt"

/**
 * Represents a given signature for a Transaction
 */
export class TxSignature {
    public readonly pubKey: Buffer 
    public readonly signature: Buffer

    /**
     * @param pubKey {Buffer} public key of the signer
     * @param signature {Buffer} the signature
     */
    public constructor(pubKey: Buffer, signature: Buffer) {
        this.pubKey = pubKey
        this.signature = signature
    }
}