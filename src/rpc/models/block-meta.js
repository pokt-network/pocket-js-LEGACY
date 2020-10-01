"use strict";
exports.__esModule = true;
var block_id_1 = require("./block-id");
var block_header_1 = require("./block-header");
/**
 *
 *
 * @class BlockMeta
 */
var BlockMeta = /** @class */ (function () {
    /**
     * BlockMeta.
     * @constructor
     * @param {BlockID} blockID - BlockMeta block_id.
     * @param {BlockHeader} header - Block header.
     */
    function BlockMeta(blockID, header) {
        this.blockID = blockID;
        this.header = header;
        if (!this.isValid()) {
            throw new TypeError("Invalid BlockMeta properties length.");
        }
    }
    /**
     *
     * Creates a BlockMeta object using a JSON string
     * @param {String} json - JSON string.
     * @returns {BlockMeta} - BlockMeta object.
     * @memberof BlockMeta
     */
    BlockMeta.fromJSON = function (json) {
        var jsonObject = JSON.parse(json);
        return new BlockMeta(block_id_1.BlockID.fromJSON(JSON.stringify(jsonObject.block_id)), block_header_1.BlockHeader.fromJSON(JSON.stringify(jsonObject.header)));
    };
    /**
     *
     * Creates a JSON object with the BlockMeta properties
     * @returns {JSON} - JSON Object.
     * @memberof BlockMeta
     */
    BlockMeta.prototype.toJSON = function () {
        return {
            block_id: this.blockID.toJSON(),
            header: this.header.toJSON()
        };
    };
    /**
     *
     * Check if the BlockMeta object is valid
     * @returns {boolean} - True or false.
     * @memberof BlockMeta
     */
    BlockMeta.prototype.isValid = function () {
        return this.blockID.isValid() && this.header.isValid();
    };
    return BlockMeta;
}());
exports.BlockMeta = BlockMeta;
