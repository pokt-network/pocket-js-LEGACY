"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
/**
 * @author Luis C. de León <luis@pokt.network>
 */
var account_1 = require("./account");
/**
 * @description Represents an account made from an ed25519 keypair using an encrypted private key and a plain one
 */
var UnlockedAccount = /** @class */ (function (_super) {
    __extends(UnlockedAccount, _super);
    /**
     * @description Constructor for UnlockedAccount
     * @param account The Account object on which to base this UnlockedAccount
     * @param privateKey The raw private key of the Account object
     */
    function UnlockedAccount(account, privateKey) {
        var _this = _super.call(this, account.publicKey, account.encryptedPrivateKeyHex) || this;
        _this.privateKey = privateKey;
        return _this;
    }
    return UnlockedAccount;
}(account_1.Account));
exports.UnlockedAccount = UnlockedAccount;
