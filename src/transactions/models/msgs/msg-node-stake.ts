import { bytesToBase64 } from "@tendermint/belt"
import { TxMsg } from "./tx-msg"
import { validatePublicKey, validateServiceURL } from "../../.."

/**
 * Model representing a MsgNodeStake to stake as an Node in the Pocket Network
 */
export class MsgNodeStake extends TxMsg {
    public readonly AMINO_KEY: string = "pos/MsgStake"
    public readonly DEFAULT_PORT: string = "443"
    public readonly DEFAULT_PROTOCOL: string = "https:"
    public readonly pubKey: Buffer
    public readonly chains: string[]
    public readonly amount: string
    public readonly serviceURL: URL

    /**
     * @param {string} pubKey - Public key
     * @param {string[]} chains - String array containing a list of blockchain hashes
     * @param {string} amount - Amount to be sent, has to be a valid number and cannot be lesser than 0
     * @param {URL} serviceURL - Service node URL, needs to be https://
     */
    constructor(pubKey: Buffer, chains: string[], amount: string, serviceURL: URL) {
        super()
        this.pubKey = pubKey
        this.chains = chains
        this.amount = amount
        this.serviceURL = serviceURL

        if (!!!this.serviceURL.port) {
            this.serviceURL.port = "443"
        }

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

    /**
     * Returns the parsed serviceURL
     * @returns {string} - Parsed serviceURL
     * @memberof MsgNodeStake
     */
    private getParsedServiceURL(): string {
        return `${this.serviceURL.protocol ? this.serviceURL.protocol : this.DEFAULT_PROTOCOL}//${this.serviceURL.hostname}:${this.serviceURL.port ? this.serviceURL.port : this.DEFAULT_PORT}`
    }

    /**
     * Converts an Msg Object to StdSignDoc
     * @returns {any} - Msg type key value.
     * @memberof MsgNodeStake
     */
    public toStdSignDocMsgObj(): any {
        return {
            type: this.AMINO_KEY,
            value: {
                chains: this.chains,
                public_key: {
                    type: "crypto/ed25519_public_key",
                    value: this.pubKey.toString("hex")
                },
                service_url: this.getParsedServiceURL(),
                value: this.amount
            }
        }
    }

    /**
     * Converts an Msg Object to StdSignDoc
     * @returns {any} - Msg type key value.
     * @memberof MsgNodeStake
     */
    public toStdTxMsgObj(): any {
        return {
            type: this.AMINO_KEY,
            value: {
                chains: this.chains,
                public_key: {
                    type: "crypto/ed25519_public_key",
                    value: bytesToBase64(this.pubKey)
                },
                service_url: this.getParsedServiceURL(),
                value: this.amount
            }
        }
    }
}