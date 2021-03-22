import { Any } from '../proto/generated/google/protobuf/any';
import { TxMsg } from "./tx-msg"
import { typeGuard, validateAddressHex } from "@pokt-network/pocket-js-utils"

/**
 * Model representing a MsgAppStake to unstake an Application in the Pocket Network
 */
export class MsgProtoAppUnstake extends TxMsg {
    public readonly KEY: string = "github.com/pokt-network/pocket-core/x/apps/types.MsgBeginUnstake"
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
        return Any.fromJSON({
            "@type": this.KEY,
            "address": {
                "@type": "github.com/pokt-network/pocket-core/types.Address",
                "value": this.appAddress.toLowerCase()
            },
        });
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