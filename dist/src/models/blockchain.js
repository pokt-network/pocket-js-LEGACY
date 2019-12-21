"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 *
 * @class Blockchain
 */
var Blockchain = /** @class */ (function () {
    /**
     * Creates an instance of Blockchain.
     * @param {String} name - Blockchain's name.
     * @param {String} netID - Network identifier.
     * @memberof Blockchain
     */
    function Blockchain(name, netID) {
        this.name = name;
        this.netID = netID;
    }
    /**
     *
     * toJSON
     * @returns {JSON} - A JSON object.
     * @memberof Blockchain
     */
    Blockchain.prototype.toJSON = function () {
        return JSON.parse('{ "name":"' + this.name + '", "netID":"' + this.netID + '"}');
    };
    /**
     *
     * Verifies if the Blockchain is valid
     * @returns {boolean} - True or false
     * @memberof Blockchain
     */
    Blockchain.prototype.isValid = function () {
        return JSON.parse('{ "name":"' + this.name + '", "netID":"' + this.netID + '"}');
    };
    return Blockchain;
}());
exports.Blockchain = Blockchain;
//# sourceMappingURL=blockchain.js.map