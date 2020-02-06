import { bytesToBase64 } from "@tendermint/belt"
import { TxMsg } from ".."
import { validatePublicKey, validateServiceURL } from "../../.."

/**
 * Model representing a MsgNodeStake to stake as an Node in the Pocket Network
 */
export class MsgNodeStake extends TxMsg {
    public readonly AMINO_KEY: string = "pos/MsgStake"
    public readonly pubKey: Buffer
    public readonly chains: string[]
    public readonly amount: string
    public readonly serviceURL: URL

    /**
     * @param pubKey {string}
     * @param chains {string[]} Cannot be empty
     * @param amount {string} Has to be a valid number and cannot be lesser than 0
     * @param serviceURL {URL} Needs to be https://
     */
    constructor(pubKey: Buffer, chains: string[], amount: string, serviceURL: URL) {
        super()
        this.pubKey = pubKey
        this.chains = chains
        this.amount = amount
        this.serviceURL = serviceURL
        const amountNumber = Number(this.amount) || -1
        if (isNaN(amountNumber)) {
            throw new Error("Amount is not a valid number")
        } else if (amountNumber < 0) {
            throw new Error("Amount < 0")
        } else if (this.chains.length === 0) {
            throw new Error("Chains is empty")
        } else if (!validatePublicKey(this.pubKey)) {
            throw new Error("Invalid public key")
        } else if (!validateServiceURL(this.serviceURL)) {
            throw new Error("Invalid Service URL")
        }
    }

    public getMsgTypeKey(): string {
        return this.AMINO_KEY
    }

    public getMsgValueObj(): {} {
        return {
            chains: this.chains,
            public_key: {
                type: "crypto/ed25519_public_key",
                value: bytesToBase64(this.pubKey)
            },
            service_url: this.serviceURL.toString(),
            value: this.amount
        }
    }
}