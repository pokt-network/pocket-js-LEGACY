import { SessionHeader } from "./input/session-header"

/**
 *
 *
 * @class StoredReceipt
 */
export class StoredReceipt {
  /**
   *
   * Creates a StoredReceipt object using a JSON string
   * @param {string} json - JSON string.
   * @returns {StoredReceipt} - StoredReceipt object.
   * @memberof StoredReceipt
   */
  public static fromJSON(json: string): StoredReceipt {
    const jsonObject = JSON.parse(json)

    return new StoredReceipt(
      SessionHeader.fromJSON(JSON.stringify(jsonObject.session_header)),
      jsonObject.servicer_address,
      BigInt(jsonObject.total_relays)
    )
  }

  public readonly sessionHeader: SessionHeader
  public readonly servicerAddress: string
  public readonly totalRelays: BigInt

  /**
   * StoredReceipt.
   * @constructor
   * @param {SessionHeader} sessionHeader - Session Header.
   * @param {string} servicerAddress - Servicer address.
   * @param {BigInt} totalRelays - Total amount of relays.
   */
  constructor(
    sessionHeader: SessionHeader,
    servicerAddress: string,
    totalRelays: BigInt
  ) {
    this.sessionHeader = sessionHeader
    this.servicerAddress = servicerAddress
    this.totalRelays = totalRelays
  }
  /**
   *
   * Creates a JSON object with the StoredReceipt properties
   * @returns {JSON} - JSON Object.
   * @memberof StoredReceipt
   */
  public toJSON() {
    return {
      servicer_address: this.servicerAddress,
      session_header: this.sessionHeader.toJSON(),
      total_relays: Number(this.totalRelays.toString())
    }
  }
  /**
   *
   * Check if the StoredReceipt object is valid
   * @returns {boolean} - True or false.
   * @memberof StoredReceipt
   */
  public isValid(): boolean {
    return this.servicerAddress.length !== 0 &&
    Number(this.totalRelays.toString()) >= 0 &&
    this.sessionHeader.isValid()
  }
}
