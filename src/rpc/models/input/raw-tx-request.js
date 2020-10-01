"use strict";
exports.__esModule = true;
var utils_1 = require("../../../utils");
/**
 * Represents a /v1/rawtx RPC request
 */
var RawTxRequest = /** @class */ (function () {
    /**
     * Constructor for this class
     * @param {string} address - The address hex of the sender
     * @param {string} txHex - The transaction bytes in hex format
     */
    function RawTxRequest(address, txHex) {
        this.address = address;
        this.txHex = txHex;
        var errorOrUndefined = utils_1.validateAddressHex(address);
        if (utils_1.typeGuard(errorOrUndefined, Error)) {
            throw errorOrUndefined;
        }
        else if (!utils_1.Hex.isHex(txHex)) {
            throw new Error("Invalid transaction hex");
        }
    }
    /**
     * Util function to create a RawTxRequest using Buffer or strings
     * @param {Buffer | string} address - The address hex of the sender
     * @param {Buffer | string} tx - The transaction bytes
     * @returns {RawTxRequest} - Raw transaction request object.
     * @memberof RawTxRequest
     */
    RawTxRequest["with"] = function (address, tx) {
        var addrParam = utils_1.typeGuard(address, Buffer) ? address.toString('hex') : address;
        var txParam = utils_1.typeGuard(tx, Buffer) ? tx.toString('hex') : tx;
        return new RawTxRequest(addrParam, txParam);
    };
    /**
     * JSON representation of this model
     * @returns {object} The JSON request specified by the /v1/rawtx RPC call
     * @memberof RawTxRequest
     */
    RawTxRequest.prototype.toJSON = function () {
        return {
            address: this.address,
            raw_hex_bytes: this.txHex
        };
    };
    return RawTxRequest;
}());
exports.RawTxRequest = RawTxRequest;
