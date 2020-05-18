import { TxMsg } from "./tx-msg"
import { typeGuard, validateAddressHex } from "../../.."

/**
 * Model representing a MsgNodeUnjail to unjail as an Node in the Pocket Network
 */
export class MsgNodeUnjail extends TxMsg {
    public readonly AMINO_KEY: string = "pos/MsgUnjail"
    public readonly address: string

    /**
     * @param {string} address - Address value
     */
    public constructor(address: string) {
        super()
        this.address = address

        const errorOrUndefined = validateAddressHex(this.address)
        if (typeGuard(errorOrUndefined, Error)) {
            throw errorOrUndefined as Error
        }
    }
    /**
     * Converts an Msg Object to StdSignDoc
     * @returns {any} - Msg type key value.
     * @memberof MsgNodeUnjail
     */
    public toStdSignDocMsgObj(): any {
        return {
            type: this.AMINO_KEY,
            value: {
                address: this.address.toLowerCase()
            }
        }
    }

    /**
     * Converts an Msg Object to StdTx
     * @returns {any} - Msg type key value.
     * @memberof MsgNodeUnjail
     */
    public toStdTxMsgObj(): any {
        return this.toStdSignDocMsgObj()
    }
}