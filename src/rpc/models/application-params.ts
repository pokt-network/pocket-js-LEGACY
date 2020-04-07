/**
 *
 *
 * @class ApplicationParams
 */
export class ApplicationParams {
  /**
   *
   * Creates a ApplicationParams object using a JSON string
   * @param {String} json - JSON string.
   * @returns {ApplicationParams} - ApplicationParams object.
   * @memberof ApplicationParams
   */
  public static fromJSON(json: string): ApplicationParams {
    try {
      const jsonObject = JSON.parse(json)

      return new ApplicationParams(
        jsonObject.unstaking_time,
        BigInt(jsonObject.max_applications),
        BigInt(jsonObject.app_stake_minimum),
        BigInt(jsonObject.base_relays_per_pokt),
        BigInt(jsonObject.stability_adjustment),
        jsonObject.participation_rate_on
      )
    } catch (error) {
      throw error
    }
  }
  
  public readonly unstakingTime: string
  public readonly maxApplications: BigInt
  public readonly appStakeMin: BigInt
  public readonly baseRelaysPerPokt: BigInt
  public readonly stabilityAdjustment: BigInt
  public readonly participationRateOn: boolean

  /**
   * Application Params.
   * @constructor
   * @param {string} unstakingTime - Unstaking timestamp.
   * @param {BigInt} maxApplications - Max applications count.
   * @param {BigInt} appStakeMin - Minimum amount an app can stake.
   * @param {BigInt} baseRelaysPerPokt - Amount of relays per Pocket tokens.
   * @param {BigInt} stabilityAdjustment - Stability adjustment variable.
   * @param {boolean} participationRateOn - True or false if participation rate is on.
   */
  constructor(
    unstakingTime: string,
    maxApplications: BigInt,
    appStakeMin: BigInt,
    baseRelaysPerPokt: BigInt,
    stabilityAdjustment: BigInt,
    participationRateOn: boolean
  ) {
    this.unstakingTime = unstakingTime
    this.maxApplications = maxApplications
    this.appStakeMin = appStakeMin
    this.baseRelaysPerPokt = baseRelaysPerPokt
    this.stabilityAdjustment = stabilityAdjustment
    this.participationRateOn = participationRateOn

    if (!this.isValid()) {
      throw new TypeError("Invalid ApplicationParams properties.")
    }
  }
  /**
   *
   * Creates a JSON object with the ApplicationParams properties
   * @returns {JSON} - JSON Object.
   * @memberof ApplicationParams
   */
  public toJSON() {
    return {
      app_stake_minimum: Number(this.appStakeMin.toString()),
      base_relays_per_pokt: Number(this.baseRelaysPerPokt.toString()),
      max_applications: Number(this.maxApplications.toString()),
      participation_rate_on: this.participationRateOn,
      stability_adjustment: Number(this.stabilityAdjustment.toString()),
      unstaking_time: this.unstakingTime
    }
  }
  /**
   *
   * Check if the ApplicationParams object is valid
   * @returns {boolean} - True or false.
   * @memberof ApplicationParams
   */
  public isValid(): boolean {
    return Number(this.appStakeMin.toString()) >= 0 &&
    Number(this.baseRelaysPerPokt.toString()) >= 0 &&
    Number(this.maxApplications.toString()) >= 0 &&
    Number(this.stabilityAdjustment.toString()) >= 0 &&
    this.unstakingTime.length >= 0 &&
    this.participationRateOn !== undefined
  }
}
