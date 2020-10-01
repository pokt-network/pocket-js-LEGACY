"use strict";
exports.__esModule = true;
var rpc_error_1 = require("../rpc/errors/rpc-error");
var type_guard_1 = require("../utils/type-guard");
/**
 *
 *
 * @class Routing
 */
var RoutingTable = /** @class */ (function () {
    /**
     * Creates an instance of routing.
     * @param {Array} nodes - Array holding the initial dispatcher url(s).
     * @param {Configuration} configuration - Configuration object.
     * @memberof Routing
     */
    function RoutingTable(dispatchers, configuration, store) {
        if (dispatchers === void 0) { dispatchers = []; }
        this.localNodesFileName = "";
        this.dispatchersKey = "DISPATCHER_KEY";
        if (dispatchers.length > configuration.maxDispatchers && configuration.maxDispatchers > 0) {
            throw new Error("Routing table cannot contain more than the specified maxDispatcher per blockchain.");
        }
        if (dispatchers.length < 1) {
            throw new Error("Routing table must be initialized with at least one Dispatch node.");
        }
        this.configuration = configuration;
        this.store = store;
        this.store.add(this.dispatchersKey, dispatchers);
    }
    Object.defineProperty(RoutingTable.prototype, "dispatchersCount", {
        /**
         * Returns the stored dispatchers urls count
         * @returns {number} Nodes count.
         * @memberof Routing
         */
        get: function () {
            var result = this.store.get(this.dispatchersKey);
            if (result !== undefined && Array.isArray(result)) {
                return result.length;
            }
            else {
                return 0;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Reads an array of random dispatchers urls from the routing table
     * @param {number} count - desired number of dispatchers urls returned
     * @returns {URL[]} Random dispatcher urls.
     * @memberof Routing
     */
    RoutingTable.prototype.readRandomDispatchers = function (count) {
        var dispatchers = this.store.get(this.dispatchersKey);
        // Shuffle array then return the slice
        var shuffled = dispatchers.sort(function () { return 0.5 - Math.random(); });
        return shuffled.slice(0, count);
    };
    /**
     * Reads a random node from the routing table based on blockchain netID
     * @returns {Node} Random node.
     * @memberof Routing
     */
    RoutingTable.prototype.readRandomDispatcher = function () {
        var dispatchers = this.store.get(this.dispatchersKey);
        return dispatchers[Math.floor(Math.random() * dispatchers.length)];
    };
    /**
     * Gets a dispatcher url for the Pocket network rpc calls
     * @returns {URL | RpcError} Dispatcher url or rpc error
     * @memberof Routing
     */
    RoutingTable.prototype.getDispatcher = function () {
        var dispatchers = this.store.get(this.dispatchersKey);
        if (dispatchers.length < 0) {
            return new rpc_error_1.RpcError("101", "Dispatcher not found in routing table.");
        }
        return dispatchers[Math.floor(Math.random() * dispatchers.length)];
    };
    /**
     * Reads a specific node from the routing table based on public key
     * @param {string} publicKey - public key attached to the node
     * @returns {Node} Node object.
     * @memberof Routing
     */
    RoutingTable.prototype.readDispatcher = function (url) {
        var dispatchers = this.store.get(this.dispatchersKey.toUpperCase());
        var requestedDispatcher;
        dispatchers.forEach(function (storedURL) {
            if (storedURL.hash === url.hash) {
                requestedDispatcher = url;
            }
        });
        if (type_guard_1.typeGuard(requestedDispatcher, URL)) {
            return requestedDispatcher;
        }
        else {
            throw new Error("Dispatcher not found in routing table.");
        }
    };
    /**
     * Add a dispatcher url to the routing table
     * @param {URL} url - URL object to be added
     * @memberof Routing
     */
    RoutingTable.prototype.addDispatcher = function (url) {
        var disptachers = this.store.get(this.dispatchersKey);
        disptachers.push(url);
        // If this pushes the count over the maxNodes, splice the first element off
        if (disptachers.length > this.configuration.maxDispatchers && this.configuration.maxDispatchers > 0) {
            disptachers.splice(0, 1);
        }
        this.store.add(this.dispatchersKey, disptachers);
    };
    /**
     * Deletes a dispatcher url from the routing table
     * @param {URL} url - url object to be deleted
     * @returns {boolean} True or false if the node was deleted.
     * @memberof Routing
     */
    RoutingTable.prototype.deleteDispatcher = function (url) {
        // Cycle through the list of nodes, find a match, splice it off
        var disptachers = this.store.get(this.dispatchersKey);
        for (var i = 0; i < disptachers.length; i++) {
            if (disptachers[i].hash === url.hash) {
                disptachers.splice(i, 1);
                return true;
            }
        }
        return false;
    };
    return RoutingTable;
}());
exports.RoutingTable = RoutingTable;
