/**
 *
 *
 * @class PocketParams
 */
export class PocketParams {
    /**
   *
   * Creates a PocketParams object using a JSON string
   * @param {String} json - JSON string.
   * @returns {PocketParams} - PocketParams object.
   * @memberof PocketParams
   */
    public static fromJSON(json: string): PocketParams {
        const jsonObject = JSON.parse(json);
        
        return new PocketParams(
            jsonObject.session_node_ount,
            jsonObject.proof_waiting_period,
            jsonObject.supported_blockchains,
            jsonObject.claim_expiration
        );
    }

    public readonly sessionNodeCount: BigInt;
    public readonly proofWaitingPeriod: BigInt;
    public readonly supportedBlockchains: string[];
    public readonly claimExpiration: BigInt;

    /**
     * PocketParams.
     * @constructor
     * @param {BigInt} sessionNodeCount - Session node count.
     * @param {BigInt} proofWaitingPeriod - Proof waiting period.
     * @param {string[]} supportedBlockchains - Supported blockchain array.
     * @param {BigInt} claimExpiration - Claim expiration.
     */
    constructor(
        sessionNodeCount: BigInt,
        proofWaitingPeriod: BigInt,
        supportedBlockchains: string[],
        claimExpiration: BigInt
    ) {
        this.sessionNodeCount = sessionNodeCount;
        this.proofWaitingPeriod = proofWaitingPeriod;
        this.supportedBlockchains = supportedBlockchains;
        this.claimExpiration = claimExpiration;

        if (!this.isValid()) {
            throw new TypeError("Invalid properties length.");
        }
    }
    /**
   *
   * Creates a JSON object with the PocketParams properties
   * @returns {JSON} - JSON Object.
   * @memberof PocketParams
   */
    public toJSON() {
        return {
            "session_node_count": this.sessionNodeCount,
            "proof_waiting_period": this.proofWaitingPeriod,
            "supported_blockchains": this.supportedBlockchains,
            "claim_expiration": this.claimExpiration
        }
    }
    /**
   *
   * Check if the PocketParams object is valid
   * @returns {boolean} - True or false.
   * @memberof PocketParams
   */
    public isValid(): boolean {
        for (let key in this) {
            if (!this.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }
}