import { Node } from "@pokt-network/pocket-js-rpc-models"
import { Configuration } from "@pokt-network/pocket-js-configuration"
import { IKVStore } from "@pokt-network/pocket-js-storage"
import { typeGuard } from "@pokt-network/pocket-js-utils"

/**
 *
 *
 * @class Routing
 */
export class RoutingTable {
  public readonly configuration: Configuration
  public readonly localNodesFileName = ""
  private readonly dispatchersKey: string = "DISPATCHER_KEY"
  public readonly store: IKVStore
  /**
   * Creates an instance of routing.
   * @param {URL[]} dispatchers - Array holding the initial dispatcher url(s).
   * @param {Configuration} configuration - Configuration object.
   * @param {IKVStore} store - KeyBase store object.
   * @memberof Routing
   */
  constructor(dispatchers: URL[] = [], configuration: Configuration, store: IKVStore) {
    if (dispatchers.length > configuration.maxDispatchers && configuration.maxDispatchers > 0) {
      throw new Error(
        "Routing table cannot contain more than the specified maxDispatcher per blockchain."
      )
    }
    if (dispatchers.length < 1) {
      throw new Error(
        "Routing table must be initialized with at least one Dispatch node."
      )
    }

    this.configuration = configuration
    this.store = store
    this.store.add(this.dispatchersKey, dispatchers)
  }
  /**
   * Returns the stored dispatchers urls count
   * @returns {number} Dispatcher nodes count.
   * @memberof Routing
   */
  public get dispatchersCount(): number { 
    const result = this.store.get(this.dispatchersKey)
    if (result !== undefined && Array.isArray(result) ) {
      return result.length
    }else{
      return 0
    }
  } 

  /**
   * Reads an array of random dispatchers urls from the routing table
   * @param {number} count - Desired number of dispatchers urls returned
   * @returns {URL[]} Random dispatcher urls.
   * @memberof Routing
   */
  public readRandomDispatchers(count: number): URL[] {
    const dispatchers = this.store.get(this.dispatchersKey) as URL[]
    // Shuffle array then return the slice
    const shuffled = dispatchers.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  /**
   * Reads a random dispatcher node from the routing table
   * @returns {URL} Random dispatcher URL.
   * @memberof Routing
   */
  public readRandomDispatcher(): URL {
    const dispatchers = this.store.get(this.dispatchersKey) as URL[]
    return dispatchers[Math.floor(Math.random() * dispatchers.length)]
  }

  /**
   * Gets a dispatcher url for the Pocket network rpc calls
   * @returns {URL | Error} Dispatcher url or error
   * @memberof Routing
   */
  public getDispatcher(): URL | Error {
    const dispatchers = this.store.get(this.dispatchersKey) as URL[]

    if (dispatchers.length <= 0) {
      return new Error("No dispatcher's available.")
    }

    return dispatchers[Math.floor(Math.random() * dispatchers.length)]
  }

  /**
   * Reads a specific node from the routing table based on public key
   * @param {URL} url - Node's service url.
   * @returns {Node} Node object.
   * @memberof Routing
   */
  public readDispatcher(url: URL): Node {
    const dispatchers = this.store.get(this.dispatchersKey.toUpperCase()) as URL[]
    let requestedDispatcher
    dispatchers.forEach(function(storedURL: URL) {
      if (storedURL.hash === url.hash) {
        requestedDispatcher = url
      }
    })
    if (typeGuard(requestedDispatcher, URL)) {
      return requestedDispatcher
    }else{
      throw new Error("Dispatcher not found in routing table.")
    }
  }

  /**
   * Add a dispatcher url to the routing table
   * @param {URL} url - URL of the dispatcher node to be added.
   * @memberof Routing
   */
  public addDispatcher(url: URL) {
    const disptachers = this.store.get(this.dispatchersKey) as URL[]
    disptachers.push(url)
    // If this pushes the count over the maxNodes, splice the first element off
    if (disptachers.length > this.configuration.maxDispatchers && this.configuration.maxDispatchers > 0) {
      disptachers.splice(0, 1)
    }

    const shuffledDispatchers = disptachers.sort(() => Math.random() - 0.5)

    this.store.add(this.dispatchersKey, shuffledDispatchers)
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
        // Shuffle the dispatcher's list
        const shuffledDispatchers = dispatchers.sort(() => Math.random() - 0.5)
        // Update the store
        this.store.add(this.dispatchersKey, shuffledDispatchers)
        return true
      }
    }
    return false
  }
}
