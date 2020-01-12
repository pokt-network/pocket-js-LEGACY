import { Node } from "../models/node";
import { PocketAAT } from 'pocket-aat-js';

/**
 *
 *
 * @class Configuration
 */
export class Configuration {

  public readonly blockchains: string[]
  public readonly pocketAAT: PocketAAT
  public readonly maxNodes: number = 5
  public readonly requestTimeOut: number = 10000
  public readonly sslOnly: boolean = true
  public readonly maxSessions: number = 10

  /**
   * Configuration stores settings.
   * @constructor
   * @param {string[]} blockchains - Blockchain hash list.
   * @param {PocketAAT} pocketAAT - Pocket Authentication Token.
   * @param {string} maxNodes - (optional) Maximun amount of nodes to store in instance, default 5.
   * @param {string} requestTimeOut - (optional) Maximun timeout for every request in miliseconds, default 10000.
   * @param {string} sslOnly - (optional) Indicates if you prefer nodes with ssl enabled only, default is true.
   * @param {Node[]} nodes - (optional) Node list.
   */
  constructor(
    blockchains: string[],
    pocketAAT: PocketAAT,
    maxNodes: number,
    requestTimeOut: number,
    sslOnly: boolean
  ) {
    this.blockchains = blockchains
    this.pocketAAT = pocketAAT,
    this.maxNodes = maxNodes || 5
    this.requestTimeOut = requestTimeOut || 10000
    this.sslOnly = sslOnly || true
  }
  /**
   * Verify if the configuration is valid
   *
   * @returns {Boolean}
   * @memberof Configuration
   */
  public isValid(): boolean {
    this.blockchains.length != 0 && this.pocketAAT.isValid()
    return false
  }
}
