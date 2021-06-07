
/**
 *
 *
 * @class QueryUpgradeResponse
 */
 export class QueryUpgradeResponse {
    /**
     *
     * Creates a QueryUpgradeResponse object using a JSON string
     * @param {String} json - JSON string.
     * @returns {QueryUpgradeResponse} - QueryUpgradeResponse object.
     * @memberof QueryUpgradeResponse
     */
    public static fromJSON(json: string): QueryUpgradeResponse {
      try {
        const rawObjValue = JSON.parse(json)
        
        const height = BigInt(rawObjValue.Height !== undefined ? rawObjValue.Height : rawObjValue.height)
        const version = rawObjValue.Version !== undefined ? rawObjValue.Version : rawObjValue.version
  
        return new QueryUpgradeResponse(
          height,
          version
        )
      } catch (error) {
        throw error
      }
    }
  
    public readonly height: BigInt
    public readonly version: string
  
    /**
     * Query all parameters Response.
     * @constructor
     * @param {BigInt} height - Application parameter list.
     * @param {string} version - Auth parameter list.
     */
    constructor(
      height: BigInt,
      version: string
    ) {
      this.height = height
      this.version = version
  
      if (!this.isValid()) {
        throw new TypeError("Invalid QueryUpgradeResponse properties.")
      }
    }
    /**
     *
     * Creates a JSON object with the QueryUpgradeResponse properties
     * @returns {JSON} - JSON Object.
     * @memberof QueryUpgradeResponse
     */
    public toJSON() {
      return {
        height: Number(this.height.toString()),
        version: this.version
      }
    }
    /**
     *
     * Check if the QueryUpgradeResponse object is valid
     * @returns {boolean} - True or false.
     * @memberof QueryUpgradeResponse
     */
    public isValid(): boolean {
      return true
    }
  }
  