const BLOCK_TAG = {
    EARLIEST: "earliest",
    LATEST: "latest"
}

class BlockTag {
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
            console.log(error);
        }

    }
    toString(){
        return this.blockHeight;
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