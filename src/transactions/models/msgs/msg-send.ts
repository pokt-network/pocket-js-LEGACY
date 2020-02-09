import { TxMsg } from "./tx-msg"
import { CoinDenom } from "../../../models"

/**
 * Model representing a MsgSend to send POKT from one account to another
 */
export class MsgSend extends TxMsg {
    public readonly fromAddress: string
    public readonly toAddress: string
    public readonly amount: string
    public readonly amountDenom: CoinDenom
    public readonly AMINO_KEY: string = "posmint/MsgSend"

    /**
     * Constructor this message
     * @param fromAddress {string}
     * @param toAddress {string}
     * @param amount {string} Needs to be a valid number greater than 0
     * @param amountDenom {CoinDenom | undefined}
     */
    public constructor(fromAddress: string, toAddress: string, amount: string, amountDenom?: CoinDenom) {
        super()
        this.fromAddress = fromAddress
        this.toAddress = toAddress
        this.amount = amount
        this.amountDenom = amountDenom ? amountDenom : CoinDenom.Upokt
        const amountNumber = Number(this.amount) || -1
        if (isNaN(amountNumber)) {
            throw new Error("Fee is not a valid number")
        } else if (amountNumber < 0) {
            throw new Error("Amount < 0")
        }
    }
    public getMsgTypeKey(): string {
        return this.AMINO_KEY
    }
    public getMsgValueObj(): object {
        return {
            amount: [{
                amount: this.amount,
                denom: this.amountDenom
            }],
            from_address: this.fromAddress,
            to_address: this.toAddress
        }
    }
}