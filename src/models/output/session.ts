import { Node } from "../node"
import { SessionHeader } from "../input/session-header"

/**
 *
 *
 * @class Session
 */
export class Session {
  public static fromJSON(json: string): Session {
    const jsonObject = JSON.parse(json)
    const sessionHeader = SessionHeader.fromJSON(jsonObject.header)
    const sessionNodes: Node[] = []

    for (const sessionNodeJson in jsonObject.nodes) {
      if (sessionNodeJson.hasOwnProperty("serviceurl")) {
        sessionNodes.push(Node.fromJSON(sessionNodeJson))
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
   * @param {SessionHeader} sessionHeader - Application Key associated with a client.
   * @param {string} sessionKey - Chain.
   * @param {SessionNode[]} sessionNodes - Height of session.
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
   *
   * Creates a JSON object with the Session properties
   * @returns {JSON} - JSON Object.
   * @memberof Session
   */
  public toJSON() {
    const nodeListJSON: Node[] = []
    this.sessionNodes.forEach(node => {
      nodeListJSON.push(node)
    })
    return {
      header: this.sessionHeader.toJSON(),
      key: this.sessionKey,
      nodes: JSON.parse(JSON.stringify(nodeListJSON))
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
