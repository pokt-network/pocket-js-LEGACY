import { SessionHeader } from "../input"
import { EvidenceType } from "../evidence-type"
import { Hex } from "../../../utils/hex"

// HashSum
export interface HashSum {
    hash: string,
    sum: BigInt
}
/**
 *
 *
 * @class MsgClaim
 */
export class MsgClaim {
    /**
     *
     * Creates a RelayMeta object using a JSON string
     * @param {string} json - JSON string.
     * @returns {MsgClaim} - MsgClaim object.
     * @memberof MsgClaim
     */
    public static fromJSON(json: string): MsgClaim {
        try {
            const jsonObject = JSON.parse(json)
            
            const header = SessionHeader.fromJSON(JSON.stringify(jsonObject.header))
            const merkleRoot = { hash: jsonObject.merkle_root.hash, sum: BigInt(jsonObject.merkle_root.sum)} as HashSum
            const evidenceType = EvidenceType.getType(jsonObject.evidence_type)

            return new MsgClaim(
                header,
                merkleRoot,
                BigInt(jsonObject.total_proofs),
                jsonObject.from_address,
                evidenceType,
                BigInt(jsonObject.expiration_height)
            )
        } catch (error) {
            throw error
        }
    }

    public readonly header: SessionHeader
    public readonly merkleRoot: HashSum
    public readonly totalProofs: BigInt
    public readonly fromAddress: string
    public readonly evidenceType: EvidenceType
    public readonly expirationHeight: BigInt

    /**
     * Challenge Response.
     * @constructor
     * @param {string} response - response json.
     */
    constructor(
        header: SessionHeader,
        merkleRoot: HashSum,
        totalProofs: BigInt,
        fromAddress: string,
        evidenceType: EvidenceType,
        expirationHeight: BigInt,
    ) {
        this.header = header
        this.merkleRoot = merkleRoot
        this.totalProofs = totalProofs
        this.fromAddress = fromAddress
        this.evidenceType = evidenceType
        this.expirationHeight = expirationHeight

        if (!this.isValid()) {
            throw new TypeError("Invalid MsgClaim properties.")
        }
    }
    /**
     *
     * Creates a JSON object with the MsgClaim properties
     * @returns {JSON} - JSON Object.
     * @memberof MsgClaim
     */
    public toJSON() {
        return {
            header: this.header.toJSON(),
            merkle_root: this.merkleRoot,
            total_proofs: Number(this.totalProofs.toString()),
            from_address: this.fromAddress,
            evidence_type: this.evidenceType,
            expiration_height: Number(this.expirationHeight.toString()),
        }
    }
    /**
     *
     * Check if the MsgClaim object is valid
     * @returns {boolean} - True or false.
     * @memberof MsgClaim
     */
    public isValid(): boolean {
        return (
            this.header.isValid() &&
            this.merkleRoot.hash.length > 0 &&
            Number(this.merkleRoot.sum.toString()) >= 0 &&
            Hex.validateAddress(this.fromAddress) &&
            Number(this.expirationHeight.toString()) >= 0
        )
    }
}
