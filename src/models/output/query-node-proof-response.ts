import { StoredProof } from "../stored-proof";
/**
 *
 *
 * @class QueryNodeProofResponse
 */
export class QueryNodeProofResponse {
    /**
   *
   * Creates a QueryNodeProofResponse object using a JSON string
   * @param {String} json - JSON string.
   * @returns {QueryNodeProofResponse} - QueryNodeProofResponse object.
   * @memberof QueryNodeProofResponse
   */
    public static fromJSON(json: string): QueryNodeProofResponse {
        const jsonObject = JSON.parse(json);

        return new QueryNodeProofResponse(
            StoredProof.fromJSON(jsonObject)
        ); 
    }

    public readonly stroredProof: StoredProof;

    /**
     * QueryNodeProofResponse.
     * @constructor
     * @param {StoredProof} stroredProof - Amount staked by the node.
     */
    constructor(
        stroredProof: StoredProof
    ) {
        this.stroredProof = stroredProof
    }
    /**
   *
   * Creates a JSON object with the QueryNodeProofResponse properties
   * @returns {JSON} - JSON Object.
   * @memberof QueryNodeProofResponse
   */
    public toJSON() {
        return this.stroredProof.toJSON();
    }
}