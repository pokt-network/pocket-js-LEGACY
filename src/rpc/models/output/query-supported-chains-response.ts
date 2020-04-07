/**
 *
 *
 * @class QuerySupportedChainsResponse
 */
export class QuerySupportedChainsResponse {
  /**
   *
   * Creates a QuerySupportedChainsResponse object using a JSON string
   * @param {String} json - JSON string.
   * @returns {QuerySupportedChainsResponse} - QuerySupportedChainsResponse object.
   * @memberof QuerySupportedChainsResponse
   */
  public static fromJSON(json: string): QuerySupportedChainsResponse {
    try {
      const chains: string[] = []
      if (Array.isArray(json)) {
        json.forEach(chain => {
          chains.push(chain)
        })
      }

      return new QuerySupportedChainsResponse(chains)
    } catch (error) {
      throw error
    }
  }

  public readonly supportedChains: string[]

  /**
   * QuerySupportedChainsResponse
   * @constructor
   * @param {string[]} supportedChains - Supported chains string array.
   */
  constructor(supportedChains: string[]) {
    this.supportedChains = supportedChains

    if (!this.isValid()) {
      throw new TypeError("Invalid SupportedShainsResponse properties.")
    }
  }
  /**
   *
   * Creates a JSON object with the QuerySupportedChainsResponse properties
   * @returns {JSON} - JSON Object.
   * @memberof QuerySupportedChainsResponse
   */
  public toJSON() {
    const chainsJSON: string[] = []
    this.supportedChains.forEach(chain => {
      chainsJSON.push(chain)
    })
    return JSON.parse(JSON.stringify(chainsJSON))
  }
  /**
   *
   * Check if the QuerySupportedChainsResponse object is valid
   * @returns {boolean} - True or false.
   * @memberof QuerySupportedChainsResponse
   */
  public isValid(): boolean {
    return this.supportedChains !== undefined
  }
}
