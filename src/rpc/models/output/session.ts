import { Node } from "../node"
import { SessionHeader } from "../input/session-header"
import { Configuration } from "../../../config/configuration"

/**
 *
 *
 * @class Session
 */
export class Session {
  /**
   *
   * Creates a Session object using a JSON string
   * @param {String} json - JSON string.
   * @returns {Session} - Session object.
   * @memberof Session
   */
  public static fromJSON(json: string): Session {
    const jsonObject = JSON.parse(json)

    // Compute the session timestamp from the number of blocks since dispatch
    const sessionBlockAge = Number( BigInt(jsonObject.block_height) - BigInt(jsonObject.session.header.session_height))
    jsonObject.session.header.session_timestamp = Math.floor( (Date.now() / 1000) - (sessionBlockAge * 60))
    
    const sessionHeader = SessionHeader.fromJSON(JSON.stringify(jsonObject.session.header))
    const sessionNodes: Node[] = []

    if (jsonObject.session.nodes !== undefined && Array.isArray(jsonObject.session.nodes)) {
      for(let i = 0; i < jsonObject.session.nodes.length; i++) {
        sessionNodes.push(Node.fromJSON(JSON.stringify(jsonObject.session.nodes[i])))
      }
    }
    return new Session(sessionHeader, jsonObject.key, sessionNodes)
  }

  public readonly sessionHeader: SessionHeader
  public readonly sessionKey: string
  public readonly sessionNodes: Node[]
  public relayCount: number = 0

  /**
   * Request for Session.
   * @constructor
   * @param {SessionHeader} sessionHeader - Session Header object.
   * @param {string} sessionKey - Session Key.
   * @param {SessionNode[]} sessionNodes - Nodes for the session.
   */
  constructor(
    sessionHeader: SessionHeader,
    sessionKey: string,
    sessionNodes: Node[]
  ) {
    this.sessionHeader = sessionHeader
    this.sessionKey = sessionKey
    this.sessionNodes = sessionNodes
  }
  
  public relayPlus(v: number) {
    this.relayCount = this.relayCount + v
  }

  /**
   * Returns whether or not a node is part of this session
   * @param {Node} node - Node object to verify if exists in the current session.
   * @returns {boolean} whether or not the node is part of this session
   * @memberof Session
   */
  public isNodeInSession(node: Node): boolean {
    for(let i = 0; i < this.sessionNodes.length; i++) {
      const sessionNode = this.sessionNodes[i]
      if (sessionNode.address.toUpperCase() === node.address.toUpperCase()) {
        return true
      }
    }
    return false
  }
  /**
   * Returns a random session node that haven't been part of the current consensus
   * @memberof Session
   */
  public getUniqueSessionNode(): Node | Error { 
    const nodes = this.sessionNodes
    if (nodes !== undefined && nodes.length > 0) {
      const availableNodes: Node[] = []
      nodes.forEach(node => {
        if (!node.alreadyInConsensus) {
          availableNodes.push(node)
        }
      })
      if (availableNodes !== undefined && availableNodes.length > 0) {
        return availableNodes[Math.floor(Math.random() * availableNodes.length)]
      }else {
        return new Error("Failed to retrieve a Consensus ready Session node, list is empty")
      }
    }
    return new Error("Failed to retrieve a Session node, list is empty")
  } 
  /**
   * Returns a random session node
   * @memberof Session
   */
  public getSessionNode(): Node | Error { 
    const nodes = this.sessionNodes
    if (nodes !== undefined && nodes.length > 0) {
      return nodes[Math.floor(Math.random() * nodes.length)]
    }
    return new Error("Failed to retrieve a Session node, list is empty")
  }

  /**
   * Returns the amount of blocks that have passed since the session timestamp
   */
  public getBlocksSinceCreation(configuration: Configuration): number {
    const blocksPassed = Math.ceil((Math.floor(Date.now() / 1000) - this.sessionHeader.sessionTimestamp) / (configuration.blockTime / 1000))
    return blocksPassed
  }

  /**
   *
   * Creates a JSON object with the Session properties
   * @returns {JSON} - JSON Object.
   * @memberof Session
   */
  public toJSON() {
    return {
      header: this.sessionHeader.toJSON(),
      key: this.sessionKey,
      nodes: JSON.parse(JSON.stringify(this.sessionNodes))
    }
  }
  /**
   *
   * Check if the Session object is valid
   * @returns {boolean} - True or false.
   * @memberof Session
   */
  public isValid(): boolean {
    return (
      this.sessionHeader.isValid() &&
      this.sessionKey !== undefined &&
      this.sessionNodes !== undefined
    )
  }
}
