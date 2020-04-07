/**
 * @class MinorityResponse
 */
import {validateRelayResponse} from "../../../utils/validator"
import {typeGuard} from "../../../utils"
import {RelayResponse} from "../output"


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
                RelayResponse.fromJSON(JSON.stringify(jsonObject.relay))
            )
        } catch (error) {
            throw error
        }
    }

    public readonly relay: RelayResponse

    /**
     * Minority Response.
     * @constructor
     * @param {Relay} relay - Array of relays.
     */
    constructor(
        relay: RelayResponse
    ) {
        this.relay = relay

        const valid = this.isValid()
        if(typeGuard(valid, Error)) {
            throw valid
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
        if (validateRelayResponse(this.relay) === undefined) {
            return true
        }
        return false
    }
}
