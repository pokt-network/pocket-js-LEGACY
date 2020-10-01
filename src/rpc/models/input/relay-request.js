"use strict";
exports.__esModule = true;
var relay_proof_1 = require("../relay-proof");
var relay_payload_1 = require("./relay-payload");
/**
 *
 *
 * @class RelayRequest
 */
var RelayRequest = /** @class */ (function () {
    /**
     * Relay Request.
     * @constructor
     * @param {RelayPayload} payload - Relay payload.
     * @param {RelayProof} proof - Proof object.
     */
    function RelayRequest(payload, proof) {
        this.payload = payload;
        this.proof = proof;
        if (!this.isValid()) {
            throw new TypeError("Invalid RelayRequest properties.");
        }
    }
    /**
     *
     * Creates a RelayRequest object using a JSON string
     * @param {String} json - JSON string.
     * @returns {RelayRequest} - RelayRequest object.
     * @memberof RelayRequest
     */
    RelayRequest.fromJSON = function (json) {
        try {
            var jsonObject = JSON.parse(json);
            return new RelayRequest(relay_payload_1.RelayPayload.fromJSON(JSON.stringify(jsonObject.payload)), relay_proof_1.RelayProof.fromJSON(JSON.stringify(jsonObject.proof)));
        }
        catch (error) {
            throw error;
        }
    };
    /**
     *
     * Creates a JSON object with the RelayRequest properties
     * @returns {JSON} - JSON Object.
     * @memberof RelayRequest
     */
    RelayRequest.prototype.toJSON = function () {
        return {
            payload: this.payload.toJSON(),
            relayProof: this.proof.toJSON()
        };
    };
    /**
     *
     * Check if the RelayRequest object is valid
     * @returns {boolean} - True or false.
     * @memberof RelayRequest
     */
    RelayRequest.prototype.isValid = function () {
        return this.payload.isValid() && this.proof.isValid();
    };
    return RelayRequest;
}());
exports.RelayRequest = RelayRequest;
