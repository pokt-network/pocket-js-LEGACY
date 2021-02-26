import { validateAddressHex, validatePublicKey, typeGuard } from "@pokt-network/pocket-js-utils"

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
      
      if (rawObjValue === null) {
        throw new Error("Account doesn't exist in the world state.")
      }

      let balance = "0"
      const coins = rawObjValue.coins

      if (coins && typeGuard(coins, Array) && coins.length === 1) {
        const coinObj: any = coins[0] as any
        balance = coinObj.amount || "0"
      }

      return new QueryAccountResponse(rawObjValue.address, balance, rawObjValue.public_key)
    } catch (error) {
      throw error
    }
  }

  public readonly address: string | null
  public readonly balance: string | null
  public readonly publicKey: string | null

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
      "address": this.address,
      "coins": [
        {
          "amount": this.balance,
          "denom": "upokt"
        }
      ],
      "public_key": this.publicKey
    }
  }
  /**
   *
   * Check if the QueryAccountResponse object is valid
   * @returns {boolean} - True or false.
   * @memberof QueryAccountResponse
   */
  public isValid(): boolean {
    let validAddress = true
    let validPubKey = true
    
    if (this.address) {
      validAddress = validateAddressHex(this.address) === undefined ? true : false
    }
    if (this.publicKey) {
      validPubKey = validatePublicKey(this.publicKey)
    }
    return  validAddress === true &&
    validPubKey === true
  }
}
