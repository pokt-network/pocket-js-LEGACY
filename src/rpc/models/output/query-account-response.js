"use strict";
exports.__esModule = true;
var utils_1 = require("../../../utils");
/**
 *
 *
 * @class QueryAccountResponse
 */
var QueryAccountResponse = /** @class */ (function () {
    /**
     * Query Account Response.
     * @constructor
     * @param {object} account - Current account object.
     */
    function QueryAccountResponse(address, balance, publicKey) {
        this.address = address;
        this.balance = balance;
        this.publicKey = publicKey;
        if (!this.isValid()) {
            throw new TypeError("Invalid QueryAccountResponse properties.");
        }
    }
    /**
     *
     * Creates a QueryAccountResponse object using a JSON string
     * @param {String} json - JSON string.
     * @returns {QueryAccountResponse} - QueryAccountResponse object.
     * @memberof QueryAccountResponse
     */
    QueryAccountResponse.fromJSON = function (json) {
        try {
            var rawObjValue = JSON.parse(json);
            var address = rawObjValue.address.toString();
            var balance = "0";
            var coins = rawObjValue.coins;
            if (coins && utils_1.typeGuard(coins, Array) && coins.length === 1) {
                var coinObj = coins[0];
                balance = coinObj.amount || "0";
            }
            var pubKeyObj = rawObjValue.public_key;
            var pubKeyValue = Buffer.from(pubKeyObj).toString("hex");
            return new QueryAccountResponse(address, balance, pubKeyValue);
        }
        catch (error) {
            throw error;
        }
    };
    /**
     *
     * Creates a JSON object with the QueryAccountResponse properties
     * @returns {JSON} - JSON Object.
     * @memberof QueryAccountResponse
     */
    QueryAccountResponse.prototype.toJSON = function () {
        return {
            "type": "posmint/Account",
            "value": {
                "address": this.address,
                "coins": [
                    {
                        "amount": this.balance,
                        "denom": "upokt"
                    }
                ],
                "public_key": {
                    "type": "crypto/ed25519_public_key",
                    "value": this.publicKey
                }
            }
        };
    };
    /**
     *
     * Check if the QueryAccountResponse object is valid
     * @returns {boolean} - True or false.
     * @memberof QueryAccountResponse
     */
    QueryAccountResponse.prototype.isValid = function () {
        var validAddress = utils_1.validateAddressHex(this.address) === undefined;
        var validPubKey = utils_1.validatePublicKey(Buffer.from(this.publicKey, "hex"));
        return validAddress && validPubKey;
    };
    return QueryAccountResponse;
}());
exports.QueryAccountResponse = QueryAccountResponse;
