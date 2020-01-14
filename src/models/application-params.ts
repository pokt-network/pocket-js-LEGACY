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
    const jsonObject = JSON.parse(json)

    return new ApplicationParams(
      jsonObject.unstaking_time,
      jsonObject.max_applications,
      jsonObject.app_stake_minimum,
      jsonObject.baseline_throughput_stake_rate,
      jsonObject.staking_adjustment,
      jsonObject.participation_rate_on
    )
  }

  public readonly unstakingTime: string
  public readonly maxApplications: BigInt
  public readonly appStakeMin: BigInt
  public readonly baselineThroughputStakeRate: BigInt
  public readonly stakingAdjustment: BigInt
  public readonly participationRateOn: boolean

  /**
   * ApplicationParams.
   * @constructor
   * @param {Hex} hash - ApplicationParams hash.
   * @param {PartSetHeader} parts - Session ApplicationParams Height.
   */
  constructor(
    unstakingTime: string,
    maxApplications: BigInt,
    appStakeMin: BigInt,
    baselineThroughputStakeRate: BigInt,
    stakingAdjustment: BigInt,
    participationRateOn: boolean
  ) {
    this.unstakingTime = unstakingTime
    this.maxApplications = maxApplications
    this.appStakeMin = appStakeMin
    this.baselineThroughputStakeRate = baselineThroughputStakeRate
    this.stakingAdjustment = stakingAdjustment
    this.participationRateOn = participationRateOn

    if (!this.isValid()) {
      throw new TypeError("Invalid properties length.")
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
      app_stake_min: this.appStakeMin,
      baseline_throughput_stake_rate: this.baselineThroughputStakeRate,
      max_applications: this.maxApplications,
      participation_rate_on: this.participationRateOn,
      staking_adjustment: this.stakingAdjustment,
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
    for (const key in this) {
      if (!this.hasOwnProperty(key)) {
        return false
      }
    }
    return true
  }
}
