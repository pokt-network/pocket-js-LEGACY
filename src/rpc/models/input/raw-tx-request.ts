import { Hex, validateAddressHex, typeGuard } from "../../../utils"

/**
 * Represents a /v1/rawtx RPC request
 */
export class RawTxRequest {
    /**
     * Util function to create a RawTxRequest using Buffer or strings
     * @param {Buffer | string} address - The address hex of the sender
     * @param {Buffer | string} tx - The transaction bytes
     * @returns {RawTxRequest} - Raw transaction request object.
     * @memberof RawTxRequest
     */
    public static with(address: Buffer | string, tx: Buffer | string): RawTxRequest {
        const addrParam: string = typeGuard(address, Buffer) ? (address as Buffer).toString('hex') : (address as string)
        const txParam: string = typeGuard(tx, Buffer) ? (tx as Buffer).toString('hex') : (tx as string)
        return new RawTxRequest(addrParam, txParam)
    }

    public readonly address: string
    public readonly txHex: string

    /**
     * Constructor for this class
     * @param {string} address - The address hex of the sender
     * @param {string} txHex - The transaction bytes in hex format
     */
    public constructor(address: string, txHex: string) {
        this.address = address
        this.txHex = txHex

        const errorOrUndefined = validateAddressHex(address)
        if (typeGuard(errorOrUndefined, Error)) {
            throw errorOrUndefined as Error
        } else if (!Hex.isHex(txHex)) {
            throw new Error("Invalid transaction hex")
        }
    }

    /**
     * JSON representation of this model
     * @returns {object} The JSON request specified by the /v1/rawtx RPC call
     * @memberof RawTxRequest
     */
    public toJSON(): {} {
        return {
            address: this.address,
            raw_hex_bytes: this.txHex
        }
    }
}