import { SessionHeader } from "../input"
import { EvidenceType } from "../evidence-type"
import { Hex } from "@pokt-network/pocket-js-utils"

// HashSum
export interface HashSum {
    merkleHash: string,
    range: {
        lower: BigInt,
        upper: BigInt
    }
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
            const merkleRoot = {
                merkleHash: jsonObject.merkle_root.merkleHash,
                range: {
                    lower: BigInt(jsonObject.merkle_root.range.lower),
                    upper: BigInt(jsonObject.merkle_root.range.upper)
                }
            } as HashSum
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
            merkle_root: {
                merkleHash: this.merkleRoot.merkleHash,
                range: {
                    lower: this.merkleRoot.range.lower,
                    upper: this.merkleRoot.range.upper
                }
            },
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
            this.merkleRoot.merkleHash.length > 0 &&
            Number(this.merkleRoot.range.lower.toString()) >= 0 &&
            Number(this.merkleRoot.range.upper.toString()) >= 0 &&
            Hex.validateAddress(this.fromAddress) &&
            Number(this.expirationHeight.toString()) >= 0
        )
    }
}
