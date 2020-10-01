"use strict";
exports.__esModule = true;
var bond_status_1 = require("./bond-status");
var __1 = require("../..");
/**
 *
 *
 * @class Application
 */
var Application = /** @class */ (function () {
    /**
     * Creates a Application.
     * @constructor
     * @param {string} address - the hex address of the validator
     * @param {string} publicKey - the hex consensus public key of the validator.
     * @param {boolean} jailed - has the validator been jailed from staked status?
     * @param {BondStatus} status - validator status
     * @param {string[]} chains - chains
     * @param {BigInt} stakedTokens - how many staked tokens
     * @param {string} maxRelays - Service Application url
     * @param {string} unstakingCompletionTime - if unstaking, min time for the validator to complete unstaking
     */
    function Application(address, publicKey, jailed, status, chains, stakedTokens, maxRelays, unstakingCompletionTime) {
        if (chains === void 0) { chains = []; }
        if (unstakingCompletionTime === void 0) { unstakingCompletionTime = ""; }
        this.address = address;
        this.publicKey = publicKey;
        this.jailed = jailed;
        this.status = status;
        this.chains = chains;
        this.stakedTokens = stakedTokens;
        this.maxRelays = maxRelays;
        this.unstakingCompletionTime = unstakingCompletionTime;
        if (!this.isValid()) {
            throw new TypeError("Invalid Application properties.");
        }
    }
    /**
     *
     * Creates a Application object using a JSON string
     * @param {String} json - JSON string.
     * @returns {Application} - Application object.
     * @memberof Application
     */
    Application.fromJSON = function (json) {
        try {
            var jsonObject = JSON.parse(json);
            var status_1 = bond_status_1.BondStatusUtil.getStatus(jsonObject.status);
            return new Application(jsonObject.address, jsonObject.public_key, jsonObject.jailed, status_1, jsonObject.chains, BigInt(jsonObject.staked_tokens), BigInt(jsonObject.max_relays), jsonObject.unstaking_time);
        }
        catch (error) {
            throw error;
        }
    };
    /**
     *
     * Creates a JSON object with the Application properties
     * @returns {JSON} - JSON Object.
     * @memberof Application
     */
    Application.prototype.toJSON = function () {
        return {
            address: this.address,
            chains: this.chains,
            public_key: this.publicKey,
            jailed: this.jailed,
            max_relays: Number(this.maxRelays.toString()),
            status: this.status,
            staked_tokens: Number(this.stakedTokens.toString()),
            unstaking_time: this.unstakingCompletionTime
        };
    };
    /**
     *
     * Verify if all properties are valid
     * @returns {boolean} - True or false.
     * @memberof Application
     */
    Application.prototype.isValid = function () {
        return __1.Hex.isHex(this.address) &&
            __1.Hex.byteLength(this.address) === 20 &&
            this.chains.length > 0 &&
            __1.Hex.isHex(this.publicKey) &&
            __1.Hex.byteLength(this.publicKey) === 32 &&
            this.jailed !== undefined &&
            Number(this.maxRelays.toString()) >= 0 &&
            this.status !== undefined &&
            Number(this.stakedTokens.toString()) >= 0;
    };
    return Application;
}());
exports.Application = Application;
