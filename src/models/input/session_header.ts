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

  public readonly applicationPubKey: string;
  public readonly chain: string;
  public readonly sessionBlockHeight: number;

  /**
   * Request for Session.
   * @constructor
   * @param {string} applicationPubKey - Application Key associated with a client.
   * @param {string} chain - Chain.
   * @param {number} sessionBlockHeight - Height of session.
   */
  constructor(
    applicationPubKey: string,
    chain: string,
    sessionBlockHeight: number
  ) {
    this.applicationPubKey = applicationPubKey;
    this.chain = chain;
    this.sessionBlockHeight = sessionBlockHeight;

    if (!this.isValid()) {
      throw new TypeError("Invalid properties length.");
    }
  }

  private isValid(): boolean {
    return this.applicationPubKey.length !== 0 && this.chain.length !== 0;
  }
}
