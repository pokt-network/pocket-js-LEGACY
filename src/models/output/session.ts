import { Node } from "../node"
import { SessionHeader } from "../input/session-header"
import { Hex } from "../../utils/hex";

/**
 *
 *
 * @class Session
 */
export class Session {
  public static fromJSON(json: string): Session {
    const jsonObject = JSON.parse(json);
    const sessionHeader = SessionHeader.fromJSON(
      jsonObject.header
    );
    const sessionNodes: Node[] = [];

    for (const sessionNodeJson in jsonObject.nodes) {
      if (sessionNodeJson.hasOwnProperty("serviceurl")) {
        sessionNodes.push(SessionNode.fromJSON(sessionNodeJson))
      }
    }

    return new Session(sessionHeader, jsonObject.key, sessionNodes)
  }

  public readonly sessionHeader: SessionHeader;
  public readonly sessionKey: Hex;
  public readonly sessionNodes: Node[];

  /**
   * Request for Session.
   * @constructor
   * @param {SessionHeader} sessionHeader - Application Key associated with a client.
   * @param {hex} sessionKey - Chain.
   * @param {SessionNode[]} sessionNodes - Height of session.
   */
  constructor(
    sessionHeader: SessionHeader,
    sessionKey: Hex,
    sessionNodes: Node[]
  ) {
    this.sessionHeader = sessionHeader
    this.sessionKey = sessionKey
    this.sessionNodes = sessionNodes
  }

  /**
*
* Creates a JSON object with the Session properties
* @returns {JSON} - JSON Object.
* @memberof Session
*/
  public toJSON() {
    var nodeListJSON;
    this.sessionNodes.forEach(node => {
      nodeListJSON.push(node.toJSON());
    });
    return {
      "header": this.sessionHeader.toJSON(),
      "key": this.sessionKey,
      "nodes": nodeListJSON
    }
  }
  /**
  *
  * Check if the Session object is valid
  * @returns {boolean} - True or false.
  * @memberof Session
  */
  public isValid(): boolean {
    return this.sessionHeader.isValid() && this.sessionKey != undefined && this.sessionNodes != undefined;
  }

  /**
*
* Creates a JSON object with the Session properties
* @returns {JSON} - JSON Object.
* @memberof Session
*/
  public toJSON() {
    var nodeListJSON;
    this.sessionNodes.forEach(node => {
      nodeListJSON.push(node.toJSON());
    });
    return {
      "header": this.sessionHeader.toJSON(),
      "key": this.sessionKey,
      "nodes": nodeListJSON
    }
  }
  /**
  *
  * Check if the Session object is valid
  * @returns {boolean} - True or false.
  * @memberof Session
  */
  public isValid(): boolean {
    return this.sessionHeader.isValid() && this.sessionKey != undefined && this.sessionNodes != undefined;
  }
}
