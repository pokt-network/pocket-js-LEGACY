/* eslint-disable @typescript-eslint/naming-convention */
import { BlockMeta } from "../block-meta"
import { Block } from "../block"

/**
 *
 *
 * @class QueryBlockResponse
 */
export class QueryBlockResponse {
  /**
   *
   * Creates a QueryBlockResponse object using a JSON string
   *
   * @param {String} json - JSON string.
   * @returns {QueryBlockResponse} - QueryBlockResponse object.
   * @memberof QueryBlockResponse
   */
  public static fromJSON(json: string): QueryBlockResponse {
    try {
      const jsonObject = JSON.parse(json)
      
      const blockMeta = jsonObject.block_meta !== undefined ? jsonObject.block_meta : {
        block_id: jsonObject.block_id,
        header: jsonObject.block.header
      }

      return new QueryBlockResponse(
        BlockMeta.fromJSON(JSON.stringify(blockMeta)),
        Block.fromJSON(JSON.stringify(jsonObject.block))
      )
    } catch (error) {
      throw error
    }
  }

  public readonly blockMeta: BlockMeta
  public readonly block: Block

  /**
   * Query Block Response.
   *
   * @constructor
   * @param {Block} block - Block object.
   */
  constructor(blockMeta: BlockMeta, block: Block) {
    this.blockMeta = blockMeta
    this.block = block

    if (!this.isValid()) {
      throw new TypeError("Invalid QueryBlockResponse properties.")
    }
  }
  /**
   *
   * Creates a JSON object with the QueryBlockResponse properties
   *
   * @returns {JSON} - JSON Object.
   * @memberof QueryBlockResponse
   */
  public toJSON(): any {
    return {
      "block": this.block.toJSON(),
      "block_meta": this.blockMeta.toJSON()
    }
  }
  /**
   *
   * Check if the QueryBlockResponse object is valid
   *
   * @returns {boolean} - True or false.
   * @memberof QueryBlockResponse
   */
  public isValid(): boolean {
    return this.block.isValid() && this.blockMeta.isValid()
  }
}
