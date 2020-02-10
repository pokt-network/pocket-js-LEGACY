import { TxMsg } from "./tx-msg"
import { CoinDenom } from "../coin-denom"

/**
 * Model representing a MsgSend to send POKT from one account to another
 */
export class MsgSend extends TxMsg {
    public readonly fromAddress: string
    public readonly toAddress: string
    public readonly amount: string
    public readonly AMINO_KEY: string = "pos/Send"

    /**
     * Constructor this message
     * @param fromAddress {string}
     * @param toAddress {string}
     * @param amount {string} Needs to be a valid number greater than 0
     * @param amountDenom {CoinDenom | undefined}
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
    public toStdSignDocMsgObj(): any {
        return { 
            type: this.AMINO_KEY, 
            value: { 
                Amount: this.amount,
                FromAddress: this.fromAddress.toLowerCase(), 
                ToAddress: this.toAddress.toLowerCase()
            } 
        }
    }
}