import { SessionHeader } from "../models/input/session-header"
import { Session } from "../models/output/session"
import { KVStore } from "../utils/storage/kv-store"
import { InMemoryKVStore } from "./storage/in-memory-kv-store"
import { Node } from "../models"
import { Configuration } from "../configuration/configuration"
import { DispatchResponse } from "../models/output/dispatch-response"
import { RpcErrorResponse } from "../models/output/rpc-error-response"
import { RequestManager } from "../request-manager"
import { DispatchRequest } from "../models/input/dispatch-request"
import { typeGuard } from "../utils/type-guard";
import { Queue } from "./structure/queue"

/**
 *
 *
 * @class SessionManager
 * This class provides a TypeScript implementation of the bech32 format specified in BIP 173 --> https://github.com/bitcoin/bips/blob/master/bip-0173.mediawiki.
 */

 export class SessionManager {

    private readonly store: KVStore
    private readonly sessionQueue: Queue<Session>

    constructor(store: KVStore = new InMemoryKVStore()) {
        this.store = store
        this.sessionQueue = new Queue()
    }

    public createSession(header: SessionHeader, node: Node, configuration: Configuration) {
        const dispatchRequest: DispatchRequest = new DispatchRequest(header)
        RequestManager.dispatch(dispatchRequest, node, configuration).then((rcpErrorResponse) => {
            return rcpErrorResponse
        }).then((dispatchResponse) => {
            const session: Session = Session.fromJSON(JSON.stringify(dispatchResponse.toJSON()))

            if(this.sessionQueue.length > configuration.maxSessions) {
                this.sessionQueue.enqueue(session)

                const currentSession = this.getSession()
                this.store.add(currentSession.sessionKey, currentSession)
            }
        })
    }

    public getSession(): Session {
        const currentSession = this.sessionQueue.front
        if(currentSession !== undefined) {
            return currentSession
        }

        throw new TypeError("Session not found")
    }

    public destroySession() {
        this.sessionQueue.dequeue()
    }
 }