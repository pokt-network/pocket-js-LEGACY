import { BlockID } from "./block_id";
import { Hex } from "../utils/Hex";
import { Consensus } from "./consensus";

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
        const jsonObject = JSON.parse(json);

        return new BlockHeader(
            Consensus.fromJSON(jsonObject.version),
            jsonObject.chain_id,
            jsonObject.height,
            jsonObject.time,
            jsonObject.num_txs,
            jsonObject.total_txs,
            BlockID.fromJSON(jsonObject.last_block_id),
            jsonObject.last_commit_hash,
            jsonObject.data_hash,
            jsonObject.validators_hash,
            jsonObject.next_validators_hash,
            jsonObject.consensus_hash,
            jsonObject.app_hash,
            jsonObject.last_results_hash,
            jsonObject.evidence_hash,
            jsonObject.proposer_address
        );
    }

    public readonly version: Consensus;
    public readonly chainID: string;
    public readonly height: BigInt;
    public readonly time: string;
    public readonly numTXs: BigInt;
    public readonly totalTxs: BigInt;
    public readonly lastBlockID: BlockID;
    public readonly lastCommitHash: Hex;
    public readonly dataHash: Hex;
    public readonly validatorsHash: Hex;
    public readonly nextValidatorsHash: Hex;
    public readonly consensusHash: Hex;
    public readonly appHash: Hex;
    public readonly lastResultsHash: Hex;
    public readonly evidenceHash: Hex;
    public readonly proposerAddress: Hex;

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
     * @param {Hex} lastCommitHash - Last commit hash.
     * @param {Hex} dataHash - Data hash.
     * @param {Hex} validatorsHash - Validators hash.
     * @param {Hex} nextValidatorsHash - Next validators hash.
     * @param {Hex} consensusHash - Consensus hash.
     * @param {Hex} appHash - App hash.
     * @param {Hex} lastResultsHash - Last Results hash.
     * @param {Hex} evidenceHash - Evidence hash.
     * @param {Hex} proposerAddress - Proposer Address.
     */
    constructor(
        version: Consensus,
        chainID: string,
        height: BigInt,
        time: string,
        numTXs: BigInt,
        totalTxs: BigInt,
        lastBlockID: BlockID,
        lastCommitHash: Hex,
        dataHash: Hex,
        validatorsHash: Hex,
        nextValidatorsHash: Hex,
        consensusHash: Hex,
        appHash: Hex,
        lastResultsHash: Hex,
        evidenceHash: Hex,
        proposerAddress: Hex

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
            throw new TypeError("Invalid properties length.");
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
            "version": this.version,
            "chain_id": this.chainID,
            "height": this.height,
            "time": this.time,
            "num_txs": this.numTXs,
            "total_txs": this.totalTxs,
            "last_block_id": this.lastBlockID.toJSON(),
            "last_commit_hash": this.lastCommitHash,
            "data_hash": this.dataHash,
            "validators_hash": this.validatorsHash,
            "next_validators_hash": this.nextValidatorsHash,
            "consensus_hash": this.consensusHash,
            "app_hash": this.appHash,
            "last_results_hash": this.lastResultsHash,
            "evidence_hash": this.evidenceHash,
            "proposer_address": this.proposerAddress
        }
    }
    /**
   *
   * Check if the BlockHeader object is valid
   * @returns {boolean} - True or false.
   * @memberof BlockHeader
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