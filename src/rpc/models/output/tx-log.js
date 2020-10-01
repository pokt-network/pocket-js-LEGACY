"use strict";
exports.__esModule = true;
var utils_1 = require("../../../utils");
/**
 * A model representing a log generated from a Transaction
 */
var TxLog = /** @class */ (function () {
    /**
     * Constructor for this class
     * @param msgIndex {BigInt} index for this log in the logs list
     * @param success {boolean} whether or not this message was processed succesfully
     * @param log {string} The content of the log message
     */
    function TxLog(msgIndex, success, log) {
        this.msgIndex = msgIndex;
        this.success = success;
        this.log = log;
    }
    /**
     * Construct this object from it's JSON representation
     * @param txLogObj {any}
     * @returns {TxLog | Error}
     * @memberof TxLog
     */
    TxLog.fromJSONObj = function (txLogObj) {
        var msgIndex;
        var success;
        var log;
        if (utils_1.typeGuard(txLogObj.msg_index, "number")) {
            msgIndex = BigInt(txLogObj.msg_index);
        }
        else {
            return new Error("Invalid msg index for transaction log: " + JSON.stringify(txLogObj));
        }
        if (utils_1.typeGuard(txLogObj.success, "boolean")) {
            success = txLogObj.success;
        }
        else {
            return new Error("Invalid success field for transaction log: " + JSON.stringify(txLogObj));
        }
        if (utils_1.typeGuard(txLogObj.log, "string")) {
            log = txLogObj.log;
        }
        else {
            return new Error("Invalid log for transaction log: " + JSON.stringify(txLogObj));
        }
        return new TxLog(msgIndex, success, log);
    };
    return TxLog;
}());
exports.TxLog = TxLog;
