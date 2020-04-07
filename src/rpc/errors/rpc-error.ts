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
   * @param {Error} error - Error object.
   * @param {string} data - Relay error payload.
   * @returns {RpcError} - RpcError object.
   * @memberof RpcError
   */
  public static fromRelayError(error: Error, data: string): RpcError {
    return new RpcError("0", error.message+": "+data)
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

  /**
   * RPC Error.
   * @constructor
   * @param {string} code - Error code.
   * @param {string} message - Error message.
   * @memberof RpcError
   */
  constructor(code: string, message: string) {
    super(...arguments)
    this.code = code
    this.message = message
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
      message: this.message
    }
  }
}
