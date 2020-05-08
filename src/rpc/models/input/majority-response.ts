/**
 * @class MajorityResponse
 */
import {validateMajorityResponse} from "../../../utils/validator"
import {typeGuard} from "../../../utils"
import {RelayResponse, RelayProofResponse} from "../output"
import { RelayRequest } from "./relay-request"


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

            const relays: RelayResponse[] =  new Array<RelayResponse>(2)

            if (Array.isArray(jsonObject.majority_responses)) {
                jsonObject.majority_responses.forEach((relay: any) => {
                    if (relay !== null) {
                        const newRelay = RelayResponse.fromJSON(JSON.stringify(relay))
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

    public readonly relays: RelayResponse[]

    /**
     * Majority Response.
     * @constructor
     * @param {RelayResponse[]} relays - Array of relay response.
     */
    constructor(
        relays: RelayResponse[]
    ) {
        this.relays = relays

        const valid = this.isValid()
        if(typeGuard(valid, Error)) {
            throw valid
        }
    }
    /**
     *
     * Creates a JSON object with the MajorityResponse properties
     * @returns {JSON} - JSON Object.
     * @memberof MajorityResponse
     */
    public toJSON() {
        return this.relays
    }
    /**
     *
     * Check if the MajorityResponse object is valid
     * @returns {boolean} - True or false.
     * @memberof MajorityResponse
     */
    public isValid(): boolean {
        if (validateMajorityResponse(this) === undefined) {
            return true
        }
        return false
    }
}
