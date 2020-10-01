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
 * @class RpcError
 */
var RpcError = /** @class */ (function (_super) {
    __extends(RpcError, _super);
    /**
     * RPC Error.
     * @constructor
     * @param {string} code - Error code.
     * @param {string} message - Error message.
     * @memberof RpcError
     */
    function RpcError(code, message) {
        var _this = _super.apply(this, arguments) || this;
        _this.code = code;
        _this.message = message;
        Object.setPrototypeOf(_this, RpcError.prototype);
        return _this;
    }
    /**
     * Creates a RpcError from an Error object
     * @param {Error} error - Error object.
     */
    RpcError.fromError = function (error) {
        return new RpcError("0", error.message);
    };
    /**
     *
     * Creates a RpcError object using a JSON string
     * @param {string} json - JSON string.
     * @returns {RpcError} - RpcError object.
     * @memberof RpcError
     */
    RpcError.fromJSON = function (json) {
        var jsonObject = JSON.parse(json);
        return new RpcError(jsonObject.code, jsonObject.message);
    };
    /**
     *
     * Creates a JSON object with the RpcError properties
     * @returns {JSON} - JSON Object.
     * @memberof RpcError
     */
    RpcError.prototype.toJSON = function () {
        return {
            code: this.code,
            message: this.message
        };
    };
    return RpcError;
}(Error));
exports.RpcError = RpcError;
