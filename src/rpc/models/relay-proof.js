"use strict";
exports.__esModule = true;
var aat_js_1 = require("@pokt-network/aat-js");
var utils_1 = require("../../utils");
var js_sha3_1 = require("js-sha3");
/**
 *
 *
 * @class Proof
 */
var RelayProof = /** @class */ (function () {
    /**
     * Proof.
     * @constructor
     * @param {BigInt} entropy - Index entropy value.
     * @param {BigInt} sessionBlockHeight - Session Block Height.
     * @param {string} servicePubKey - Service Public Key.
     * @param {string} blockchain - Blockchain hash.
     * @param {PocketAAT} token - Application Authentication Token object.
     * @param {string} signature - Proof's signature.
     */
    function RelayProof(entropy, sessionBlockHeight, servicePubKey, blockchain, token, signature) {
        this.entropy = entropy;
        this.sessionBlockHeight = sessionBlockHeight;
        this.servicePubKey = servicePubKey;
        this.blockchain = blockchain;
        this.token = token;
        this.signature = signature;
        if (!this.isValid()) {
            throw new TypeError("Invalid Proof properties.");
        }
    }
    /**
     *
     * Creates a Proof object using a JSON string
     * @param {string} json - JSON string.
     * @returns {RelayProof} - Proof object.
     * @memberof Proof
     */
    RelayProof.fromJSON = function (json) {
        try {
            var jsonObject = JSON.parse(json);
            var pocketAAT = void 0;
            if (jsonObject.aat !== undefined) {
                pocketAAT = new aat_js_1.PocketAAT(jsonObject.aat.version, jsonObject.aat.client_pub_key, jsonObject.aat.app_pub_key, jsonObject.aat.signature);
                return new RelayProof(jsonObject.entropy, jsonObject.session_block_height, jsonObject.servicer_pub_key, jsonObject.blockchain, pocketAAT, jsonObject.signature);
            }
            else {
                throw new Error("Failed to retrieve PocketAAT, property is undefined");
            }
        }
        catch (error) {
            throw new Error("Failed to retrieve PocketAAT for Proof with error: " + error);
        }
    };
    /**
     *
     * Creates a Proof object using a JSON string
     * @param {BigInt} entropy - Entropy big int value.
     * @param {BigInt} sessionBlockHeight - Session Block Height.
     * @param {string} servicePubKey - Service Public Key.
     * @param {string} blockchain - Blockchain hash.
     * @param {PocketAAT} token - PocketAAT token.
     * @returns {Buffer} - Buffer.
     * @memberof RelayProof
     */
    RelayProof.bytes = function (entropy, sessionBlockHeight, servicePubKey, blockchain, token) {
        var proofJSON = {
            entropy: Number(entropy.toString()),
            session_block_height: Number(sessionBlockHeight.toString()),
            servicer_pub_key: servicePubKey,
            blockchain: blockchain,
            signature: "",
            token: RelayProof.hashAAT(token)
        };
        var proofJSONStr = JSON.stringify(proofJSON);
        // Hash proofJSONStr
        var hash = js_sha3_1.sha3_256.create();
        hash.update(proofJSONStr);
        return Buffer.from(hash.hex(), "hex");
    };
    /**
     *
     * Creates a Proof object using a JSON string
     * @param {PocketAAT} aat - PocketAAT token.
     * @returns {string} - PocketAAT Hash.
     * @memberof RelayProof
     */
    RelayProof.hashAAT = function (aat) {
        var aatObj = {
            version: aat.version,
            app_pub_key: aat.applicationPublicKey,
            client_pub_key: aat.clientPublicKey,
            signature: ""
        };
        // Generate sha3 hash of the aat payload object
        var hash = js_sha3_1.sha3_256.create();
        hash.update(JSON.stringify(aatObj));
        return hash.hex();
    };
    /**
     *
     * Creates a JSON object with the Proof properties
     * @returns {JSON} - JSON Object.
     * @memberof Proof
     */
    RelayProof.prototype.toJSON = function () {
        return {
            entropy: Number(this.entropy.toString()),
            session_block_height: Number(this.sessionBlockHeight.toString()),
            servicer_pub_key: this.servicePubKey,
            blockchain: this.blockchain,
            aat: {
                version: this.token.version,
                app_pub_key: this.token.applicationPublicKey,
                client_pub_key: this.token.clientPublicKey,
                signature: this.token.applicationSignature
            },
            signature: this.signature
        };
    };
    /**
     *
     * Check if the Proof object is valid
     * @returns {boolean} - True or false.
     * @memberof Proof
     */
    RelayProof.prototype.isValid = function () {
        return this.blockchain.length !== 0 &&
            Number(this.entropy.toString()) !== undefined &&
            utils_1.Hex.isHex(this.servicePubKey) &&
            Number(this.sessionBlockHeight) > 0 &&
            this.token.isValid();
    };
    return RelayProof;
}());
exports.RelayProof = RelayProof;
