/**
 * @class MajorityResponse
 */
import {RelayProof} from "../relay-proof"
import {Relay} from "./relay"


export class MajorityResponse {
    /**
     *
     * Creates a MajorityResponse object using a JSON string
     * @param {String} json - JSON string.
     * @returns {MajorityResponse} - MajorityResponse object.
     * @memberof MajorityResponse
     */
    public static fromJSON(json: string): MajorityResponse {
        try {
            const jsonObject = JSON.parse(json)

            const relays: Relay[] =  new Array<Relay>(2)

            if (Array.isArray(jsonObject.majority_responses)) {
                jsonObject.majority_responses.forEach((relay: any) => {
                    if (relay !== null) {
                        const newRelay = new Relay(
                            relay.signature,
                            relay.payload,
                            RelayProof.fromJSON(JSON.stringify(relay.proof)),
                        )
                        relays.push(newRelay)
                    }
                })
            }
            return new MajorityResponse(
                relays
            )
        } catch (error) {
            throw error
        }
    }

    public readonly relays: Relay[]

    /**
     * Majority Response.
     * @constructor
     * @param {Relay[]} relays - Array of relays.
     */
    constructor(
        relays: Relay[]
    ) {
        this.relays = relays
        if (!this.isValid()) {
            throw new TypeError("Invalid MajorityResponse properties.")
        }
    }
    /**
     *
     * Creates a JSON object with the MajorityResponse properties
     * @returns {JSON} - JSON Object.
     * @memberof MajorityResponse
     */
    public toJSON() {
        return JSON.stringify(this.relays)
    }
    /**
     *
     * Check if the MajorityResponse object is valid
     * @returns {boolean} - True or false.
     * @memberof MajorityResponse
     */
    public isValid(): boolean {
        return (this.relays.length > 0 && this.relays.length < 3)
    }
}
