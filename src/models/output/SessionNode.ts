import { BondStatus } from "./BondStatus";
import { Hex } from "../../utils/Hex";

/**
 *
 *
 * @class SessionNode
 */
export class SessionNode {
  public static fromJSON(json: string): SessionNode {
    const jsonObject = JSON.parse(json);
    const status: BondStatus = BondStatus.getStatus(jsonObject.status);

    return new SessionNode(
      jsonObject.address,
      jsonObject.cons_pubkey,
      jsonObject.jailed,
      status,
      jsonObject.stakedTokens,
      jsonObject.serviceurl,
      jsonObject.chains,
      jsonObject.unstaking_time
    );
  }

  public readonly address: string;
  public readonly consPubKey: string;
  public readonly jailed: boolean;
  public readonly status: BondStatus;
  public readonly stakedTokens: number;
  public readonly serviceURL: string;
  public readonly chains: string[];
  public readonly unstakingCompletionTime: number | undefined;

  /**
   * Create a Session Node.
   * @constructor
   * @param {string} address - the hex address of the validator
   * @param {string} consPubKey - the hex consensus public key of the validator.
   * @param {boolean} jailed - has the validator been jailed from staked status?
   * @param {BondStatus} status - validator status
   * @param {number} stakedTokens - how many staked tokens
   * @param {string} serviceURL - Service node url
   * @param {string[]} chains - chains
   * @param {number} unstakingCompletionTime - if unstaking, min time for the validator to complete unstaking
   */
  constructor(
    address: string,
    consPubKey: string,
    jailed: boolean,
    status: BondStatus,
    stakedTokens: number = 0,
    serviceURL: string,
    chains: string[] = [],
    unstakingCompletionTime?: number
  ) {
    this.address = Hex.decodeString(address);
    this.consPubKey = consPubKey;
    this.jailed = jailed;
    this.status = status;
    this.stakedTokens = stakedTokens;
    this.serviceURL = serviceURL;
    this.chains = chains;
    this.unstakingCompletionTime = unstakingCompletionTime;

    if (!this.isValid()) {
      throw new TypeError("Invalid properties length.");
    }
  }

  private isValid(): boolean {
    return this.address.length !== 0 && this.serviceURL.length !== 0;
  }
}
