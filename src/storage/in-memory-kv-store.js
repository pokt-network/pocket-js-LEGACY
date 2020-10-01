"use strict";
exports.__esModule = true;
/**
 *
 *
 * @class InMemoryKVStore
 * @description Save data using a Key/Value relationship. This object save information in memory, that means if the application is closed,
 * the saved information will be deleted
 */
var InMemoryKVStore = /** @class */ (function () {
    function InMemoryKVStore() {
        this.localStorage = new Map();
    }
    /**
     * @description Associates the specified value with the specified key and save this association in memory.
     * @param {string} key - key with which the specified value is to be associated
     * @param {any} value - value to be associated with the specified key
     * @memberof InMemoryKVStore
     */
    InMemoryKVStore.prototype.add = function (key, value) {
        this.localStorage.set(key, value);
    };
    /**
     * @description Returns the value to which the specified key is mapped.
     * @param {string} key - the key whose associated value is to be returned
     * @returns {any | undefined} - Key or undefined.
     * @memberof InMemoryKVStore
     */
    InMemoryKVStore.prototype.get = function (key) {
        return this.localStorage.get(key);
    };
    /**
     * @description Returns a list with all the saved value
     * @returns {any[]} - An array of items.
     */
    InMemoryKVStore.prototype.getItems = function () {
        var list = new Array();
        Array.from(this.localStorage.entries()).forEach(function (entry) {
            var key = entry[0];
            var value = entry[1];
            list.push({ key: key, value: value });
        });
        return list;
    };
    /**
     * @description Verifies if the object has an association identified with a key.
     * @param {string} key - key whose mapping is to be checked from the memory
     * @returns {boolean} - True or false if the key exists in the local storage.
     * @memberof InMemoryKVStore
     */
    InMemoryKVStore.prototype.has = function (key) {
        return this.localStorage.has(key);
    };
    /**
     * @description Removes the mapping for a key from this object if it is present.
     * @param {string} key - key whose mapping is to be removed from the memory
     * @returns {boolean} - True or false if the item was removed or not.
     * @memberof InMemoryKVStore
     */
    InMemoryKVStore.prototype.remove = function (key) {
        return this.localStorage["delete"](key);
    };
    /**
     * @description Removes all of the mappings from this object.
     */
    InMemoryKVStore.prototype.clear = function () {
        this.localStorage.clear();
    };
    return InMemoryKVStore;
}());
exports.InMemoryKVStore = InMemoryKVStore;
