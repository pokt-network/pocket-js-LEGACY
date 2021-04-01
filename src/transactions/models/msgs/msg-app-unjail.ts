import { TxMsg } from "./tx-msg"
import { typeGuard, validateAddressHex } from './../../../utils'

/**
 * Model representing a MsgAppUnjail to unjail an Application in the Pocket Network
 */
export class MsgAppUnjail extends TxMsg {
    public readonly AMINO_KEY: string = "apps/MsgAppUnjail"
    public readonly address: string

    /**
     * 
     * @param {string} address - The address of the Application to unjail
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
     * @returns {object} - Msg type key value.
     * @memberof MsgAppUnjail
     */
    public toStdSignDocMsgObj(): object {
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
     * @memberof MsgAppUnjail
     */
    public toStdTxMsgObj(): any {
        return this.toStdSignDocMsgObj()
    }
}