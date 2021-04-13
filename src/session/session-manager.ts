import { SessionHeader } from "../rpc/models/input/session-header"
import { Session } from "../rpc/models/output/session"
import { IKVStore } from "../storage/kv-store"
import { Configuration } from "../config"
import { DispatchResponse } from "../rpc/models/output/dispatch-response"
import { RpcError } from "../rpc/errors/rpc-error"
import { RPC } from "../rpc/rpc"
import { Node } from "../rpc/models"
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
  private readonly sessionMap: Map<string, Queue<Session>>
  private readonly routingTable: RoutingTable
  private readonly sessionMapKey: string = "SESSIONS_KEY"

  /**
   * Creates an instance of SessionManager.
   * @param {URL[]} dispatchers - Dispatcher's list.
   * @param {Configuration} configuration - Pocket Configuration.
   * @param {IKVStore} store - KVStore implementation.
   * @memberof SessionManager
   */
  constructor(dispatchers: URL[], configuration: Configuration , store: IKVStore) {
    this.routingTable = new RoutingTable(dispatchers, configuration, store)
    this.sessionMap = new Map()

    if (this.routingTable.store.has(this.sessionMapKey)) {
      this.sessionMap = this.routingTable.store.get(this.sessionMapKey)
    } else {
      this.sessionMap = new Map()
      this.routingTable.store.add(this.sessionMapKey, this.sessionMap)
    }
  }

  /**
   * Adds a new node to the routing table dispatcher's list
   * @param {Node} dispatcher - New dispatcher.
   * @memberof SessionManager
   */
  public addNewDispatcher(dispatcher: Node) {
    this.routingTable.addDispatcher(dispatcher.serviceURL)
  }

  /**
   * Returns the routing table dispatcher's count
   * @returns {Number} - Dispatcher's count.
   * @memberof SessionManager
   */
  public getDispatchersCount() {
    return this.routingTable.dispatchersCount
  }

  /**
   * Update the current session using an already requested dispatch response. Returns a Promise with the Session object or an Error when something goes wrong.
   * @param {PocketAAT} pocketAAT - Pocket Authentication Token.
   * @param {string} chain - Name of the Blockchain.
   * @param {Configuration} configuration - Configuration object.
   * @returns {Promise}
   * @memberof SessionManager
   */
  public async updateCurrentSession(
    dispatchResponse: DispatchResponse,
    pocketAAT: PocketAAT,
    chain: string,
    configuration: Configuration
  ): Promise<Session | Error> {
    let session: Session
    try {
      session = Session.fromJSON(
        JSON.stringify(dispatchResponse.toJSON())
      )
    } catch (error) {
      return error
    }

    if (session !== undefined) {
      const key = this.getSessionKey(pocketAAT, chain)

      return this.saveSession(key, session, configuration)
    } else {
      // Remove node from dispatcher if it failed 3 times
      return new Error("Error decoding session from Dispatch response")
    }
  }
  /**
   * Request a new session object. Returns a Promise with the Session object or an Error when something goes wrong.
   * @param {PocketAAT} pocketAAT - Pocket Authentication Token.
   * @param {string} chain - Name of the Blockchain.
   * @param {Configuration} configuration - Configuration object.
   * @returns {Promise}
   * @memberof SessionManager
   */
  public async requestCurrentSession(
    pocketAAT: PocketAAT,
    chain: string,
    configuration: Configuration
  ): Promise<Session | Error> {
    // Retrieve a dispatcher from the routing table
    const dispatcher = this.routingTable.getDispatcher()

    if (typeGuard(dispatcher, Error)) {
      return dispatcher
    }

    const key = this.getSessionKey(pocketAAT, chain)

    if (!this.sessionMap.has(key)) {
      this.sessionMap.set(key, new Queue())
    }

    const rpc = new RPC(new HttpRpcProvider(dispatcher))
    const header = new SessionHeader(pocketAAT.applicationPublicKey, chain, BigInt(0))
    const dispatchRequest: DispatchRequest = new DispatchRequest(header)

    // Perform a dispatch request
    const result = await rpc.client.dispatch(dispatchRequest, configuration.requestTimeOut, configuration.rejectSelfSignedCertificates)

    if (typeGuard(result, DispatchResponse)) {
      let session: Session
      try {
        session = Session.fromJSON(
          JSON.stringify(result.toJSON())
        )
      } catch (error) {
        return error
      }

      if (session !== undefined) {
        const key = this.getSessionKey(pocketAAT, chain)
        
        return this.saveSession(key, session, configuration)
      } else {
        // Remove node from dispatcher if it failed 3 times
        return new Error("Error decoding session from Dispatch response")
      }
    } else {
      // Remove the failed dispatcher from the routing table
      this.routingTable.deleteDispatcher(dispatcher)
      // Request the session again
      return await this.requestCurrentSession(pocketAAT, chain, configuration)
    }
  }

  /**
   * Returns the current session for an specific Blockchain. Request a new session object if there's no an active Session for the specified blockchain. Returns a Promise with the Session object or a RpcErrorResponse when something goes wrong.
   * @param {PocketAAT} pocketAAT - Pocket Authentication Token.
   * @param {string} chain - Name of the Blockchain.
   * @param {Configuration} configuration - Configuration object.
   * @returns {Promise}
   * @memberof SessionManager
   */
  public async getCurrentSession(
    pocketAAT: PocketAAT,
    chain: string,
    configuration: Configuration
  ): Promise<Session | Error> {

    const key = this.getSessionKey(pocketAAT, chain)
    if (!this.sessionMap.has(key)) {
      return await this.requestCurrentSession(pocketAAT, chain, configuration)
    }

    const currentSession = (this.sessionMap.get(key) as Queue<Session>).front
    if (currentSession !== undefined) {
      return currentSession
    } else {
      return await this.requestCurrentSession(pocketAAT, chain, configuration)
    }
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
  public saveSession(
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
