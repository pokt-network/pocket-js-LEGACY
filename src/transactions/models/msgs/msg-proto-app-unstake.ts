import { MsgBeginUnstake } from './../proto/generated/tx-signer';
import { Any } from '../proto/generated/google/protobuf/any';
import { TxMsg } from "./tx-msg"
import { typeGuard, validateAddressHex } from './../../../utils'

/**
 * Model representing a MsgAppStake to unstake an Application in the Pocket Network
 */
export class MsgProtoAppUnstake extends TxMsg {
    public readonly KEY: string = "/x.apps.MsgBeginUnstake"
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
     * @returns {object} - Msg type key value.
     * @memberof MsgAppUnstake
     */
    public toStdSignDocMsgObj(): object {
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
        const data = { Address: Buffer.from(this.appAddress, "hex") }

        return Any.fromJSON({
            "typeUrl": this.KEY,
            "value": Buffer.from(MsgBeginUnstake.encode(data).finish()).toString("base64")
        });
    }
}