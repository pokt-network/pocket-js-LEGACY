// Object holding the max, min and default values
export const LIMITER = {
  max_dispatchers: {
    default: 50,
    min: 1,
    max: 1000
  },
  max_sessions: {
    default: 1,
    min: 1,
    max: 1000
  },
  request_timeout: {
    default: 40000,
    min: 10000,
    max: 200000,
  },
  session_block_frequency: {
    default: 1,
    min: 1,
    max: 50
  },
  max_session_refresh_retries: {
    default: 1,
    min: 1,
    max: 10
  },
  consensus_node_count: {
    default: 0,
    min: 0,
    max: 100
  },
  accept_disputed_response: {
    default: false
  },
  validate_relay_responses: {
    default: true
  },
  reject_self_signed_certificates: {
    default: true
  }
}

/**
 *
 *
 * @class Configuration
 */
export class Configuration {
public readonly maxDispatchers: number = LIMITER.max_dispatchers.default
public readonly maxSessions: number = LIMITER.max_sessions.default
public consensusNodeCount: number = LIMITER.consensus_node_count.default
public readonly requestTimeOut: number = LIMITER.request_timeout.default
public readonly acceptDisputedResponses: boolean = LIMITER.accept_disputed_response.default
public readonly sessionBlockFrequency: number = LIMITER.session_block_frequency.default
public readonly maxSessionRefreshRetries: number = LIMITER.max_session_refresh_retries.default
public readonly validateRelayResponses: boolean = LIMITER.validate_relay_responses.default
public readonly rejectSelfSignedCertificates: boolean = LIMITER.reject_self_signed_certificates.default

  /**
   * Stores multiple properties used to interact with the Pocket Network.
   * @constructor
   * @param {number} maxDispatchers - (optional) Maximun amount of dispatchers urls to stored in rounting table; min 1, max 1000 and default 50.
   * @param {number} maxSessions - (optional) Maximun amount of sessions to stored for the session manager; min 1, max 1000 and default 0.
   * @param {number} consensusNodeCount - (optional) Maximun amount of nodes for local consensus, mandatory ODD number; min 0, max 100 and default 0.
   * @param {number} requestTimeOut - (optional) Maximun timeout for every request in miliseconds; min 1000, max 200000 and default 40000.
   * @param {boolean} acceptDisputedResponses - (optional) Accept or reject responses based on having a full consensus, default false.
   * @param {number} sessionBlockFrequency - (optional) Amount of blocks that need to elapse for a new session to be tumbled, look at https://github.com/pokt-network/pocket-network-genesis for more information; min 1, max 50 and default 1.
   * @param {number} maxSessionRefreshRetries - (optional) Amount of times to perform a session refresh in case of getting error code 1124 (Invalid Session); min 1, max 10 and default 1.
   * @param {boolean} validateRelayResponses - (optional) If True the relay responses are validated againt's the relay request information, False will not validate; default true.
   * @param {boolean} rejectSelfSignedCertificates - (optional) If True the HTTP RPC provider will force certificates to come from CAs, False will allow self signed; default true.
   * @memberof Configuration
   */
  constructor(
    maxDispatchers: number = LIMITER.max_dispatchers.default,
    maxSessions: number = LIMITER.max_sessions.default,
    consensusNodeCount: number = LIMITER.consensus_node_count.default,
    requestTimeOut: number = LIMITER.request_timeout.default,
    acceptDisputedResponses: boolean = LIMITER.accept_disputed_response.default,
    sessionBlockFrequency: number = LIMITER.session_block_frequency.default,
    maxSessionRefreshRetries: number = LIMITER.max_session_refresh_retries.default,
    validateRelayResponses: boolean = LIMITER.validate_relay_responses.default,
    rejectSelfSignedCertificates: boolean = LIMITER.reject_self_signed_certificates.default,
  ) {
    
    if (maxDispatchers > LIMITER.max_dispatchers.max) {
      throw new Error("Failed to instantiate a Configuration class due to maxDispatchers = "+maxDispatchers+" exceeding the limit of "+LIMITER.max_dispatchers.max)
    }else if (maxDispatchers < LIMITER.max_dispatchers.min){
      throw new Error("Failed to instantiate a Configuration class due to maxDispatchers = "+maxDispatchers+" is below the minimum of "+LIMITER.max_dispatchers.min)
    }else {
      this.maxDispatchers = maxDispatchers
    }

    if (maxSessions > LIMITER.max_sessions.max) {
      throw new Error("Failed to instantiate a Configuration class due to maxSessions = "+maxSessions+" exceeding the limit of "+LIMITER.max_sessions.max)
    }else if (maxSessions < LIMITER.max_sessions.min){
      throw new Error("Failed to instantiate a Configuration class due to maxSessions = "+maxSessions+" is below the minimum of "+LIMITER.max_sessions.min)
    }else {
      this.maxSessions = maxSessions
    }

    if (consensusNodeCount > LIMITER.consensus_node_count.max) {
      throw new Error("Failed to instantiate a Configuration class due to consensusNodeCount = "+consensusNodeCount+" exceeding the limit of "+LIMITER.consensus_node_count.max)
    }else if (consensusNodeCount < LIMITER.consensus_node_count.min){
      throw new Error("Failed to instantiate a Configuration class due to consensusNodeCount = "+consensusNodeCount+" is below the minimum of "+LIMITER.consensus_node_count.min)
    }else {
      if (consensusNodeCount % 2 === 1 || consensusNodeCount === 0) {
        this.consensusNodeCount = consensusNodeCount
      }else {
        throw new Error("Failed to instantiate a Configuration class due to consensusNodeCount = "+consensusNodeCount+" not being an odd number")
      }
    }

    if (requestTimeOut > LIMITER.request_timeout.max) {
      throw new Error("Failed to instantiate a Configuration class due to requestTimeOut = "+requestTimeOut+" exceeding the limit of "+LIMITER.request_timeout.max)
    }else if (requestTimeOut < LIMITER.request_timeout.min){
      throw new Error("Failed to instantiate a Configuration class due to requestTimeOut = "+requestTimeOut+" is below the minimum of "+LIMITER.request_timeout.min)
    }else {
      this.requestTimeOut = requestTimeOut
    }

    if (sessionBlockFrequency > LIMITER.session_block_frequency.max) {
      throw new Error("Failed to instantiate a Configuration class due to sessionBlockFrequency = "+sessionBlockFrequency+" exceeding the limit of "+LIMITER.session_block_frequency.max)
    }else if (sessionBlockFrequency < LIMITER.session_block_frequency.min){
      throw new Error("Failed to instantiate a Configuration class due to sessionBlockFrequency = "+sessionBlockFrequency+" is below the minimum of "+LIMITER.session_block_frequency.min)
    }else {
      this.sessionBlockFrequency = sessionBlockFrequency
    }

    if (maxSessionRefreshRetries > LIMITER.max_session_refresh_retries.max) {
      throw new Error("Failed to instantiate a Configuration class due to maxSessionRefreshRetries = "+maxSessionRefreshRetries+" exceeding the limit of "+LIMITER.max_session_refresh_retries.max)
    }else if (maxSessionRefreshRetries < LIMITER.max_session_refresh_retries.min){
      throw new Error("Failed to instantiate a Configuration class due to maxSessionRefreshRetries = "+maxSessionRefreshRetries+" is below the minimum of "+LIMITER.max_session_refresh_retries.min)
    }else {
      this.maxSessionRefreshRetries = maxSessionRefreshRetries
    }

    this.acceptDisputedResponses = acceptDisputedResponses
    this.validateRelayResponses = validateRelayResponses
    this.rejectSelfSignedCertificates = rejectSelfSignedCertificates
  }
  
}
