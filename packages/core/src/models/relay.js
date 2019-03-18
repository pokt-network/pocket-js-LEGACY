// Relay
class Relay {
	constructor(blockchain, netID, version, data, configuration) {
		this.blockchain = blockchain;
		this.netID = netID;
		this.version = version;
		this.data = data;
		this.configuration = configuration;
	}

	toJSON(){
		return {
			"Blockchain": this.blockchain,
			"NetID": this.netID,
			"Version": this.version,
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