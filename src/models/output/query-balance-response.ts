
/**
 *
 *
 * @class QueryBalanceResponse
 */
export class QueryBalanceResponse {
    /**
   *
   * Creates a QueryBalanceResponse object using a JSON string
   * @param {String} json - JSON string.
   * @returns {QueryBalanceResponse} - QueryBalanceResponse object.
   * @memberof QueryBalanceResponse
   */
    public static fromJSON(json: string): QueryBalanceResponse {
        const jsonObject = JSON.parse(json);

        return new QueryBalanceResponse(
            jsonObject.balance
        );
    }

    public readonly balance: BigInt;

    /**
     * Relay Response.
     * @constructor
     * @param {Bigint} balance - Current network block balance.
     */
    constructor(
        balance: BigInt

    ) {
        this.balance = balance

        if (!this.isValid()) {
            throw new TypeError("Invalid properties length.");
        }
    }
    /**
   *
   * Creates a JSON object with the QueryBalanceResponse properties
   * @returns {JSON} - JSON Object.
   * @memberof QueryBalanceResponse
   */
    public toJSON() {
        return {"balance": this.balance}
    }
    /**
   *
   * Check if the QueryBalanceResponse object is valid
   * @returns {boolean} - True or false.
   * @memberof QueryBalanceResponse
   */
    public isValid(): boolean {
        return this.balance != undefined;
    }
}