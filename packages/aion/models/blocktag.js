const BLOCK_TAG = {
    EARLIEST: "earliest",
    LATEST: "latest"
}

class BlockTag {
    constructor(block) {
        this.defaultBlock = BLOCK_TAG.LATEST;
        this.blockHeight = this.defaultBlock;

        // Check if block is string type
        if (typeof block == "string") {
            if (this.hasZeroX(block)) {
                this.blockHeight = block;
            }else if(this.isValidBlockTag(block)){
                this.blockHeight = BLOCK_TAG[block.toUpperCase()];
            }
        } else if (typeof block == "number") {// Check if block is type number
            this.blockHeight = BigInt(block).toString(16);
            this.blockHeight = this.prependZeroX(this.blockHeight);
        }
    }
    hasZeroX(value) {
        if (value.substring(0, 2) == "0x") {
            return true;
        }
        return false;
    }
    prependZeroX(value){
        if (this.hasZeroX(value)) {
            return value;
        }
        return "0x"+value;
    }
    isValidBlockTag(value) {
        value = value.toUpperCase();
        // Check if value is a valid BLOCK_TAG
        if (BLOCK_TAG[value]) {
            return true;
        }
        return false;
    }
}

module.exports = {
    BlockTag
}