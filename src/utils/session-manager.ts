import { SessionHeader } from "../models/input/session-header"
import { Session } from "../models/output/session"
import { IKVStore } from "../utils/storage/kv-store"
import { InMemoryKVStore } from "./storage/in-memory-kv-store"
import { Node } from "../models"
import { Configuration } from "../configuration/configuration"
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

  constructor(routingTable: Routing, store: IKVStore = new InMemoryKVStore()) {
    this.store = store
    this.routingTable = routingTable
    this.sessionMap = new Map()

    if(this.store.has(this.sessionMapKey)){
      this.sessionMap = this.store.get(this.sessionMapKey)
    }

  }

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

    switch(true) {
      case typeGuard(result, DispatchResponse):
        const session: Session = Session.fromJSON(
          JSON.stringify(result.toJSON())
        )

        if (sessionQueue.length > configuration.maxSessions) {
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

        default:
          return result as RpcErrorResponse
    }
  }

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

  public destroySession(chain: string) {
    (this.sessionMap.get(chain) as Queue<Session>).dequeue()
  }

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
