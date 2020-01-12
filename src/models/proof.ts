
/**
 *
 *
 * @class Proof
 */
export class Proof {
    /**
   *
   * Creates a Proof object using a JSON String
   * @param {String} json - JSON String.
   * @returns {Proof} - Proof object.
   * @memberof Proof
   */
    public static fromJSON(json: String): Proof {
        const jsonObject = JSON.parse(json);

        return new Proof(
            jsonObject.index,
            jsonObject.session_block_height,
            jsonObject.service_pub_key,
            jsonObject.blockchain,
            jsonObject.token,
            jsonObject.signature
        );
    }

    public readonly index: BigInt;
    public readonly sessionBlockHeight: BigInt;
    public readonly servicePubKey: String;
    public readonly blockchain: String;
    public readonly token: String;
    public readonly signature: String;

    /**
     * Proof.
     * @constructor
     * @param {BigInt} index - Index value.
     * @param {BigInt} sessionBlockHeight - Session Block Height.
     * @param {String} servicePubKey - Service Public Key.
     * @param {String} blockchain - Blockchain hash.
     * @param {AAT} token - Application Authentication Token.
     * @param {String} signature - Proof's signature.
     */
    constructor(
        index: BigInt,
        sessionBlockHeight: BigInt,
        servicePubKey: String,
        blockchain: String,
        token: String,
        signature: String
    ) {
        this.index = index
        this.sessionBlockHeight = sessionBlockHeight
        this.servicePubKey = servicePubKey
        this.blockchain = blockchain
        this.token = token
        this.signature = signature

        if (!this.isValid()) {
            throw new TypeError("Invalid properties length.");
        }
    }
    /**
   *
   * Creates a JSON object with the Proof properties
   * @returns {JSON} - JSON Object.
   * @memberof Proof
   */
    public toJSON() {
        return {
            "index": this.index,
            "session_block_height": this.sessionBlockHeight,
            "service_pub_key": this.servicePubKey,
            "blockchain": this.blockchain,
            "token": this.token,
            "signature": this.signature
        }
    }
    /**
   *
   * Check if the Proof object is valid
   * @returns {boolean} - True or false.
   * @memberof Proof
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