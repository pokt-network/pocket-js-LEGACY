import { RpcError } from "./rpc-error"

/**
 * @class RelayError
 */
export class RelayError extends Error {

  /**
   * Creates a RelayError from an Error object
   * @param {Error} error - Error object.
   * @returns {RelayError} - RelayError object.
   * @memberof RelayError
   */
  public static fromError(error: Error): RelayError {
    return new RelayError("NA", error.message)
  }

  /**
   * Creates a RelayError from an Rpc Error object
   * @param {RpcError} rpcError - RPC error.
   * @returns {RelayError} - RelayError object.
   * @memberof RelayError
   */
     public static fromRpcError(rpcError: RpcError): RelayError {
      return new RelayError(rpcError.code, rpcError.message)
    }

  /**
   *
   * Creates a RelayError object using a JSON string
   * @param {string} json - JSON string.
   * @returns {RelayError} - RelayError object.
   * @memberof RelayError
   */
  public static fromJSON(json: string): RelayError {
    const jsonObject = JSON.parse(json)
    return new RelayError(jsonObject.code, jsonObject.message, jsonObject.node_public_key)
  }

  public readonly code: string
  public readonly message: string
  public readonly nodePubKey: string

  /**
   * Relay Error.
   * @constructor
   * @param {string} code - Error code.
   * @param {string} message - Error message.
   * @param {string} nodePubKey - Servicer Node Public Key.
   * @memberof RelayError
   */
  constructor(code: string, message: string, nodePubKey: string = "") {
    super(...arguments)
    this.code = code
    this.message = message
    this.nodePubKey = nodePubKey
    Object.setPrototypeOf(this, RelayError.prototype)
  }

  /**
   *
   * Creates a JSON object with the RelayError properties
   * @returns {JSON} - JSON Object.
   * @memberof RelayError
   */
  public toJSON() {
    return {
      code: this.code,
      message: this.message,
      node_public_key: this.nodePubKey
    }
  }
}
