"use strict";
exports.__esModule = true;
var block_id_1 = require("./block-id");
/**
 *
 *
 * @class BlockHeader
 */
var BlockHeader = /** @class */ (function () {
    /**
     * BlockHeader.
     * @constructor
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
    function BlockHeader(chainID, height, time, numTXs, totalTxs, lastBlockID, lastCommitHash, dataHash, validatorsHash, nextValidatorsHash, consensusHash, appHash, lastResultsHash, evidenceHash, proposerAddress) {
        this.chainID = chainID;
        this.height = height;
        this.time = time;
        this.numTXs = numTXs;
        this.totalTxs = totalTxs;
        this.lastBlockID = lastBlockID;
        this.lastCommitHash = lastCommitHash;
        this.dataHash = dataHash;
        this.validatorsHash = validatorsHash;
        this.nextValidatorsHash = nextValidatorsHash;
        this.consensusHash = consensusHash;
        this.appHash = appHash;
        this.lastResultsHash = lastResultsHash;
        this.evidenceHash = evidenceHash;
        this.proposerAddress = proposerAddress;
        if (!this.isValid()) {
            throw new TypeError("Invalid BlockHeader properties.");
        }
    }
    /**
     *
     * Creates a BlockHeader object using a JSON string
     * @param {String} json - JSON string.
     * @returns {BlockHeader} - BlockHeader object.
     * @memberof BlockHeader
     */
    BlockHeader.fromJSON = function (json) {
        try {
            var jsonObject = JSON.parse(json);
            return new BlockHeader(jsonObject.chain_id, BigInt(jsonObject.height), jsonObject.time, BigInt(jsonObject.num_txs), BigInt(jsonObject.total_txs), block_id_1.BlockID.fromJSON(JSON.stringify(jsonObject.last_block_id)), jsonObject.last_commit_hash, jsonObject.data_hash, jsonObject.validators_hash, jsonObject.next_validators_hash, jsonObject.consensus_hash, jsonObject.app_hash, jsonObject.last_results_hash, jsonObject.evidence_hash, jsonObject.proposer_address);
        }
        catch (error) {
            throw error;
        }
    };
    /**
     *
     * Creates a JSON object with the BlockHeader properties
     * @returns {JSON} - JSON Object.
     * @memberof BlockHeader
     */
    BlockHeader.prototype.toJSON = function () {
        return {
            app_hash: this.appHash,
            chain_id: this.chainID,
            consensus_hash: this.consensusHash,
            data_hash: this.dataHash,
            evidence_hash: this.evidenceHash,
            height: Number(this.height.toString()),
            last_block_id: this.lastBlockID.toJSON(),
            last_commit_hash: this.lastCommitHash,
            last_results_hash: this.lastResultsHash,
            next_validators_hash: this.nextValidatorsHash,
            num_txs: Number(this.numTXs.toString()),
            proposer_address: this.proposerAddress,
            time: this.time,
            total_txs: Number(this.totalTxs.toString()),
            validators_hash: this.validatorsHash
        };
    };
    /**
     *
     * Check if the BlockHeader object is valid
     * @returns {boolean} - True or false.
     * @memberof BlockHeader
     */
    BlockHeader.prototype.isValid = function () {
        return this.chainID.length !== 0 &&
            Number(this.height.toString()) > 0 &&
            this.lastBlockID.isValid() &&
            Number(this.numTXs.toString()) >= 0 &&
            this.time.length !== 0 &&
            Number(this.totalTxs.toString()) >= 0;
    };
    return BlockHeader;
}());
exports.BlockHeader = BlockHeader;
