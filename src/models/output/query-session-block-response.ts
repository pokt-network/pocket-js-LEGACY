/**
 *
 *
 * @class QuerySessionBlockResponse
 */
export class QuerySessionBlockResponse {
  /**
   *
   * Creates a QuerySessionBlockResponse object using a JSON string
   * @param {String} json - JSON string.
   * @returns {QuerySessionBlockResponse} - QuerySessionBlockResponse object.
   * @memberof QuerySessionBlockResponse
   */
  public static fromJSON(json: string): QuerySessionBlockResponse {
    const jsonObject = JSON.parse(json)

    return new QuerySessionBlockResponse(jsonObject.session_block)
  }

  public readonly sessionBlock: BigInt

  /**
   * QuerySessionBlockResponse.
   * @constructor
   * @param {Bigint} sessionBlock - Session block height.
   */
  constructor(sessionBlock: BigInt) {
    this.sessionBlock = sessionBlock

    if (!this.isValid()) {
      throw new TypeError("Invalid QuerySessionBlockResponse properties.")
    }
  }
  /**
   *
   * Creates a JSON object with the QuerySessionBlockResponse properties
   * @returns {JSON} - JSON Object.
   * @memberof QuerySessionBlockResponse
   */
  public toJSON() {
    return { session_block: this.sessionBlock.toString(16) }
  }
  /**
   *
   * Check if the QuerySessionBlockResponse object is valid
   * @returns {boolean} - True or false.
   * @memberof QuerySessionBlockResponse
   */
  public isValid(): boolean {
    return this.sessionBlock !== undefined
  }
}
