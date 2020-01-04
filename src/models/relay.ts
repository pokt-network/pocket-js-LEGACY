// Relay
import { Blockchain } from "./blockchain"
import { Configuration } from "../configuration/configuration"
/**
 *
 *
 * @class Relay
 */
export class Relay {
  public readonly blockchain: Blockchain
  public readonly data: string
  public readonly configuration: Configuration
  public readonly httpMethod: string
  public path: string
  public readonly queryParams: { [key: string]: any[] } = {}
  public readonly headers: { [key: string]: any[] } = {}
  /**
   * Creates an instance of Relay.
   * @param {Blockchain} blockchain - A blockchain object.
   * @param {string} data - Data string.
   * @param {Configuration} configuration - Configuration object.
   * @param {string} httpMethod - (Optional) HTTP Method.
   * @param {string} path - (Optional) API path.
   * @param {Object} queryParams - (Optional) An object holding the query params.
   * @param {Object} headers - (Optional) An object holding the HTTP Headers.
   * @memberof Relay
   */
  constructor(
    blockchain: Blockchain,
    data: string,
    configuration: Configuration,
    httpMethod: string,
    path: string,
    queryParams: {},
    headers: {}
  ) {
    this.blockchain = blockchain
    this.data = data
    this.configuration = configuration
    this.httpMethod = httpMethod
    this.path = path
    this.appendQueryParams(queryParams)
    this.headers = headers
  }

  /**
   *
   * Parse properties to a JSON Object.
   * @returns {JSON} - A JSON Object.
   * @memberof Relay
   */
  public toJSON() {
    return {
      Blockchain: this.blockchain.name,
      Data: this.data,
      DevID: this.configuration.devID,
      HEADERS: this.headers,
      METHOD: this.httpMethod,
      NetID: this.blockchain.netID,
      PATH: this.path
    }
  }

  /**
   *
   * Verifies if the Relay is valid
   * @returns {boolean} - True or false
   * @memberof Relay
   */
  public isValid() {
    if (
      this.blockchain != null &&
      this.blockchain.isValid() &&
      this.configuration != null
    ) {
      return true
    }
    return false
  }

  /**
   *
   * Appends the Query parameters to the "path" property string.
   * @param {Object} queryParams - Object containing one or multiple query parameters.
   * @memberof Relay
   */
  private appendQueryParams(queryParams: { [key: string]: any[] }) {
    let paramsStr = ""
    if (typeof queryParams === "object") {
      for (const k in queryParams) {
        if (queryParams.hasOwnProperty(k)) {
          paramsStr += k + "=" + queryParams[k] + "&"
        }
      }
      // Append the query params to the path
      this.path += "?" + paramsStr
    }
  }
}
