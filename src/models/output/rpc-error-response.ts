/**
 *
 *
 * @class RpcErrorResponse
 */
export class RpcErrorResponse {
  /**
   *
   * Creates a RpcErrorResponse object using a JSON string
   * @param {string} json - JSON string.
   * @returns {RpcErrorResponse} - RpcErrorResponse object.
   * @memberof RpcErrorResponse
   */
  public static fromJSON(json: string): RpcErrorResponse {
    const jsonObject = JSON.parse(json)

    return new RpcErrorResponse(jsonObject.code, jsonObject.message)
  }

  public readonly code: string
  public readonly message: string

  /**
   * Relay Response.
   * @constructor
   * @param {string} code - Error code.
   * @param {string} message - Error message.
   */
  constructor(code: string, message: string) {
    this.code = code
    this.message = message

    if (!this.isValid()) {
      throw new TypeError("Invalid properties length.")
    }
  }
  /**
   *
   * Creates a JSON object with the RpcErrorResponse properties
   * @returns {JSON} - JSON Object.
   * @memberof RpcErrorResponse
   */
  public toJSON() {
    return {
      code: this.code,
      message: this.message
    }
  }
  /**
   *
   * Check if the RpcErrorResponse object is valid
   * @returns {boolean} - True or false.
   * @memberof RpcErrorResponse
   */
  public isValid(): boolean {
    return (
      this.code.length !== 0 &&
      this.code !== "" &&
      this.message !== "" &&
      this.message.length !== 0
    )
  }
}
