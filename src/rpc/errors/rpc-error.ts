/**
 * @class RpcError
 */
 export class RpcError extends Error {

  /**
   * Creates a RpcError from an Error object
   * @param {Error} error - Error object.
   * @returns {RpcError} - RpcError object.
   * @memberof RpcError
   */
  public static fromError(error: Error): RpcError {
    return new RpcError("0", error.message)
  }

  /**
   * Creates a RpcError from an Error object
   * @param {string} code - Error code
   * @param {string} data - Relay error data.
   * @returns {RpcError} - RpcError object.
   * @memberof RpcError
   */
  public static fromRelayError(code: string, data: string): RpcError {
    return new RpcError(code, data)
  }

  /**
   *
   * Creates a RpcError object using a JSON string
   * @param {string} json - JSON string.
   * @returns {RpcError} - RpcError object.
   * @memberof RpcError
   */
  public static fromJSON(json: string): RpcError {
    const jsonObject = JSON.parse(json)
    return new RpcError(jsonObject.code, jsonObject.message)
  }

  public readonly code: string
  public readonly message: string
  public readonly data: object = {}

  /**
   * RPC Error.
   * @constructor
   * @param {string} code - Error code.
   * @param {string} message - Error message.
   * @memberof RpcError
   */
  constructor(code: string, message: string, data: object = {}) {
    super(...arguments)
    this.code = code
    this.message = message
    this.data = data
    Object.setPrototypeOf(this, RpcError.prototype)
  }

  /**
   *
   * Creates a JSON object with the RpcError properties
   * @returns {JSON} - JSON Object.
   * @memberof RpcError
   */
  public toJSON() {
    return {
      code: this.code,
      message: this.message,
      data: this.data
    }
  }
}
