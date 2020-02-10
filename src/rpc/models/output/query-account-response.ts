import { validateAddressHex, validatePublicKey, typeGuard } from "../../../utils"

/**
 *
 *
 * @class QueryAccountResponse
 */
export class QueryAccountResponse {
  /**
   *
   * Creates a QueryAccountResponse object using a JSON string
   * @param {String} json - JSON string.
   * @returns {QueryAccountResponse} - QueryAccountResponse object.
   * @memberof QueryAccountResponse
   */
  public static fromJSON(json: string): QueryAccountResponse {
    try {
      const rawObj = JSON.parse(json)
      if (!rawObj.value) {
        throw new Error("No value field in account response")
      }
      const rawObjValue = rawObj.value
      const accountNumber = rawObjValue.account_number
      const address = rawObjValue.address
      let balance = "0"
      const coins = rawObjValue.coins
      if (coins && typeGuard(coins, Array) && coins.length === 1) {
        const coinObj: any = coins[0] as any
        balance = coinObj.amount || "0"
      }
      const pubKeyObj = rawObjValue.public_key
      const pubKeyValue = Buffer.from(pubKeyObj.value, "base64").toString("hex")
      const sequence = rawObjValue.sequence
      return new QueryAccountResponse(accountNumber, address, balance, pubKeyValue, sequence)
    } catch (error) {
      throw error
    }
  }

  public readonly accountNumber: string
  public readonly address: string
  public readonly balance: string
  public readonly publicKey: string
  public readonly sequence: string

  /**
   * Query Account Response.
   * @constructor
   * @param {object} account - Current account object.
   */
  constructor( 
    accountNumber: string, 
    address: string,
    balance: string,
    publicKey: string,
    sequence: string
  ) {
    this.accountNumber = accountNumber
    this.address = address
    this.balance = balance
    this.publicKey = publicKey
    this.sequence = sequence

    if (!this.isValid()) {
      throw new TypeError("Invalid QueryAccountResponse properties.")
    }
  }
  /**
   *
   * Creates a JSON object with the QueryAccountResponse properties
   * @returns {JSON} - JSON Object.
   * @memberof QueryAccountResponse
   */
  public toJSON() {
    return {
      "type": "posmint/Account",
      "value": {
        "account_number": this.accountNumber,
        "address": this.address,
        "coins": [
          {
            "amount": this.balance,
            "denom": "upokt"
          }
        ],
        "public_key": {
          "type": "crypto/ed25519_public_key",
          "value": this.publicKey
        },
        "sequence": this.sequence
      }
    }
  }
  /**
   *
   * Check if the QueryAccountResponse object is valid
   * @returns {boolean} - True or false.
   * @memberof QueryAccountResponse
   */
  public isValid(): boolean {
    const validAddress: boolean = validateAddressHex(this.address) === undefined
    const validPubKey: boolean = validatePublicKey(Buffer.from(this.publicKey, "hex"))
    return validAddress && validPubKey && this.accountNumber.length > 0 && this.sequence.length > 0
  }
}
