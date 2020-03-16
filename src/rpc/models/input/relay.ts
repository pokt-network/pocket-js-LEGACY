/**
 * @class Relay
 */
import {RelayProof} from "../relay-proof"
import {Hex} from "../../../utils"


export class Relay {
    /**
     *
     * Creates a MajorityResponse object using a JSON string
     * @param {String} json - JSON string.
     * @returns {Relay} - Relay object.
     * @memberof Relay
     */
    public static fromJSON(json: string): Relay {
        try {
            const jsonObject = JSON.parse(json)

            return new Relay(
                jsonObject.signature,
                jsonObject.payload,
                RelayProof.fromJSON(JSON.stringify(jsonObject.meta))
            )
        } catch (error) {
            throw error
        }
    }

    public readonly signature: string
    public readonly payload: string
    public readonly proof: RelayProof

    /**
     * Relay.
     * @constructor
     * @param {string} signature - signature.
     * @param {string} payload - payload.
     * @param {RelayProof} proof - proof.
     */
    constructor(
        signature: string,
        payload: string,
        proof: RelayProof
    ) {
        this.signature = signature
        this.payload = payload
        this.proof = proof

        if (!this.isValid()) {
            throw new TypeError("Invalid Relay properties.")
        }
    }

    /**
     *
     * Creates a JSON object with the MajorityResponse properties
     * @returns {JSON} - JSON Object.
     * @memberof Relay
     */
    public toJSON() {
        return {
            signature: this.signature,
            payload: this.payload,
            proof: this.proof.toJSON()
        }
    }
    /**
     *
     * Check if the NodeProof object is valid
     * @returns {boolean} - True or false.
     * @memberof NodeProof
     */
    public isValid(): boolean {
        return (this.proof.isValid() && Hex.isHex(this.signature)
        )
    }
}
