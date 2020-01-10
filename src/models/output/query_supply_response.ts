/**
 *
 *
 * @class QuerySupplyResponse
 */
export class QuerySupplyResponse {
    /**
   *
   * Creates a QuerySupplyResponse object using a JSON string
   * @param {String} json - JSON string.
   * @returns {QuerySupplyResponse} - QuerySupplyResponse object.
   * @memberof QuerySupplyResponse
   */
    public static fromJSON(json: string): QuerySupplyResponse {
        const jsonObject = JSON.parse(json);

        return new QuerySupplyResponse(
            jsonObject.node_staked,
            jsonObject.app_staked,
            jsonObject.dao,
            jsonObject.total_staked,
            jsonObject.total_unstaked,
            jsonObject.total
        );
    }

    public readonly nodeStaked: BigInt;
    public readonly appStaked: BigInt;
    public readonly dao: BigInt;
    public readonly totalStaked: BigInt;
    public readonly totalUnstaked: BigInt;
    public readonly total: BigInt;

    /**
     * QuerySupplyResponse.
     * @constructor
     * @param {BigInt} nodeStaked - Amount staked by the node.
     * @param {BigInt} appStaked - Amount staked by the app.
     * @param {BigInt} dao - DAO amount.
     * @param {BigInt} totalStaked - Total amount staked.
     * @param {BigInt} totalUnstaked - Total amount unstaked.
     * @param {BigInt} total - Total amount.
     */
    constructor(
        nodeStaked: BigInt,
        appStaked: BigInt,
        dao: BigInt,
        totalStaked: BigInt,
        totalUnstaked: BigInt,
        total: BigInt
    ) {
        this.nodeStaked = nodeStaked
        this.appStaked = appStaked
        this.dao = dao
        this.totalStaked = totalStaked
        this.totalUnstaked = totalUnstaked
        this.total = total
    }
    /**
   *
   * Creates a JSON object with the QuerySupplyResponse properties
   * @returns {JSON} - JSON Object.
   * @memberof NodeProof
   */
    public toJSON() {
        return {
            "nodeStaked": this.nodeStaked,
            "appStaked": this.appStaked,
            "dao": this.dao,
            "totalStaked": this.totalStaked,
            "totalUnstaked": this.totalUnstaked,
            "total": this.total
        }
    }
}