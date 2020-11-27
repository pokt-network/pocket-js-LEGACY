/**
 * @author Alex Firmani <alex@pokt.network>
 * @description Unit tests for the Routing Table
 */
import { expect } from 'chai'
import { InMemoryKVStore, Configuration, RoutingTable, Pocket, Account, PocketAAT } from '../../../../src'
// Constants
// For Testing we are using dummy data, none of the following information is real.
const dispatcher = new URL("http://127.0.0.1:8080")
const store = new InMemoryKVStore()
const configuration = new Configuration(30, 1000, undefined, 40000, true, undefined, undefined, undefined, undefined, false)
//
const clientPrivateKey = ""
const walletAppPublicKey = ""
const walletPrivateKey = ""
const clientPassphrase = "123"
const blockchain = "0002"

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

    it("should be able to add new nodes to the session manager's routing table using the ones provided in the new session", async () => {                
        // Instantiate Pocket
        const pocket = new Pocket([dispatcher], undefined, configuration)

        // Import Client Account
        const clientAccountOrError = await pocket.keybase.importAccount(Buffer.from(clientPrivateKey, "hex"), clientPassphrase)
        const clientAccount = clientAccountOrError as Account
        
        // Unlock client account
        await pocket.keybase.unlockAccount(clientAccount.addressHex, clientPassphrase, 0)
    
        // Create AAT for imported account
        const aat = await PocketAAT.from("0.0.1", clientAccount.publicKey.toString("hex"), walletAppPublicKey, walletPrivateKey)

        const firstDispatchersCount = pocket.getDispatchersCount()

        await pocket.sessionManager.requestCurrentSession(aat, blockchain, configuration)

        const secondDispatchersCount = pocket.getDispatchersCount()

        await pocket.sessionManager.requestCurrentSession(aat, blockchain, configuration)
    
        const thirdDispatchersCount = pocket.getDispatchersCount()

        expect(firstDispatchersCount).to.be.below(secondDispatchersCount).to.be.below(thirdDispatchersCount)
    }).timeout(0)

}).timeout(0)
