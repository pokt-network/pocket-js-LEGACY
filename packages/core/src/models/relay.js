
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
}

module.exports = {
	Relay
}