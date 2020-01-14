/**
 *
 *
 * @class NodeProof
 */
export class NodeProof {
  /**
   *
   * Creates a NodeProof object using a JSON string
   * @param {String} json - JSON string.
   * @returns {NodeProof} - NodeProof object.
   * @memberof NodeProof
   */
  public static fromJSON(json: string): NodeProof {
    const jsonObject = JSON.parse(json)

    return new NodeProof(
      jsonObject.address,
      jsonObject.blockchain,
      jsonObject.app_pubkey,
      jsonObject.session_block_height,
      jsonObject.height
    )
  }

  public readonly address: string
  public readonly blockchain: string
  public readonly appPubKey: string
  public readonly SBlockHeight: BigInt
  public readonly height: BigInt

  /**
   * Node Proof.
   * @constructor
   * @param {string} address - Node address.
   * @param {string} blockchain - Blockchain hash.
   * @param {string} appPubKey - Application Key associated with a client.
   * @param {BigInt} SBlockHeight - Session Block Height.
   * @param {BigInt} height - Height of session.
   */
  constructor(
    address: string,
    blockchain: string,
    appPubKey: string,
    SBlockHeight: BigInt,
    height: BigInt
  ) {
    this.address = address
    this.blockchain = blockchain
    this.appPubKey = appPubKey
    this.SBlockHeight = SBlockHeight
    this.height = height

    if (!this.isValid()) {
      throw new TypeError("Invalid properties length.")
    }
  }
  /**
   *
   * Creates a JSON object with the NodeProof properties
   * @returns {JSON} - JSON Object.
   * @memberof NodeProof
   */
  public toJSON() {
    return {
      address: this.address,
      app_pubkey: this.appPubKey,
      blockchain: this.blockchain,
      height: this.height,
      session_block_height: this.SBlockHeight
    }
  }
  /**
   *
   * Check if the NodeProof object is valid
   * @returns {boolean} - True or false.
   * @memberof NodeProof
   */
  private isValid(): boolean {
    return (
      this.address.length !== 0 &&
      this.blockchain.length !== 0 &&
      this.appPubKey.length !== 0 &&
      this.SBlockHeight !== undefined &&
      this.height !== undefined
    )
  }
}
