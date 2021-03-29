import { MsgProtoStake } from '../proto/generated/tx-signer';
import { Any } from '../proto/generated/google/protobuf/any';
import { bytesToBase64 } from "@tendermint/belt"
import { TxMsg } from "./tx-msg"
import { validatePublicKey } from './../../../utils'

/**
 * Model representing a MsgAppStake to stake as an Application in the Pocket Network
 */
export class MsgProtoAppStake extends TxMsg {
    public readonly KEY: string = "github.com/pokt-network/pocket-core/x/apps/types.MsgProtoStake"
    public readonly pubKey: Buffer
    public readonly chains: string[]
    public readonly amount: string

    /**
     * Constructor for this class
     * @param {Buffer} pubKey - Public key buffer
     * @param {string[]} chains - Network identifier list to be requested by this app
     * @param {string} amount - The amount to stake, must be greater than 0
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
    /**
     * Returns the msg type key
     * @returns {string} - Msg type key value.
     * @memberof MsgAppStake
     */
    public getMsgTypeKey(): string {
        return this.KEY
    }
    /**
     * Converts an Msg Object to StdSignDoc
     * @returns {any} - Msg type key value.
     * @memberof MsgAppStake
     */
    public toStdSignDocMsgObj(): any {
        let data = {pubKey: Buffer.from(this.pubKey.toString("hex")), chains: this.chains, value: this.amount}

        return Any.fromJSON({
            "typeUrl": this.KEY,
            "value": MsgProtoStake.encode(data).finish()
        });
    }

    /**
     * Converts an Msg Object for StdTx encoding
     * @returns {any} - Msg type key value.
     * @memberof MsgAppStake
     */
    public toStdTxMsgObj(): any {
        return this.toStdSignDocMsgObj();
    }
}