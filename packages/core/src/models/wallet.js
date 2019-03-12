
// Wallet - Model
function Wallet(address, privateKey, network, subnetwork, data) {
  this.address = address;
	this.privateKey = privateKey;
	this.network = network;
	this.subnetwork = subnetwork;
	this.data = data;
}

module.exports = {Wallet}