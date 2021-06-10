/**
 * @author Pabel Nunez <pabel@pokt.network>
 * @description Unit tests for the Configuration Class
 */
import { expect } from "chai";
import { Configuration, LIMITER } from "../../src";

describe("Configuration tests", () => {
  describe("Success scenarios", () => {
    it("should initialize a new Configuration using the default values", () => {
      expect(function () {
        new Configuration();
      }).to.not.throw();
    }).timeout(0);

    it("should initialize a new Configuration using average values", () => {
      expect(function () {
        new Configuration(5, 5, 0, 50000, true, undefined, 3, false, false);
      }).to.not.throw();
    }).timeout(0);
  });

  describe("Error scenarios", () => {
    it("should fail to initialize a new Configuration due to maxDispatchers lower than minimum", () => {
        const maxDispatchers = 0
        expect(function () {
        new Configuration(maxDispatchers);
      }).to.throw("Failed to instantiate a Configuration class due to maxDispatchers = "+maxDispatchers+" is below the minimum of "+LIMITER.max_dispatchers.min);
    }).timeout(0);

    it("should fail to initialize a new Configuration due to maxDispatchers exceeding the maximum", () => {
        const maxDispatchers = 1001
        expect(function () {
        new Configuration(maxDispatchers);
      }).to.throw("Failed to instantiate a Configuration class due to maxDispatchers = "+maxDispatchers+" exceeding the limit of "+LIMITER.max_dispatchers.max);
    }).timeout(0);

    it("should fail to initialize a new Configuration due to maxSessions lower than minimum", () => {
        const maxSessions = 0
        expect(function () {
        new Configuration(undefined, maxSessions);
      }).to.throw("Failed to instantiate a Configuration class due to maxSessions = "+maxSessions+" is below the minimum of "+LIMITER.max_sessions.min);
    }).timeout(0);

    it("should fail to initialize a new Configuration due to maxSessions exceeding the maximum", () => {
        const maxSessions = 1001
        expect(function () {
        new Configuration(undefined, maxSessions);
      }).to.throw("Failed to instantiate a Configuration class due to maxSessions = "+maxSessions+" exceeding the limit of "+LIMITER.max_sessions.max);
    }).timeout(0);

    it("should fail to initialize a new Configuration due to consensusNodeCount lower than minimum", () => {
        const consensusNodeCount = -1
        expect(function () {
        new Configuration(undefined, undefined, consensusNodeCount);
      }).to.throw("Failed to instantiate a Configuration class due to consensusNodeCount = "+consensusNodeCount+" is below the minimum of "+LIMITER.consensus_node_count.min);
    }).timeout(0);

    it("should fail to initialize a new Configuration due to consensusNodeCount exceeding the maximum", () => {
        const consensusNodeCount = 101
        expect(function () {
        new Configuration(undefined, undefined, consensusNodeCount);
      }).to.throw("Failed to instantiate a Configuration class due to consensusNodeCount = "+consensusNodeCount+" exceeding the limit of "+LIMITER.consensus_node_count.max);
    }).timeout(0);

    it("should fail to initialize a new Configuration due to consensusNodeCount not being an odd number", () => {
        const consensusNodeCount = 2
        expect(function () {
        new Configuration(undefined, undefined, consensusNodeCount);
      }).to.throw("Failed to instantiate a Configuration class due to consensusNodeCount = "+consensusNodeCount+" not being an odd number");
    }).timeout(0);

    it("should fail to initialize a new Configuration due to requestTimeOut lower than minimum", () => {
        const requestTimeOut = 1000
        expect(function () {
        new Configuration(undefined, undefined, undefined, requestTimeOut);
      }).to.throw("Failed to instantiate a Configuration class due to requestTimeOut = "+requestTimeOut+" is below the minimum of "+LIMITER.request_timeout.min);
    }).timeout(0);

    it("should fail to initialize a new Configuration due to requestTimeOut exceeding the maximum", () => {
        const requestTimeOut = 220000
        expect(function () {
        new Configuration(undefined, undefined, undefined, requestTimeOut);
      }).to.throw("Failed to instantiate a Configuration class due to requestTimeOut = "+requestTimeOut+" exceeding the limit of "+LIMITER.request_timeout.max);
    }).timeout(0);

    it("should fail to initialize a new Configuration due to sessionBlockFrequency lower than minimum", () => {
        const sessionBlockFrequency = 0
        expect(function () {
        new Configuration(undefined, undefined, undefined, undefined, undefined, sessionBlockFrequency);
      }).to.throw("Failed to instantiate a Configuration class due to sessionBlockFrequency = "+sessionBlockFrequency+" is below the minimum of "+LIMITER.session_block_frequency.min);
    }).timeout(0);

    it("should fail to initialize a new Configuration due to sessionBlockFrequency exceeding the maximum", () => {
        const sessionBlockFrequency = 100
        expect(function () {
        new Configuration(undefined, undefined, undefined, undefined, undefined, sessionBlockFrequency);
      }).to.throw("Failed to instantiate a Configuration class due to sessionBlockFrequency = "+sessionBlockFrequency+" exceeding the limit of "+LIMITER.session_block_frequency.max);
    }).timeout(0);

    it("should fail to initialize a new Configuration due to maxSessionRefreshRetries lower than minimum", () => {
        const maxSessionRefreshRetries = 0
        expect(function () {
        new Configuration(undefined, undefined, undefined, undefined, undefined, undefined, maxSessionRefreshRetries);
      }).to.throw("Failed to instantiate a Configuration class due to maxSessionRefreshRetries = "+maxSessionRefreshRetries+" is below the minimum of "+LIMITER.max_session_refresh_retries.min);
    }).timeout(0);

    it("should fail to initialize a new Configuration due to maxSessionRefreshRetries exceeding the maximum", () => {
        const maxSessionRefreshRetries = 20
        expect(function () {
        new Configuration(undefined, undefined, undefined, undefined, undefined, undefined, maxSessionRefreshRetries);
      }).to.throw("Failed to instantiate a Configuration class due to maxSessionRefreshRetries = "+maxSessionRefreshRetries+" exceeding the limit of "+LIMITER.max_session_refresh_retries.max);
    }).timeout(0);
  });
}).timeout(0);
