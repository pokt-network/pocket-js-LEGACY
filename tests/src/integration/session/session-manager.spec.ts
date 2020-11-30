/**
 * @author Pabel Nunez <pabel@pokt.network>
 * @description Integration tests for the Session Manager
 */
import { expect } from 'chai'
import { InMemoryKVStore, Configuration, RoutingTable, PocketRpcProvider, Pocket, Account, PocketAAT, SessionManager, Session } from '../../../../src'
// Constants
// For Testing we are using dummy data, none of the following information is real.
const dispatcher = new URL("http://localhost:8081")
const store = new InMemoryKVStore()
const configuration = new Configuration(30, 1000, undefined, 40000, true, undefined, undefined, undefined, undefined, false)
//
const clientPrivateKey = ""
const walletAppPublicKey = ""
const walletPrivateKey = ""
const clientPassphrase = "123"
const blockchain = "0002"

describe('Session Manager tests',() => {

    it('should initialize a session manager instance', () => {
        const configuration = new Configuration(5, 200, undefined, 40000)
        const routingTable = new RoutingTable([dispatcher], configuration, store)
        const sessionManager = new SessionManager(routingTable)

        expect(sessionManager).to.be.an.instanceof(SessionManager)
    }).timeout(0)

    it('should retrieve a new session', async () => {
        const configuration = new Configuration(5, 200, undefined, 40000)
        // Instantiate Pocket
        const pocket = new Pocket([dispatcher], undefined, configuration)

        // Import Client Account
        const clientAccountOrError = await pocket.keybase.importAccount(Buffer.from(clientPrivateKey, "hex"), clientPassphrase)
        const clientAccount = clientAccountOrError as Account
        
        // Unlock client account
        await pocket.keybase.unlockAccount(clientAccount.addressHex, clientPassphrase, 0)

        // Create AAT for imported account
        const aat = await PocketAAT.from("0.0.1", clientAccount.publicKey.toString("hex"), walletAppPublicKey, walletPrivateKey)

        const session = await pocket.sessionManager.requestCurrentSession(aat, blockchain, configuration)
        expect(session).to.be.an.instanceof(Session)
    }).timeout(0)

    it("should be able to increase the session manager dispatchers count by performing relay requests", async () => {                
        // Instantiate Pocket
        const pocket = new Pocket([dispatcher], undefined, configuration)

        // Import Client Account
        const clientAccountOrError = await pocket.keybase.importAccount(Buffer.from(clientPrivateKey, "hex"), clientPassphrase)
        const clientAccount = clientAccountOrError as Account
        
        // Unlock client account
        await pocket.keybase.unlockAccount(clientAccount.addressHex, clientPassphrase, 0)
    
        // Create AAT for imported account
        const aat = await PocketAAT.from("0.0.1", clientAccount.publicKey.toString("hex"), walletAppPublicKey, walletPrivateKey)

        const provider = new PocketRpcProvider(pocket, aat, blockchain, false)

        const firstDispatchersCount = pocket.getDispatchersCount()

        await pocket.rpc(provider)!.query.getHeight()

        const secondDispatchersCount = pocket.getDispatchersCount()

        await pocket.rpc(provider)!.query.getHeight()
    
        const thirdDispatchersCount = pocket.getDispatchersCount()

        expect(firstDispatchersCount).to.be.below(secondDispatchersCount).to.be.below(thirdDispatchersCount)
    }).timeout(0)

    it("should be able to increase the routing table dispatchers count by performing relay requests for two different client accounts", async () => {                
        // Instantiate Pocket
        const pocket = new Pocket([dispatcher], undefined, configuration)

        // Import Client Account
        const clientAccountOrError = await pocket.keybase.importAccount(Buffer.from(clientPrivateKey, "hex"), clientPassphrase)
        const clientAccount = clientAccountOrError as Account
        // Unlock client account
        await pocket.keybase.unlockAccount(clientAccount.addressHex, clientPassphrase, 0)
        // Create AAT for imported account
        const aat = await PocketAAT.from("0.0.1", clientAccount.publicKey.toString("hex"), walletAppPublicKey, walletPrivateKey)
        // Create the PocketRpcProvider for the first client account
        const provider = new PocketRpcProvider(pocket, aat, blockchain, false)

        // Create a second client account --
        const clientAccountOrError2 = await pocket.keybase.createAccount(clientPassphrase)
        const clientAccount2 = clientAccountOrError2 as Account
        // Unlock client account
        await pocket.keybase.unlockAccount(clientAccount2.addressHex, clientPassphrase, 0)
        // Create AAT for imported account
        const aat2 = await PocketAAT.from("0.0.1", clientAccount.publicKey.toString("hex"), walletAppPublicKey, walletPrivateKey)
        // Create the PocketRpcProvider for the second client account
        const provider2 = new PocketRpcProvider(pocket, aat2, blockchain, false)

        // Get the first dispatchers count
        const firstDispatchersCount = pocket.getDispatchersCount()
        // Perform a relay request using the first provider that contains the first account aat information
        await pocket.rpc(provider)!.query.getHeight()

        // Get the second dispatchers count
        const secondDispatchersCount = pocket.getDispatchersCount()
        // Perform a relay request using the second provider that contains the second account aat information
        await pocket.rpc(provider2)!.query.getHeight()
    
        // Get the third dispatchers count
        const thirdDispatchersCount = pocket.getDispatchersCount()

        expect(firstDispatchersCount).to.be.below(secondDispatchersCount).to.be.below(thirdDispatchersCount)
    }).timeout(0)

}).timeout(0)
