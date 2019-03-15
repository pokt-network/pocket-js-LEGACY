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

    async send(){
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
            return response.data;
          } else {
            throw new Error("Failed to send report with error: " + response.data);
          }
    }
}

module.exports = {
	Report
}