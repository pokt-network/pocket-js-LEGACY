"use strict";
exports.__esModule = true;
/**
 *
 *
 * @class QuerySupplyResponse
 */
var QuerySupplyResponse = /** @class */ (function () {
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
    function QuerySupplyResponse(nodeStaked, appStaked, dao, totalStaked, totalUnstaked, total) {
        this.nodeStaked = nodeStaked;
        this.appStaked = appStaked;
        this.dao = dao;
        this.totalStaked = totalStaked;
        this.totalUnstaked = totalUnstaked;
        this.total = total;
    }
    /**
     *
     * Creates a QuerySupplyResponse object using a JSON string
     * @param {String} json - JSON string.
     * @returns {QuerySupplyResponse} - QuerySupplyResponse object.
     * @memberof QuerySupplyResponse
     */
    QuerySupplyResponse.fromJSON = function (json) {
        try {
            var jsonObject = JSON.parse(json);
            return new QuerySupplyResponse(BigInt(jsonObject.node_staked), BigInt(jsonObject.app_staked), BigInt(jsonObject.dao), BigInt(jsonObject.total_staked), BigInt(jsonObject.total_unstaked), BigInt(jsonObject.total));
        }
        catch (error) {
            throw error;
        }
    };
    /**
     *
     * Creates a JSON object with the QuerySupplyResponse properties
     * @returns {JSON} - JSON Object.
     * @memberof NodeProof
     */
    QuerySupplyResponse.prototype.toJSON = function () {
        return {
            app_staked: Number(this.appStaked.toString()),
            dao: Number(this.dao.toString()),
            node_staked: Number(this.nodeStaked.toString()),
            total: Number(this.total.toString()),
            total_staked: Number(this.totalStaked.toString()),
            total_unstaked: Number(this.totalUnstaked.toString())
        };
    };
    return QuerySupplyResponse;
}());
exports.QuerySupplyResponse = QuerySupplyResponse;
