import { BondStatus } from "./output/bond-status"
import { Hex } from "../utils/hex"
/**
 *
 *
 * @class Application
 */
export class Application {
  public static fromJSON(json: string): Application {
    const jsonObject = JSON.parse(json)
    const status: BondStatus = BondStatus.getStatus(jsonObject.status)

    return new Application(
      jsonObject.address,
      jsonObject.cons_pubkey,
      jsonObject.jailed,
      status,
      jsonObject.chains,
      jsonObject.tokens,
      jsonObject.max_relays,
      jsonObject.unstaking_time
    )
  }

  public readonly address: string
  public readonly consPubKey: string
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
   * @param {string} consPubKey - the hex consensus public key of the validator.
   * @param {boolean} jailed - has the validator been jailed from staked status?
   * @param {BondStatus} status - validator status
   * @param {string[]} chains - chains
   * @param {BigInt} stakedTokens - how many staked tokens
   * @param {string} maxRelays - Service Application url
   * @param {string} unstakingCompletionTime - if unstaking, min time for the validator to complete unstaking
   */
  constructor(
    address: string,
    consPubKey: string,
    jailed: boolean,
    status: BondStatus,
    chains: string[] = [],
    stakedTokens: BigInt,
    maxRelays: BigInt,
    unstakingCompletionTime: string = ""
  ) {
    this.address = address
    this.consPubKey = consPubKey
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
      cons_pubkey: this.consPubKey,
      jailed: this.jailed,
      max_relays: this.maxRelays.toString(16),
      status: this.status,
      tokens: this.stakedTokens.toString(16),
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
    Hex.isHex(this.consPubKey) &&
    Hex.byteLength(this.consPubKey) === 32 &&
    this.jailed !== undefined &&
    this.maxRelays !== undefined &&
    this.status !== undefined &&
    this.stakedTokens !== undefined
  }
}
