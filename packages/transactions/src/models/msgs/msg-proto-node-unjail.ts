import { Any } from './../../../../../dist/transactions/models/proto/generated/google/protobuf/any.d';
import { TxMsg } from "./tx-msg"
import { typeGuard, validateAddressHex } from "@pokt-network/pocket-js-utils"

/**
 * Model representing a MsgNodeUnjail to unjail as an Node in the Pocket Network
 */
export class MsgProtoNodeUnjail extends TxMsg {
    public readonly KEY: string = "github.com/pokt-network/pocket-core/x/nodes/types.MsgUnjail"
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
     * @returns {any} - Msg type key value.
     * @memberof MsgNodeUnjail
     */
    public toStdSignDocMsgObj(): any {
        return Any.fromJSON({
            "@type": this.KEY,
            "validatorAddr": {
                "@type": "github.com/pokt-network/pocket-core/types.Address",
                "value": this.address.toLowerCase()
            },
        });
    }

    /**
     * Converts an Msg Object to StdTx
     * @returns {any} - Msg type key value.
     * @memberof MsgNodeUnjail
     */
    public toStdTxMsgObj(): any {
        return this.toStdSignDocMsgObj()
    }
}