import { bytesToBase64 } from "@tendermint/belt"
import { TxMsg } from ".."
import { validatePublicKey } from "../../.."

/**
 * Model representing a MsgAppStake to stake as an Application in the Pocket Network
 */
export class MsgAppStake extends TxMsg {
    public readonly AMINO_KEY: string = "apps/MsgAppStake"
    public readonly pubKey: Buffer
    public readonly chains: string[]
    public readonly amount: string

    /**
     * Constructor for this class
     * @param pubKey {Buffer}
     * @param chains {string[]} Network identifier list to be requested by this app
     * @param amount {string} the amount to stake, must be greater than 0
     */
    constructor(pubKey: Buffer, chains: string[], amount: string) {
        super()
        this.pubKey = pubKey
        this.chains = chains
        this.amount = amount
        const amountNumber = Number(this.amount) || -1
        if (isNaN(amountNumber)) {
            throw new Error("Amount is not a valid number")
        } else if (amountNumber < 0) {
            throw new Error("Amount < 0")
        } else if (this.chains.length === 0) {
            throw new Error("Chains is empty")
        } else if (!validatePublicKey(this.pubKey)) {
            throw new Error("Invalid public key")
        }
    }

    public getMsgTypeKey(): string {
        return this.AMINO_KEY
    }

    public getMsgValueObj(): {} {
        return {
            chains: this.chains,
            pubkey: {
                type: "crypto/ed25519_public_key",
                value: bytesToBase64(this.pubKey)
            },
            value: this.amount
        }
    }
}