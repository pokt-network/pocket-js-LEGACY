import { Blockchain } from "../blockchain";

/**
 *
 *
 * @class NodeProof
 */
export class NodeProof {
    /**
   *
   * Creates a NodeProof object using a JSON string
   * @param {String} json - JSON string.
   * @returns {NodeProof} - NodeProof object.
   * @memberof NodeProof
   */
    public static fromJSON(json: string): NodeProof {
        const jsonObject = JSON.parse(json);

        return new NodeProof(
            jsonObject.address,
            jsonObject.blockchain,
            jsonObject.app_pubkey,
            jsonObject.session_block_height,
            jsonObject.height
        );
    }

    public readonly address: string;
    public readonly blockchain: Blockchain;
    public readonly app_pubkey: string;
    public readonly session_block_height: BigInt;
    public readonly height: BigInt;

    /**
     * Node Proof.
     * @constructor
     * @param {string} address - Node address.
     * @param {Blockchain} blockchain - Blockchain information.
     * @param {string} app_pubkey - Application Key associated with a client.
     * @param {BigInt} session_block_height - Session Block Height.
     * @param {BigInt} height - Height of session.
     */
    constructor(
        address: string,
        blockchain: Blockchain,
        app_pubkey: string,
        session_block_height: BigInt,
        height: BigInt,
    ) {
        this.address = address
        this.blockchain = blockchain
        this.app_pubkey = app_pubkey
        this.session_block_height = session_block_height
        this.height = height

        if (!this.isValid()) {
            throw new TypeError("Invalid properties length.");
        }
    }
    /**
   *
   * Creates a JSON object with the NodeProof properties
   * @returns {JSON} - JSON Object.
   * @memberof NodeProof
   */
    public toJSON() {
        return {
            "Blockchain": this.blockchain.name,
            "AppPubKey": this.app_pubkey,
            "Address": this.address,
            "SBlockHeight": this.session_block_height,
            "Height": this.height
        }
    }
    /**
   *
   * Check if the NodeProof object is valid
   * @returns {boolean} - True or false.
   * @memberof NodeProof
   */
    private isValid(): boolean {
        return this.address.length !== 0 && this.blockchain.isValid() && this.app_pubkey.length !== 0;
    }
}