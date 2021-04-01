import { SessionHeader } from "./session-header"

/**
 *
 *
 * @class DispatchRequest
 */
export class DispatchRequest {
  /**
   *
   * Creates a DispatchRequest object using a JSON string
   * @param {String} json - JSON string.
   * @returns {DispatchRequest} - DispatchRequest object.
   * @memberof DispatchRequest
   */
  public static fromJSON(json: string): DispatchRequest {
    const jsonObj = JSON.parse(json)
    return new DispatchRequest(SessionHeader.fromJSON(JSON.stringify(jsonObj.session_header)))
  }

  public readonly sessionHeader: SessionHeader

  /**
   * Dispatch Request.
   * @constructor
   * @param {SessionHeader} sessionHeader - Session header object.
   */
  constructor(sessionHeader: SessionHeader) {
    this.sessionHeader = sessionHeader

    if (!this.isValid()) {
      throw new TypeError("Invalid properties length.")
    }
  }
  /**
   *
   * Creates a JSON object with the DispatchRequest properties
   * @returns {JSON} - JSON Object.
   * @memberof DispatchRequest
   */
  public toJSON() {
    return this.sessionHeader.toJSON()
  }
  /**
   *
   * Check if the DispatchRequest object is valid
   * @returns {boolean} - True or false.
   * @memberof DispatchRequest
   */
  public isValid(): boolean {
    return this.sessionHeader.isValid()
  }
}
