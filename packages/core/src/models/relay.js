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
	 * @param {String} data - Data string.
	 * @param {Configuration} configuration - Configuration object.
	 * @param {String} httpMethod - (Optional) HTTP Method.
	 * @param {String} path - (Optional) API path.
	 * @param {Object} queryParams - (Optional) An object holding the query params.
	 * {"enabled":"true", "active":"false"}
	 * @memberof Relay
	 */
	constructor(blockchain, netID, data, configuration, httpMethod, path, queryParams) {
		this.blockchain = blockchain;
		this.netID = netID;
		this.data = data;
		this.configuration = configuration;
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
			"DevID": this.configuration.devID,
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
			&& this.configuration != null && this.configuration != "") {
				return true;
		}
		return false;
	}
}

module.exports = {
	Relay
}