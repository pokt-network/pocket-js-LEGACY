/**
 *
 *
 * @class QueryHeightResponse
 */
export class QueryHeightResponse {
  /**
   *
   * Creates a QueryHeightResponse object using a JSON string
   * @param {String} json - JSON string.
   * @returns {QueryHeightResponse} - QueryHeightResponse object.
   * @memberof QueryHeightResponse
   */
  public static fromJSON(json: string): QueryHeightResponse {
    const jsonObject = JSON.parse(json)

    return new QueryHeightResponse(jsonObject.height)
  }

  public readonly height: BigInt

  /**
   * Query Height Response.
   * @constructor
   * @param {Bigint} height - Current network block height.
   */
  constructor(height: BigInt) {
    this.height = height

    if (!this.isValid()) {
      throw new TypeError("Invalid properties length.")
    }
  }
  /**
   *
   * Creates a JSON object with the QueryHeightResponse properties
   * @returns {JSON} - JSON Object.
   * @memberof QueryHeightResponse
   */
  public toJSON() {
    return { height: this.height }
  }
  /**
   *
   * Check if the QueryHeightResponse object is valid
   * @returns {boolean} - True or false.
   * @memberof QueryHeightResponse
   */
  public isValid(): boolean {
    return this.height !== undefined
  }
}
