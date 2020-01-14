/**
 *
 *
 * @class NodeParams
 */
export class NodeParams {
  /**
   *
   * Creates a NodeParams object using a JSON string
   * @param {String} json - JSON string.
   * @returns {NodeParams} - NodeParams object.
   * @memberof NodeParams
   */
  public static fromJSON(json: string): NodeParams {
    const jsonObject = JSON.parse(json)

    return new NodeParams(
      jsonObject.unstaking_time,
      jsonObject.max_validator,
      jsonObject.stake_denom,
      jsonObject.stake_minimum,
      jsonObject.proposer_reward_percentage,
      jsonObject.sessionBlock,
      jsonObject.relaysToTokens,
      jsonObject.maxEvidenceAge,
      jsonObject.signedBlocksWindow,
      jsonObject.minSignedPerWindow,
      jsonObject.downtimeJailDuration,
      jsonObject.slashFractionDoubleSign,
      jsonObject.slashFractionDowntime
    )
  }

  public readonly unstakingTime: BigInt
  public readonly maxValidator: BigInt
  public readonly stakeDenom: string
  public readonly stakeMinimum: BigInt
  public readonly proposerRewardPercentage: number
  public readonly sessionBlock: BigInt
  public readonly relaysToTokens: BigInt
  public readonly maxEvidenceAge: BigInt
  public readonly signedBlocksWindow: BigInt
  public readonly minSignedPerWindow: BigInt
  public readonly downtimeJailDuration: BigInt
  public readonly slashFractionDoubleSign: BigInt
  public readonly slashFractionDowntime: BigInt

  /**
   * NodeParams.
   * @constructor
   * @param {Hex} hash - NodeParams hash.
   * @param {PartSetHeader} parts - Session NodeParams Height.
   */
  constructor(
    unstakingTime: BigInt,
    maxValidator: BigInt,
    stakeDenom: string,
    stakeMinimum: BigInt,
    proposerRewardPercentage: number,
    sessionBlock: BigInt,
    relaysToTokens: BigInt,
    maxEvidenceAge: BigInt,
    signedBlocksWindow: BigInt,
    minSignedPerWindow: BigInt,
    downtimeJailDuration: BigInt,
    slashFractionDoubleSign: BigInt,
    slashFractionDowntime: BigInt
  ) {
    this.unstakingTime = unstakingTime
    this.maxValidator = maxValidator
    this.stakeDenom = stakeDenom
    this.stakeMinimum = stakeMinimum
    this.proposerRewardPercentage = proposerRewardPercentage
    this.sessionBlock = sessionBlock
    this.relaysToTokens = relaysToTokens
    this.maxEvidenceAge = maxEvidenceAge
    this.signedBlocksWindow = signedBlocksWindow
    this.minSignedPerWindow = minSignedPerWindow
    this.downtimeJailDuration = downtimeJailDuration
    this.slashFractionDoubleSign = slashFractionDoubleSign
    this.slashFractionDowntime = slashFractionDowntime

    if (!this.isValid()) {
      throw new TypeError("Invalid properties length.")
    }
  }
  /**
   *
   * Creates a JSON object with the NodeParams properties
   * @returns {JSON} - JSON Object.
   * @memberof NodeParams
   */
  public toJSON() {
    return {
      downtime_jail_duration: this.downtimeJailDuration,
      max_evidence_age: this.maxEvidenceAge,
      max_validator: this.maxValidator,
      min_signed_per_window: this.minSignedPerWindow,
      proposer_reward_percentage: this.proposerRewardPercentage,
      relays_to_tokens: this.relaysToTokens,
      session_block: this.sessionBlock,
      signed_blocks_window: this.signedBlocksWindow,
      slash_fraction_double_sign: this.slashFractionDoubleSign,
      slash_fraction_downtime: this.slashFractionDowntime,
      stake_denom: this.stakeDenom,
      stake_minimum: this.stakeMinimum,
      unstaking_time: this.unstakingTime
    }
  }
  /**
   *
   * Check if the NodeParams object is valid
   * @returns {boolean} - True or false.
   * @memberof NodeParams
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
