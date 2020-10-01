"use strict";
exports.__esModule = true;
/**
 * Validates wheter or not a Service URL is valid
 * @param serviceURL
 */
function validateServiceURL(serviceURL) {
    return serviceURL.protocol === "https:";
}
exports.validateServiceURL = validateServiceURL;
