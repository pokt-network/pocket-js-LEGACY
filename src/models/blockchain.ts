/**
 *
 *
 * @class Blockchain
 */
export class Blockchain {
  public readonly name: string;
  public readonly netID: string;
  /**
   * Creates an instance of Blockchain.
   * @param {String} name - Blockchain's name.
   * @param {String} netID - Network identifier.
   * @memberof Blockchain
   */
  constructor(name: string, netID: string) {
    this.name = name;
    this.netID = netID;
  }
  /**
   *
   * toJSON
   * @returns {JSON} - A JSON object.
   * @memberof Blockchain
   */
  public toJSON() {
    return JSON.parse(
      '{ "name":"' + this.name + '", "netID":"' + this.netID + '"}'
    );
  }
}
