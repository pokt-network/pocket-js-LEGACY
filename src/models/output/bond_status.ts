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

export namespace BondStatus {
  export function getStatus(status: string): BondStatus {
    switch (status) {
      case "bonded":
<<<<<<< HEAD
        return BondStatus.bonded;
      case "unbonding":
        return BondStatus.unbonding;
      default:
        return BondStatus.unbonded;
=======
        return BondStatus.bonded
      case "unbonding":
        return BondStatus.unbonding
      default:
        return BondStatus.unbonded
>>>>>>> 02ea9ae... Renaming files to match naming conventions
    }
  }
}
