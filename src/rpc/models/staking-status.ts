/**
 *
 * StakingStatus enum with the possible Staking status values
 */
export enum StakingStatus {
    Staked = "staked",
    Unstaked = "unstaked",
    Unstaking = "unstaking",
    None = ""
}
/**
 *
 * StakingStatus enum utility
 */
export namespace StakingStatus {
    /**
     *
     * Returns the StakingStatus by passing an string
     * @param {string} status - Staking status string.
     * @returns {StakingStatus} - StakingStatus object.
     * @memberof StakingStatus
     */
    export function getStatus(status: string): StakingStatus {
        switch (status) {
            case "staked":
                return StakingStatus.Staked
            case "unstaked":
                return StakingStatus.Unstaked
            case "unstaking":
                return StakingStatus.Unstaking
            case "":
                return StakingStatus.None
            default:
                return StakingStatus.None
        }
    }
}