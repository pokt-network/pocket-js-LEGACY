import {
  SessionHeader,
  Session,
  DispatchResponse,
  Node,
  DispatchRequest,
} from "@pokt-network/pocket-js-rpc-models";
import { IKVStore, InMemoryKVStore } from "@pokt-network/pocket-js-storage";
import { Configuration } from "@pokt-network/pocket-js-configuration";
import { RpcError, typeGuard } from "@pokt-network/pocket-js-utils";
import { Client } from "@pokt-network/pocket-js-rpc-client";
import { Queue } from "./queue";
import { RoutingTable } from "@pokt-network/pocket-js-routing-table";
import { PocketAAT } from "@pokt-network/aat-js";
import { sha3_256 } from "js-sha3";

/**
 * @class SessionManager
 */

export class SessionManager {
  private readonly sessionMap: Map<string, Queue<Session>>;
  private readonly routingTable: RoutingTable;
  private readonly sessionMapKey: string = "SESSIONS_KEY";

  /**
   * Creates an instance of SessionManager.
   * @param {URL[]} dispatchers - Dispatcher's list.
   * @param {Configuration} configuration - Pocket Configuration.
   * @param {IKVStore} store - (Optional) KVStore implementation.
   * @memberof SessionManager
   */
  constructor(
    dispatchers: URL[],
    configuration: Configuration,
    store?: IKVStore
  ) {
    const inMemoryKVStore = store || new InMemoryKVStore();

    if (dispatchers.length === 0) {
      throw new Error(
        "Failed to instantiate the Session Manager due to empty dispatcher's list."
      );
    }

    this.routingTable = new RoutingTable(
      dispatchers,
      configuration,
      inMemoryKVStore
    );
    this.sessionMap = new Map();

    if (this.routingTable.store.has(this.sessionMapKey)) {
      this.sessionMap = this.routingTable.store.get(this.sessionMapKey);
    } else {
      this.sessionMap = new Map();
      this.routingTable.store.add(this.sessionMapKey, this.sessionMap);
    }
  }

  /**
   * Adds a new node to the routing table dispatcher's list
   * @param {Node} dispatcher - New dispatcher.
   * @memberof SessionManager
   */
  public addNewDispatcher(dispatcher: Node | URL): boolean {
    if (typeGuard(dispatcher, Node)) {
      return this.routingTable.addDispatcher(dispatcher.serviceURL);
    } else {
      return this.routingTable.addDispatcher(dispatcher);
    }
  }

  /**
   * Removes a dispatcher from the routing table dispatcher's list
   * @param {Node} dispatcher - Dispatcher to be removed.
   * @memberof SessionManager
   */
  public deleteDispatcher(dispatcher: Node | URL): boolean {
    if (typeGuard(dispatcher, Node)) {
      return this.routingTable.deleteDispatcher(dispatcher.serviceURL);
    } else {
      return this.routingTable.deleteDispatcher(dispatcher);
    }
  }

  /**
   * Returns the routing table dispatcher's count
   * @returns {Number} - Dispatcher's count.
   * @memberof SessionManager
   */
  public getDispatchersCount() {
    return this.routingTable.dispatchersCount;
  }

  /**
   * Request a new session object. Returns a Promise with the Session object or an Error when something goes wrong.
   * @param {PocketAAT} pocketAAT - Pocket Authentication Token.
   * @param {string} chain - Name of the Blockchain.
   * @param {Configuration} configuration - Configuration object.
   * @returns {Promise}
   * @memberof SessionManager
   */
  public async requestNewSession(
    pocketAAT: PocketAAT,
    chain: string,
    configuration: Configuration
  ): Promise<Session | Error> {
    // Retrieve a dispatcher from the routing table
    const dispatcher = this.routingTable.getRandomDispatcher();

    if (typeGuard(dispatcher, Error)) {
      return dispatcher
    }

    // Create the Client using the dispatcher
    const client = new Client(dispatcher);

    // Create the session header
    const header = new SessionHeader(
      pocketAAT.applicationPublicKey,
      chain,
      BigInt(0)
    );
    // Create the Dispatch request
    const dispatchRequest: DispatchRequest = new DispatchRequest(header);

    // Perform a dispatch request
    const result = await client.dispatch(
      dispatchRequest,
      configuration.requestTimeOut,
      configuration.rejectSelfSignedCertificates
    );

    if (typeGuard(result, DispatchResponse)) {
      let session: Session;
      try {
        session = Session.fromJSON(JSON.stringify(result.toJSON()));
      } catch (error) {
        return error;
      }

      if (session !== undefined) {
        const key = this.getSessionKey(pocketAAT, chain);

        return this.saveSession(key, session, configuration);
      } else {
        return new Error("Error decoding session from Dispatch response.");
      }
    } else if (this.routingTable.dispatchersCount > 0) {
      // Remove the failed dispatcher from the routing table
      this.routingTable.deleteDispatcher(dispatcher);
      // Request the session again
      return await this.requestNewSession(pocketAAT, chain, configuration);
    } else {
      return new Error(
        "Unable to retrieve a new session using the provided dispatcher(s); the list was clear due to non of the dispatchers being able to provide a session."
      );
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
    const key = this.getSessionKey(pocketAAT, chain);
    if (!this.sessionMap.has(key)) {
      return await this.requestNewSession(pocketAAT, chain, configuration);
    }

    const currentSession = (this.sessionMap.get(key) as Queue<Session>).front;
    if (currentSession !== undefined) {
      return currentSession;
    } else {
      return await this.requestNewSession(pocketAAT, chain, configuration);
    }
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
    session: Session,
    pocketAAT: PocketAAT,
    chain: string,
    configuration: Configuration
  ): Promise<Session | Error> {
    const key = this.getSessionKey(pocketAAT, chain);

    return this.saveSession(key, session, configuration);
  }

  /**
   * Creates an unique key using the PocketAAT object and the chain.
   * @param {PocketAAT} pocketAAT - Pocket Authentication Token.
   * @param {string} chain - Blockchain hash.
   * @memberof SessionManager
   */
  public getSessionKey(pocketAAT: PocketAAT, chain: string): string {
    const hash = sha3_256.create();
    hash.update(JSON.stringify(pocketAAT).concat(chain));
    return hash.toString();
  }

  /**
   * Removes the first Session in the queue for the specified blockchain.
   * @param {PocketAAT} pocketAAT - Pocket Authentication Token.
   * @param {string} chain - Blockchain hash.
   * @memberof SessionManager
   */
  public destroySession(pocketAAT: PocketAAT, chain: string) {
    const key = this.getSessionKey(pocketAAT, chain);
    (this.sessionMap.get(key) as Queue<Session>).dequeue(); 
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
      this.sessionMap.set(key, new Queue());
    }

    // Check session queue length to pop the oldest element in the queue
    const sessionQueue = this.sessionMap.get(key) as Queue<Session>;
    if (
      configuration.maxSessions !== 0 &&
      sessionQueue.length === configuration.maxSessions
    ) {
      sessionQueue.dequeue();
    }

    // Append the new session to the queue
    sessionQueue.enqueue(session);
    return session;
  }
}
