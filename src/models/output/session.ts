import { SessionHeader } from "../input/session_header"
import { Node } from "../node"


/**
 *
 *
 * @class Session
 */
export class Session {
  public static fromJSON(json: string): Session {
    const jsonObject = JSON.parse(json)
    const sessionHeader: SessionHeader = SessionHeader.fromJSON(jsonObject.header)
    const sessionNodes: SessionNode[] = []

    for (const sessionNodeJson in jsonObject.nodes) {
      if (sessionNodeJson.hasOwnProperty("serviceurl")) {
        sessionNodes.push(SessionNode.fromJSON(sessionNodeJson))
      }
    }

    return new Session(sessionHeader, jsonObject.key, sessionNodes)
  }

  public readonly sessionHeader: SessionHeader
  public readonly sessionKey: number[]
  public readonly sessionNodes: Node[]

  /**
   * Request for Session.
   * @constructor
   * @param {SessionHeader} sessionHeader - Application Key associated with a client.
   * @param {number[]} sessionKey - Chain.
   * @param {SessionNode[]} sessionNodes - Height of session.
   */
  constructor(
    sessionHeader: SessionHeader,
    sessionKey: number[],
    sessionNodes: SessionNode[]
  ) {
    this.sessionHeader = sessionHeader
    this.sessionKey = sessionKey
    this.sessionNodes = sessionNodes
  }
}
