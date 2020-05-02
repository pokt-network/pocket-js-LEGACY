/**
 *
 *
 * @class SessionHeader
 */
export class SessionHeader {
  /**
   *
   * Creates a SessionHeader object using a JSON string
   * @param {string} json - JSON string.
   * @returns {SessionHeader} - SessionHeader object.
   * @memberof SessionHeader
   */
  public static fromJSON(json: string): SessionHeader {
    try {
      const jsonObject = JSON.parse(json)
      return new SessionHeader(
        jsonObject.app_public_key,
        jsonObject.chain,
        BigInt(jsonObject.session_height),
        Number(jsonObject.session_timestamp)
      )
    } catch (error) {
      throw error
    }
  }

  public readonly applicationPubKey: string
  public readonly chain: string
  public readonly sessionBlockHeight: BigInt
  public readonly sessionTimestamp: number

  /**
   * Request for Session.
   * @constructor
   * @param {string} applicationPubKey - Application Key associated with a client.
   * @param {string} chain - Chain.
   * @param {BigInt} sessionBlockHeight - Height of session.
   * @param {number} sessionTimestamp - Creation timestamp, used locally only.
   */
  constructor(
    applicationPubKey: string,
    chain: string,
    sessionBlockHeight: BigInt,
    sessionTimestamp: number = 0
  ) {
    this.applicationPubKey = applicationPubKey
    this.chain = chain
    this.sessionBlockHeight = sessionBlockHeight
    this.sessionTimestamp = sessionTimestamp

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
      session_height: Number(this.sessionBlockHeight.toString()),
      session_timestamp: this.sessionTimestamp
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
      Number(this.sessionBlockHeight.toString()) >= 0 &&
      this.sessionTimestamp >= 0
    )
  }
}
