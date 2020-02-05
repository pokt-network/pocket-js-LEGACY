import { bytesToBase64 } from "@tendermint/belt"
import { PosmintStdSignature } from "@tendermint/amino-js/types/src/types/pocket"

/**
 * Represents a given signature for a Transaction
 */
export class TxSignature {
    private readonly PUBLIC_KEY_TYPE: string = "crypto/ed25519_public_key"
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

    /**
     * Encodes the object to it's Amino encodable form
     */
    public toPosmintStdSignature(): PosmintStdSignature {
        return {
            pub_key: {
                type: this.PUBLIC_KEY_TYPE,
                value: bytesToBase64(this.pubKey)
            },
            signature: bytesToBase64(this.signature)
        }
    }
}