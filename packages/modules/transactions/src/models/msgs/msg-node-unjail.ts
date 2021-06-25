/* eslint-disable @typescript-eslint/naming-convention */
import { TxMsg } from "./tx-msg"
import { typeGuard, validateAddressHex } from '@pokt-network/pocket-js-utils'

/**
 * Model representing a MsgNodeUnjail to unjail as an Node in the Pocket Network
 */
export class MsgNodeUnjailTx extends TxMsg {
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
            throw errorOrUndefined 
        }
    }
    /**
     * Converts an Msg Object to StdSignDoc
     *
     * @returns {object} - Msg type key value.
     * @memberof MsgNodeUnjail
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
     *
     * @returns {any} - Msg type key value.
     * @memberof MsgNodeUnjail
     */
    public toStdTxMsgObj(): any {
        return this.toStdSignDocMsgObj()
    }
}