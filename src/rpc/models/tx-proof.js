"use strict";
exports.__esModule = true;
var simple_proof_1 = require("./simple-proof");
/**
 *
 *
 * @class TxProof
 */
var TxProof = /** @class */ (function () {
    /**
     * TxProof.
     * @constructor
     * @param {string} rootHash - Root hash.
     * @param {string} data - Hash holding the current tx proof data.
     * @param {SimpleProof} proof - Simple proof object.
     */
    function TxProof(rootHash, data, proof) {
        this.rootHash = rootHash;
        this.data = data;
        this.proof = proof;
        if (!this.isValid()) {
            throw new TypeError("Invalid TxProof properties.");
        }
    }
    /**
     *
     * Creates a TxProof object using a JSON string
     * @param {string} json - JSON string.
     * @returns {TxProof} - TxProof object.
     * @memberof TxProof
     */
    TxProof.fromJSON = function (json) {
        try {
            var jsonObject = JSON.parse(json);
            return new TxProof(jsonObject.root_hash, jsonObject.data, simple_proof_1.SimpleProof.fromJSON(JSON.stringify(jsonObject.proof)));
        }
        catch (error) {
            throw error;
        }
    };
    /**
     *
     * Creates a JSON object with the TxProof properties
     * @returns {JSON} - JSON Object.
     * @memberof TxProof
     */
    TxProof.prototype.toJSON = function () {
        return {
            data: this.data,
            proof: this.proof.toJSON(),
            root_hash: this.rootHash
        };
    };
    /**
     *
     * Check if the TxProof object is valid
     * @returns {boolean} - True or false.
     * @memberof TxProof
     */
    TxProof.prototype.isValid = function () {
        return true;
    };
    return TxProof;
}());
exports.TxProof = TxProof;
