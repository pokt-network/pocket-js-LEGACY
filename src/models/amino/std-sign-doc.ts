import { IAminoEncodable } from "./amino-encodable"
import { PosmintStdSignDoc } from "@pokt-network/amino-js/types/src/types/pocket"
import { TxMsg } from "./tx-msg"
import { CoinDenom } from "../coin-denom"
import { marshalPosmintStdSignDoc } from "@pokt-network/amino-js"

/**
 * Model to represent a StdSignDoc which produces the bytes to sign for a given Transaction
 */
export class StdSignDoc implements IAminoEncodable{

    public readonly accountNumber: string 
    public readonly sequence: string
    public readonly chaindId: string
    public readonly msgs: TxMsg[]
    public readonly fee: string
    public readonly feeDenom: CoinDenom
    public readonly memo: string
    private readonly AMINO_TYPE: string = "posmint/StdSignDoc"

    /**
     * Constructor for the StdSignDoc class
     * @throws {Error} Throws an error if the msgs list is empty or the fee is not a number
     * @param accountNumber 
     * @param sequence 
     * @param chaindId 
     * @param msgs 
     * @param fee 
     * @param feeDenom 
     * @param memo 
     */
    public constructor(accountNumber: string, sequence: string, chaindId: string, msgs: TxMsg[], fee: string, feeDenom?: CoinDenom, memo?: string) {
        this.accountNumber = accountNumber
        this.sequence = sequence
        this.chaindId = chaindId
        this.msgs = msgs
        this.fee = fee
        this.feeDenom = feeDenom ? feeDenom : CoinDenom.Upokt
        this.memo = memo ? memo : ""

        // Number parsing
        const accountNumb = Number(this.accountNumber) || -1
        const sequenceNumber = Number(this.sequence)
        const feeNumber = Number(this.fee) || -1
        
        if (isNaN(accountNumb) || accountNumb < 0) {
            throw new Error("Invalid accountNumber or < 0")
        } else if (isNaN(sequenceNumber) || sequenceNumber < 0) {
            throw new Error("Invalid sequence or < 0")
        } else if (isNaN(feeNumber) || feeNumber < 0) {
            throw new Error("Invalid fee or < 0")
        } else if (msgs.length === 0) {
            throw new Error("No messages found in the msgs list")
        } else if (this.chaindId.length === 0) {
            throw new Error("Empty chain id")
        }
    }

    public marshalAmino(): Buffer {
        const posmintStdSignDoc: PosmintStdSignDoc = {
            type: this.AMINO_TYPE,
            value: {
                account_number: this.accountNumber,
                chain_id: this.chaindId,
                fee: {
                    amount: this.fee,
                    denom: this.feeDenom
                },
                memo: this.memo,
                msgs: this.msgs.map((value) => {
                    return value.toMsgObj()
                }),
                sequence: this.sequence
            }
        }
        try {
            return Buffer.from(marshalPosmintStdSignDoc(posmintStdSignDoc, true))
        } catch(err) {
            throw err
        }
    }
}