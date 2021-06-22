/**
 *
 * StakingStatus enum with the possible Staking status values
 */
export enum StakingStatus {
    na = "",
    unstaked = 0,
    unstaking = 1,
    staked = 2
}
/**
 *
 * StakingStatus enum utility
 */
export namespace StakingStatus {
    /**
     *
     * Returns the StakingStatus by passing an string
     *
     * @param {string} status - Staking status string.
     * @returns {StakingStatus} - StakingStatus object.
     * @memberof StakingStatus
     */
    export function getStatus(status: number): StakingStatus {
        switch (status) {
            case 0:
                return StakingStatus.unstaked
            case 1:
                return StakingStatus.unstaking
            case 2:
                return StakingStatus.staked
            default:
                return StakingStatus.na
        }
    }
}