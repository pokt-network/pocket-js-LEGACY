
/**
 *
 *
 * @class ChallengeResponse
 */
export class ChallengeResponse {
    /**
     *
     * Creates a RelayMeta object using a JSON string
     * @param {string} json - JSON string.
     * @returns {ChallengeResponse} - ChallengeResponse object.
     * @memberof ChallengeResponse
     */
    public static fromJSON(json: string): ChallengeResponse {
        try {
            const jsonObject = JSON.parse(json)

            return new ChallengeResponse(
                jsonObject.response
            )
        } catch (error) {
            throw error
        }
    }

    public readonly response: string

    /**
     * Challenge Response.
     * @constructor
     * @param {string} response - response json.
     */
    constructor(
        response: string
    ) {
        this.response = response

        if (!this.isValid()) {
            throw new TypeError("Invalid ChallengeResponse properties.")
        }
    }
    /**
     *
     * Creates a JSON object with the ChallengeResponse properties
     * @returns {JSON} - JSON Object.
     * @memberof ChallengeResponse
     */
    public toJSON() {
        return {
            response: this.response
        }
    }
    /**
     *
     * Check if the ChallengeResponse object is valid
     * @returns {boolean} - True or false.
     * @memberof ChallengeResponse
     */
    public isValid(): boolean {
        return (
            this.response.length > 0
        )
    }
}
