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

  /**
   * Stores multiple properties used to interact with the Pocket Network.
   * @constructor
   * @param {number} maxDispatchers - (optional) Maximun amount of dispatchers urls to stored in rounting table, default 0.
   * @param {number} maxSessions - (optional) Maximun amount of sessions to stored for the session manager, default 0.
   * @param {number} consensusNodeCount - (optional) Maximun amount of nodes for local consensus, mandatory ODD number, default 0.
   * @param {number} requestTimeOut - (optional) Maximun timeout for every request in miliseconds, default 0.
   * @param {boolean} acceptDisputedResponses - (optional) Accept or reject responses based on having a full consensus, default false.
   * @memberof Configuration
   */
  constructor(
    maxDispatchers: number = 0,
    maxSessions: number = 0,
    consensusNodeCount: number = 0,
    requestTimeOut: number = 0,
    acceptDisputedResponses: boolean = false
  ) {
    this.maxDispatchers = maxDispatchers
    this.requestTimeOut = requestTimeOut
    this.maxSessions = maxSessions
    if (consensusNodeCount % 2 === 1 || consensusNodeCount === 0) {
      this.consensusNodeCount = consensusNodeCount
    }else {
      throw new Error("Failed to instantiate a Configuration class object due to consensusNodeCount not being an odd number.")
    }
    this.acceptDisputedResponses = acceptDisputedResponses
  }
  public setconsensusNodeCount(v: number){
    this.consensusNodeCount = v
  }
}
