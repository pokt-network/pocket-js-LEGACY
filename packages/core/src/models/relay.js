// Relay
class Relay {
	constructor(blockchain, netID, version, data, devID, configuration) {
		this.blockchain = blockchain;
		this.netID = netID;
		this.version = version;
		this.data = data;
		this.devID = devID;
		this.configuration = configuration;
	}

	toJSON(){
		return {
			"Blockchain": this.blockchain,
			"NetID": this.netID,
			"Version": this.version,
			"Data": this.data,
			"DevID": this.devID
		}
	}

	isValid(){
		for (var property in this) {
			if (!this.hasOwnProperty(property)) {
				return false;
			}
		}
		return true;
	}
}

module.exports = {
	Relay
}