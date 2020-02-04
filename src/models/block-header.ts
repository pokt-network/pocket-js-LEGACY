import { BlockID } from "./block-id"
import { Consensus } from "./consensus"
import { Hex } from "../utils"

/**
 *
 *
 * @class BlockHeader
 */
export class BlockHeader {
  /**
   *
   * Creates a BlockHeader object using a JSON string
   * @param {String} json - JSON string.
   * @returns {BlockHeader} - BlockHeader object.
   * @memberof BlockHeader
   */
  public static fromJSON(json: string): BlockHeader {
    const jsonObject = JSON.parse(json)

    return new BlockHeader(
      Consensus.fromJSON(JSON.stringify(jsonObject.version)),
      jsonObject.chain_id,
      jsonObject.height,
      jsonObject.time,
      jsonObject.num_txs,
      jsonObject.total_txs,
      BlockID.fromJSON(JSON.stringify(jsonObject.last_block_id)),
      jsonObject.last_commit_hash,
      jsonObject.data_hash,
      jsonObject.validators_hash,
      jsonObject.next_validators_hash,
      jsonObject.consensus_hash,
      jsonObject.app_hash,
      jsonObject.last_results_hash,
      jsonObject.evidence_hash,
      jsonObject.proposer_address
    )
  }

  public readonly version: Consensus
  public readonly chainID: string
  public readonly height: BigInt
  public readonly time: string
  public readonly numTXs: BigInt
  public readonly totalTxs: BigInt
  public readonly lastBlockID: BlockID
  public readonly lastCommitHash: string
  public readonly dataHash: string
  public readonly validatorsHash: string
  public readonly nextValidatorsHash: string
  public readonly consensusHash: string
  public readonly appHash: string
  public readonly lastResultsHash: string
  public readonly evidenceHash: string
  public readonly proposerAddress: string

  /**
   * BlockHeader.
   * @constructor
   * @param {Consensus} version - Block version information.
   * @param {string} chainID - Blockchain ID.
   * @param {BigInt} height - Block Height.
   * @param {string} time - Date time.
   * @param {BigInt} numTXs - Number of transactions in the block.
   * @param {BigInt} totalTxs - Total transaction count.
   * @param {BlockID} lastBlockID - Last block Id.
   * @param {string} lastCommitHash - Last commit hash.
   * @param {string} dataHash - Data hash.
   * @param {string} validatorsHash - Validators hash.
   * @param {string} nextValidatorsHash - Next validators hash.
   * @param {string} consensusHash - Consensus hash.
   * @param {string} appHash - App hash.
   * @param {string} lastResultsHash - Last Results hash.
   * @param {string} evidenceHash - Evidence hash.
   * @param {string} proposerAddress - Proposer Address.
   */
  constructor(
    version: Consensus,
    chainID: string,
    height: BigInt,
    time: string,
    numTXs: BigInt,
    totalTxs: BigInt,
    lastBlockID: BlockID,
    lastCommitHash: string,
    dataHash: string,
    validatorsHash: string,
    nextValidatorsHash: string,
    consensusHash: string,
    appHash: string,
    lastResultsHash: string,
    evidenceHash: string,
    proposerAddress: string
  ) {
    this.version = version
    this.chainID = chainID
    this.height = height
    this.time = time
    this.numTXs = numTXs
    this.totalTxs = totalTxs
    this.lastBlockID = lastBlockID
    this.lastCommitHash = lastCommitHash
    this.dataHash = dataHash
    this.validatorsHash = validatorsHash
    this.nextValidatorsHash = nextValidatorsHash
    this.consensusHash = consensusHash
    this.appHash = appHash
    this.lastResultsHash = lastResultsHash
    this.evidenceHash = evidenceHash
    this.proposerAddress = proposerAddress

    if (!this.isValid()) {
      throw new TypeError("Invalid BlockHeader properties length.")
    }
  }
  /**
   *
   * Creates a JSON object with the BlockHeader properties
   * @returns {JSON} - JSON Object.
   * @memberof BlockHeader
   */
  public toJSON() {
    return {
      app_hash: this.appHash,
      chain_id: this.chainID,
      consensus_hash: this.consensusHash,
      data_hash: this.dataHash,
      evidence_hash: this.evidenceHash,
      height: this.height.toString(16),
      last_block_id: this.lastBlockID.toJSON(),
      last_commit_hash: this.lastCommitHash,
      last_results_hash: this.lastResultsHash,
      next_validators_hash: this.nextValidatorsHash,
      num_txs: this.numTXs.toString(16),
      proposer_address: this.proposerAddress,
      time: this.time,
      total_txs: this.totalTxs.toString(16),
      validators_hash: this.validatorsHash,
      version: this.version.toJSON()
    }
  }
  /**
   *
   * Check if the BlockHeader object is valid
   * @returns {boolean} - True or false.
   * @memberof BlockHeader
   */
  public isValid(): boolean {
    return Hex.isHex(this.appHash) &&
      this.chainID.length !== 0 &&
      Hex.isHex(this.consensusHash) &&
      Hex.isHex(this.dataHash) &&
      Hex.isHex(this.evidenceHash) &&
      this.height !== undefined &&
      this.lastBlockID.isValid() &&
      Hex.isHex(this.lastCommitHash) &&
      Hex.isHex(this.lastResultsHash) &&
      Hex.isHex(this.nextValidatorsHash) &&
      Hex.isHex(this.proposerAddress) &&
      Hex.isHex(this.validatorsHash) &&
      this.numTXs !== undefined &&
      this.time.length !== 0 &&
      this.totalTxs !== undefined &&
      this.version.isValid()
  }
}
