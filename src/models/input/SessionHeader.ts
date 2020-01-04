/**
 *
 *
 * @class SessionHeader
 */
export class SessionHeader {
  public static fromJSON(json: string): SessionHeader {
    const jsonObject = JSON.parse(json)

    return new SessionHeader(
      jsonObject.app_pub_key,
      jsonObject.chain
    )
  }

  public readonly applicationPubKey: string
  public readonly chain: string

  /**
   * Request for Session.
   * @constructor
   * @param {string} applicationPubKey - Application Key associated with a client.
   * @param {string} chain - Chain.
   */
  constructor(
    applicationPubKey: string,
    chain: string
  ) {
    this.applicationPubKey = applicationPubKey
    this.chain = chain

    if (!this.isValid()) {
      throw new TypeError("Invalid properties length.")
    }
  }

  private isValid(): boolean {
    return this.applicationPubKey.length !== 0 && this.chain.length !== 0
  }
}
