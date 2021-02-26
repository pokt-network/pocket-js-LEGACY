
/**
 *
 *
 * @class RelayMeta
 */
export class RelayMeta {
    /**
     *
     * Creates a RelayMeta object using a JSON string
     * @param {string} json - JSON string.
     * @returns {RelayMeta} - RelayMeta object.
     * @memberof RelayMeta
     */
    public static fromJSON(json: string): RelayMeta {
        try {
            const jsonObject = JSON.parse(json)

            return new RelayMeta(
                BigInt(jsonObject.block_height)
            )
        } catch (error) {
            throw error
        }
    }

    public readonly blockHeight: BigInt

    /**
     * Relay Meta.
     * @constructor
     * @param {number} blockHeight - Block Height.
     */
    constructor(
        blockHeight: BigInt
    ) {
        this.blockHeight = blockHeight

        if (!this.isValid()) {
            throw new TypeError("Invalid RelayMeta properties.")
        }
    }
    /**
     *
     * Creates a JSON object with the RelayMeta properties
     * @returns {JSON} - JSON Object.
     * @memberof RelayMeta
     */
    public toJSON() {
        return {
            block_height: Number(this.blockHeight.toString())
        }
    }
    /**
     *
     * Check if the RelayMeta object is valid
     * @returns {boolean} - True or false.
     * @memberof RelayMeta
     */
    public isValid(): boolean {
        return (
            Number(this.blockHeight) > 0
        )
    }
}
