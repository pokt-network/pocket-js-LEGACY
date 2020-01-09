import { Hex } from "../utils/Hex"
import { SimpleProof } from "./simple_proof"

/**
 *
 *
 * @class TxProof
 */
export class TxProof {
    /**
   *
   * Creates a TxProof object using a JSON string
   * @param {String} json - JSON string.
   * @returns {TxProof} - TxProof object.
   * @memberof TxProof
   */
    public static fromJSON(json: string): TxProof {
        const jsonObject = JSON.parse(json);

        return new TxProof(
            jsonObject.root_hash,
            jsonObject.data,
            jsonObject.proof
        );
    }

    public readonly rootHash: Hex;
    public readonly data: Hex;
    public readonly proof: SimpleProof;

    /**
     * TxProof.
     * @constructor
     * @param {Hex} rootHash - Root hash.
     * @param {Hex} data - Hash holding the current tx proof data.
     * @param {SimpleProof} proof - Simple proof object.
     */
    constructor(
        rootHash: Hex,
        data: Hex,
        proof: SimpleProof
    ) {
        this.rootHash = rootHash
        this.data = data
        this.proof = proof

        if (!this.isValid()) {
            throw new TypeError("Invalid properties length.");
        }
    }
    /**
   *
   * Creates a JSON object with the TxProof properties
   * @returns {JSON} - JSON Object.
   * @memberof TxProof
   */
    public toJSON() {
        return {
            "root_hash": this.rootHash,
            "data": this.data,
            "proof": this.proof.toJSON()
        }
    }
    /**
   *
   * Check if the TxProof object is valid
   * @returns {boolean} - True or false.
   * @memberof TxProof
   */
    public isValid(): boolean {
        for (let key in this) {
            if (!this.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }
}