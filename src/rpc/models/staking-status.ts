export enum StakingStatus {
    Staked = "staked",
    Unstaked = "unstaked",
    Unstaking = "unstaking",
    None = ""
}
export namespace StakingStatus {
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