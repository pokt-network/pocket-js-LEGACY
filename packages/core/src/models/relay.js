// Relay
class Relay {
	constructor(blockchain, netID, data, configuration) {
		this.blockchain = blockchain;
		this.netID = netID;
		this.data = data;
		this.configuration = configuration;
	}

	toJSON(){
		return {
			"Blockchain": this.blockchain,
			"NetID": this.netID,
			"Data": this.data,
			"DevID": this.configuration.devID
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
}

module.exports = {
	Relay
}