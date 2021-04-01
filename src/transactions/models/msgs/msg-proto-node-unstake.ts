import { MsgBeginNodeUnstake } from './../proto/generated/tx-signer';
import { Any } from '../proto/generated/google/protobuf/any';
import { TxMsg } from "./tx-msg"
import { typeGuard, validateAddressHex } from './../../../utils'

/**
 * Model representing a MsgNodeStake to unstake as an Node in the Pocket Network
 */
export class MsgProtoNodeUnstake extends TxMsg {
    public readonly KEY: string = "/x.nodes.MsgBeginUnstake"
    public readonly AMINO_KEY: string = "pos/MsgBeginUnstake"
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
     * @returns {object} - Msg type key value.
     * @memberof MsgNodeUnstake
     */
    public toStdSignDocMsgObj(): object {
        return {
            type: this.AMINO_KEY,
            value: {
                validator_address: this.nodeAddress
            }
        }
    }

    /**
     * Converts an Msg Object to StdTx
     * @returns {any} - Msg type key value.
     * @memberof MsgNodeUnstake
     */
    public toStdTxMsgObj(): any {
        let data = { Address: Buffer.from(this.nodeAddress, "hex") }

        return Any.fromJSON({
            "typeUrl": this.KEY,
            "value": MsgBeginNodeUnstake.encode(data).finish(),
        });
    }
}