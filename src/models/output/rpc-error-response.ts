/**
 *
 *
 * @class RpcErrorResponse
 */
export class RpcErrorResponse {
    /**
   *
   * Creates a RpcErrorResponse object using a JSON string
   * @param {String} json - JSON string.
   * @returns {RpcErrorResponse} - RpcErrorResponse object.
   * @memberof RpcErrorResponse
   */
    public static fromJSON(json: string): RpcErrorResponse {
        const jsonObject = JSON.parse(json);

        return new RpcErrorResponse(
            jsonObject.code,
            jsonObject.message
        );
    }

    public readonly code: String;
    public readonly message: String;

    /**
     * Relay Response.
     * @constructor
     * @param {String} code - Error code.
     * @param {String} message - Error message.
     */
    constructor(
        code: String,
        message: String,

    ) {
        this.code = code
        this.message = message

        if (!this.isValid()) {
            throw new TypeError("Invalid properties length.");
        }
    }
    /**
   *
   * Creates a JSON object with the RpcErrorResponse properties
   * @returns {JSON} - JSON Object.
   * @memberof RpcErrorResponse
   */
    public toJSON() {
        return {
            "code": this.code,
            "message": this.message
        }
    }
    /**
   *
   * Check if the RpcErrorResponse object is valid
   * @returns {boolean} - True or false.
   * @memberof RpcErrorResponse
   */
    public isValid(): boolean {
        return this.code.length !== 0 && this.code 
        != "" && this.message != "" && this.message.length !== 0;
    }
}