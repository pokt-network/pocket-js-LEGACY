/**
 *
 *
 * @class RequestHash
 */
import {RelayPayload} from "./relay-payload"
import {RelayMeta} from "./relay-meta"

export class RequestHash {
    /**
     *
     * Creates a RequestHash object using a JSON string
     * @param {string} json - JSON string.
     * @returns {RequestHash} - RequestHash object.
     * @memberof RequestHash
     */
    public static fromJSON(json: string): RequestHash {
        try {
            const jsonObject = JSON.parse(json)

            return new RequestHash(
                RelayPayload.fromJSON(jsonObject.payload),
                RelayMeta.fromJSON(jsonObject.meta)
            )
        } catch (error) {
            throw error
        }
    }

    public readonly payload: RelayPayload
    public readonly meta: RelayMeta

    /**
     * Request Hash.
     * @constructor
     * @param {RelayPayload} payload - RelayPayload object.
     * @param {RelayMeta} meta - RelayMeta object.
     */
    constructor(
        payload: RelayPayload,
        meta: RelayMeta
    ) {
        this.payload = payload
        this.meta = meta

        if (!this.isValid()) {
            throw new TypeError("Invalid RequestHash properties.")
        }
    }
    /**
     *
     * Creates a JSON object with the RequestHash properties
     * @returns {JSON} - JSON Object.
     * @memberof RelayMeta
     */
    public toJSON() {
        return {
            payload: this.payload.toJSON(),
            meta: this.meta.toJSON()
        }
    }
    /**
     *
     * Check if the RequestHash object is valid
     * @returns {boolean} - True or false.
     * @memberof RequestHash
     */
    public isValid(): boolean {
        return (
            this.payload.isValid() && this.meta.isValid()
        )
    }
}
