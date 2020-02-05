import { IAminoEncodable } from "./amino-encodable";
import { PosmintStdSignDoc } from "@tendermint/amino-js/types/src/types/pocket"
import { TxMsg } from "./tx-msg"
import { CoinDenom } from "../coin-denom";
import { marshalPosmintStdSignDoc } from "@tendermint/amino-js";

/**
 * Model to represent a StdSignDoc which produces the bytes to sign for a given Transaction
 */
export class StdSignDoc implements IAminoEncodable{

    private readonly AMINO_TYPE: string = "posmint/StdSignDoc"
    public readonly accountNumber: string 
    public readonly sequence: string
    public readonly chaindId: string
    public readonly msgs: TxMsg[]
    public readonly fee: string
    public readonly feeDenom: CoinDenom
    public readonly memo: string

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

        if(msgs.length == 0) {
            throw new Error("No messages found in the msgs list")
        } else if (isNaN(this.fee as any)) {
            throw new Error("Fee is not a valid number")
        }
    }

    marshalAmino(): Buffer {
        const posmintStdSignDoc: PosmintStdSignDoc = {
            type: this.AMINO_TYPE,
            value: {
                account_number: this.accountNumber,
                chain_id: this.chaindId,
                fee: {
                    denom: this.feeDenom,
                    amount: this.fee
                },
                memo: this.memo,
                msgs: this.msgs.map((value) => {
                    return value.toMsgObj()
                }),
                sequence: this.sequence
            }
        }
        return new Buffer(marshalPosmintStdSignDoc(posmintStdSignDoc, true))
    }
}