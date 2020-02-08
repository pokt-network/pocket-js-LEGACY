import { BondStatus } from "./output/bond-status"
import { Hex } from "../utils/hex"

/**
 *
 *
 * @class Node
 */
export class Node {
  public static fromJSON(json: string): Node {
    try {
      const jsonObject = JSON.parse(json)
      const status: BondStatus = BondStatus.getStatus(jsonObject.status)
  
      return new Node(
        jsonObject.address,
        jsonObject.public_key,
        jsonObject.jailed,
        status,
        BigInt(jsonObject.tokens),
        jsonObject.service_url,
        jsonObject.chains,
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
  public readonly stakedTokens: BigInt
  public readonly serviceURL: string
  public readonly chains: string[]
  public readonly unstakingCompletionTime: string | undefined

  /**
   * Creates a Node.
   * @constructor
   * @param {string} address - the hex address of the validator
   * @param {string} publicKey - the hex consensus public key of the validator.
   * @param {boolean} jailed - has the validator been jailed from staked status?
   * @param {BondStatus} status - validator status
   * @param {BigInt} stakedTokens - how many staked tokens
   * @param {string} serviceURL - Service node url
   * @param {string[]} chains - chains
   * @param {string} unstakingCompletionTime - if unstaking, min time for the validator to complete unstaking
   */
  constructor(
    address: string,
    publicKey: string,
    jailed: boolean,
    status: BondStatus,
    stakedTokens: BigInt,
    serviceURL: string,
    chains: string[] = [],
    unstakingCompletionTime: string = ""
  ) {
    this.address = address
    this.publicKey = publicKey
    this.jailed = jailed
    this.status = status
    this.stakedTokens = stakedTokens
    this.serviceURL = serviceURL
    this.chains = chains
    this.unstakingCompletionTime = unstakingCompletionTime

    if (!this.isValid()) {
      throw new TypeError("Invalid Node properties.")
    }
  }
  /**
   *
   * Creates a JSON object with the Node properties
   * @returns {JSON} - JSON Object.
   * @memberof Node
   */
  public toJSON() {
    return {
      address: this.address,
      chains: this.chains,
      public_key: this.publicKey,
      jailed: this.jailed,
      service_url: this.serviceURL,
      status: this.status.toString(),
      tokens: Number(this.stakedTokens.toString()),
      unstaking_time: this.unstakingCompletionTime
    }
  }
  /**
   *
   * Verify if all properties are valid
   * @returns {boolean} - True or false.
   * @memberof Node
   */
  public isValid() {
    return Hex.isHex(this.address) &&
    Hex.isHex(this.publicKey) &&
    this.jailed !== undefined &&
    this.serviceURL.length !== 0 &&
    this.status !== undefined &&
    Number(this.stakedTokens.toString()) >= 0
  }
}
