import { Node } from "../rpc/models/node"
/**
 *
 *
 * @class Configuration
 */
export class Configuration {
  public readonly maxDispatchers: number = 0
  public readonly maxSessions: number = 0
  public consensusNodeCount: number = 0
  public readonly requestTimeOut: number = 0
  public readonly acceptDisputedResponses: boolean = false
  public readonly sessionBlockFrequency: number = 25
  public readonly blockTime: number = 60000
  public readonly maxSessionRefreshRetries: number = 3
  public readonly validateRelayResponses: boolean = true

  /**
   * Stores multiple properties used to interact with the Pocket Network.
   * @constructor
   * @param {number} maxDispatchers - (optional) Maximun amount of dispatchers urls to stored in rounting table, default 0.
   * @param {number} maxSessions - (optional) Maximun amount of sessions to stored for the session manager, default 0.
   * @param {number} consensusNodeCount - (optional) Maximun amount of nodes for local consensus, mandatory ODD number, default 0.
   * @param {number} requestTimeOut - (optional) Maximun timeout for every request in miliseconds, default 0.
   * @param {boolean} acceptDisputedResponses - (optional) Accept or reject responses based on having a full consensus, default false.
   * @param {number} sessionBlockFrequency - (optional) Amount of blocks that need to elapse for a new session to be tumbled, look at https://github.com/pokt-network/pocket-network-genesis for more information
   * @param {number} blockTime - (optional) Amount of time (in milliseconds) for a new block to be produced in the Pocket Network
   * @param {number} maxSessionRefreshRetries - (optional) Amount of times to perform a session refresh in case of getting error code 1124 (Invalid Session)
   * @param {boolean} validateRelayResponses - (optional) If True the relay responses are validated againt's the relay request information, False will not validate
   * @memberof Configuration
   */
  constructor(
    maxDispatchers: number = 0,
    maxSessions: number = 0,
    consensusNodeCount: number = 0,
    requestTimeOut: number = 0,
    acceptDisputedResponses: boolean = false,
    sessionBlockFrequency: number = 25,
    blockTime: number = 60000,
    maxSessionRefreshRetries: number = 3,
    validateRelayResponses: boolean = true
  ) {
    this.maxDispatchers = maxDispatchers
    this.requestTimeOut = requestTimeOut
    this.maxSessions = maxSessions
    this.validateRelayResponses = validateRelayResponses
    if (consensusNodeCount % 2 === 1 || consensusNodeCount === 0) {
      this.consensusNodeCount = consensusNodeCount
    }else {
      throw new Error("Failed to instantiate a Configuration class object due to consensusNodeCount not being an odd number.")
    }
    this.acceptDisputedResponses = acceptDisputedResponses
    this.sessionBlockFrequency = sessionBlockFrequency
    this.blockTime = blockTime
    this.maxSessionRefreshRetries = maxSessionRefreshRetries
  }
  public setconsensusNodeCount(v: number){
    this.consensusNodeCount = v
  }
}
