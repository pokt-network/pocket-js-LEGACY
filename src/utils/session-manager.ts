import { SessionHeader } from "../models/input/session-header"
import { Session } from "../models/output/session"
import { IKVStore } from "../utils/storage/kv-store"
import { InMemoryKVStore } from "./storage/in-memory-kv-store"
import { Node } from "../models"
import { Configuration } from "../models/configuration"
import { DispatchResponse } from "../models/output/dispatch-response"
import { RpcErrorResponse } from "../models/output/rpc-error-response"
import { RequestManager } from "../request-manager"
import { DispatchRequest } from "../models/input/dispatch-request"
import { typeGuard } from "../utils/type-guard"
import { Queue } from "./structure/queue"
import { Routing } from "../models/routing"

/**
 *
 *
 * @class SessionManager
 * This class provides a TypeScript implementation of the bech32 format specified in BIP 173 --> https://github.com/bitcoin/bips/blob/master/bip-0173.mediawiki.
 */

export class SessionManager {
  private readonly store: IKVStore
  private readonly sessionMap: Map<string, Queue<Session>>
  private readonly routingTable: Routing
  private readonly sessionMapKey: string = "SESSIONS_KEY"

  /**
   * Creates an instance of SessionManager.
   * @param {Routing} routingTable - Element that supplies a default list of node(s) .
   * @param {IKVStore} store - KVStore implementation.
   * @memberof SessionManager
   */
  constructor(routingTable: Routing, store: IKVStore = new InMemoryKVStore()) {
    this.store = store
    this.routingTable = routingTable
    this.sessionMap = new Map()

    if(this.store.has(this.sessionMapKey)){
      this.sessionMap = this.store.get(this.sessionMapKey)
    }
  }

  /**
   * Request a new session object. Returns a Promise with the Session object or a RpcErrorResponse when something goes wrong.
   * @param {SessionHeader} header - SessionHeader object.
   * @param {Configuration} configuration - Configuration object.
   * @returns {Promise}
   * @memberof SessionManager
   */
  public async requestCurrentSession(
    header: SessionHeader,
    configuration: Configuration
  ): Promise<Session | RpcErrorResponse> {
    const node = this.routingTable.getNode()

    if (!typeGuard(node, Node)) {
      return new RpcErrorResponse(
        "500",
        "You have reached the maximum number of sessions"
      )
    }
    
    if(!this.sessionMap.has(header.chain)) {
      this.sessionMap.set(header.chain, new Queue())
    }
    const dispatchRequest: DispatchRequest = new DispatchRequest(header)
    const result = await RequestManager.dispatch(dispatchRequest, node as Node, configuration)
    const sessionQueue = this.sessionMap.get(header.chain) as Queue<Session>

    if (typeGuard(result, DispatchResponse)) {
      const session: Session = Session.fromJSON(
        JSON.stringify(result.toJSON())
      )

      if (sessionQueue.length < configuration.maxSessions) {
        sessionQueue.enqueue(session)

        if (typeGuard(session, Session)) {
          this.saveCurrentSession(header, configuration) 
        }

        return this.getCurrentSession(header, configuration)
      }
      return new RpcErrorResponse(
        "500",
        "You have reached the maximum number of sessions"
      )
    } else {
      return result
    }
  }

  /**
   * Returns the current session for an specific Blockchain. Request a new session object if there's no an active Session for the specified blockchain. Returns a Promise with the Session object or a RpcErrorResponse when something goes wrong.
   * @param {SessionHeader} header - SessionHeader object.
   * @param {Configuration} configuration - Configuration object.
   * @returns {Promise}
   * @memberof SessionManager
   */
  public async getCurrentSession(header: SessionHeader, configuration: Configuration): Promise<Session | RpcErrorResponse> {

    if(!this.sessionMap.has(header.chain)){
      return await this.requestCurrentSession(header, configuration)
    }

    const currentSession = (this.sessionMap.get(header.chain) as Queue<Session>).front
    if (currentSession !== undefined) {
      return currentSession
    }

    return new RpcErrorResponse("500", "Session not found")
  }

  /**
   * Removes the first Session in the queue for the specified blockchain.
   * @param {string} chain - Name of the Blockchain.
   * @memberof SessionManager
   */
  public destroySession(chain: string) {
    (this.sessionMap.get(chain) as Queue<Session>).dequeue()
  }

  /**
   * Save every new Session inside of the KVStore object. All the Sessions saved using this method can be recover if the current execution of the application is terminated.
   * @param {SessionHeader} header - SessionHeader object.
   * @param {Configuration} configuration - Configuration object
   * @memberof SessionManager
   */
  private saveCurrentSession(header: SessionHeader, configuration: Configuration) {
    this.getCurrentSession(header, configuration).then(currentSession => {
      switch(true) {
        case typeGuard(currentSession, Session):


          if(!this.store.has(this.sessionMapKey)) {
            const map: Map<string, Queue<Session>> = new Map()
            map.set(header.chain, new Queue<Session>())
            this.store.add(this.sessionMapKey, map)
          }
          ((this.store.get(this.sessionMapKey) as Map<string, Queue<Session>>)
          .get(header.chain) as Queue<Session>).enqueue(currentSession as Session)
        
        default:
          throw currentSession as RpcErrorResponse
      }
    })
  }
}
