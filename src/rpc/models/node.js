"use strict";
exports.__esModule = true;
var bond_status_1 = require("./bond-status");
var hex_1 = require("../../utils/hex");
/**
 *
 *
 * @class Node
 */
var Node = /** @class */ (function () {
    /**
     * Creates a Node.
     * @constructor
     * @param {string} address - the hex address of the validator
     * @param {string} publicKey - the hex consensus public key of the validator.
     * @param {boolean} jailed - has the validator been jailed from staked status?
     * @param {BondStatus} status - validator status
     * @param {BigInt} stakedTokens - how many staked tokens
     * @param {URL} serviceURL - Service node url
     * @param {string[]} chains - chains
     * @param {string} unstakingCompletionTime - if unstaking, min time for the validator to complete unstaking
     */
    function Node(address, publicKey, jailed, status, stakedTokens, serviceURL, chains, unstakingCompletionTime) {
        if (chains === void 0) { chains = []; }
        if (unstakingCompletionTime === void 0) { unstakingCompletionTime = ""; }
        this.address = address;
        this.publicKey = publicKey;
        this.jailed = jailed;
        this.status = status;
        this.stakedTokens = stakedTokens;
        this.serviceURL = new URL(serviceURL);
        this.chains = chains;
        this.unstakingCompletionTime = unstakingCompletionTime;
        if (!this.isValid()) {
            throw new TypeError("Invalid Node properties.");
        }
    }
    Node.fromJSON = function (json) {
        try {
            var rawObjValue = JSON.parse(json);
            var status_1 = bond_status_1.BondStatusUtil.getStatus(rawObjValue.status);
            return new Node(rawObjValue.address, rawObjValue.public_key, rawObjValue.jailed, status_1, BigInt(rawObjValue.tokens), rawObjValue.service_url, rawObjValue.chains, rawObjValue.unstaking_time);
        }
        catch (error) {
            throw error;
        }
    };
    /**
     *
     * Creates a JSON object with the Node properties
     * @returns {JSON} - JSON Object.
     * @memberof Node
     */
    Node.prototype.toJSON = function () {
        return {
            address: this.address,
            chains: this.chains,
            public_key: this.publicKey,
            jailed: this.jailed,
            service_url: this.serviceURL,
            status: this.status.toString(),
            tokens: Number(this.stakedTokens.toString()),
            unstaking_time: this.unstakingCompletionTime
        };
    };
    /**
     *
     * Verify if all properties are valid
     * @returns {boolean} - True or false.
     * @memberof Node
     */
    Node.prototype.isValid = function () {
        return hex_1.Hex.isHex(this.address) &&
            hex_1.Hex.isHex(this.publicKey) &&
            this.jailed !== undefined &&
            this.serviceURL.pathname.length !== 0 &&
            this.status !== undefined &&
            Number(this.stakedTokens.toString()) >= 0;
    };
    return Node;
}());
exports.Node = Node;
