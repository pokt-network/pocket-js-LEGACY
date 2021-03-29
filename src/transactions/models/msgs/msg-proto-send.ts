import { MsgSend } from './../proto/generated/tx-signer';
import { Any } from '../proto/generated/google/protobuf/any';
import { TxMsg } from "./tx-msg"

/**
 * Model representing a MsgSend to send POKT from one account to another
 */
export class MsgProtoSend extends TxMsg {
    public readonly fromAddress: string
    public readonly toAddress: string
    public readonly amount: string
    public readonly KEY: string = "github.com/pokt-network/pocket-core/x/nodes/types.MsgSend"

    /**
     * Constructor this message
     * @param {string} fromAddress - Origin address
     * @param {string} toAddress - Destination address
     * @param {string} amount - Amount to be sent, needs to be a valid number greater than 0
     * @param {CoinDenom | undefined} amountDenom  - Amount value denomination
     */
    public constructor(fromAddress: string, toAddress: string, amount: string) {
        super()
        this.fromAddress = fromAddress
        this.toAddress = toAddress
        this.amount = amount
        const amountNumber = Number(this.amount) || -1
        if (isNaN(amountNumber)) {
            throw new Error("Fee is not a valid number")
        } else if (amountNumber < 0) {
            throw new Error("Amount < 0")
        }
    }
    /**
     * Converts an Msg Object to StdSignDoc
     * @returns {any} - Msg type key value.
     * @memberof MsgSend
     */
    public toStdSignDocMsgObj(): any {
        let data = { FromAddress: Buffer.from(this.fromAddress), ToAddress: Buffer.from(this.toAddress), amount: this.amount }

        let result = Any.fromJSON({
            "typeUrl": this.KEY,
            "value": MsgSend.encode(data).finish() 
        });
        
        return result;
    }

    /**
     * Converts an Msg Object to StdSignDoc
     * @returns {any} - Msg type key value.
     * @memberof MsgSend
     */
    public toStdTxMsgObj(): any {
        return this.toStdSignDocMsgObj()
    }
}