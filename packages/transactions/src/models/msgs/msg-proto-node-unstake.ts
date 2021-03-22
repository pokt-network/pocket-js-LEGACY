import { Any } from './../../../../../dist/transactions/models/proto/generated/google/protobuf/any.d';
import { TxMsg } from "./tx-msg"
import { typeGuard, validateAddressHex } from "@pokt-network/pocket-js-utils"

/**
 * Model representing a MsgNodeStake to unstake as an Node in the Pocket Network
 */
export class MsgProtoNodeUnstake extends TxMsg {
    public readonly KEY: string = "github.com/pokt-network/pocket-core/x/nodes/types.MsgBeginUnstake"
    public readonly nodeAddress: string

    /**
     * @param {string} nodeAddress - Node address
     */
    public constructor(nodeAddress: string) {
        super()
        this.nodeAddress = nodeAddress

        const errorOrUndefined = validateAddressHex(this.nodeAddress)
        if (typeGuard(errorOrUndefined, Error)) {
            throw errorOrUndefined as Error
        }
    }
    /**
     * Converts an Msg Object to StdSignDoc
     * @returns {any} - Msg type key value.
     * @memberof MsgNodeUnstake
     */
    public toStdSignDocMsgObj(): any {
        return Any.fromJSON({
            "@type": this.KEY,
            "address": {
                "@type": "github.com/pokt-network/pocket-core/types.Address",
                "value": this.nodeAddress.toLowerCase()
            },
            
        });
    }

    /**
     * Converts an Msg Object to StdTx
     * @returns {any} - Msg type key value.
     * @memberof MsgNodeUnstake
     */
    public toStdTxMsgObj(): any {
        return this.toStdSignDocMsgObj()
    }
}