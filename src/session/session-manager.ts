import { SessionHeader } from "../rpc/models/input/session-header"
import { Session } from "../rpc/models/output/session"
import { IKVStore } from "../storage/kv-store"
import { Configuration } from "../config"
import { DispatchResponse } from "../rpc/models/output/dispatch-response"
import { RpcError } from "../rpc/errors/rpc-error"
import { RPC } from "../rpc/rpc"
import { DispatchRequest } from "../rpc/models/input/dispatch-request"
import { typeGuard } from "../utils/type-guard"
import { Queue } from "./queue"
import { RoutingTable } from "../routing-table/routing-table"
import { HttpRpcProvider } from "../rpc"
import { PocketAAT } from "@pokt-network/aat-js"
import { sha3_256 } from "js-sha3"

/**
 * @class SessionManager
 */

export class SessionManager {
  private readonly store: IKVStore
  private readonly sessionMap: Map<string, Queue<Session>>
  private readonly routingTable: RoutingTable
  private readonly sessionMapKey: string = "SESSIONS_KEY"

  /**
   * Creates an instance of SessionManager.
   * @param {RoutingTable} routingTable - Element that supplies a default list of node(s) .
   * @param {IKVStore} store - KVStore implementation.
   * @memberof SessionManager
   */
  constructor(routingTable: RoutingTable, store: IKVStore) {
    this.store = store
    this.routingTable = routingTable
    this.sessionMap = new Map()

    if (this.store.has(this.sessionMapKey)) {
      this.sessionMap = this.store.get(this.sessionMapKey)
    } else {
      this.sessionMap = new Map()
      this.store.add(this.sessionMapKey, this.sessionMap)
    }
  }

  /**
   * Request a new session object. Returns a Promise with the Session object or a RpcErrorResponse when something goes wrong.
   * @param {PocketAAT} pocketAAT - Pocket Authentication Token.
   * @param {string} chain - Name of the Blockchain.
   * @param {Configuration} configuration - Configuration object.
   * @param {BigInt} sessionBlockHeight - Session Block Height.
   * @returns {Promise}
   * @memberof SessionManager
   */
  public async requestCurrentSession(
    pocketAAT: PocketAAT,
    chain: string,
    configuration: Configuration,
    sessionBlockHeight: BigInt = BigInt(0)
  ): Promise<Session | RpcError> {
    const dispatcher = this.routingTable.getDispatcher()

    if (!typeGuard(dispatcher, URL)) {
      return new RpcError(
        "500",
        "Dispatcher URL is invalid"
      )
    }

    const key = this.getSessionKey(pocketAAT, chain)
    if (!this.sessionMap.has(key)) {
      this.sessionMap.set(key, new Queue())
    }
    const rpc = new RPC(new HttpRpcProvider(dispatcher))
    const header = new SessionHeader(pocketAAT.applicationPublicKey, chain, sessionBlockHeight)
    const dispatchRequest: DispatchRequest = new DispatchRequest(header)
    const result = await rpc.client.dispatch(dispatchRequest, configuration.requestTimeOut)

    if (typeGuard(result, DispatchResponse)) {
      let session: Session
      try {
        session = Session.fromJSON(
          JSON.stringify(result.toJSON())
        )
      } catch (error) {
        return RpcError.fromError(error)
      }

      if (session !== undefined) {
        const key = this.getSessionKey(pocketAAT, chain)
        return this.saveSession(key, session, configuration)
      } else {
        return new RpcError(
          "500",
          "Error decoding session from Dispatch response"
        )
      }
    } else {
      return result
    }
  }

  /**
   * Returns the current session for an specific Blockchain. Request a new session object if there's no an active Session for the specified blockchain. Returns a Promise with the Session object or a RpcErrorResponse when something goes wrong.
   * @param {PocketAAT} pocketAAT - Pocket Authentication Token.
   * @param {string} chain - Name of the Blockchain.
   * @param {Configuration} configuration - Configuration object.
   * @param {BigInt} sessionBlockHeight - Session Block Height.
   * @returns {Promise}
   * @memberof SessionManager
   */
  public async getCurrentSession(
    pocketAAT: PocketAAT,
    chain: string,
    configuration: Configuration,
    sessionBlockHeight: BigInt = BigInt(0)
  ): Promise<Session | RpcError> {

    const key = this.getSessionKey(pocketAAT, chain)
    if (!this.sessionMap.has(key)) {
      return await this.requestCurrentSession(pocketAAT, chain, configuration, sessionBlockHeight)
    }

    const currentSession = (this.sessionMap.get(key) as Queue<Session>).front
    if (currentSession !== undefined) {
      if (currentSession.getBlocksSinceCreation(configuration) >= configuration.sessionBlockFrequency) {
        return await this.requestCurrentSession(pocketAAT, chain, configuration, sessionBlockHeight)
      } else {
        return currentSession
      }
    }

    return new RpcError("500", "Session not found")
  }

  /**
   * Creates an unique key using the PocketAAT object and the chain.
   * @param {PocketAAT} pocketAAT - Pocket Authentication Token.
   * @param {string} chain - Blockchain hash.
   * @memberof SessionManager
   */
  public getSessionKey(pocketAAT: PocketAAT, chain: string): string {
    const hash = sha3_256.create()
    hash.update(JSON.stringify(pocketAAT).concat(chain))
    return hash.toString()
  }

  /**
   * Removes the first Session in the queue for the specified blockchain.
   * @param {PocketAAT} pocketAAT - Pocket Authentication Token.
   * @param {string} chain - Blockchain hash.
   * @memberof SessionManager
   */
  public destroySession(pocketAAT: PocketAAT, chain: string) {
    const key = this.getSessionKey(pocketAAT, chain);
    (this.sessionMap.get(key) as Queue<Session>).dequeue()
  }

  /**
   * Saves the given session to the session queue
   * @param {string} key - The key under which to save the session
   * @param {Session} session - The session to save
   * @param {Configuration} configuration - The configuration to use
   */
  private saveSession(
    key: string,
    session: Session,
    configuration: Configuration
  ): Session | RpcError {
    if (!this.sessionMap.has(key)) {
      this.sessionMap.set(key, new Queue())
    }

    // Check session queue length to pop the oldest element in the queue
    const sessionQueue = this.sessionMap.get(key) as Queue<Session>
    if (configuration.maxSessions !== 0 && sessionQueue.length === configuration.maxSessions) {
      sessionQueue.dequeue()
    }

    // Append the new session to the queue
    sessionQueue.enqueue(session)
    return session
  }
}
