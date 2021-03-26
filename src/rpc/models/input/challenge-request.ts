/**
 * @class ChallengeRequest
 */
import {MajorityResponse} from "./majority-response"
import {MinorityResponse} from "./minority-response"
import {validateChallengeRequest} from "../../../utils/validator"
import {typeGuard, Hex} from "../../../utils"


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
                MinorityResponse.fromJSON(JSON.stringify(jsonObject.minority_response))
            )
        } catch (error) {
            throw error
        }
    }

    public readonly majorityResponse: MajorityResponse
    public readonly minorityResponse: MinorityResponse

    /**
     * Challenge Request.
     * @constructor
     * @param {MajorityResponse} majorityResponse - MajorityResponse object.
     * @param {MinorityResponse} minorityResponse - MinorityResponse object.
     */
    constructor(
        majorityResponse: MajorityResponse,
        minorityResponse: MinorityResponse,
    ) {
        this.majorityResponse = majorityResponse
        this.minorityResponse = minorityResponse

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
            minority_response: this.minorityResponse.toJSON()
        }
    }

    /**
     *
     * Check if the ChallengeRequest object is valid
     * @returns {boolean} - True or false.
     * @memberof ChallengeRequest
     */
    public isValid(): boolean {
        if (validateChallengeRequest(this) === undefined) {
            return true
        }
        return false
    }
}
