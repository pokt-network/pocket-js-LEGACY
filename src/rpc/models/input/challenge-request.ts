/**
 * @class ChallengeRequest
 */
import {MajorityResponse} from "./majority-response"
import {MinorityResponse} from "./minority-response"
import {validateChallengeRequest, validateRelay} from "../../../utils/validator"
import {typeGuard} from "../../../utils"


export class ChallengeRequest {
    /**
     *
     * Creates a ChallengeRequest object using a JSON string
     * @param {String} json - JSON string.
     * @returns {ChallengeRequest} - ChallengeRequest object.
     * @memberof ChallengeRequest
     */
    public static fromJSON(json: string): ChallengeRequest {
        try {
            const jsonObject = JSON.parse(json)

            return new ChallengeRequest(
                MajorityResponse.fromJSON(JSON.stringify(jsonObject.majority_responses)),
                MinorityResponse.fromJSON(JSON.stringify(jsonObject.minority_response)),
                jsonObject.address
            )
        } catch (error) {
            throw error
        }
    }

    public readonly majorityResponse: MajorityResponse
    public readonly minorityResponse: MinorityResponse
    public readonly address: string

    /**
     * Challenge Request.
     * @constructor
     * @param {MajorityResponse} majorityResponse - MajorityResponse object.
     * @param {MinorityResponse} minorityResponse - MinorityResponse object.
     * @param {string} address - address.
     */
    constructor(
        majorityResponse: MajorityResponse,
        minorityResponse: MinorityResponse,
        address: string
    ) {
        this.majorityResponse = majorityResponse
        this.minorityResponse = minorityResponse
        this.address = address

        const valid = this.isValid()
        if(typeGuard(valid, Error)) {
            throw valid
        }
    }
    /**
     *
     * Creates a JSON object with the ChallengeRequest properties
     * @returns {JSON} - JSON Object.
     * @memberof ChallengeRequest
     */
    public toJSON() {
        return {
            majority_responses: this.majorityResponse.toJSON(),
            minority_response: this.minorityResponse.toJSON(),
            addRange: this.address
        }
    }

    /**
     *
     * Check if the ChallengeRequest object is valid
     * @returns {boolean} - True or false.
     * @memberof ChallengeRequest
     */
    public isValid(): Error | undefined {
        return validateChallengeRequest(this)
    }
}
