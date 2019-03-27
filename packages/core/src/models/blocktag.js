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
            // Uppercase the string
            block = block.toUpperCase();
            // Check if block is a valid BLOCK_TAG
            if (BLOCK_TAG[block]) {
                this.blockHeight = BLOCK_TAG[block];
            } else {
                // default blockHeight to defaultBlock
                this.blockHeight = this.defaultBlock;
            }
        }else if(typeof block == "number"){
            // block is type number
            this.blockHeight = block;
        }
    }
}
module.exports = {
	BlockTag
}