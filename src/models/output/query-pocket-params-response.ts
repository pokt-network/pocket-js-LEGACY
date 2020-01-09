import { PocketParams } from "../pocket-params";

/**
 *
 *
 * @class QueryPocketParamsResponse
 */
export class QueryPocketParamsResponse {
    /**
   *
   * Creates a QueryPocketParamsResponse object using a JSON string
   * @param {String} json - JSON string.
   * @returns {QueryPocketParamsResponse} - QueryPocketParamsResponse object.
   * @memberof QueryPocketParamsResponse
   */
    public static fromJSON(json: string): QueryPocketParamsResponse {
        const jsonObject = JSON.parse(json);

        return new QueryPocketParamsResponse(
            PocketParams.fromJSON(jsonObject)
        );
    }

    public readonly pocketParams: PocketParams;

    /**
     * QueryPocketParamsResponse
     * @constructor
     * @param {PocketParams} applicationParams - Application params.
     */
    constructor(
        pocketParams: PocketParams

    ) {
        this.pocketParams = pocketParams

        if (!this.isValid()) {
            throw new TypeError("Invalid properties length.");
        }
    }
    /**
   *
   * Creates a JSON object with the QueryPocketParamsResponse properties
   * @returns {JSON} - JSON Object.
   * @memberof QueryPocketParamsResponse
   */
    public toJSON() {
        return this.pocketParams.toJSON();
    }
    /**
   *
   * Check if the QueryPocketParamsResponse object is valid
   * @returns {boolean} - True or false.
   * @memberof QueryPocketParamsResponse
   */
    public isValid(): boolean {
        return this.pocketParams.isValid();
    }
}