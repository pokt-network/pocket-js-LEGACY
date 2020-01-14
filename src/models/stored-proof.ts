import { SessionHeader } from "./input/session-header"

/**
 *
 *
 * @class StoredProof
 */
export class StoredProof {
  /**
   *
   * Creates a StoredProof object using a JSON string
   * @param {string} json - JSON string.
   * @returns {StoredProof} - StoredProof object.
   * @memberof StoredProof
   */
  public static fromJSON(json: string): StoredProof {
    const jsonObject = JSON.parse(json)

    return new StoredProof(
      SessionHeader.fromJSON(jsonObject.session_header),
      jsonObject.servicer_address,
      jsonObject.total_relays
    )
  }

  public readonly sessionHeader: SessionHeader
  public readonly servicerAddress: string
  public readonly totalRelays: BigInt

  /**
   * StoredProof.
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
   * Creates a JSON object with the StoredProof properties
   * @returns {JSON} - JSON Object.
   * @memberof StoredProof
   */
  public toJSON() {
    return {
      servicer_address: this.servicerAddress,
      session_header: this.sessionHeader,
      total_relays: this.totalRelays
    }
  }
}
