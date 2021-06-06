/**
 *
 * JailedStatus enum with the possible Jailed status values
 */
 export enum JailedStatus {
    NA = "",
    Jailed = 1,
    Unjailed = 2
}
/**
 *
 * JailedStatus enum utility
 */
export namespace JailedStatus {
    /**
     *
     * Returns the JailedStatus by passing an string
     * @param {string} status - Staking status string.
     * @returns {JailedStatus} - JailedStatus object.
     * @memberof JailedStatus
     */
    export function getStatus(status: number): JailedStatus {
        switch (status) {
            case 1:
                return JailedStatus.Jailed
            case 2:
                return JailedStatus.Unjailed
            default:
                return JailedStatus.NA
        }
    }
}