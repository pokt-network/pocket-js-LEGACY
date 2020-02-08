/**
 *
 *
 * @class QueryAccountResponse
 */
export class QueryAccountResponse {
  /**
   *
   * Creates a QueryAccountResponse object using a JSON string
   * @param {String} json - JSON string.
   * @returns {QueryAccountResponse} - QueryAccountResponse object.
   * @memberof QueryAccountResponse
   */
  public static fromJSON(json: any): QueryAccountResponse {
    try {    
      return new QueryAccountResponse(json.value)
    } catch (error) {
      throw error
    }
  }

  public readonly account: object

  /**
   * Query Account Response.
   * @constructor
   * @param {object} account - Current account object.
   */
  constructor(
    account: object
    ) {
      this.account = account

    if (!this.isValid()) {
      throw new TypeError("Invalid QueryAccountResponse properties.")
    }
  }
  /**
   *
   * Creates a JSON object with the QueryAccountResponse properties
   * @returns {JSON} - JSON Object.
   * @memberof QueryAccountResponse
   */
  public toJSON() {
    return this.account
  }
  /**
   *
   * Check if the QueryAccountResponse object is valid
   * @returns {boolean} - True or false.
   * @memberof QueryAccountResponse
   */
  public isValid(): boolean {
    return this.account !== undefined
  }
}
