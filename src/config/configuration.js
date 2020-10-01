"use strict";
exports.__esModule = true;
/**
 *
 *
 * @class Configuration
 */
var Configuration = /** @class */ (function () {
    /**
     * Stores multiple properties used to interact with the Pocket Network.
     * @constructor
     * @param {number} maxDispatchers - (optional) Maximun amount of dispatchers urls to stored in rounting table, default 0.
     * @param {number} maxSessions - (optional) Maximun amount of sessions to stored for the session manager, default 0.
     * @param {number} requestTimeOut - (optional) Maximun timeout for every request in miliseconds, default 0.
     * @memberof Configuration
     */
    function Configuration(maxDispatchers, requestTimeOut, maxSessions) {
        if (maxDispatchers === void 0) { maxDispatchers = 0; }
        if (requestTimeOut === void 0) { requestTimeOut = 0; }
        if (maxSessions === void 0) { maxSessions = 0; }
        this.maxDispatchers = 0;
        this.maxSessions = 0;
        this.requestTimeOut = 0;
        this.maxDispatchers = maxDispatchers;
        this.requestTimeOut = requestTimeOut;
        this.maxSessions = maxSessions;
    }
    return Configuration;
}());
exports.Configuration = Configuration;
