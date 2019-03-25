// Wallet - Model
class Wallet {
	constructor(address, privateKey, network, networkID, data) {
		this.address = address;
		this.privateKey = privateKey;
		this.network = network;
		this.networkID = networkID;
		this.data = data;
	}
}

module.exports = {
	Wallet
}