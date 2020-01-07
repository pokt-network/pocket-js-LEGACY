import { Blockchain } from "./blockchain";

/**
 *
 *
 * @class Proof
 */
export class Proof {
    /**
   *
   * Creates a Proof object using a JSON string
   * @param {String} json - JSON string.
   * @returns {Proof} - Proof object.
   * @memberof Proof
   */
    public static fromJSON(json: string): Proof {
        const jsonObject = JSON.parse(json);

        return new Proof(
            jsonObject.index,
            jsonObject.sessionBlockHeight,
            jsonObject.servicePubKey,
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
     * @param {string} servicePubKey - Service Public Key.
     * @param {string} blockchain - Blockchain hex string.
     * @param {AAT} token - Application Authentication Token.
     * @param {string} signature - Proof's signature.
     */
    constructor(
        index: BigInt,
        sessionBlockHeight: BigInt,
        servicePubKey: string,
        blockchain: string,
        token: string,
        signature: string
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
            "Index": this.index,
            "SessionBlockHeight": this.sessionBlockHeight,
            "ServicePubKey": this.servicePubKey,
            "Blockchain": this.blockchain,
            "Token": this.token,
            "Signature": this.signature
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