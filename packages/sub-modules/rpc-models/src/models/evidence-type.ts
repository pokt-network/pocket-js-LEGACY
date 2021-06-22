/**
 *
 * EvidenceType enum with the possible evidence types
 */
export enum EvidenceType {
    relay = 0,
    challenge = 1
}
/**
 *
 * EvidenceType enum utility
 */
export namespace EvidenceType {
    /**
     *
     * Returns the EvidenceType by passing an string
     *
     * @param {string} type - Evidence type string.
     * @returns {EvidenceType} - EvidenceType object.
     * @memberof EvidenceType
     */
    export function getType(type: number): EvidenceType {
        switch (type) {
            case 0:
                return EvidenceType.relay
            case 1:
                return EvidenceType.challenge
            default:
                return EvidenceType.relay
        }
    }
}