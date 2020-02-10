import { TxMsg } from "./tx-msg"
import { typeGuard, validateAddressHex } from "../../.."

/**
 * Model representing a MsgNodeStake to unstake as an Node in the Pocket Network
 */
export class MsgNodeUnstake extends TxMsg {
    public readonly AMINO_KEY: string = "pos/MsgBeginUnstake"
    public readonly nodeAddress: string

    /**
     * @param nodeAddress {string}
     */
    public constructor(nodeAddress: string) {
        super()
        this.nodeAddress = nodeAddress

        const errorOrUndefined = validateAddressHex(this.nodeAddress)
        if (typeGuard(errorOrUndefined, Error)) {
            throw errorOrUndefined as Error
        }
    }

    public toStdSignDocMsgObj(): any {
        return {
            type: this.AMINO_KEY,
            value: {
                validator_address: this.nodeAddress.toLowerCase()
            }
        }
    }
}