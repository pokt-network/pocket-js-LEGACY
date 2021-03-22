import { Any } from './../../../../../dist/transactions/models/proto/generated/google/protobuf/any.d';
import { bytesToBase64 } from "@tendermint/belt"
import { TxMsg } from "./tx-msg"
import { validatePublicKey, validateServiceURL } from "@pokt-network/pocket-js-utils"

/**
 * Model representing a MsgNodeStake to stake as an Node in the Pocket Network
 */
export class MsgProtoNodeStake extends TxMsg {
    public readonly KEY: string = "github.com/pokt-network/pocket-core/x/nodes/types.MsgProtoStake"
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
        return Any.fromJSON({
            "@type": this.KEY,
            "publickey": {
                "@type": "github.com/pokt-network/pocket-core/types.Address",
                "value": this.pubKey.toString("hex")
            },
            "chains": this.chains,
            "value": {
                "@type": "github.com/pokt-network/pocket-core/types.BigInt",
                "value": this.amount
            },
            "serviceUrl": this.serviceURL
        });
    }

    /**
     * Converts an Msg Object to StdSignDoc
     * @returns {any} - Msg type key value.
     * @memberof MsgNodeStake
     */
    public toStdTxMsgObj(): any {
        this.toStdSignDocMsgObj();
    }
}