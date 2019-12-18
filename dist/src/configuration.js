"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 *
 * @class Configuration
 */
var Configuration = /** @class */ (function () {
    /**
     * Configuration stores settings.
     * @constructor
     * @param {string} devID - Unique developer ID.
     * @param {string} blockchains - Blockchain class type list.
     * @param {string} maxNodes - (optional) Maximun amount of nodes to store in instance, default 5.
     * @param {string} requestTimeOut - (optional) Maximun timeout for every request in miliseconds, default 10000.
     * @param {string} sslOnly - (optional) Indicates if you prefer nodes with ssl enabled only, default is true.
     */
    function Configuration(devID, blockchains, maxNodes, requestTimeOut, sslOnly) {
        this.maxNodes = 5;
        this.requestTimeOut = 10000;
        this.sslOnly = true;
        this.nodes = [];
        this.devID = devID;
        this.blockchains = blockchains;
        this.maxNodes = maxNodes || 5;
        this.requestTimeOut = requestTimeOut || 10000;
        this.sslOnly = sslOnly || true;
    }
    /**
     * Verify if the nodes list is empty
     *
     * @returns {Boolean}
     * @memberof Configuration
     */
    Configuration.prototype.nodesIsEmpty = function () {
        if (this.nodes == null || this.nodes.length == 0) {
            return true;
        }
        else {
            return false;
        }
    };
    Configuration.prototype.setDispatcher = function (dispatcher) {
        this.dispatcher = dispatcher;
    };
    Configuration.prototype.setNodes = function (nodes) {
        this.nodes = nodes;
    };
    return Configuration;
}());
exports.Configuration = Configuration;
//# sourceMappingURL=configuration.js.map