/**
 * @class RpcErrorResponse
 */
export class RpcError extends Error {

  /**
   * Creates a RpcErrorResponse from an Error object
   * @param error 
   */
  public static fromError(error: Error): RpcError {
    return new RpcError("0", error.message)
  }

  /**
   *
   * Creates a RpcErrorResponse object using a JSON string
   * @param {string} json - JSON string.
   * @returns {RpcError} - RpcErrorResponse object.
   * @memberof RpcErrorResponse
   */
  public static fromJSON(json: string): RpcError {
    const jsonObject = JSON.parse(json)
    return new RpcError(jsonObject.code, jsonObject.message)
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
    super(...arguments)
    this.code = code
    this.message = message
    Object.setPrototypeOf(this, RpcError.prototype)
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
}
