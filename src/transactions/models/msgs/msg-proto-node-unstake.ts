import { MsgBeginNodeUnstake8 } from './../proto/generated/tx-signer';
import { Any } from '../proto/generated/google/protobuf/any';
import { TxMsg } from "./tx-msg"
import { typeGuard, validateAddressHex } from './../../../utils'

/**
 * Model representing a MsgNodeStake to unstake as an Node in the Pocket Network
 */
export class MsgProtoNodeUnstake extends TxMsg {
    public readonly KEY: string = "/x.nodes.MsgBeginUnstake8"
    public readonly AMINO_KEY: string = "pos/8.0MsgBeginUnstake"
    public readonly nodeAddress: string
    public readonly signerAddress: string

    /**
     * @param {string} nodeAddress - Node address
     * @param {string} signerAddress - Signer address (who triggered the unstake)
     */
    public constructor(nodeAddress: string, signerAddress: string) {
        super()
        this.nodeAddress = nodeAddress
        this.signerAddress = signerAddress

        const nodeErrorOrUndefined = validateAddressHex(this.nodeAddress)
        if (typeGuard(nodeErrorOrUndefined, Error)) {
            throw nodeErrorOrUndefined as Error
        }

        const signerErrorOrUndefined = validateAddressHex(this.signerAddress)
        if (typeGuard(signerErrorOrUndefined, Error)) {
            throw signerErrorOrUndefined as Error
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
                validator_address: this.nodeAddress,
                signer_address: this.signerAddress
            }
        }
    }

    /**
     * Converts an Msg Object to StdTx
     * @returns {any} - Msg type key value.
     * @memberof MsgNodeUnstake
     */
    public toStdTxMsgObj(): any {
        let data = { Address: Buffer.from(this.nodeAddress, "hex"), Signer: Buffer.from(this.signerAddress, "hex") }

        return Any.fromJSON({
            "typeUrl": this.KEY,
            "value": Buffer.from(MsgBeginNodeUnstake8.encode(data).finish()).toString("base64"),
        });
    }
}