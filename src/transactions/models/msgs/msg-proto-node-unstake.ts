import { MsgBeginNodeUnstake } from './../proto/generated/tx-signer';
import { Any } from '../proto/generated/google/protobuf/any';
import { TxMsg } from "./tx-msg"
import { typeGuard, validateAddressHex } from './../../../utils'

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
        let data = { Address: Buffer.from(this.nodeAddress) }

        return Any.fromJSON({
            "typeUrl": this.KEY,
            "value": MsgBeginNodeUnstake.encode(data).finish(),
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