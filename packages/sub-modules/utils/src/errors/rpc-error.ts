/**
 * @class RpcError
 */
 export class RpcError extends Error {

  /**
   * Creates a RpcError from an Error object
   *
   * @param {Error} error - Error object.
   * @returns {RpcError} - RpcError object.
   * @memberof RpcError
   */
  public static fromError(error: Error): RpcError {
    return new RpcError("0", error.message)
  }

  /**
   * Creates a RpcError from an Error object
   *
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
   *
   * @param {string} json - JSON string.
   * @returns {RpcError} - RpcError object.
   * @memberof RpcError
   */
  public static fromJSON(json: string): RpcError {
    const jsonObject = JSON.parse(json)

    return new RpcError(
      jsonObject.code, 
      jsonObject.message,
      undefined,
      undefined
    )
  }

  public readonly code: string
  public readonly message: string
  public readonly session?: any
  public readonly nodePubKey?: string

  /**
   * RPC Error.
   *
   * @constructor
   * @param {string} code - Error code.
   * @param {string} message - Error message.
   * @param {any} session - Session json object.
   * @param {string} nodePubKey - Error message.
   * @memberof RpcError
   */
  constructor(code: string, message: string, session?: any, nodePubKey?: string) {
    super()
    this.code = code
    this.message = message
    this.session = session
    this.nodePubKey = nodePubKey
    Object.setPrototypeOf(this, RpcError.prototype)
  }

  /**
   *
   * Creates a JSON object with the RpcError properties
   *
   * @returns {JSON} - JSON Object.
   * @memberof RpcError
   */
  public toJSON(): any {
    return {
      code: this.code,
      message: this.message,
      session: this.session !== undefined ? this.session : {},
      node_public_key: this.nodePubKey !== undefined ? this.nodePubKey : ""
    }
  }
}
