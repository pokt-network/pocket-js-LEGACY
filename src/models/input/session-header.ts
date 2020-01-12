/**
 *
 *
 * @class SessionHeader
 */
export class SessionHeader {
  public static fromJSON(json: string): SessionHeader {
    const jsonObject = JSON.parse(json);

    return new SessionHeader(
      jsonObject.app_pub_key,
      jsonObject.chain,
      jsonObject.session_height
    );
  }

  public readonly applicationPubKey: String;
  public readonly chain: String;
  public readonly sessionBlockHeight: BigInt;

  /**
   * Request for Session.
   * @constructor
   * @param {String} applicationPubKey - Application Key associated with a client.
   * @param {String} chain - Chain.
   * @param {BigInt} sessionBlockHeight - Height of session.
   */
  constructor(
    applicationPubKey: String,
    chain: String,
    sessionBlockHeight: BigInt
  ) {
    this.applicationPubKey = applicationPubKey;
    this.chain = chain;
    this.sessionBlockHeight = sessionBlockHeight;

    if (!this.isValid()) {
      throw new TypeError("Invalid properties length.");
    }
  }
  /**
*
* Creates a JSON object with the SessionHeader properties
* @returns {JSON} - JSON Object.
* @memberof SessionHeader
*/
  public toJSON() {
    return {
      "app_pub_key": this.applicationPubKey,
      "chain": this.chain,
      "session_height": this.sessionBlockHeight
    }
  }
  /**
  *
  * Check if the SessionHeader is valid
  * @returns {boolean} - True or false.
  * @memberof Session
  */
  public isValid(): boolean {
    return this.applicationPubKey.length !== 0 && this.chain.length !== 0 && this.sessionBlockHeight != undefined;
  }
}
