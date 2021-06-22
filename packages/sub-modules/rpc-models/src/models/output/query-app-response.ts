import { Application } from "../application"

/**
 *
 *
 * @class QueryAppResponse
 */
export class QueryAppResponse {
  /**
   *
   * Creates a QueryAppResponse object using a JSON string
   *
   * @param {String} json - JSON string.
   * @returns {QueryAppResponse} - QueryAppResponse object.
   * @memberof QueryAppResponse
   */
  public static fromJSON(json: string): QueryAppResponse {
    try {
      return new QueryAppResponse(Application.fromJSON(json))
    } catch (error) {
      throw error
    }
  }

  public readonly application: Application

  /**
   * Query app Response.
   *
   * @constructor
   * @param {Application} application - Application object.
   */
  constructor(application: Application) {
    this.application = application

    if (!this.isValid()) {
      throw new TypeError("Invalid Query app properties length.")
    }
  }
  /**
   *
   * Creates a JSON object with the QueryAppResponse properties
   *
   * @returns {JSON} - JSON Object.
   * @memberof QueryAppResponse
   */
  public toJSON(): any {
    return this.application.toJSON()
  }
  /**
   *
   * Check if the QueryAppResponse object is valid
   *
   * @returns {boolean} - True or false.
   * @memberof QueryAppResponse
   */
  public isValid(): boolean {
    return this.application.isValid()
  }
}
