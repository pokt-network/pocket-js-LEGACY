/**
 *
 * JailedStatus enum with the possible Jailed status values
 */
export enum JailedStatus {
    na = "",
    jailed = 1,
    unjailed = 2
}
/**
 *
 * JailedStatus enum utility
 */
export namespace JailedStatus {
    /**
     *
     * Returns the JailedStatus by passing an string
     *
     * @param {string} status - Staking status string.
     * @returns {JailedStatus} - JailedStatus object.
     * @memberof JailedStatus
     */
    export function getStatus(status: number): JailedStatus {
        switch (status) {
            case 1:
                return JailedStatus.jailed
            case 2:
                return JailedStatus.unjailed
            default:
                return JailedStatus.na
        }
    }
}