import { SessionHeader } from "../rpc/models/input/session-header"
import { Session } from "../rpc/models/output/session"
import { IKVStore } from "../storage/kv-store"
import { Node } from "../rpc/models"
import { Configuration } from "../config"
import { DispatchResponse } from "../rpc/models/output/dispatch-response"
import { RpcError } from "../rpc/errors/rpc-error"
import { RPC } from "../rpc/rpc"
import { DispatchRequest } from "../rpc/models/input/dispatch-request"
import { typeGuard } from "../utils/type-guard"
import { Queue } from "./queue"
import { RoutingTable } from "../routing-table/routing-table"
import { HttpRpcProvider } from "../rpc"

/**
 *
 *
 * @class SessionManager
 * This class provides a TypeScript implementation of the bech32 format specified in BIP 173 --> https://github.com/bitcoin/bips/blob/master/bip-0173.mediawiki.
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
    applicationPubKey: string, 
    chain: string,
    configuration: Configuration,
    sessionBlockHeight: BigInt = BigInt(0)
  ): Promise<Session | RpcError> {
    const node = this.routingTable.getNode()

    if (!typeGuard(node, Node)) {
      return new RpcError(
        "500",
        "You have reached the maximum number of sessions"
      )
    }
    
    if(!this.sessionMap.has(chain)) {
      this.sessionMap.set(chain, new Queue())
    }
    const rpc = new RPC(new HttpRpcProvider(new URL(node.serviceURL)))
    const header = new SessionHeader(applicationPubKey, chain, sessionBlockHeight)
    const dispatchRequest: DispatchRequest = new DispatchRequest(header)
    const result = await rpc.client.dispatch(dispatchRequest, configuration.requestTimeOut)
    const sessionQueue = this.sessionMap.get(chain) as Queue<Session>

    if (typeGuard(result, DispatchResponse)) {
      const session: Session = Session.fromJSON(
        JSON.stringify(result.toJSON())
      )

      if (sessionQueue.length < configuration.maxSessions) {
        sessionQueue.enqueue(session)

        if (typeGuard(session, Session)) {
          this.saveCurrentSession(header, configuration) 
        }

        return this.getCurrentSession(applicationPubKey, chain, configuration, sessionBlockHeight)
      }
      return new RpcError(
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
  public async getCurrentSession(applicationPubKey: string, chain: string, configuration: Configuration, sessionBlockHeight: BigInt = BigInt(0)): Promise<Session | RpcError> {

    if(!this.sessionMap.has(chain)){
      return await this.requestCurrentSession(applicationPubKey, chain, configuration, sessionBlockHeight)
    }

    const currentSession = (this.sessionMap.get(chain) as Queue<Session>).front
    if (currentSession !== undefined) {
      return currentSession
    }

    return new RpcError("500", "Session not found")
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
  private async saveCurrentSession(header: SessionHeader, configuration: Configuration): Promise< RpcError | undefined > {
    const currentSession = await this.getCurrentSession(header.applicationPubKey, header.chain, configuration, header.sessionBlockHeight)

    if (typeGuard(currentSession, Session)) {
      if(!this.store.has(this.sessionMapKey)) {
        const map: Map<string, Queue<Session>> = new Map()
        map.set(header.chain, new Queue<Session>())
        this.store.add(this.sessionMapKey, map)
      }
      ((this.store.get(this.sessionMapKey) as Map<string, Queue<Session>>)
      .get(header.chain) as Queue<Session>).enqueue(currentSession as Session)
      return undefined
    }else{
      return currentSession as RpcError
    }
  }
}
