import { IAminoEncodable } from "./amino-encodable"
import { TxMsg } from "./msgs/tx-msg"
import { CoinDenom } from "./coin-denom"

/**
 * Model to represent a StdSignDoc which produces the bytes to sign for a given Transaction
 */
export class StdSignDoc implements IAminoEncodable{

    public readonly entropy: string
    public readonly chainID: string
    public readonly msgs: TxMsg[]
    public readonly fee: string
    public readonly feeDenom: CoinDenom
    public readonly memo: string
    private readonly AMINO_TYPE: string = "posmint/StdSignDoc"

    /**
     * Constructor for the StdSignDoc class
     * @throws {Error} Throws an error if the msgs list is empty or the fee is not a number
     * @param {string} entropy - Random int64.
     * @param {string} chainId - The chainId of the network to be sent to
     * @param {string} fee - The amount to pay as a fee for executing this transaction
     * @param {CoinDenom | undefined} feeDenom - The denomination of the fee amount 
     * @param {string | undefined} memo - The memo field for this account
     */
    public constructor(entropy: string, chainID: string, msgs: TxMsg[], fee: string, feeDenom?: CoinDenom, memo?: string) {
        this.entropy = entropy
        this.chainID = chainID
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
        } else if (this.chainID.length === 0) {
            throw new Error("Empty chain id")
        }
    }
    /**
     * Marshals using Amino
     * @returns {Buffer} - Buffer representation of the class properties
     * @memberof StdSignDoc
     */
    public marshalAmino(): Buffer {
        const stdSignDocValue = {
            chain_id: this.chainID,
            entropy: this.entropy,
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