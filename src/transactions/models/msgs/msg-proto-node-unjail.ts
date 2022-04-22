import { MsgNodeUnjail8 } from '../proto/generated/tx-signer';

import { Any } from '../proto/generated/google/protobuf/any';
import { TxMsg } from "./tx-msg"
import { typeGuard, validateAddressHex } from './../../../utils'

/**
 * Model representing a MsgNodeUnjail to unjail as an Node in the Pocket Network
 */
export class MsgProtoNodeUnjail extends TxMsg {
    public readonly KEY: string = "/x.nodes.MsgUnjail8"
    public readonly AMINO_KEY: string = "pos/8.0MsgUnjail"
    public readonly nodeAddress: string
    public readonly signerAddress: string

    /**
     * @param {string} nodeAddress - Node address to be unjail
     * @param {string} signerAddress - Signer address (who triggered the unjail)
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
     * @memberof MsgNodeUnjail
     */
    public toStdSignDocMsgObj(): object {
        return {
            type: this.AMINO_KEY,
            value: {
                address: this.nodeAddress,
                signer_address: this.signerAddress
            }
        }
    }

    /**
     * Converts an Msg Object to StdTx
     * @returns {any} - Msg type key value.
     * @memberof MsgNodeUnjail
     */
    public toStdTxMsgObj(): any {
        let data = {
            ValidatorAddr: Buffer.from(this.nodeAddress, "hex"),
            Signer: Buffer.from(this.signerAddress, "hex")
        }

        return Any.fromJSON({
            "typeUrl": this.KEY,
            "value": Buffer.from(MsgNodeUnjail8.encode(data).finish()).toString("base64"),
        });
    }
}