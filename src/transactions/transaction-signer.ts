export class TransactionSignature {
    public readonly publicKey: Buffer
    public readonly signature: Buffer

    constructor(publicKey: Buffer, signature: Buffer) {
        this.publicKey = publicKey
        this.signature = signature
    }
}
export type TransactionSigner = (encodedTxBytes: Buffer) => TransactionSignature | Error