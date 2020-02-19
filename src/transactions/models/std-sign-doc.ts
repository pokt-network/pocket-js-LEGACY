import { IAminoEncodable } from "./amino-encodable"
import { TxMsg } from "./msgs/tx-msg"
import { CoinDenom } from "./coin-denom"

/**
 * Model to represent a StdSignDoc which produces the bytes to sign for a given Transaction
 */
export class StdSignDoc implements IAminoEncodable{

    public readonly chaindId: string
    public readonly msgs: TxMsg[]
    public readonly fee: string
    public readonly feeDenom: CoinDenom
    public readonly memo: string
    private readonly AMINO_TYPE: string = "posmint/StdSignDoc"

    /**
     * Constructor for the StdSignDoc class
     * @throws {Error} Throws an error if the msgs list is empty or the fee is not a number
     * @param chaindId 
     * @param msgs 
     * @param fee 
     * @param feeDenom 
     * @param memo 
     */
    public constructor(chaindId: string, msgs: TxMsg[], fee: string, feeDenom?: CoinDenom, memo?: string) {
        this.chaindId = chaindId
        this.msgs = msgs
        this.fee = fee
        this.feeDenom = feeDenom ? feeDenom : CoinDenom.Upokt
        this.memo = memo ? memo : ""

        // Number parsing
        const feeNumber = Number(this.fee) || -1
        
        if (isNaN(feeNumber) || feeNumber < 0) {
            throw new Error("Invalid fee or < 0")
        } else if (msgs.length === 0) {
            throw new Error("No messages found in the msgs list")
        } else if (this.chaindId.length === 0) {
            throw new Error("Empty chain id")
        }
    }

    public marshalAmino(): Buffer {
        const stdSignDocValue = {
            chain_id: this.chaindId,
            fee: [{
                amount: this.fee,
                denom: this.feeDenom
            }],
            memo: this.memo,
            msgs: this.msgs.map((value) => {
                return value.toStdSignDocMsgObj()
            })
        }
        try {
            return Buffer.from(JSON.stringify(stdSignDocValue).replace(/\\/g, ""), "utf8")
        } catch(err) {
            throw err
        }
    }
}