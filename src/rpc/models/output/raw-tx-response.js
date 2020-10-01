"use strict";
exports.__esModule = true;
var tx_log_1 = require("./tx-log");
var utils_1 = require("../../../utils");
/**
 * Represents a /v1/rawtx RPC response
 */
var RawTxResponse = /** @class */ (function () {
    /**
     * Constructor for this class
     * @param height {BigInt} The height for this Transaction
     * @param hash {string} The transaction hash in hex format
     * @param code {BigInt} The code for this tx
     * @param data {string} Data hex for this tranaction
     * @param rawLog {string} Dumped logs in string format
     * @param logs {TxLog[]} Logs for this transaction
     * @param info {string}
     * @param codeSpace {string}
     * @param tx {string}
     * @param timestamp {string}
     */
    function RawTxResponse(height, hash, code, data, rawLog, logs, info, codeSpace, tx, timestamp) {
        this.height = height;
        this.hash = hash;
        this.code = code;
        this.data = data;
        this.rawLog = rawLog;
        this.logs = logs;
        this.info = info;
        this.codeSpace = codeSpace;
        this.tx = tx;
        this.timestamp = timestamp;
    }
    /**
     * Construct this model from it's JSON representation
     * @param jsonStr {string}
     * @returns {RawTxResponse | Error}
     */
    RawTxResponse.fromJSON = function (jsonStr) {
        try {
            var rawTxResObj = JSON.parse(jsonStr);
            var height = void 0;
            var hash = void 0;
            var logs = [];
            if (rawTxResObj.height !== undefined) {
                height = BigInt(rawTxResObj.height);
            }
            else {
                return new Error("Invalid height: " + rawTxResObj.height);
            }
            if (rawTxResObj.txhash && utils_1.typeGuard(rawTxResObj.txhash, "string")) {
                hash = rawTxResObj.txhash;
            }
            else {
                return new Error("Invalid tx hash: " + rawTxResObj.txhash);
            }
            if (rawTxResObj.logs && utils_1.typeGuard(rawTxResObj.logs, Array)) {
                var rawLogObjs = rawTxResObj.logs;
                for (var i = 0; i < rawLogObjs.length; i++) {
                    var txLogOrError = tx_log_1.TxLog.fromJSONObj(rawLogObjs[i]);
                    if (utils_1.typeGuard(txLogOrError, tx_log_1.TxLog)) {
                        logs.push(txLogOrError);
                    }
                }
            }
            return new RawTxResponse(height, hash, rawTxResObj.code ? BigInt(rawTxResObj.code) : undefined, rawTxResObj.data ? rawTxResObj.data : undefined, rawTxResObj.raw_log ? rawTxResObj.raw_log : undefined, logs, rawTxResObj.info ? rawTxResObj.info : undefined, rawTxResObj.codespace ? rawTxResObj.codespace : undefined, rawTxResObj.tx ? rawTxResObj.tx : undefined, rawTxResObj.timestamp ? rawTxResObj.timestamp : undefined);
        }
        catch (err) {
            return err;
        }
    };
    return RawTxResponse;
}());
exports.RawTxResponse = RawTxResponse;
