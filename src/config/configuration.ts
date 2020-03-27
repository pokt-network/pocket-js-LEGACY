import { Node } from "../rpc/models/node"
/**
 *
 *
 * @class Configuration
 */
export class Configuration {
  public readonly maxDispatchers: number = 0
  public readonly maxSessions: number = 0
  public readonly requestTimeOut: number = 0
  public readonly acceptDisputedResponses: boolean = false
  public maxConsensusNodes: number = 0

  /**
   * Stores multiple properties used to interact with the Pocket Network.
   * @constructor
   * @param {number} maxDispatchers - (optional) Maximun amount of dispatchers urls to stored in rounting table, default 0.
   * @param {number} maxSessions - (optional) Maximun amount of sessions to stored for the session manager, default 0.
   * @param {number} maxConsensusNodes - (optional) Maximun amount of nodes for local consensus, mandatory ODD number, default 0.
   * @param {number} requestTimeOut - (optional) Maximun timeout for every request in miliseconds, default 0.
   * @param {boolean} acceptDisputedResponses - (optional) Accept or reject responses based on having a full consensus, default false.
   * @memberof Configuration
   */
  constructor(
    maxDispatchers: number = 0,
    maxSessions: number = 0,
    maxConsensusNodes: number = 0,
    requestTimeOut: number = 0,
    acceptDisputedResponses: boolean = false
  ) {
    this.maxDispatchers = maxDispatchers
    this.requestTimeOut = requestTimeOut
    this.maxSessions = maxSessions
    if (maxConsensusNodes % 2 === 1) {
      this.maxConsensusNodes = maxConsensusNodes
    }
    this.acceptDisputedResponses = acceptDisputedResponses
  }
  public setMaxConsensusNodes(v: number){
    this.maxConsensusNodes = v
  }
}
