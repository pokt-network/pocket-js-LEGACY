/**
 * Model representing a ECDSA signature result
 */
export class TransactionSignature {
    public readonly publicKey: Buffer
    public readonly signature: Buffer

    constructor(publicKey: Buffer, signature: Buffer) {
        this.publicKey = publicKey
        this.signature = signature
    }
}