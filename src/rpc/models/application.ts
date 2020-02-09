import { BondStatus, BondStatusUtil } from "./bond-status"
import { Hex } from "../utils/hex"
/**
 *
 *
 * @class Application
 */
export class Application {
  public static fromJSON(json: string): Application {
    try {
      const jsonObject = JSON.parse(json)
      const status: BondStatus = BondStatusUtil.getStatus(jsonObject.status)
  
      return new Application(
        jsonObject.address,
        jsonObject.public_key,
        jsonObject.jailed,
        status,
        jsonObject.chains,
        BigInt(jsonObject.staked_tokens),
        BigInt(jsonObject.max_relays),
        jsonObject.unstaking_time
      )
    } catch (error) {
      throw error
    }
  }

  public readonly address: string
  public readonly publicKey: string
  public readonly jailed: boolean
  public readonly status: BondStatus
  public readonly chains: string[]
  public readonly stakedTokens: BigInt
  public readonly maxRelays: BigInt
  public readonly unstakingCompletionTime: string | undefined

  /**
   * Creates a Application.
   * @constructor
   * @param {string} address - the hex address of the validator
   * @param {string} publicKey - the hex consensus public key of the validator.
   * @param {boolean} jailed - has the validator been jailed from staked status?
   * @param {BondStatus} status - validator status
   * @param {string[]} chains - chains
   * @param {BigInt} stakedTokens - how many staked tokens
   * @param {string} maxRelays - Service Application url
   * @param {string} unstakingCompletionTime - if unstaking, min time for the validator to complete unstaking
   */
  constructor(
    address: string,
    publicKey: string,
    jailed: boolean,
    status: BondStatus,
    chains: string[] = [],
    stakedTokens: BigInt,
    maxRelays: BigInt,
    unstakingCompletionTime: string = ""
  ) {
    this.address = address
    this.publicKey = publicKey
    this.jailed = jailed
    this.status = status
    this.chains = chains
    this.stakedTokens = stakedTokens
    this.maxRelays = maxRelays
    this.unstakingCompletionTime = unstakingCompletionTime

    if (!this.isValid()) {
      throw new TypeError("Invalid Application properties.")
    }
  }
  /**
   *
   * Creates a JSON object with the Application properties
   * @returns {JSON} - JSON Object.
   * @memberof Application
   */
  public toJSON() {
    return {
      address: this.address,
      chains: this.chains,
      public_key: this.publicKey,
      jailed: this.jailed,
      max_relays: Number(this.maxRelays.toString()),
      status: this.status,
      staked_tokens: Number(this.stakedTokens.toString()),
      unstaking_time: this.unstakingCompletionTime
    }
  }
  /**
   *
   * Verify if all properties are valid
   * @returns {boolean} - True or false.
   * @memberof Application
   */
  public isValid() {
    return Hex.isHex(this.address) &&
    Hex.byteLength(this.address) === 20 &&
    this.chains.length > 0 &&
    Hex.isHex(this.publicKey) &&
    Hex.byteLength(this.publicKey) === 32 &&
    this.jailed !== undefined &&
    Number(this.maxRelays.toString()) >= 0 &&
    this.status !== undefined &&
    Number(this.stakedTokens.toString()) >= 0
  }
}
