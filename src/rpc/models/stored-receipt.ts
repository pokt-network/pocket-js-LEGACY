import { SessionHeader } from "./input/session-header"
import { Hex } from "../../utils"

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
    try {
      const jsonObject = JSON.parse(json)

      return new StoredReceipt(
        SessionHeader.fromJSON(JSON.stringify(jsonObject.header)),
        jsonObject.address,
        BigInt(jsonObject.total),
        jsonObject.evidence_type
      )
    } catch (error) {
      throw error 
    }

  }

  public readonly sessionHeader: SessionHeader
  public readonly address: string
  public readonly total: BigInt
  public readonly evidenceType: number

  /**
   * StoredReceipt.
   * @constructor
   * @param {SessionHeader} sessionHeader - Session Header.
   * @param {string} address - Servicer address.
   * @param {BigInt} total - Total amount of relays.
   * @param {number} evidenceType - Evidence type.
   */
  constructor(
    sessionHeader: SessionHeader,
    address: string,
    total: BigInt,
    evidenceType: number
  ) {
    this.sessionHeader = sessionHeader
    this.address = address
    this.total = total
    this.evidenceType = evidenceType
  }
  /**
   *
   * Creates a JSON object with the StoredReceipt properties
   * @returns {JSON} - JSON Object.
   * @memberof StoredReceipt
   */
  public toJSON() {
    return {
      servicer_address: this.address,
      session_header: this.sessionHeader.toJSON(),
      total_relays: Number(this.total.toString()),
      evidence_type: this.evidenceType
    }
  }
  /**
   *
   * Check if the StoredReceipt object is valid
   * @returns {boolean} - True or false.
   * @memberof StoredReceipt
   */
  public isValid(): boolean {
    let validAddress = true

    if (this.address) {
      validAddress = Hex.validateAddress(this.address)
    }

    return validAddress &&
    Number(this.total.toString()) >= 0 &&
    this.sessionHeader.isValid() &&
    this.evidenceType >= 0
  }
}
