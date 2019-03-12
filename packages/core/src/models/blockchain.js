// Blockchain
class Blockchain {
  constructor(name, netID, version) {
    this.name = name;
    this.netID = netID;
    this.version = version;
  }

  toJSON() {
    return JSON.parse('{ "Name":"' + 
    this.name + '", "NetID":"' + 
    this.netID + '", "Version":"' + 
    this.version + '" }')
  }
}

module.exports = {
  Blockchain
}