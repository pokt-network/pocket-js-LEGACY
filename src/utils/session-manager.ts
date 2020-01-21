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
  private readonly sessionQueue: Queue<Session>
  private readonly routingTable: Routing

  constructor(routingTable: Routing, store: IKVStore = new InMemoryKVStore()) {
    this.store = store
    this.routingTable = routingTable
    this.sessionQueue = new Queue()
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
    
    const dispatchRequest: DispatchRequest = new DispatchRequest(header)
    const result = await RequestManager.dispatch(dispatchRequest, node as Node, configuration)

    switch(true) {
      case typeGuard(result, DispatchResponse):
        const session: Session = Session.fromJSON(
          JSON.stringify(result.toJSON())
        )

        if (this.sessionQueue.length > configuration.maxSessions) {
          this.sessionQueue.enqueue(session)

          if (typeGuard(session, Session)) {
            this.saveCurrentSession() 
          }

          return this.getCurrentSession()
        }
        return new RpcErrorResponse(
          "500",
          "You have reached the maximum number of sessions"
        )

        default:
          return result as RpcErrorResponse
    }
  }

  public getCurrentSession(): Session | RpcErrorResponse {

    const currentSession = this.sessionQueue.front
    if (currentSession !== undefined) {
      return currentSession
    }

    return new RpcErrorResponse("500", "Session not found")
  }

  public destroySession() {
    this.sessionQueue.dequeue()
  }

  private saveCurrentSession() {
    const currentSession = this.getCurrentSession()
    this.store.add(
      (currentSession as Session).sessionKey,
      currentSession
    )
  }
}
