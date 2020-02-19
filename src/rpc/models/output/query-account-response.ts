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
      const rawObjValue = JSON.parse(json)
      const address = rawObjValue.address.toString()
      let balance = "0"
      const coins = rawObjValue.coins
      if (coins && typeGuard(coins, Array) && coins.length === 1) {
        const coinObj: any = coins[0] as any
        balance = coinObj.amount || "0"
      }
      const pubKeyObj = rawObjValue.public_key
      const pubKeyValue = Buffer.from(pubKeyObj).toString("hex")
      return new QueryAccountResponse(address, balance, pubKeyValue)
    } catch (error) {
      throw error
    }
  }

  public readonly address: string
  public readonly balance: string
  public readonly publicKey: string

  /**
   * Query Account Response.
   * @constructor
   * @param {object} account - Current account object.
   */
  constructor( 
    address: string,
    balance: string,
    publicKey: string,
  ) {
    this.address = address
    this.balance = balance
    this.publicKey = publicKey

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
        }
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
    return validAddress && validPubKey
  }
}
