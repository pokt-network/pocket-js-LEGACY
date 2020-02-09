/**
 *
 *
 * @class BondStatus
 */

export enum BondStatus {
  bonded,
  unbonding,
  unbonded
}

export namespace BondStatusUtil {
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
