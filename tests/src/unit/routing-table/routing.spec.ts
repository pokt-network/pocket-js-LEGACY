/**
 * @author Alex Firmani <alex@pokt.network>
 * @description Unit tests for the Routing Table
 */
import { expect } from 'chai'
import { InMemoryKVStore, Configuration, RoutingTable, Node } from '../../../../src'
// Constants
// For Testing we are using dummy data, none of the following information is real.
const dispatcher = new URL("http://127.0.0.1:8080")
const store = new InMemoryKVStore()

describe('Routing Table tests',() => {
    it('should initialize a routing table', () => {
        const configuration = new Configuration(5, 200, undefined, 40000)
        
        const routing = new RoutingTable([dispatcher], configuration, store)

        expect(routing).to.be.an.instanceof(RoutingTable)
    }).timeout(0)

    it('should fail to initialize a routing table due to excessive nodes', () => {
        const configuration = new Configuration(5, 200, undefined, 40000)
        
        const dispatchers: URL[] = [dispatcher]
        for(let i = 0; i < configuration.maxDispatchers; i++) {
            const additionalDispatcher = dispatcher
            dispatchers.push(additionalDispatcher)
        }

        expect(() => new RoutingTable(dispatchers, configuration, store)).to.throw("Routing table cannot contain more than the specified maxDispatcher per blockchain.")
    }).timeout(0)

    it('should be able to read a specific node from the routing table', () => {
        const configuration = new Configuration(5, 200, undefined, 40000)
        const routing = new RoutingTable([dispatcher], configuration, store)
        const readDispatcher = routing.readDispatcher(dispatcher)
        
        expect(readDispatcher).to.be.an.instanceof(URL)
    }).timeout(0)

    it('should be able to add a node to the routing table', () => {
        const configuration = new Configuration(5, 200, undefined, 40000)
        
        const routing = new RoutingTable([dispatcher], configuration, store)
        const secondaryDispatcher: URL = new URL("http://127.0.0.1:80")
        routing.addDispatcher(secondaryDispatcher)
        
        const readDispatcher = routing.readDispatcher(secondaryDispatcher)
        expect(readDispatcher).to.be.an.instanceof(URL)
    }).timeout(0)

    it('should be able to delete a node from the routing table', () => {
        const configuration = new Configuration(5, 200, undefined, 40000)

        const routing = new RoutingTable([dispatcher], configuration, store)
        routing.deleteDispatcher(dispatcher)
        
        expect(() => routing.readDispatcher(dispatcher)).to.throw("Dispatcher not found in routing table.")
    }).timeout(0)

    it('should not allow more than the max number of nodes per blockchain to be added to the routing table', () => {
        const configuration = new Configuration(5, 200, undefined, 40000)

        const routing = new RoutingTable([dispatcher], configuration, store)
        // Add more than the currently allowed since one was added already above
        for(let i = 0; i < configuration.maxDispatchers; i++) {
            const secondaryDispatcher: URL = new URL("http://127.0.0.1:80")
            routing.readDispatcher(secondaryDispatcher)
        }
        expect(routing.dispatchersCount).to.lte(configuration.maxDispatchers)
    }).timeout(0)

    it('should be able to read a random node from the routing table', () => {
        const configuration = new Configuration(5, 200, undefined, 40000)
        
        const routing = new RoutingTable([dispatcher], configuration, store)

        const readDispatcher = routing.readRandomDispatcher()
        expect(readDispatcher).to.be.an.instanceof(URL)
    }).timeout(0)

    it('should be able to read multiple random nodes from the routing table', () => { // Test doesn't currently check randomness of results
        const configuration = new Configuration(5, 200, undefined, 40000)
        
    
        const routing = new RoutingTable([dispatcher], configuration, store)

        for(let i = 2; i <= configuration.maxDispatchers; i++) {
            const secondaryDispatcher: URL = new URL("http://127.0.0.1:80")

            routing.addDispatcher(secondaryDispatcher)
        }

        const readDispatchers = routing.readRandomDispatchers(3)

        expect(readDispatchers[0]).to.be.an.instanceof(URL)
        expect(readDispatchers[1]).to.be.an.instanceof(URL)
        expect(readDispatchers[2]).to.be.an.instanceof(URL)
    }).timeout(0)

}).timeout(0)
