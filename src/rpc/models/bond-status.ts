/**
 *
 * BondStatus enum with the possible Bond status values
 */
export enum BondStatus {
  bonded,
  unbonding,
  unbonded
}
/**
 *
 * BondStatus enum utility
 */
export namespace BondStatusUtil {
  /**
   *
   * Returns the BondStatus by passing an string
   * @param {string} status - Bond status string.
   * @returns {BondStatus} - BondStatus object.
   * @memberof BondStatusUtil
   */
  export function getStatus(status: string): BondStatus {
    switch (status) {
      case "bonded":
        return BondStatus.bonded
      case "unbonding":
        return BondStatus.unbonding
      default:
        return BondStatus.unbonded
    }
  }
}
