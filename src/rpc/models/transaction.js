"use strict";
exports.__esModule = true;
var hex_1 = require("../../utils/hex");
var tx_proof_1 = require("./tx-proof");
/**
 *
 *
 * @class Transaction
 */
var Transaction = /** @class */ (function () {
    /**
     * Transaction.
     * @constructor
     * @param {string} hash - Transaction hash.
     * @param {BigInt} height - Session Block Height.
     * @param {BigInt} index - Transaction index in the block.
     * @param {Hex} tx - Transaction hex.
     * @param {TxProof} proof - Transaction Proof.
     */
    function Transaction(hash, height, index, tx, proof) {
        this.hash = hash;
        this.height = height;
        this.index = index;
        this.tx = tx;
        this.proof = proof;
        if (!this.isValid()) {
            throw new TypeError("Invalid Transaction properties.");
        }
    }
    /**
     *
     * Creates a Transaction object using a JSON string
     * @param {string} json - JSON string.
     * @returns {Transaction} - Transaction object.
     * @memberof Transaction
     */
    Transaction.fromJSON = function (json) {
        try {
            var jsonObject = JSON.parse(json);
            return new Transaction(jsonObject.hash, BigInt(jsonObject.height), BigInt(jsonObject.index), jsonObject.tx, tx_proof_1.TxProof.fromJSON(JSON.stringify(jsonObject.proof)));
        }
        catch (error) {
            throw error;
        }
    };
    /**
     *
     * Creates a JSON object with the Transaction properties
     * @returns {JSON} - JSON Object.
     * @memberof Transaction
     */
    Transaction.prototype.toJSON = function () {
        return {
            hash: this.hash,
            height: Number(this.height.toString()),
            index: Number(this.index.toString()),
            proof: this.proof.toJSON(),
            tx: this.tx
        };
    };
    /**
     *
     * Check if the Transaction object is valid
     * @returns {boolean} - True or false.
     * @memberof Transaction
     */
    Transaction.prototype.isValid = function () {
        return hex_1.Hex.isHex(this.hash) &&
            Number(this.height.toString()) >= 0 &&
            Number(this.index.toString()) >= 0 &&
            this.tx !== undefined;
    };
    return Transaction;
}());
exports.Transaction = Transaction;
