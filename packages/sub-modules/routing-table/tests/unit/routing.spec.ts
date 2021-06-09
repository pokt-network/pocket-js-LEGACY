/**
 * @author Alex Firmani <alex@pokt.network>
 * @description Unit tests for the Routing Table
 */
import { expect } from 'chai'
import { Configuration } from "@pokt-network/pocket-js-configuration"
import { InMemoryKVStore } from "@pokt-network/pocket-js-storage"
import { RoutingTable } from '../../src'

// For Testing we are using dummy data, none of the following information is real.
const dispatcher = new URL("http://localhost:8081")
const store = new InMemoryKVStore()

function getConfig() : Configuration {
    return new Configuration(5, 200, undefined, 40000)
}

describe('Routing Table tests',() => {
    describe("Success scenarios", () => {
        it('should initialize a routing table', () => {
            const configuration = getConfig()
            
            const routing = new RoutingTable([dispatcher], configuration, store)
    
            expect(routing).to.be.an.instanceof(RoutingTable)
        }).timeout(0)

        it('should be able to read an specific node from the routing table', () => {
            const configuration = getConfig()
            const routing = new RoutingTable([dispatcher], configuration, store)
            const readDispatcher = routing.getDispatcher(dispatcher)
            
            expect(readDispatcher).to.be.an.instanceof(URL)
        }).timeout(0)
    
        it('should be able to add a node to the routing table', () => {
            const configuration = getConfig()
            
            const routing = new RoutingTable([dispatcher], configuration, store)
            const secondaryDispatcher: URL = new URL("http://127.0.0.1:80")
            routing.addDispatcher(secondaryDispatcher)
            
            const readDispatcher = routing.getDispatcher(secondaryDispatcher)
            expect(readDispatcher).to.be.an.instanceof(URL)
        }).timeout(0)
    
        it('should be able to delete a node from the routing table', () => {
            const configuration = getConfig()
    
            const routing = new RoutingTable([dispatcher], configuration, store)
            routing.deleteDispatcher(dispatcher)
            
            expect(routing.getDispatcher(dispatcher)).to.be.an.instanceof(Error)
        }).timeout(0)
    
        it('it should not allow to add more than the maxDispatchers configuration variable number of entries into the routing table.', () => {
            const configuration = getConfig()
    
            const routing = new RoutingTable([dispatcher], configuration, store)
            // Add more than the currently allowed since one was added already above
            for(let i = 0; i <= configuration.maxDispatchers + 5; i++) {
                const secondaryDispatcher: URL = new URL("http://127.0.0.1:80"+i)
                routing.addDispatcher(secondaryDispatcher)
            }
            expect(routing.dispatchersCount).to.lte(configuration.maxDispatchers)
        }).timeout(0)
    
        it('should be able to read a random node from the routing table', () => {
            const configuration = getConfig()
            
            const routing = new RoutingTable([dispatcher], configuration, store)

            for(let i = 2; i <= configuration.maxDispatchers; i++) {
                const secondaryDispatcher: URL = new URL("http://127.0.0.1:80"+i)
    
                routing.addDispatcher(secondaryDispatcher)
            }

            const readDispatcher = routing.getRandomDispatcher()
            expect(readDispatcher).to.be.an.instanceof(URL)
        }).timeout(0)
    
        it('should be able to read multiple random nodes from the routing table', () => {
            const configuration = getConfig()
        
            const routing = new RoutingTable([dispatcher], configuration, store)
    
            for(let i = 2; i <= 10; i++) {
                const secondaryDispatcher: URL = new URL("http://127.0.0.1:80"+i)
    
                routing.addDispatcher(secondaryDispatcher)
            }
    
            const readDispatchersOrError = routing.getRandomDispatchers(3)
            expect(readDispatchersOrError).to.not.be.an.instanceof(Error)

            const dispatchers = readDispatchersOrError as URL[]
            expect(dispatchers.length).to.be.greaterThanOrEqual(3)
        }).timeout(0)
    })
    describe("Error scenarios", () => {
        it('should fail to initialize a routing table due to excessive nodes', () => {
            const configuration = getConfig()
            
            const dispatchers: URL[] = [dispatcher]
            for(let i = 0; i < configuration.maxDispatchers; i++) {
                const additionalDispatcher = dispatcher
                dispatchers.push(additionalDispatcher)
            }
    
            expect(() => new RoutingTable(dispatchers, configuration, store)).to.throw("Routing table cannot contain more than the specified maxDispatcher per blockchain.")
        }).timeout(0)

        it('should fail to read an specific dispatcher from the routing table due to non-existing dispatcher on the list', () => {
            const badDispatcher = new URL("http://baddispatcher:8081")

            const configuration = getConfig()
            const routing = new RoutingTable([dispatcher], configuration, store)
            
            const dispatcherOrError = routing.getDispatcher(badDispatcher)
            expect(dispatcherOrError).to.be.an.instanceof(Error)
        }).timeout(0)
    
        it('should fail to add a dispatcher to the routing table since it exists already on the list', () => {
            const configuration = getConfig()
            
            const routing = new RoutingTable([dispatcher], configuration, store)
            
            const dispatcherAdded = routing.addDispatcher(dispatcher)
            
            expect(dispatcherAdded).to.be.false
        }).timeout(0)
    
        it('should fail to delete a node from the routing table since it doesnt exist', () => {
            const badDispatcher = new URL("http://baddispatcher:8081")
            const configuration = getConfig()
    
            const routing = new RoutingTable([dispatcher], configuration, store)
            const dispatcherDeleted = routing.deleteDispatcher(badDispatcher)
            
            expect(dispatcherDeleted).to.be.false
        }).timeout(0)
    
        it('should fail to read a random node due to empty routing table', () => {
            const configuration = getConfig()
            
            const routing = new RoutingTable([dispatcher], configuration, store)
            const dispatcherDeleted = routing.deleteDispatcher(dispatcher)
            expect(dispatcherDeleted).to.be.true
            
            const randomDispatcherOrError = routing.getRandomDispatcher()
            expect(randomDispatcherOrError).to.be.an.instanceof(Error)
        }).timeout(0)
    
        it('should fail to read multiple random nodes from the routing table fue to empty dispatchers list', () => { // Test doesn't currently check randomness of results
            const configuration = getConfig()
            
            const routing = new RoutingTable([dispatcher], configuration, store)
    
            const dispatcherDeleted = routing.deleteDispatcher(dispatcher)
            expect(dispatcherDeleted).to.be.true
            
            const randomDispatchersOrError = routing.getRandomDispatchers(3)
            expect(randomDispatchersOrError).to.be.an.instanceof(Error)
        }).timeout(0)
    })

}).timeout(0)
