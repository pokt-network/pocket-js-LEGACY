// Blockchain
class Blockchain {
  constructor(name, netID) {
    this.name = name;
    this.netID = netID;
  }

  toJSON() {
    return JSON.parse('{ "name":"' + 
    this.name + '", "netID":"' + 
    this.netID + '"}')
  }
}

module.exports = {
  Blockchain
}