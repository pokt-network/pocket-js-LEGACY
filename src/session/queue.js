"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
/**
 * @class Queue
 * This class provides a TypeScript implementation of a Queue (FIFO Structure).
 */
var Queue = /** @class */ (function () {
    function Queue() {
        var _this = this;
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        this.intHead = undefined;
        this.intTail = undefined;
        this.iintLength = 0;
        if (values.length > 0) {
            values.forEach(function (value) {
                _this.append(value);
            });
        }
    }
    /**
     *
     * Creates a Application object using a JSON string
     * @param {String} json - JSON string.
     * @returns {Application} - Application object.
     * @memberof Queue
     */
    Queue.prototype.iterator = function () {
        var currentItem;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currentItem = this.intHead;
                    _a.label = 1;
                case 1:
                    if (!currentItem) return [3 /*break*/, 3];
                    return [4 /*yield*/, currentItem.value];
                case 2:
                    _a.sent();
                    currentItem = currentItem.next;
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    };
    Queue.prototype[Symbol.iterator] = function () {
        return this.iterator();
    };
    Object.defineProperty(Queue.prototype, "head", {
        get: function () {
            return this.intHead !== undefined ? this.intHead.value : undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Queue.prototype, "tail", {
        get: function () {
            return this.intTail !== undefined ? this.intTail.value : undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Queue.prototype, "length", {
        get: function () {
            return this.iintLength;
        },
        enumerable: true,
        configurable: true
    });
    Queue.prototype.insert = function (val, previousItem, checkDuplicates) {
        if (checkDuplicates === void 0) { checkDuplicates = false; }
        if (checkDuplicates && this.isDuplicate(val)) {
            return false;
        }
        var newItem = new QueueItem(val);
        var currentItem = this.intHead;
        if (!currentItem) {
            return false;
        }
        else {
            while (true) {
                if (currentItem.value === previousItem) {
                    newItem.next = currentItem.next;
                    newItem.prev = currentItem;
                    currentItem.next = newItem;
                    if (newItem.next) {
                        newItem.next.prev = newItem;
                    }
                    else {
                        this.intTail = newItem;
                    }
                    this.iintLength++;
                    return true;
                }
                else {
                    if (currentItem.next) {
                        currentItem = currentItem.next;
                    }
                    else {
                        return false;
                    }
                }
            }
        }
    };
    Queue.prototype.append = function (val, checkDuplicates) {
        if (checkDuplicates === void 0) { checkDuplicates = false; }
        if (checkDuplicates && this.isDuplicate(val)) {
            return false;
        }
        var newItem = new QueueItem(val);
        if (!this.intTail) {
            this.intHead = this.intTail = newItem;
        }
        else {
            this.intTail.next = newItem;
            newItem.prev = this.intTail;
            this.intTail = newItem;
        }
        this.iintLength++;
        return true;
    };
    Queue.prototype.prepend = function (val, checkDuplicates) {
        if (checkDuplicates === void 0) { checkDuplicates = false; }
        if (checkDuplicates && this.isDuplicate(val)) {
            return false;
        }
        var newItem = new QueueItem(val);
        if (!this.intHead) {
            this.intHead = this.intTail = newItem;
        }
        else {
            newItem.next = this.intHead;
            this.intHead.prev = newItem;
            this.intHead = newItem;
        }
        this.iintLength++;
        return true;
    };
    Queue.prototype.remove = function (val) {
        var currentItem = this.intHead;
        if (!currentItem) {
            return;
        }
        if (currentItem.value === val) {
            this.intHead = currentItem.next;
            this.iintLength--;
            if (this.intHead !== undefined) {
                this.intHead.prev = undefined;
            }
            currentItem.next = currentItem.prev = undefined;
            return currentItem.value;
        }
        else {
            while (true) {
                if (currentItem.value === val) {
                    if (currentItem.next) {
                        if (currentItem.prev) {
                            currentItem.prev.next = currentItem.next;
                        }
                        currentItem.next.prev = currentItem.prev;
                        currentItem.next = currentItem.prev = undefined;
                    }
                    else {
                        if (currentItem.prev) {
                            currentItem.prev.next = undefined;
                        }
                        this.intTail = currentItem.prev;
                        currentItem.next = currentItem.prev = undefined;
                    }
                    this.iintLength--;
                    return currentItem.value;
                }
                else {
                    if (currentItem.next) {
                        currentItem = currentItem.next;
                    }
                    else {
                        return;
                    }
                }
            }
        }
    };
    Queue.prototype.removeHead = function () {
        var _a;
        var currentItem = this.intHead;
        // empty list
        if (!currentItem) {
            return;
        }
        // single item list
        if (!((_a = this.intHead) === null || _a === void 0 ? void 0 : _a.next)) {
            this.intHead = undefined;
            this.intTail = undefined;
            // full list
        }
        else {
            this.intHead.next.prev = undefined;
            this.intHead = this.intHead.next;
            currentItem.next = currentItem.prev = undefined;
        }
        this.iintLength--;
        return currentItem.value;
    };
    Queue.prototype.removeTail = function () {
        var _a;
        var currentItem = this.intTail;
        // empty list
        if (!currentItem) {
            return;
        }
        // single item list
        if (!((_a = this.intTail) === null || _a === void 0 ? void 0 : _a.prev)) {
            this.intHead = undefined;
            this.intTail = undefined;
            // full list
        }
        else {
            this.intTail.prev.next = undefined;
            this.intTail = this.intTail.prev;
            currentItem.next = currentItem.prev = undefined;
        }
        this.iintLength--;
        return currentItem.value;
    };
    Queue.prototype.first = function (num) {
        var iter = this.iterator();
        var result = [];
        var n = Math.min(num, this.length);
        for (var i = 0; i < n; i++) {
            var val = iter.next();
            result.push(val.value);
        }
        return result;
    };
    Queue.prototype.toArray = function () {
        return __spreadArrays(this);
    };
    Object.defineProperty(Queue.prototype, "front", {
        get: function () {
            return this.head;
        },
        enumerable: true,
        configurable: true
    });
    Queue.prototype.enqueue = function (val) {
        this.append(val);
    };
    Queue.prototype.dequeue = function () {
        return this.removeHead();
    };
    Queue.prototype.isDuplicate = function (val) {
        var set = new Set(this.toArray());
        return set.has(val);
    };
    return Queue;
}());
exports.Queue = Queue;
var QueueItem = /** @class */ (function () {
    function QueueItem(val) {
        this.value = val;
        this.next = undefined;
        this.prev = undefined;
    }
    return QueueItem;
}());
exports.QueueItem = QueueItem;
