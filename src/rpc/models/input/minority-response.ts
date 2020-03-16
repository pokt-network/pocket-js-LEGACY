/**
 * @class MinorityResponse
 */
import {Relay} from "./relay"


export class MinorityResponse {
    /**
     *
     * Creates a MinorityResponse object using a JSON string
     * @param {String} json - JSON string.
     * @returns {MinorityResponse} - MinorityResponse object.
     * @memberof MinorityResponse
     */
    public static fromJSON(json: string): MinorityResponse {
        try {
            const jsonObject = JSON.parse(json)

            return new MinorityResponse(
                Relay.fromJSON(JSON.stringify(jsonObject.relay))
            )
        } catch (error) {
            throw error
        }
    }

    public readonly relay: Relay

    /**
     * Minority Response.
     * @constructor
     * @param {Relay} relay - Array of relays.
     */
    constructor(
        relay: Relay
    ) {
        this.relay = relay
        if (!this.isValid()) {
            throw new TypeError("Invalid MinorityResponse properties.")
        }
    }
    /**
     *
     * Creates a JSON object with the MinorityResponse properties
     * @returns {JSON} - JSON Object.
     * @memberof MinorityResponse
     */
    public toJSON() {
        return this.relay.toJSON()
    }
    /**
     *
     * Check if the MinorityResponse object is valid
     * @returns {boolean} - True or false.
     * @memberof MinorityResponse
     */
    public isValid(): boolean {
        return (this.relay.isValid())
    }
}
