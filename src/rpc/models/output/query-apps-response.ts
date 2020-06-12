import { Application } from "../application"
/**
 *
 *
 * @class QueryAppsResponse
 */
export class QueryAppsResponse {
  /**
   *
   * Creates a QueryAppsResponse object using a JSON string
   * @param {string} json - JSON string.
   * @returns {QueryAppsResponse} - QueryAppsResponse object.
   * @memberof QueryAppsResponse
   */
  public static fromJSON(json: string): QueryAppsResponse {
    try {
      const jsonObject = JSON.parse(json)
      const apps: Application[] = []
      
      if (Array.isArray(jsonObject.result)) {
        jsonObject.result.forEach(function (appJSON: {}) {
          const app = Application.fromJSON(JSON.stringify(appJSON))
          apps.push(app)
        })
      }
      return new QueryAppsResponse(apps, jsonObject.page, jsonObject.total_pages)
    } catch (error) {
      throw error
    }
  }

  public readonly applications: Application[]
  public readonly page: number
  public readonly totalPages: number

  /**
   * QueryAppsResponse.
   * @constructor
   * @param {Application[]} applications - Amount staked by the node.
   * @param {number} page - Current page.
   * @param {number} totalPages - Total amount of pages.
   */
  constructor(applications: Application[], page: number, totalPages: number) {
    this.applications = applications
    this.page = page
    this.totalPages = totalPages
  }
  /**
   *
   * Creates a JSON object with the QueryAppsResponse properties
   * @returns {JSON} - JSON Object.
   * @memberof QueryAppsResponse
   */
  public toJSON() {
    const appListJSON: object[] = []
    this.applications.forEach(app => {
      appListJSON.push(app.toJSON())
    })

    return {
      result: appListJSON,
      page: this.page,
      total_pages: this.totalPages
    }
  }
  /**
   *
   * Check if the QueryAppsResponse object is valid
   * @returns {boolean} - True or false.
   * @memberof QueryAppsResponse
   */
  public isValid(): boolean {
    return this.applications !== undefined &&
    this.page >= 0 &&
    this.totalPages >= 0
  }
}
