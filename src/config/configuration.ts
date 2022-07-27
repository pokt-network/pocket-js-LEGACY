/**
 *
 *
 * @class Configuration
 */
export class Configuration {
  public readonly maxDispatchers: number = 50
  public readonly maxSessions: number = 0
  public consensusNodeCount: number = 0
  public readonly requestTimeOut: number = 0
  public readonly acceptDisputedResponses: boolean = false
  public readonly sessionBlockFrequency: number = 4
  public readonly blockTime: number = 900000
  public readonly maxSessionRefreshRetries: number = 1
  public readonly validateRelayResponses: boolean = true
  public readonly rejectSelfSignedCertificates: boolean = true
  public readonly useLegacyTxCodec: boolean = false

  /**
   * Stores multiple properties used to interact with the Pocket Network.
   * @constructor
   * @param {number} maxDispatchers - (optional) Maximun amount of dispatchers urls to stored in rounting table, default 50.
   * @param {number} maxSessions - (optional) Maximun amount of sessions to stored for the session manager, default 0.
   * @param {number} consensusNodeCount - (optional) Maximun amount of nodes for local consensus, mandatory ODD number, default 0.
   * @param {number} requestTimeOut - (optional) Maximun timeout for every request in miliseconds, default 0.
   * @param {boolean} acceptDisputedResponses - (optional) Accept or reject responses based on having a full consensus, default false.
   * @param {number} sessionBlockFrequency - (optional) Amount of blocks that need to elapse for a new session to be tumbled, look at https://github.com/pokt-network/pocket-network-genesis for more information.
   * @param {number} blockTime - (optional) Amount of time (in milliseconds) for a new block to be produced in the Pocket Network.
   * @param {number} maxSessionRefreshRetries - (optional) Amount of times to perform a session refresh in case of getting error code 1124 (Invalid Session), default 1.
   * @param {boolean} validateRelayResponses - (optional) If True the relay responses are validated againt's the relay request information, False will not validate.
   * @param {boolean} rejectSelfSignedCertificates - (optional) If True the HTTP RPC provider will force certificates to come from CAs, False will allow self signed.
   * @param {boolean} useLegacyTxCodec - (optional) If True the legacy tx codec will be used (AminoJS), false will use the new ProtoBuf encoding, default is true.
   * @memberof Configuration
   */
  constructor(
    maxDispatchers: number = 50,
    maxSessions: number = 0,
    consensusNodeCount: number = 0,
    requestTimeOut: number = 0,
    acceptDisputedResponses: boolean = false,
    sessionBlockFrequency: number = 25,
    blockTime: number = 60000,
    maxSessionRefreshRetries: number = 1,
    validateRelayResponses: boolean = true,
    rejectSelfSignedCertificates: boolean = true,
    useLegacyTxCodec: boolean = false
  ) {
    this.maxDispatchers = maxDispatchers
    this.maxSessions = maxSessions
    if (consensusNodeCount % 2 === 1 || consensusNodeCount === 0) {
      this.consensusNodeCount = consensusNodeCount
    }else {
      throw new Error("Failed to instantiate a Configuration class object due to consensusNodeCount not being an odd number.")
    }
    this.requestTimeOut = requestTimeOut
    this.acceptDisputedResponses = acceptDisputedResponses
    this.sessionBlockFrequency = sessionBlockFrequency
    this.blockTime = blockTime
    this.maxSessionRefreshRetries = maxSessionRefreshRetries
    this.validateRelayResponses = validateRelayResponses
    this.rejectSelfSignedCertificates = rejectSelfSignedCertificates
    this.useLegacyTxCodec = useLegacyTxCodec
  }
  public setconsensusNodeCount(v: number){
    this.consensusNodeCount = v
  }
}
