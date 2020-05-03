// Http headers map type
export type RelayHeaders = Record<string, string>

/**
 *
 *
 * @class RelayPayload
 */
export class RelayPayload {
  /**
   *
   * Creates a RelayPayload object using a JSON string
   * @param {string} json - JSON string.
   * @returns {RelayPayload} - RelayPayload object.
   * @memberof RelayPayload
   */
  public static fromJSON(json: string): RelayPayload {
    try {
      const jsonObject = JSON.parse(json)

      return new RelayPayload(
        jsonObject.data,
        jsonObject.method,
        jsonObject.path,
        jsonObject.headers
      )
    } catch (error) {
      throw error
    }
  }

  public readonly data: string
  public readonly method: string
  public readonly path: string
  public readonly headers?: RelayHeaders | null

  /**
   * Relay Payload.
   * @constructor
   * @param {string} data - The actual data string for the external chain.
   * @param {string} method - The http CRUD method.
   * @param {string} path - The REST pathx.
   * @param {RelayHeaders} headers - Http headers.
   */
  constructor(
    data: string,
    method: string,
    path: string,
    headers: RelayHeaders | null
  ) {
    this.data = data
    this.method = method
    this.path = path
    this.headers = headers
  }
  /**
   *
   * Creates a JSON object with the RelayPayload properties
   * @returns {JSON} - JSON Object.
   * @memberof RelayPayload
   */
  public toJSON() {
    return {
      data: this.data,
      method: this.method,
      path: this.path,
      headers: this.headers
    }
  }
  /**
   *
   * Check if the RelayPayload object is valid
   * @returns {boolean} - True or false.
   * @memberof RelayPayload
   */
  public isValid(): boolean {
    return (
      this.data.length !== undefined &&
      this.method.length !== undefined &&
      this.path.length !== undefined
    )
  }
}
