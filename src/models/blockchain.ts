/**
 *
 *
 * @class Blockchain
 */
export class Blockchain {
  /**
 *
 * Creates a Blockchain object using a JSON string
 * @param {String} json - JSON string.
 * @returns {Block} - Block object.
 * @memberof Block
 */
  public static fromJSON(json: string): Blockchain {
    const jsonObject = JSON.parse(json);

    return new Blockchain(
      jsonObject.name,
      jsonObject.net_id,
    );
  }
  public readonly name: string;
  public readonly netID: string;
  /**
   * Creates an instance of Blockchain.
   * @param {String} name - Blockchain's name.
   * @param {String} netID - Network identifier.
   * @memberof Blockchain
   */
  constructor(
    name: string,
    netID: string
  ) {
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
    return {
      "name": this.name,
      "net_id": this.netID
    }
  }
  /**
   *
   * Verifies if the Blockchain is valid
   * @returns {boolean} - True or false
   * @memberof Blockchain
   */
  public isValid(): boolean {
    for (let key in this) {
      if (!this.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }
}
