
/**
 *
 *
 * @class Configuration
 */
export class Configuration {
  public readonly maxNodes: number = 5
  public readonly maxSessions: number = 100
  public readonly requestTimeOut: number = 10000
  /**
   * Stores multiple properties used to interact with the Pocket Network.
   * @constructor
   * @param {number} maxNodes - (optional) Maximun amount of nodes to stored in rounting table, default 5.
   * @param {number} maxSessions - (optional) Maximun amount of sessions to stored for the session manager, default 100.
   * @param {number} requestTimeOut - (optional) Maximun timeout for every request in miliseconds, default 10000.
   */
  // TODO: Add default values so the Configuration can be instantiated without params
  constructor(
    maxNodes: number = 5,
    requestTimeOut: number = 100,
    maxSessions: number = 10000
  ) {
    this.maxNodes = maxNodes
    this.requestTimeOut = requestTimeOut
    this.maxSessions = maxSessions
  }
}
