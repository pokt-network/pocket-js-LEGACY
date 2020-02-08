/**
 *
 *
 * @class SessionHeader
 */
export class SessionHeader {
  public static fromJSON(json: string): SessionHeader {
    try {
      const jsonObject = JSON.parse(json)
      return new SessionHeader(
        jsonObject.app_public_key,
        jsonObject.chain,
        BigInt(jsonObject.session_height)
      )
    } catch (error) {
      throw error
    }
  }

  public readonly applicationPubKey: string
  public readonly chain: string
  public readonly sessionBlockHeight: BigInt

  /**
   * Request for Session.
   * @constructor
   * @param {string} applicationPubKey - Application Key associated with a client.
   * @param {string} chain - Chain.
   * @param {BigInt} sessionBlockHeight - Height of session.
   */
  constructor(
    applicationPubKey: string,
    chain: string,
    sessionBlockHeight: BigInt
  ) {
    this.applicationPubKey = applicationPubKey
    this.chain = chain
    this.sessionBlockHeight = sessionBlockHeight

    if (!this.isValid()) {
      throw new TypeError("Invalid SessionHeader properties.")
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
      app_public_key: this.applicationPubKey,
      chain: this.chain,
      session_height: Number(this.sessionBlockHeight.toString())
    }
  }
  /**
   *
   * Check if the SessionHeader is valid
   * @returns {boolean} - True or false.
   * @memberof Session
   */
  public isValid(): boolean {
    return (
      this.applicationPubKey.length !== 0 &&
      this.chain.length !== 0 &&
      Number(this.sessionBlockHeight.toString()) > 0
    )
  }
}
