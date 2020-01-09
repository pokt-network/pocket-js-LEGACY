import { Hex } from "../utils/hex";
import { BlockHeader } from "./block-header";
import { Commit } from "./commit";

/**
 *
 *
 * @class Block
 */
export class Block {
    /**
   *
   * Creates a Block object using a JSON string
   * @param {String} json - JSON string.
   * @returns {Block} - Block object.
   * @memberof Block
   */
    public static fromJSON(json: string): Block {
        const jsonObject = JSON.parse(json);

        return new Block(
            jsonObject.header,
            jsonObject.data,
            jsonObject.evidence,
            jsonObject.last_commit
        );
    }

    public readonly header: BlockHeader;
    public readonly data: Hex;
    public readonly evidence: Hex;
    public readonly lastCommit: Commit;

    /**
     * Block
     * @constructor
     * @param {BlockHeader} header - Block header.
     * @param {Hex} data - Data hash.
     * @param {Hex} evidence - Evidence hash.
     * @param {Commit} lastCommit - Last commit.
     */
    constructor(
        header: BlockHeader,
        data: Hex,
        evidence: Hex,
        lastCommit: Commit
    ) {
        this.header = header;
        this.data = data;
        this.evidence = evidence;
        this.lastCommit = lastCommit;

        if (!this.isValid()) {
            throw new TypeError("Invalid properties length.");
        }
    }
    /**
   *
   * Creates a JSON object with the Block properties
   * @returns {JSON} - JSON Object.
   * @memberof Block
   */
    public toJSON() {
        return {
            "header": this.header.toJSON(),
            "data": this.data,
            "evidence": this.evidence,
            "lastCommit": this.lastCommit.toJSON()
        }
    }
    /**
   *
   * Check if the Block object is valid
   * @returns {boolean} - True or false.
   * @memberof Block
   */
    public isValid(): boolean {
        for (let key in this) {
            if (!this.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }
}