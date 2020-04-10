import { Hex } from "../../utils/hex"
import { StakingStatus } from "./staking-status"

/**
 *
 *
 * @class Node
 */
export class Node {
  public static fromJSON(json: string): Node {
    try {
      const rawObjValue = JSON.parse(json)
      const status= StakingStatus.getStatus(rawObjValue.status)
      return new Node(
        rawObjValue.address,
        rawObjValue.public_key,
        rawObjValue.jailed,
        status,
        BigInt(rawObjValue.tokens),
        rawObjValue.service_url,
        rawObjValue.chains,
        rawObjValue.unstaking_time
      )
    } catch (error) {
      throw error
    }
  }

  public readonly address: string
  public readonly publicKey: string
  public readonly jailed: boolean
  public readonly status: StakingStatus
  public readonly stakedTokens: BigInt
  public readonly serviceURL: URL
  public readonly chains: string[]
  public readonly unstakingCompletionTimestamp: string | undefined
  public alreadyInConsensus: boolean = false

  /**
   * Creates a Node.
   * @constructor
   * @param {string} address - Node address hex.
   * @param {string} publicKey - Node public key hex.
   * @param {boolean} jailed - True or false if the validator been jailed.
   * @param {StakingStatus} status - Validator staking status
   * @param {BigInt} stakedTokens - How many tokens are staked
   * @param {URL} serviceURL - Service node URL
   * @param {string[]} chains - A list of blockchain hash
   * @param {string} unstakingCompletionTimestamp - If unstaking, the minimum time for the validator to complete unstaking
   */
  constructor(
    address: string,
    publicKey: string,
    jailed: boolean,
    status: StakingStatus,
    stakedTokens: BigInt,
    serviceURL: string,
    chains: string[] = [],
    unstakingCompletionTimestamp: string = ""
  ) {
    this.address = address
    this.publicKey = publicKey
    this.jailed = jailed
    this.status = status
    this.stakedTokens = stakedTokens
    this.serviceURL = new URL(serviceURL)
    this.chains = chains
    this.unstakingCompletionTimestamp = unstakingCompletionTimestamp

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
      unstaking_time: this.unstakingCompletionTimestamp   
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
    this.serviceURL.pathname.length !== 0 &&
    this.status !== undefined &&
    Number(this.stakedTokens.toString()) >= 0
  }
}
