"use strict";
exports.__esModule = true;
var relay_proof_1 = require("../relay-proof");
/**
 *
 *
 * @class RelayResponse
 */
var RelayResponse = /** @class */ (function () {
    /**
     * Relay Response.
     * @constructor
     * @param {string} signature - Signature.
     * @param {string} response - Response string.
     * @param {RelayProof} proof - Proof object.
     */
    function RelayResponse(signature, response, proof) {
        this.signature = signature;
        this.response = response;
        this.proof = proof;
        if (!this.isValid()) {
            throw new TypeError("Invalid RelayResponse properties.");
        }
    }
    /**
     *
     * Creates a RelayResponse object using a JSON string
     * @param {String} json - JSON string.
     * @returns {RelayResponse} - RelayResponse object.
     * @memberof RelayResponse
     */
    RelayResponse.fromJSON = function (json) {
        try {
            var jsonObject = JSON.parse(json);
            var proof = relay_proof_1.RelayProof.fromJSON(JSON.stringify(jsonObject.RelayProof));
            return new RelayResponse(jsonObject.signature, jsonObject.payload, proof);
        }
        catch (error) {
            throw error;
        }
    };
    /**
     *
     * Creates a JSON object with the RelayResponse properties
     * @returns {JSON} - JSON Object.
     * @memberof RelayResponse
     */
    RelayResponse.prototype.toJSON = function () {
        return {
            proof: this.proof.toJSON(),
            response: this.response,
            signature: this.signature
        };
    };
    /**
     *
     * Check if the RelayResponse object is valid
     * @returns {boolean} - True or false.
     * @memberof RelayResponse
     */
    RelayResponse.prototype.isValid = function () {
        return (this.signature.length !== 0 &&
            this.proof.isValid() &&
            this.response.length !== 0);
    };
    return RelayResponse;
}());
exports.RelayResponse = RelayResponse;
