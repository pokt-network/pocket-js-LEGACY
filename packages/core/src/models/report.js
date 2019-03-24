const axios = require('axios');
const constants = require("../utils/constants.js");

// Report
class Report {
	constructor(ip, message, configuration) {
		this.ip = ip;
        this.message = message;
        this.configuration = configuration;
    }

    toJSON(){
		return {
			"IP": this.ip,
			"Message": this.message
		}
    }

    isValid(){
		for (var property in this) {
			if (!this.hasOwnProperty(property) || this[property] == "") {
				return false;
			}
		}
		return true;
    }

    async send(callback){
        const axiosInstance = axios.create({
            baseURL: constants.dispatchNodeURL,
            timeout: this.configuration.requestTimeOut,
            headers: {
              'Content-Type': 'application/json'
            }
          });
    
          var response = await axiosInstance.post(constants.reportPath,
            this.toJSON()
          );
    
          if (response.status == 200 && response.data != null) {
            if (callback) {
              callback(null, response.data);
              return;
            }
            return response.data;
          } else {
            if (callback) {
              callback(new Error("Failed to send report with error: " + response.data));
              return;
            }
            return new Error("Failed to send report with error: " + response.data);
          }
    }
}

module.exports = {
	Report
}