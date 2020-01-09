/**
 *
 *
 * @class QuerySupportedChainsResponse
 */
export class QuerySupportedChainsResponse {
    /**
   *
   * Creates a QuerySupportedChainsResponse object using a JSON string
   * @param {String} json - JSON string.
   * @returns {QuerySupportedChainsResponse} - QuerySupportedChainsResponse object.
   * @memberof QuerySupportedChainsResponse
   */
    public static fromJSON(json: string): QuerySupportedChainsResponse {
        const jsonObject = JSON.parse(json);

        return new QuerySupportedChainsResponse(
            jsonObject
        );
    }

    public readonly supportedChains: string[];

    /**
     * QuerySupportedChainsResponse
     * @constructor
     * @param {string[]} supportedChains - Application params.
     */
    constructor(
        supportedChains: string[]
    ) {
        this.supportedChains = supportedChains

        if (!this.isValid()) {
            throw new TypeError("Invalid properties length.");
        }
    }
    /**
   *
   * Creates a JSON object with the QuerySupportedChainsResponse properties
   * @returns {JSON} - JSON Object.
   * @memberof QuerySupportedChainsResponse
   */
    public toJSON() {
        return {
            "supported_chains": this.supportedChains
        }
    }
    /**
   *
   * Check if the QuerySupportedChainsResponse object is valid
   * @returns {boolean} - True or false.
   * @memberof QuerySupportedChainsResponse
   */
    public isValid(): boolean {
        return this.supportedChains != undefined;
    }
}