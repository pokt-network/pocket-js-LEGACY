import { MsgBeginUnstake, MsgUnjail } from './../proto/generated/tx-signer';
import { Any } from '../proto/generated/google/protobuf/any';
import { TxMsg } from "./tx-msg"
import { typeGuard, validateAddressHex } from "@pokt-network/pocket-js-utils"

/**
 * Model representing a MsgAppUnjail to unjail an Application in the Pocket Network
 */
export class MsgProtoAppUnjail extends TxMsg {
    public readonly KEY: string = "github.com/pokt-network/pocket-core/x/apps/types.MsgUnjail"
    public readonly address: string

    /**
     * 
     * @param {string} address - The address of the Application to unjail
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
     * @memberof MsgAppUnjail
     */
    public toStdSignDocMsgObj(): any {
        let data = { AppAddr: Buffer.from(this.address)}

        return Any.fromJSON({
            "typeUrl": this.KEY,
            "value": MsgUnjail.encode(data).finish()
        });
    }

    /**
     * Converts an Msg Object to StdTx
     * @returns {any} - Msg type key value.
     * @memberof MsgAppUnjail
     */
    public toStdTxMsgObj(): any {
        return this.toStdSignDocMsgObj()
    }
}