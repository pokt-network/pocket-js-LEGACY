// Relay
/**
 *
 *
 * @class Relay
 */
class Relay {
	/**
	 * Creates an instance of Relay.
	 * @param {Blockchain} blockchain - A blockchain object.
	 * @param {String} netID - Network identifier.
	 * @param {String} devID - Developer identifier.
	 * @param {String} data - Data string.
	 * @param {Number} retryAttempts - (Optional) Retry Attempts count.
	 * @param {Number} requestTimeOut - (Optional) Relay request timeout.
	 * @param {String} httpMethod - (Optional) HTTP Method.
	 * @param {String} path - (Optional) API path.
	 * @param {Object} queryParams - (Optional) An object holding the query params.
	 * {"enabled":"true", "active":"false"}
	 * @memberof Relay
	 */
	constructor(blockchain, netID, devID, data, retryAttempts, requestTimeOut, httpMethod, path, queryParams) {
		this.blockchain = blockchain;
		this.netID = netID;
		this.devID = devID;
		this.data = data;
		this.retryAttempts = retryAttempts || 3;
		this.requestTimeout = requestTimeOut || 10000
		this.httpMethod = httpMethod;
		this.path = path;
		this.appendQueryParams(queryParams);
	}
	/**
	 *
	 * Appends the Query parameters to the "path" property string.
	 * @param {Object} queryParams - Object containing one or multiple query parameters.
	 * @memberof Relay
	 */
	appendQueryParams(queryParams) {
		var paramsStr = "";
		if (typeof queryParams === 'object') {
			for (var k in queryParams) {
				if (queryParams.hasOwnProperty(k)) {
					paramsStr += k +"="+ queryParams[k] + "&";
				}
			}
			// Append the query params to the path
			this.path += "?"+paramsStr;
		}
	}
	/**
	 *
	 * Parse properties to a JSON Object.
	 * @returns {JSON} - A JSON Object.
	 * @memberof Relay
	 */
	toJSON() {
		return {
			"Blockchain": this.blockchain,
			"NetID": this.netID,
			"Data": this.data,
			"DevID": this.devID,
			"METHOD": this.httpMethod,
			"PATH": this.path
		}
	}

	/**
	 *
	 * Verifies if the Relay is valid
	 * @returns {boolean} - True or false
	 * @memberof Relay
	 */
	isValid() {
		if (this.blockchain != null && this.blockchain != "" && 
			this.netID != null && this.netID != ""
			&& this.devID != null && this.devID != "") {
				return true;
		}
		return false;
	}
}

module.exports = {
	Relay
}