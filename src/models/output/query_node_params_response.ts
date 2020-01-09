import { NodeParams } from "../node_params";

/**
 *
 *
 * @class QueryNodeParamsResponse
 */
export class QueryNodeParamsResponse {
    /**
   *
   * Creates a QueryNodeParamsResponse object using a JSON string
   * @param {String} json - JSON string.
   * @returns {QueryNodeParamsResponse} - QueryNodeParamsResponse object.
   * @memberof QueryNodeParamsResponse
   */
    public static fromJSON(json: string): QueryNodeParamsResponse {
        const jsonObject = JSON.parse(json);

        return new QueryNodeParamsResponse(
            NodeParams.fromJSON(jsonObject)
        );
    }

    public readonly nodeParams: NodeParams;

    /**
     * QueryNodeParamsResponse
     * @constructor
     * @param {NodeParams} nodeParams - Node params.
     */
    constructor(
        nodeParams: NodeParams

    ) {
        this.nodeParams = nodeParams

        if (!this.isValid()) {
            throw new TypeError("Invalid properties length.");
        }
    }
    /**
   *
   * Creates a JSON object with the QueryNodeParamsResponse properties
   * @returns {JSON} - JSON Object.
   * @memberof QueryNodeParamsResponse
   */
    public toJSON() {
        return this.nodeParams.toJSON();
    }
    /**
   *
   * Check if the QueryNodeParamsResponse object is valid
   * @returns {boolean} - True or false.
   * @memberof QueryNodeParamsResponse
   */
    public isValid(): boolean {
        return this.nodeParams.isValid();
    }
}