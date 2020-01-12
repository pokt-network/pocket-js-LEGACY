
// Http headers map type
export type RelayHeaders = Record<string, string>;

/**
 *
 *
 * @class RelayPayload
 */
export class RelayPayload {
    /**
   *
   * Creates a RelayPayload object using a JSON string
   * @param {String} json - JSON string.
   * @returns {RelayPayload} - RelayPayload object.
   * @memberof RelayPayload
   */
    public static fromJSON(json: string): RelayPayload {
        const jsonObject = JSON.parse(json);

        return new RelayPayload(
            jsonObject.data,
            jsonObject.method,
            jsonObject.path,
            jsonObject.headers
        );
    }

    public readonly data: String;
    public readonly method: String;
    public readonly path: String;
    public readonly headers: RelayHeaders;

    /**
     * Relay Response.
     * @constructor
     * @param {String} data - The actual data String for the external chain.
     * @param {String} method - The http CRUD method.
     * @param {String} path - The REST pathx.
     * @param {RelayHeaders} headers - Http headers.
     */
    constructor(
        data: String,
        method: String,
        path: String,
        headers: RelayHeaders
    ) {
        this.data = data;
        this.method = method;
        this.path = path;
        this.headers = headers;

        if (!this.isValid()) {
            throw new TypeError("Invalid properties length.");
        }
    }
    /**
   *
   * Creates a JSON object with the RelayPayload properties
   * @returns {JSON} - JSON Object.
   * @memberof RelayPayload
   */
    public toJSON() {
        return {
            "data": this.data,
            "method": this.method,
            "path": this.path,
            "headers": this.headers
        }
    }
    /**
   *
   * Check if the RelayPayload object is valid
   * @returns {boolean} - True or false.
   * @memberof RelayPayload
   */
    public isValid(): boolean {
        return this.data.length !== 0 
            && this.method.length !== 0
            && this.path.length !== 0
            && this.headers != undefined;
    }
}