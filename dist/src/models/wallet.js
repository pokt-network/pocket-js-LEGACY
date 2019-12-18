"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Wallet - Model
var Wallet = /** @class */ (function () {
    /**
     * Creates an instance of Wallet.
     * @param {String} address - Public Key string.
     * @param {String} privateKey - Private Key string.
     * @param {String} network - Network name.
     * @param {String} networkID - Network Identifier.
     * @param {Object} data - Optional data object.
     * @memberof Wallet
     */
    function Wallet(address, privateKey, network, networkID, data) {
        this.address = address;
        this.privateKey = privateKey;
        this.network = network;
        this.networkID = networkID;
        this.data = data;
    }
    return Wallet;
}());
exports.Wallet = Wallet;
//# sourceMappingURL=wallet.js.map