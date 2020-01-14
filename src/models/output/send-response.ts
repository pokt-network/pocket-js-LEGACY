/**
 *
 *
 * @class SendResponse
 */
export class SendResponse {
  /**
   *
   * Creates a SendResponse object using a JSON string
   * @param {string} json - JSON string.
   * @returns {SendResponse} - SendResponse object.
   * @memberof SendResponse
   */
  public static fromJSON(json: string): SendResponse {
    const jsonObject = JSON.parse(json)

    return new SendResponse(
      jsonObject.data,
      jsonObject.status,
      jsonObject.statusText,
      jsonObject.headers,
      jsonObject.config
    )
  }

  public readonly data: {}
  public readonly status: number
  public readonly statusText: string
  public readonly headers: {}
  public readonly config: {}

  /**
   * Send Response.
   * @constructor
   * @param {Object} data - Reponse body.
   * @param {number} status - Response status number.
   * @param {string} statusText - Response status text.
   * @param {Object} headers - Response headers.
   * @param {Object} config - Axios configuration used for the request.
   */
  constructor(
    data: {},
    status: number,
    statusText: string,
    headers: {},
    config: {}
  ) {
    this.data = data
    this.status = status
    this.statusText = statusText
    this.headers = headers
    this.config = config

    if (!this.isValid()) {
      throw new TypeError("Invalid properties length.")
    }
  }
  /**
   *
   * Creates a JSON object with the SendResponse properties
   * @returns {JSON} - JSON Object.
   * @memberof SendResponse
   */
  public toJSON() {
    return {
      config: "config",
      data: "data",
      headers: "headers",
      status: "status",
      statusText: "statusText"
    }
  }
  /**
   *
   * Check if the SendResponse object is valid
   * @returns {boolean} - True or false.
   * @memberof SendResponse
   */
  public isValid(): boolean {
    return (
      this.data !== undefined &&
      this.status !== undefined &&
      this.statusText.length !== 0 &&
      this.headers !== undefined &&
      this.config !== undefined
    )
  }
}
