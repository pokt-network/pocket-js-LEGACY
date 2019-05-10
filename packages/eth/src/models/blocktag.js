/**
 * @author Pabel Nunez Landestoy <pabel@pokt.network>
 * @description BlockTag class handles the default supported block tags
 * and format the block number if passed.
 */
const BLOCK_TAG = {
    EARLIEST: "earliest",
    LATEST: "latest",
    PENDING: "pending"
}

/**
 *
 *
 * @class BlockTag
 */
class BlockTag {
    /**
     *Creates an instance of BlockTag.
     * @param {Number} block - Block number.
     * @memberof BlockTag
     */
    constructor(block) {
        // By default the blockHeight is "latest"
        this.blockHeight = BLOCK_TAG.LATEST;
        // Check if block is string type
        try {
            if (typeof block == "string") {
                if (this.hasZeroX(block)) {
                    this.blockHeight = block;
                }else if(this.isValidBlockTag(block)){
                    this.blockHeight = BLOCK_TAG[block.toUpperCase()];
                }
            } else if (typeof block == "number") {// Check if block is type number
                this.blockHeight = this.prependZeroX(BigInt(block).toString(16));
            }
        } catch (error) {
            this.blockHeight = BLOCK_TAG.LATEST;
            console.error(error);
        }

    }
    /**
     *
     * Converts the block number or tag to string.
     * @returns {String} - Returns the block number or tag as a string.
     * @memberof BlockTag
     */
    toString(){
        return this.blockHeight;
    }
    /**
     *
     * Checks if the string starts with 0x
     * @param {String} value - String value.
     * @returns {boolean} - Returns true or false 
     * @memberof BlockTag
     */
    hasZeroX(value) {
        if (value.substring(0, 2) == "0x") {
            return true;
        }
        return false;
    }
    /**
     *
     * Prepend 0x to a String.
     * @param {String} value - String value.
     * @returns {String} - A string with 0x as a prefix.
     * @memberof BlockTag
     */
    prependZeroX(value){
        if (this.hasZeroX(value)) {
            return value;
        }
        return "0x"+value;
    }
    /**
     *
     * Verifies if the blocktag is valid.
     * @param {String} value - Block tag value.
     * @returns {boolean} - Returns true or false.
     * @memberof BlockTag
     */
    isValidBlockTag(value) {
        // Check if value is a valid BLOCK_TAG
        if (BLOCK_TAG[value.toUpperCase()]) {
            return true;
        }
        return false;
    }
}

module.exports = {
    BlockTag
}