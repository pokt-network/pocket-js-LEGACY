// Interface
export interface IAllParams { 
  paramKey: string, 
  paramValue: string 
}
/**
 *
 *
 * @class QueryAllParamsResponse
 */
export class QueryAllParamsResponse {
  /**
   *
   * Creates a QueryAllParamsResponse object using a JSON string
   * @param {String} json - JSON string.
   * @returns {QueryAllParamsResponse} - QueryAllParamsResponse object.
   * @memberof QueryAllParamsResponse
   */
  public static fromJSON(json: string): QueryAllParamsResponse {
    try {
      const rawObjValue = JSON.parse(json)

      const appParams: IAllParams[] = []
      const authParams: IAllParams[] = []
      const govParams: IAllParams[] = []
      const nodeParams: IAllParams[] = []
      const pocketParams: IAllParams[] = []

      rawObjValue.app_params.forEach((obj: any) => {
        const param = {paramKey: obj.param_key, paramValue: obj.param_value}
        appParams.push(param)
      })

      rawObjValue.auth_params.forEach((obj: any) => {
        const param = {paramKey: obj.param_key, paramValue: obj.param_value}
        authParams.push(param)
      })

      rawObjValue.gov_params.forEach((obj: any) => {
        const param = {paramKey: obj.param_key, paramValue: obj.param_value}
        govParams.push(param)
      })

      rawObjValue.node_params.forEach((obj: any) => {
        const param = {paramKey: obj.param_key, paramValue: obj.param_value}
        nodeParams.push(param)
      })

      rawObjValue.pocket_params.forEach((obj: any) => {
        const param = {paramKey: obj.param_key, paramValue: obj.param_value}
        pocketParams.push(param)
      })

      return new QueryAllParamsResponse(
        appParams,
        authParams,
        govParams,
        nodeParams,
        pocketParams
      )
    } catch (error) {
      throw error
    }
  }

  public readonly appParams: IAllParams[]
  public readonly authParams: IAllParams[]
  public readonly govParams: IAllParams[]
  public readonly nodeParams: IAllParams[]
  public readonly pocketParams: IAllParams[]

  /**
   * Query all parameters Response.
   * @constructor
   * @param {IAllParams[]} appParams - Application parameter list.
   * @param {IAllParams[]} authParams - Auth parameter list.
   * @param {IAllParams[]} govParams - Gov parameter list.
   * @param {IAllParams[]} nodeParams - Node parameter list.
   * @param {IAllParams[]} pocketParams - Pocket parameter list.
   */
  constructor(
    appParams: IAllParams[],
    authParams: IAllParams[],
    govParams: IAllParams[],
    nodeParams: IAllParams[],
    pocketParams: IAllParams[],
  ) {
    this.appParams = appParams
    this.authParams = authParams
    this.govParams = govParams
    this.nodeParams = nodeParams
    this.pocketParams = pocketParams

    if (!this.isValid()) {
      throw new TypeError("Invalid QueryAllParamsResponse properties.")
    }
  }
  /**
   *
   * Creates a JSON object with the QueryAllParamsResponse properties
   * @returns {JSON} - JSON Object.
   * @memberof QueryAllParamsResponse
   */
  public toJSON() {
    return {
      app_params: this.appParams,
      auth_params: this.authParams,
      gov_params: this.govParams,
      node_params: this.nodeParams,
      pocket_params: this.pocketParams
    }
  }
  /**
   *
   * Check if the QueryAllParamsResponse object is valid
   * @returns {boolean} - True or false.
   * @memberof QueryAllParamsResponse
   */
  public isValid(): boolean {
    return this.appParams !== undefined &&
    this.authParams !== undefined &&
    this.govParams !== undefined &&
    this.nodeParams !== undefined &&
    this.pocketParams !== undefined
  }
}
