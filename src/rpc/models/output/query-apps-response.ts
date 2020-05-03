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
        return new QueryAppsResponse(apps as Application[])
      } else {
        const app = Application.fromJSON(JSON.stringify(jsonObject))
        return new QueryAppsResponse([app])
      }
    } catch (error) {
      throw error
    }
  }

  public readonly applications: Application[]

  /**
   * QueryAppsResponse.
   * @constructor
   * @param {Application[]} applications - Amount staked by the node.
   */
  constructor(applications: Application[]) {
    this.applications = applications
  }
  /**
   *
   * Creates a JSON object with the QueryAppsResponse properties
   * @returns {JSON} - JSON Object.
   * @memberof QueryAppsResponse
   */
  public toJSON() {
    const appListJSON: Application[] = []
    this.applications.forEach(app => {
      appListJSON.push(app)
    })
    return JSON.parse(JSON.stringify(appListJSON))
  }
}
