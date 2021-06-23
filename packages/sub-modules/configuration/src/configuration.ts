// Object holding the max, min and default values
export const LIMITER = {
  maxDispatchers: {
    default: 50,
    min: 1,
    max: 1000
  },
  maxSessions: {
    default: 1,
    min: 1,
    max: 1000
  },
  requestTimeout: {
    default: 40000,
    min: 10000,
    max: 200000,
  },
  sessionBlockFrequency: {
    default: 1,
    min: 1,
    max: 50
  },
  maxSessionRefreshRetries: {
    default: 1,
    min: 1,
    max: 10
  },
  consensusNodeCount: {
    default: 0,
    min: 0,
    max: 100
  },
  acceptDisputedResponse: {
    default: false
  },
  validateRelayResponses: {
    default: true
  },
  rejectSelfSignedCertificates: {
    default: true
  }
}

/**
 *
 *
 * @class Configuration
 */
export class Configuration {
public readonly maxDispatchers: number = LIMITER.maxDispatchers.default
public readonly maxSessions: number = LIMITER.maxSessions.default
public consensusNodeCount: number = LIMITER.consensusNodeCount.default
public readonly requestTimeout: number = LIMITER.requestTimeout.default
public readonly acceptDisputedResponses: boolean = LIMITER.acceptDisputedResponse.default
public readonly sessionBlockFrequency: number = LIMITER.sessionBlockFrequency.default
public readonly maxSessionRefreshRetries: number = LIMITER.maxSessionRefreshRetries.default
public readonly validateRelayResponses: boolean = LIMITER.validateRelayResponses.default
public readonly rejectSelfSignedCertificates: boolean = LIMITER.rejectSelfSignedCertificates.default

  /**
   * Stores multiple properties used to interact with the Pocket Network.
   *
   * @constructor
   * @param {number} maxDispatchers - (optional) Maximun amount of dispatchers urls to stored in rounting table; min 1, max 1000 and default 50.
   * @param {number} maxSessions - (optional) Maximun amount of sessions to stored for the session manager; min 1, max 1000 and default 0.
   * @param {number} consensusNodeCount - (optional) Maximun amount of nodes for local consensus, mandatory ODD number; min 0, max 100 and default 0.
   * @param {number} requestTimeout - (optional) Maximun timeout for every request in miliseconds; min 1000, max 200000 and default 40000.
   * @param {boolean} acceptDisputedResponses - (optional) Accept or reject responses based on having a full consensus, default false.
   * @param {number} sessionBlockFrequency - (optional) Amount of blocks that need to elapse for a new session to be tumbled, look at https://github.com/pokt-network/pocket-network-genesis for more information; min 1, max 50 and default 1.
   * @param {number} maxSessionRefreshRetries - (optional) Amount of times to perform a session refresh in case of getting error code 1124 (Invalid Session); min 1, max 10 and default 1.
   * @param {boolean} validateRelayResponses - (optional) If True the relay responses are validated againt's the relay request information, False will not validate; default true.
   * @param {boolean} rejectSelfSignedCertificates - (optional) If True the HTTP RPC provider will force certificates to come from CAs, False will allow self signed; default true.
   * @memberof Configuration
   */
  constructor(
    maxDispatchers: number = LIMITER.maxDispatchers.default,
    maxSessions: number = LIMITER.maxSessions.default,
    consensusNodeCount: number = LIMITER.consensusNodeCount.default,
    requestTimeout: number = LIMITER.requestTimeout.default,
    acceptDisputedResponses: boolean = LIMITER.acceptDisputedResponse.default,
    sessionBlockFrequency: number = LIMITER.sessionBlockFrequency.default,
    maxSessionRefreshRetries: number = LIMITER.maxSessionRefreshRetries.default,
    validateRelayResponses: boolean = LIMITER.validateRelayResponses.default,
    rejectSelfSignedCertificates: boolean = LIMITER.rejectSelfSignedCertificates.default,
  ) {
    
    if (maxDispatchers > LIMITER.maxDispatchers.max) {
      throw new Error(`Failed to instantiate a Configuration class due to maxDispatchers = ${maxDispatchers} exceeding the limit of ${LIMITER.maxDispatchers.max}`)
    }else if (maxDispatchers < LIMITER.maxDispatchers.min){
      throw new Error(`Failed to instantiate a Configuration class due to maxDispatchers = ${maxDispatchers} exceeding the limit of ${LIMITER.maxDispatchers.min}`)
    }else {
      this.maxDispatchers = maxDispatchers
    }

    if (maxSessions > LIMITER.maxSessions.max) {
      throw new Error(`Failed to instantiate a Configuration class due to maxSessions = ${maxSessions} exceeding the limit of ${LIMITER.maxSessions.max}`)
    }else if (maxSessions < LIMITER.maxSessions.min){
      throw new Error(`Failed to instantiate a Configuration class due to maxSessions = ${maxSessions} exceeding the limit of ${LIMITER.maxSessions.min}`)
    }else {
      this.maxSessions = maxSessions
    }

    if (consensusNodeCount > LIMITER.consensusNodeCount.max) {
      throw new Error(`Failed to instantiate a Configuration class due to consensusNodeCount = ${consensusNodeCount} exceeding the limit of ${LIMITER.consensusNodeCount.max}`)
    }else if (consensusNodeCount < LIMITER.consensusNodeCount.min){
      throw new Error(`Failed to instantiate a Configuration class due to consensusNodeCount = ${consensusNodeCount} exceeding the limit of ${LIMITER.consensusNodeCount.min}`)
    }else {
      if (consensusNodeCount % 2 === 1 || consensusNodeCount === 0) {
        this.consensusNodeCount = consensusNodeCount
      }else {
        throw new Error(`Failed to instantiate a Configuration class due to consensusNodeCount = ${consensusNodeCount} not being an odd number`)
      }
    }

    if (requestTimeout > LIMITER.requestTimeout.max) {
      throw new Error(`Failed to instantiate a Configuration class due to requestTimeout = ${requestTimeout} exceeding the limit of ${LIMITER.requestTimeout.max}`)
    }else if (requestTimeout < LIMITER.requestTimeout.min){
      throw new Error(`Failed to instantiate a Configuration class due to requestTimeout = ${requestTimeout} exceeding the limit of ${LIMITER.requestTimeout.max}`)
    }else {
      this.requestTimeout = requestTimeout
    }

    if (sessionBlockFrequency > LIMITER.sessionBlockFrequency.max) {
      throw new Error(`Failed to instantiate a Configuration class due to sessionBlockFrequency = ${sessionBlockFrequency} exceeding the limit of ${LIMITER.sessionBlockFrequency.max}`)
    }else if (sessionBlockFrequency < LIMITER.sessionBlockFrequency.min){
      throw new Error(`Failed to instantiate a Configuration class due to sessionBlockFrequency = ${sessionBlockFrequency} exceeding the limit of ${LIMITER.sessionBlockFrequency.max}`)
    }else {
      this.sessionBlockFrequency = sessionBlockFrequency
    }

    if (maxSessionRefreshRetries > LIMITER.maxSessionRefreshRetries.max) {
      throw new Error(`Failed to instantiate a Configuration class due to maxSessionRefreshRetries = ${maxSessionRefreshRetries} exceeding the limit of ${LIMITER.maxSessionRefreshRetries.max}`)
    }else if (maxSessionRefreshRetries < LIMITER.maxSessionRefreshRetries.min){
      throw new Error(`Failed to instantiate a Configuration class due to maxSessionRefreshRetries = ${maxSessionRefreshRetries} exceeding the limit of ${LIMITER.maxSessionRefreshRetries.max}`)
    }else {
      this.maxSessionRefreshRetries = maxSessionRefreshRetries
    }

    this.acceptDisputedResponses = acceptDisputedResponses
    this.validateRelayResponses = validateRelayResponses
    this.rejectSelfSignedCertificates = rejectSelfSignedCertificates
  }
  
}
