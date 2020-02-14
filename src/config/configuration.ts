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
  /**
   * Stores multiple properties used to interact with the Pocket Network.
   * @constructor
   * @param {number} maxDispatchers - (optional) Maximun amount of dispatchers urls to stored in rounting table, default 0.
   * @param {number} maxSessions - (optional) Maximun amount of sessions to stored for the session manager, default 0.
   * @param {number} requestTimeOut - (optional) Maximun timeout for every request in miliseconds, default 0.
   */
  constructor(
    maxDispatchers: number = 0,
    requestTimeOut: number = 0,
    maxSessions: number = 0
  ) {
    this.maxDispatchers = maxDispatchers
    this.requestTimeOut = requestTimeOut
    this.maxSessions = maxSessions

  }
}
