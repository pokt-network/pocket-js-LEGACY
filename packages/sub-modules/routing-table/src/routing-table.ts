import { Node } from "@pokt-network/pocket-js-rpc-models";
import { Configuration } from "@pokt-network/pocket-js-configuration";
import { IKVStore } from "@pokt-network/pocket-js-storage";
import { typeGuard } from "@pokt-network/pocket-js-utils";

/**
 *
 *
 * @class Routing
 */
export class RoutingTable {
  public readonly configuration: Configuration;
  public readonly localNodesFileName = "";
  private readonly dispatchersKey: string = "DISPATCHER_KEY";
  public readonly store: IKVStore;
  /**
   * Creates an instance of routing.
   * @param {URL[]} dispatchers - Array holding the initial dispatcher url(s).
   * @param {Configuration} configuration - Configuration object.
   * @param {IKVStore} store - KeyBase store object.
   * @memberof Routing
   */
  constructor(
    dispatchers: URL[] = [],
    configuration: Configuration,
    store: IKVStore
  ) {
    if (
      dispatchers.length > configuration.maxDispatchers &&
      configuration.maxDispatchers > 0
    ) {
      throw new Error(
        "Routing table cannot contain more than the specified maxDispatcher per blockchain."
      );
    }
    if (dispatchers.length < 1) {
      throw new Error(
        "Routing table must be initialized with at least one Dispatch node."
      );
    }

    this.configuration = configuration;
    this.store = store;
    this.store.add(this.dispatchersKey, dispatchers);
  }
  /**
   * Returns the stored dispatchers urls count
   * @returns {number} Dispatcher nodes count.
   * @memberof Routing
   */
  public get dispatchersCount(): number {
    const result = this.store.get(this.dispatchersKey);
    if (result !== undefined && Array.isArray(result)) {
      return result.length;
    } else {
      return 0;
    }
  }

  /**
   * Returns an array of random dispatchers urls from the routing table
   * @param {number} count - Desired number of dispatchers urls returned
   * @returns {URL[] | Error} Random dispatcher urls or Error.
   * @memberof Routing
   */
  public getRandomDispatchers(count: number): URL[] | Error {
    const dispatchers = this.store.get(this.dispatchersKey) as URL[];
    // Shuffle array then return the slice
    const shuffled = dispatchers.sort(() => 0.5 - Math.random());

    if (dispatchers.length <= 0) {
      return new Error(
        "Unable to getRandomDispatchers(), No dispatcher's available."
      );
    }

    return shuffled.slice(0, count);
  }

  /**
   * Returns a random dispatcher node from the routing table
   * @returns {URL | Error} Random dispatcher URL or Error.
   * @memberof Routing
   */
  public getRandomDispatcher(): URL | Error {
    const dispatchers = this.store.get(this.dispatchersKey) as URL[];

    if (dispatchers.length <= 0) {
      return new Error(
        "Unable to readRandomDispatcher(), No dispatcher's available."
      );
    }

    return dispatchers[Math.floor(Math.random() * dispatchers.length)];
  }

  /**
   * Returns an specific node from the routing table based on public key
   * @param {URL} url - Node's service url.
   * @returns {Node} Node object.
   * @memberof Routing
   */
  public getDispatcher(url: URL): Node | Error {
    const dispatchers = this.store.get(
      this.dispatchersKey.toUpperCase()
    ) as URL[];
    let requestedDispatcher;
    const urlStr = url.toString();

    dispatchers.forEach(function (storedURL: URL) {
      if (storedURL.toString() === urlStr) {
        requestedDispatcher = url;
      }
    });
    if (typeGuard(requestedDispatcher, URL)) {
      return requestedDispatcher;
    } else {
      return new Error("Dispatcher not found in routing table.");
    }
  }

  /**
   * Add a dispatcher url to the routing table
   * @param {URL} url - URL of the dispatcher node to be added.
   * @returns {boolean} - Returns true if the dispatcher was added or false if it failed.
   * @memberof Routing
   */
  public addDispatcher(url: URL): boolean {
    const dispatchers = this.store.get(this.dispatchersKey) as URL[]
    const urlStr = url.toString()

    // Checking if the dispatcher is already stored
    const dispatcher = dispatchers.find(element => element.toString() === urlStr)
    
    // If the dispatcher exists then return
    if (dispatcher !== undefined) {
      return false
    }

    // Add the new dispatcher to the array
    dispatchers.push(url)

    // If this pushes the count over the maxNodes, splice the first element off
    if (dispatchers.length > this.configuration.maxDispatchers && this.configuration.maxDispatchers > 0) {
      dispatchers.splice(0,1)
    }
    // Update the store
    this.store.add(this.dispatchersKey, dispatchers)
    return true
  }

  /**
   * Deletes a dispatcher url from the routing table
   * @param {URL} url - url object to be deleted
   * @returns {boolean} True or false if the node was deleted.
   * @memberof Routing
   */
   public deleteDispatcher(url: URL): boolean {
    // Cycle through the list of nodes, find a match, splice it off
    const dispatchers = this.store.get(this.dispatchersKey) as URL[]

    for (let i = 0; i < dispatchers.length; i++) {
      if (dispatchers[i].host === url.host) {
        dispatchers.splice(i, 1)

        // Update the store
        this.store.add(this.dispatchersKey, dispatchers)
        return true
      }
    }
    return false
  }
}
