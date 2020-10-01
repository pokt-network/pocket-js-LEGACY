"use strict";
exports.__esModule = true;
/**
 * A generic type guard function to verify the class of a particular object, specially used for Error checks
 * @param o Object to check the class for
 * @param className The class to check against
 */
function typeGuard(o, className) {
    var localPrimitiveOrConstructor = className;
    if (typeof localPrimitiveOrConstructor === "string") {
        return typeof o === localPrimitiveOrConstructor;
    }
    return o instanceof localPrimitiveOrConstructor;
}
exports.typeGuard = typeGuard;
