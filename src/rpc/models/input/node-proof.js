"use strict";
exports.__esModule = true;
var utils_1 = require("../../../utils");
/**
 *
 *
 * @class NodeProof
 */
var NodeProof = /** @class */ (function () {
    /**
     * Node Proof.
     * @constructor
     * @param {string} address - Node address.
     * @param {string} blockchain - Blockchain hash.
     * @param {string} appPubKey - Application Key associated with a client.
     * @param {BigInt} SBlockHeight - Session Block Height.
     * @param {BigInt} height - Height of session.
     */
    function NodeProof(address, blockchain, appPubKey, SBlockHeight, height) {
        this.address = address;
        this.blockchain = blockchain;
        this.appPubKey = appPubKey;
        this.SBlockHeight = SBlockHeight;
        this.height = height;
        if (!this.isValid()) {
            throw new TypeError("Invalid NodeProof properties.");
        }
    }
    /**
     *
     * Creates a NodeProof object using a JSON string
     * @param {String} json - JSON string.
     * @returns {NodeProof} - NodeProof object.
     * @memberof NodeProof
     */
    NodeProof.fromJSON = function (json) {
        try {
            var jsonObject = JSON.parse(json);
            return new NodeProof(jsonObject.address, jsonObject.blockchain, jsonObject.app_pubkey, BigInt(jsonObject.session_block_height), BigInt(jsonObject.height));
        }
        catch (error) {
            throw error;
        }
    };
    /**
     *
     * Creates a JSON object with the NodeProof properties
     * @returns {JSON} - JSON Object.
     * @memberof NodeProof
     */
    NodeProof.prototype.toJSON = function () {
        return {
            address: this.address,
            app_pubkey: this.appPubKey,
            blockchain: this.blockchain,
            height: Number(this.height.toString()),
            session_block_height: Number(this.SBlockHeight.toString())
        };
    };
    /**
     *
     * Check if the NodeProof object is valid
     * @returns {boolean} - True or false.
     * @memberof NodeProof
     */
    NodeProof.prototype.isValid = function () {
        return (utils_1.Hex.isHex(this.address) &&
            utils_1.Hex.byteLength(this.address) === 20 &&
            this.blockchain.length !== 0 &&
            utils_1.Hex.isHex(this.appPubKey) &&
            utils_1.Hex.byteLength(this.appPubKey) === 32 &&
            this.SBlockHeight !== undefined &&
            this.height !== undefined);
    };
    return NodeProof;
}());
exports.NodeProof = NodeProof;
