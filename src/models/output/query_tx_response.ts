import { Transaction } from "../transaction";

/**
 *
 *
 * @class QueryTXResponse
 */
export class QueryTXResponse {
    /**
   *
   * Creates a QueryTXResponse object using a JSON string
   * @param {String} json - JSON string.
   * @returns {QueryTXResponse} - QueryTXResponse object.
   * @memberof QueryTXResponse
   */
    public static fromJSON(json: string): QueryTXResponse {
        const jsonObject = JSON.parse(json);

        return new QueryTXResponse(
            Transaction.fromJSON(jsonObject)
        );
    }

    public readonly transaction: Transaction;

    /**
     * Query Transaction Response.
     * @constructor
     * @param {Transaction} transaction - Transaction object.
     */
    constructor(
        transaction: Transaction
    ) {
        this.transaction = transaction

        if (!this.isValid()) {
            throw new TypeError("Invalid properties length.");
        }
    }
    /**
   *
   * Creates a JSON object with the QueryTXResponse properties
   * @returns {JSON} - JSON Object.
   * @memberof QueryTXResponse
   */
    public toJSON() {
        return this.transaction.toJSON();
    }
    /**
   *
   * Check if the QueryTXResponse object is valid
   * @returns {boolean} - True or false.
   * @memberof QueryTXResponse
   */
    public isValid(): boolean {
        return this.transaction.isValid();
    }
}