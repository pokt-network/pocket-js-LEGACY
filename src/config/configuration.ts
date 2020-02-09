import { Node } from "../rpc/models/node"
/**
 *
 *
 * @class Configuration
 */
export class Configuration {
  public readonly nodes: Node[]
  public readonly maxNodes: number = 5
  public readonly maxSessions: number = 100
  public readonly requestTimeOut: number = 10000
  /**
   * Stores multiple properties used to interact with the Pocket Network.
   * @constructor
   * @param {Node[]} nodes - Initial node list.
   * @param {number} maxNodes - (optional) Maximun amount of nodes to stored in rounting table, default 5.
   * @param {number} maxSessions - (optional) Maximun amount of sessions to stored for the session manager, default 100.
   * @param {number} requestTimeOut - (optional) Maximun timeout for every request in miliseconds, default 10000.
   */
  constructor(
    nodes: Node[],
    maxNodes: number = 5,
    requestTimeOut: number = 100,
    maxSessions: number = 10000
  ) {
    this.nodes = nodes
    this.maxNodes = maxNodes
    this.requestTimeOut = requestTimeOut
    this.maxSessions = maxSessions

    if (!this.isValid()) {
      throw new Error("Nodes provided to the configuration can't be less or equal to 0.")
    }

  }
  /**
   *
   * Check if the Configuration object is valid
   * @returns {boolean} - True or false.
   * @memberof Configuration
   */
  public isValid(): boolean{
    return this.nodes.length !== 0
  }
}
