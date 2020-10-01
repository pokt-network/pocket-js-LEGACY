"use strict";
exports.__esModule = true;
var block_meta_1 = require("../block-meta");
var block_1 = require("../block");
/**
 *
 *
 * @class QueryBlockResponse
 */
var QueryBlockResponse = /** @class */ (function () {
    /**
     * Query Block Response.
     * @constructor
     * @param {Block} block - Block object.
     */
    function QueryBlockResponse(blockMeta, block) {
        this.blockMeta = blockMeta;
        this.block = block;
        if (!this.isValid()) {
            throw new TypeError("Invalid QueryBlockResponse properties.");
        }
    }
    /**
     *
     * Creates a QueryBlockResponse object using a JSON string
     * @param {String} json - JSON string.
     * @returns {QueryBlockResponse} - QueryBlockResponse object.
     * @memberof QueryBlockResponse
     */
    QueryBlockResponse.fromJSON = function (json) {
        try {
            var jsonObject = JSON.parse(json);
            return new QueryBlockResponse(block_meta_1.BlockMeta.fromJSON(JSON.stringify(jsonObject.block_meta)), block_1.Block.fromJSON(JSON.stringify(jsonObject.block)));
        }
        catch (error) {
            throw error;
        }
    };
    /**
     *
     * Creates a JSON object with the QueryBlockResponse properties
     * @returns {JSON} - JSON Object.
     * @memberof QueryBlockResponse
     */
    QueryBlockResponse.prototype.toJSON = function () {
        return {
            "block": this.block.toJSON(),
            "block_meta": this.blockMeta.toJSON()
        };
    };
    /**
     *
     * Check if the QueryBlockResponse object is valid
     * @returns {boolean} - True or false.
     * @memberof QueryBlockResponse
     */
    QueryBlockResponse.prototype.isValid = function () {
        return this.block.isValid() && this.blockMeta.isValid();
    };
    return QueryBlockResponse;
}());
exports.QueryBlockResponse = QueryBlockResponse;
