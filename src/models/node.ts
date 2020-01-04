import axios from "axios"
import constants = require("../utils/constants")
import { Relay } from "./relay"
import { Blockchain } from "./blockchain"
const httpsRequestProtocol = "https://"
const httpRequestProtocol = "http://"
// Dispatch
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
  public readonly stakedTokens: number
  public readonly serviceURL: string
  public readonly chains: string[]
  public readonly unstakingCompletionTime: number | undefined

  /**
   * Create a Session Node.
   * @constructor
   * @param {string} address - the hex address of the validator
   * @param {string} consPubKey - the hex consensus public key of the validator.
   * @param {boolean} jailed - has the validator been jailed from staked status?
   * @param {BondStatus} status - validator status
   * @param {number} stakedTokens - how many staked tokens
   * @param {string} serviceURL - Service node url
   * @param {string[]} chains - chains
   * @param {number} unstakingCompletionTime - if unstaking, min time for the validator to complete unstaking
   */
  constructor(
    address: string,
    consPubKey: string,
    jailed: boolean,
    status: BondStatus,
    stakedTokens: number = 0,
    serviceURL: string,
    chains: string[] = [],
    unstakingCompletionTime?: number
  ) {
    this.address = Hex.decodeString(address)
    this.consPubKey = consPubKey
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
   * Verify if all properties are valid
   * @returns {boolean} - True or false.
   * @memberof Node
   */
  public isValid() {
    for (const property in this) {
      if (!this.hasOwnProperty(property) || property === "") {
        return false
      }
    }
    return true
  }

  /**
   *
   * Sends a relay to a service node
   * @param {Relay} relay - Relay object with the information.
   * @param {callback} callback - callback handler.
   * @returns {Object} - Object with the response.
   * @memberof Node
   */
  public async sendRelay(
    relay: Relay,
    callback?: (result?: any, error?: Error) => any
  ) {
    try {
      const axiosInstance = axios.create({
        baseURL: this.ipPort,
        headers: {
          "Content-Type": "application/json"
        },
        timeout: relay.configuration.requestTimeOut
      })

      const response = await axiosInstance.post(
        constants.relayPath,
        relay.toJSON()
      )

      if (response.status === 200 && response.data !== null) {
        const result = response.data

        if (callback) {
          callback(result)
          return
        } else {
          return result
        }
      } else {
        if (callback) {
          callback(
            null,
            new Error("Failed to send relay with error: " + response.data)
          )
          return
        } else {
          return new Error("Failed to send relay with error: " + response.data)
        }
      }
    } catch (error) {
      if (callback) {
        callback(null, new Error("Failed to send relay with error: " + error))
        return
      } else {
        return new Error("Failed to send relay with error: " + error)
      }
    }
  }
}