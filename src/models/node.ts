import { BondStatus } from "./output/bond-status"
import { Hex } from "../utils/hex"

/**
 *
 *
 * @class Node
 */
export class Node {
  public static fromJSON(json: string): Node {
    const jsonObject = JSON.parse(json)
    const status: BondStatus = BondStatus.getStatus(jsonObject.status)

    return new Node(
      jsonObject.address,
      jsonObject.cons_pubkey,
      jsonObject.jailed,
      status,
      jsonObject.stakedTokens,
      jsonObject.serviceurl,
      jsonObject.chains,
      jsonObject.unstaking_time
    )
  }

  public readonly address: string
  public readonly consPubKey: string
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
   * @param {string} consPubKey - the hex consensus public key of the validator.
   * @param {boolean} jailed - has the validator been jailed from staked status?
   * @param {BondStatus} status - validator status
   * @param {BigInt} stakedTokens - how many staked tokens
   * @param {string} serviceURL - Service node url
   * @param {string[]} chains - chains
   * @param {string} unstakingCompletionTime - if unstaking, min time for the validator to complete unstaking
   */
  constructor(
    address: string,
    consPubKey: string,
    jailed: boolean,
    status: BondStatus,
    stakedTokens: BigInt,
    serviceURL: string,
    chains: string[] = [],
    unstakingCompletionTime?: string
  ) {
    this.address = Hex.decodeString(address)
    this.consPubKey = Hex.decodeString(consPubKey)
    this.jailed = jailed
    this.status = status
    this.stakedTokens = stakedTokens
    this.serviceURL = serviceURL
    this.chains = chains
    this.unstakingCompletionTime = unstakingCompletionTime

    if (!this.isValid()) {
      throw new TypeError("Invalid properties length.")
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
      cons_pubkey: this.consPubKey,
      jailed: this.jailed,
      service_url: this.serviceURL,
      status: this.status,
      tokens: this.stakedTokens,
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
    for (const property in this) {
      if(property === 'toJSON' || property === 'isValid') {
        continue
      }
    
      if (!this.hasOwnProperty(property) || property === "") {
        return false
      }
    }
    return true
  }
}
