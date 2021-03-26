import { TxMsg } from "./tx-msg"
import { typeGuard, validateAddressHex } from "../../.."

/**
 * Model representing a MsgAppStake to unstake an Application in the Pocket Network
 */
export class MsgAppUnstake extends TxMsg {
    public readonly AMINO_KEY: string = "apps/MsgAppBeginUnstake"
    public readonly appAddress: string

    /**
     * The address hex of the Application to unstake for
     * @param {string} appAddress - Application address 
     */
    public constructor(appAddress: string) {
        super()
        this.appAddress = appAddress

        const errorOrUndefined = validateAddressHex(this.appAddress)
        if (typeGuard(errorOrUndefined, Error)) {
            throw errorOrUndefined as Error
        }
    }
    /**
     * Converts an Msg Object to StdSignDoc
     * @returns {any} - Msg type key value.
     * @memberof MsgAppUnstake
     */
    public toStdSignDocMsgObj(): any {
        return {
            type: this.AMINO_KEY,
            value: {
                application_address: this.appAddress.toLowerCase()
            }
        }
    }

    /**
     * Converts an Msg Object to StdSignDoc
     * @returns {any} - Msg type key value.
     * @memberof MsgAppUnstake
     */
    public toStdTxMsgObj(): any {
        return this.toStdSignDocMsgObj()
    }
}