import { MsgNodeUnjail } from '../proto/generated/tx-signer';

import { Any } from '../proto/generated/google/protobuf/any';
import { TxMsg } from "./tx-msg"
import { typeGuard, validateAddressHex } from './../../../utils'

/**
 * Model representing a MsgNodeUnjail to unjail as an Node in the Pocket Network
 */
export class MsgProtoNodeUnjail extends TxMsg {
    public readonly KEY: string = "/x.nodes.MsgUnjail"
    public readonly AMINO_KEY: string = "pos/MsgUnjail"
    public readonly address: string

    /**
     * @param {string} address - Address value
     */
    public constructor(address: string) {
        super()
        this.address = address

        const errorOrUndefined = validateAddressHex(this.address)
        if (typeGuard(errorOrUndefined, Error)) {
            throw errorOrUndefined as Error
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
                address: this.address
            }
        }
    }

    /**
     * Converts an Msg Object to StdTx
     * @returns {any} - Msg type key value.
     * @memberof MsgNodeUnjail
     */
    public toStdTxMsgObj(): any {
        let data = { ValidatorAddr: Buffer.from(this.address, "hex") }

        return Any.fromJSON({
            "typeUrl": this.KEY,
            "value": MsgNodeUnjail.encode(data).finish(),
        });
    }
}