// Blockchain
class Blockchain {
  constructor(name, netID, version) {
    this.name = name;
    this.netID = netID;
    this.version = version;
  }

  toJSON() {
    return JSON.parse('{ "name":"' + 
    this.name + '", "netID":"' + 
    this.netID + '", "version":"' + 
    this.version + '" }')
  }
}

module.exports = {
  Blockchain
}