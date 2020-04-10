import { Hex } from "../.."
import { StakingStatus } from "./staking-status"
/**
 *
 *
 * @class Application
 */
export class Application {
  /**
   *
   * Creates a Application object using a JSON string
   * @param {String} json - JSON string.
   * @returns {Application} - Application object.
   * @memberof Application
   */
  public static fromJSON(json: string): Application {
    try {
      const jsonObject = JSON.parse(json)
      const status = StakingStatus.getStatus(jsonObject.status)
  
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
  public readonly status: StakingStatus
  public readonly chains: string[]
  public readonly stakedTokens: BigInt
  public readonly maxRelays: BigInt
  public readonly unstakingCompletionTime: string | undefined

  /**
   * Creates a Application.
   * @constructor
   * @param {string} address - The hex address of the application
   * @param {string} publicKey - The hex consensus public key of the application.
   * @param {boolean} jailed - Has the application been jailed from staked status?
   * @param {StakingStatus} status - Application staking status
   * @param {string[]} chains - An array of blockchains
   * @param {BigInt} stakedTokens - How many staked tokens
   * @param {BigInt} maxRelays - Max amount of relays.
   * @param {string} unstakingCompletionTime - If unstaking, min time for the application to complete unstaking
   */
  constructor(
    address: string,
    publicKey: string,
    jailed: boolean,
    status: StakingStatus,
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
