import { Block } from "../block"
import { BlockMeta } from "../block-meta"

/**
 *
 *
 * @class QQueryBlockTxsResponse
 */
export class QueryBlockTxsResponse {
  /**
   *
   * Creates a QueryBlockTxsResponse object using a JSON string
   * @param {String} json - JSON string.
   * @returns {QueryBlockTxsResponse} - QueryBlockTxsResponse object.
   * @memberof QueryBlockTxsResponse
   */
  public static fromJSON(json: string): QueryBlockTxsResponse {
    try {
      const rawObjValue = JSON.parse(json)
      const block = Block.fromJSON(JSON.stringify(rawObjValue.block))
      const blockHeader = BlockMeta.fromJSON(JSON.stringify(rawObjValue.block_meta))

      return new QueryBlockTxsResponse(
        block,
        blockHeader
      )
    } catch (error) {
      throw error
    }
  }

  public readonly block: Block
  public readonly blockMeta: BlockMeta

  /**
   * Query Block transaction Response.
   * @constructor
   * @param {Block} block - 
   * @param {BlockMeta} blockMeta - 
   */
  constructor(
    block: Block,
    blockMeta: BlockMeta
  ) {
    this.block = block
    this.blockMeta = blockMeta

    if (!this.isValid()) {
      throw new TypeError("Invalid QueryBlockTxsResponse properties.")
    }
  }
  /**
   *
   * Creates a JSON object with the QueryBlockTxsResponse properties
   * @returns {JSON} - JSON Object.
   * @memberof QueryBlockTxsResponse
   */
  public toJSON() {
    return {
      block: this.block.toJSON(),
      block_meta: this.blockMeta.toJSON()
    }
  }
  /**
   *
   * Check if the QueryBlockTxsResponse object is valid
   * @returns {boolean} - True or false.
   * @memberof QueryBlockTxsResponse
   */
  public isValid(): boolean {
    return this.block.isValid() &&
      this.blockMeta.isValid()
  }
}
