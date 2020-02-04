import { BlockID } from "./block-id"
import { BlockHeader } from "./block-header"

/**
 *
 *
 * @class BlockMeta
 */
export class BlockMeta {
  /**
   *
   * Creates a BlockMeta object using a JSON string
   * @param {String} json - JSON string.
   * @returns {BlockMeta} - BlockMeta object.
   * @memberof BlockMeta
   */
  public static fromJSON(json: string): BlockMeta {
    const jsonObject = JSON.parse(json)
    
    return new BlockMeta(
      BlockID.fromJSON(JSON.stringify(jsonObject.block_id)),
      BlockHeader.fromJSON(JSON.stringify(jsonObject.header))
    )
  }

  public readonly blockID: BlockID
  public readonly header: BlockHeader

  /**
   * BlockMeta.
   * @constructor
   * @param {BlockID} blockID - BlockMeta block_id.
   * @param {BlockHeader} header - Block header.
   */
  constructor(blockID: BlockID, header: BlockHeader) {
    this.blockID = blockID
    this.header = header

    if (!this.isValid()) {
      throw new TypeError("Invalid BlockMeta properties length.")
    }
  }
  /**
   *
   * Creates a JSON object with the BlockMeta properties
   * @returns {JSON} - JSON Object.
   * @memberof BlockMeta
   */
  public toJSON() {
    return {
      block_id: this.blockID.toJSON(),
      header: this.header.toJSON()
    }
  }
  /**
   *
   * Check if the BlockMeta object is valid
   * @returns {boolean} - True or false.
   * @memberof BlockMeta
   */
  public isValid(): boolean {
    return this.blockID.isValid() && this.header.isValid()
  }
}
