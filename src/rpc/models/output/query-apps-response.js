"use strict";
exports.__esModule = true;
var application_1 = require("../application");
/**
 *
 *
 * @class QueryAppsResponse
 */
var QueryAppsResponse = /** @class */ (function () {
    /**
     * QueryAppsResponse.
     * @constructor
     * @param {Application[]} applications - Amount staked by the node.
     */
    function QueryAppsResponse(applications) {
        this.applications = applications;
    }
    /**
     *
     * Creates a QueryAppsResponse object using a JSON string
     * @param {string} json - JSON string.
     * @returns {QueryAppsResponse} - QueryAppsResponse object.
     * @memberof QueryAppsResponse
     */
    QueryAppsResponse.fromJSON = function (json) {
        try {
            var jsonObject = JSON.parse(json);
            var apps_1 = [];
            if (Array.isArray(jsonObject)) {
                jsonObject.forEach(function (appJSON) {
                    var app = application_1.Application.fromJSON(JSON.stringify(appJSON));
                    apps_1.push(app);
                });
                return new QueryAppsResponse(apps_1);
            }
            else {
                var app = application_1.Application.fromJSON(JSON.stringify(jsonObject));
                return new QueryAppsResponse([app]);
            }
        }
        catch (error) {
            throw error;
        }
    };
    /**
     *
     * Creates a JSON object with the QueryAppsResponse properties
     * @returns {JSON} - JSON Object.
     * @memberof QueryAppsResponse
     */
    QueryAppsResponse.prototype.toJSON = function () {
        var appListJSON = [];
        this.applications.forEach(function (app) {
            appListJSON.push(app);
        });
        return JSON.parse(JSON.stringify(appListJSON));
    };
    return QueryAppsResponse;
}());
exports.QueryAppsResponse = QueryAppsResponse;
