import { TxMsg } from ".."
import { typeGuard, validateAddressHex } from "../../.."

/**
 * Model representing a MsgAppStake to unstake an Application in the Pocket Network
 */
export class MsgAppUnstake extends TxMsg {
    public readonly AMINO_KEY: string = "apps/MsgAppBeginUnstake"
    public readonly appAddress: string

    /**
     * The address hex of the Application to unstake for
     * @param appAddress {string}
     */
    public constructor(appAddress: string) {
        super()
        this.appAddress = appAddress

        const errorOrUndefined = validateAddressHex(this.appAddress)
        if (typeGuard(errorOrUndefined, Error)) {
            throw errorOrUndefined as Error
        }
    }

    public getMsgTypeKey(): string {
        return this.AMINO_KEY
    }

    public getMsgValueObj(): {} {
        return {
            application_address: this.appAddress
        }
    }
}