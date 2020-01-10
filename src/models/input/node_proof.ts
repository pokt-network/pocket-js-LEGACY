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
            new Blockchain(jsonObject.blockchain,""),//TODO: Confirm if the blockchain json property is a hash
            jsonObject.app_pubkey,
            jsonObject.session_block_height,
            jsonObject.height
        );
    }

    public readonly address: string;
    public readonly blockchain: Blockchain;
    public readonly appPubKey: string;
    public readonly SBlockHeight: BigInt;
    public readonly height: BigInt;

    /**
     * Node Proof.
     * @constructor
     * @param {string} address - Node address.
     * @param {Blockchain} blockchain - Blockchain information.
     * @param {string} appPubKey - Application Key associated with a client.
     * @param {BigInt} SBlockHeight - Session Block Height.
     * @param {BigInt} height - Height of session.
     */
    constructor(
        address: string,
        blockchain: Blockchain,
        appPubKey: string,
        SBlockHeight: BigInt,
        height: BigInt,
    ) {
        this.address = address
        this.blockchain = blockchain
        this.appPubKey = appPubKey
        this.SBlockHeight = SBlockHeight
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
            "address": this.address,
            "blockchain": this.blockchain.name,
            "app_pubkey": this.appPubKey,
            "session_block_height": this.SBlockHeight,
            "height": this.height
        }
    }
    /**
   *
   * Check if the NodeProof object is valid
   * @returns {boolean} - True or false.
   * @memberof NodeProof
   */
    private isValid(): boolean {
        return this.address.length !== 0 && this.blockchain.isValid() && this.appPubKey.length !== 0 
        && this.SBlockHeight != undefined && this.height != undefined;
    }
}