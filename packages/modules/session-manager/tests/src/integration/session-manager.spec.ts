/**
 * @author Pabel Nunez <pabel@pokt.network>
 * @description Integration tests for the Session Manager
 */
import { expect } from 'chai'
import { Configuration } from "@pokt-network/pocket-js-configuration"
import { Account, Keybase } from "@pokt-network/pocket-js-keybase"
import { SessionManager } from "../../../src/session-manager" 
import { Session, SessionHeader, DispatchResponse } from "@pokt-network/pocket-js-rpc-models"
import { PocketAAT } from "@pokt-network/aat-js"
import { NockUtil } from "@pokt-network/pocket-js-nock-utils"

// Constants
// For Testing we are using dummy data, none of the following information is real.
const dispatchersList = [new URL("https://node1.testnet.pokt.network"), new URL("https://node2.testnet.pokt.network")]
const configuration = new Configuration(5, 200, undefined, 40000)
//
const appPubKeyHex = "437ae2e7902b8b5ee8ce1735e416e1455d3eb05b23cfa6c54f49329c61c72a80"
const appPrivKeyHex = "60eb765a844b21c9207b91a96f89ceb03a69f88b4f6dafd26af230ed482307ff437ae2e7902b8b5ee8ce1735e416e1455d3eb05b23cfa6c54f49329c61c72a80"
const clientPrivKeyHex = "5116d5b34e96607f7b76e6bb7828927ec3539201c70bc241ec7da186861f7ec4a6588933478b72c6e0639fcbee7039e0ff28e323d712e69f269aa519fce93b61"
const blockchain = "0022"
const clientPassphrase = "123"

describe('Session Manager tests',() => {
    describe('Success Scenarios',() => {
        it('should initialize a session manager instance', () => {
            // Instantiate the session manager
            expect(function (){
                new SessionManager(dispatchersList, configuration)
            }).to.not.throw();
        }).timeout(0)
    
        it('should be able to retrieve the dispatcher list count', () => {
            // Instantiate the session manager
            const sessionManager = new SessionManager(dispatchersList, configuration)
            // Retrieve the dispatcher list count
            let dispatcherCount = sessionManager.getDispatchersCount()
    
            expect(dispatcherCount).to.be.equal(dispatchersList.length)
        }).timeout(0)
    
        it('should be able to add a new dispatcher to the routing table', () => {
            const dispatchers = [new URL("https://node1.testnet.pokt.network")]
            // Instantiate the session manager
            const sessionManager = new SessionManager(dispatchers, configuration)
            // Retrieve the dispatcher list count
            const dispatcherCount = sessionManager.getDispatchersCount()
            expect(dispatcherCount).to.be.equal(dispatchers.length)
    
            // Add a new dispatcher
            const dispatcherAdded = sessionManager.addNewDispatcher(new URL("https://node2.testnet.pokt.network"))
            expect(dispatcherAdded).to.be.true
    
            // Retrieve again the dispatcher list count
            const dispatcherCountResult = sessionManager.getDispatchersCount()
            expect(dispatcherCountResult).to.be.equal(dispatcherCount + 1)
        }).timeout(0)
    
        it('should be able to remove a dispatcher from the routing table', () => {
            const dispatchers = [new URL("https://node1.testnet.pokt.network"), new URL("https://node2.testnet.pokt.network")]
            // Instantiate the session manager
            const sessionManager = new SessionManager(dispatchers, configuration)
            // Retrieve the dispatcher list count
            const dispatcherCount = sessionManager.getDispatchersCount()
            expect(dispatcherCount).to.be.equal(dispatchers.length)
    
            // Delete the provided dispatcher from the list
            const dispatcherRemoved = sessionManager.deleteDispatcher(new URL("https://node2.testnet.pokt.network"))
            expect(dispatcherRemoved).to.be.true
    
            // Retrieve again the dispatcher list count
            const dispatcherCountResult = sessionManager.getDispatchersCount()
            expect(dispatcherCountResult).to.be.equal(dispatcherCount - 1)
        }).timeout(0)
    
        it('should retrieve a new session', async () => {
            const dispatchers = [new URL("http://localhost:8081")]
            // Instantiate the Keybase and Session Manager
            const keybase = new Keybase()
            const sessionManager = new SessionManager(dispatchers, configuration)
    
            // Import Client Account
            const clientAccountOrError = await keybase.importAccount(Buffer.from(clientPrivKeyHex, "hex"), clientPassphrase)
            const clientAccount = clientAccountOrError as Account
            
            // Unlock client account
            await keybase.unlockAccount(clientAccount.addressHex, clientPassphrase, 0)
    
            // Create AAT for imported account
            const aat = await PocketAAT.from("0.0.1", clientAccount.publicKey.toString("hex"), appPubKeyHex, appPrivKeyHex)
            // Nock
            NockUtil.mockDispatch()
            // Request a new session
            const session = await sessionManager.requestNewSession(aat, blockchain, configuration)
            expect(session).to.be.an.instanceof(Session)
        }).timeout(0)
    
        it('should retrieve the current session', async () => {
            const dispatchers = [new URL("http://localhost:8081")]
            // Instantiate the Keybase and Session Manager
            const keybase = new Keybase()
            const sessionManager = new SessionManager(dispatchers, configuration)
    
            // Import Client Account
            const clientAccountOrError = await keybase.importAccount(Buffer.from(clientPrivKeyHex, "hex"), clientPassphrase)
            const clientAccount = clientAccountOrError as Account
            
            // Unlock client account
            await keybase.unlockAccount(clientAccount.addressHex, clientPassphrase, 0)
    
            // Create AAT for imported account
            const aat = await PocketAAT.from("0.0.1", clientAccount.publicKey.toString("hex"), appPubKeyHex, appPrivKeyHex)
            
            // Nock
            NockUtil.mockDispatch()
            // Request a new session
            const sessionOrError = await sessionManager.requestNewSession(aat, blockchain, configuration)
            expect(sessionOrError).to.be.an.instanceof(Session)
            const session = sessionOrError as Session
    
            // Request the current session
            const currentSessionOrError = await sessionManager.getCurrentSession(aat, blockchain, configuration)
            expect(currentSessionOrError).to.be.an.instanceof(Session)
            const currentSession = currentSessionOrError as Session
            // Confirm the session block height is identical
            expect(currentSession.sessionHeader.sessionBlockHeight).to.be.equal(session.sessionHeader.sessionBlockHeight)
        }).timeout(0)
    
        it('should update the current session', async () => {
            const dispatchers = [new URL("http://localhost:8081")]
            // Instantiate the Keybase and Session Manager
            const keybase = new Keybase()
            const sessionManager = new SessionManager(dispatchers, configuration)
    
            // Import Client Account
            const clientAccountOrError = await keybase.importAccount(Buffer.from(appPrivKeyHex, "hex"), clientPassphrase)
            const clientAccount = clientAccountOrError as Account
            
            // Unlock client account
            await keybase.unlockAccount(clientAccount.addressHex, clientPassphrase, 0)
    
            // Create AAT for imported account
            const aat = await PocketAAT.from("0.0.1", clientAccount.publicKey.toString("hex"), appPubKeyHex, appPrivKeyHex)
            
            // Nock
            NockUtil.mockDispatch()
            // Request a new session
            const sessionOrError = await sessionManager.requestNewSession(aat, blockchain, configuration)
            expect(sessionOrError).to.be.an.instanceof(Session)
    
            // Update the current session
            const dispatchResponse = DispatchResponse.fromJSON('{"block_height":26260,"session":{"header":{"app_public_key":"a6588933478b72c6e0639fcbee7039e0ff28e323d712e69f269aa519fce93b61","chain":"0002","session_height":26257},"key":"SqX7bCSB+9o2FJ+r6M91waUNzo3\/0V6Nf26x6ff3hjc=","nodes":[{"address":"b289b5f47165302cb8369aa7854c43fab805de45","chains":["0001","0002","0003","0004","0005","0006","0007","0008","0009","0010","0011","0012","0013","0021","0027"],"jailed":false,"public_key":"41401b10ebbbc41cc996c97c452f82dd4a90292b0eacfe916e87b0dc6257dd0b","service_url":"http:\/\/localhost:8081","status":2,"tokens":"15099969801","unstaking_time":"0001-01-01T00:00:00Z"},{"address":"633269f3f5a4cb7b6f224527bbeb550f2bc3571b","chains":["0001","0002","0003","0004","0005","0006","0009","0010","0011","0012","0021","0022","0025","0027","0028"],"jailed":false,"public_key":"83a848427f94d1d352b01c3d32cacd4617cc7f4a956df9859d115e7d61130c08","service_url":"http:\/\/localhost:8081","status":2,"tokens":"15199969601","unstaking_time":"0001-01-01T00:00:00Z"},{"address":"de24fc52321b2661995176eb996b26169e595aed","chains":["0001","0002","0003","0004","0005","0006","0007","0008","0009","0010","0011","0012","0013","0021","0027"],"jailed":false,"public_key":"fbb5e5c915e253e10403269e978fe6c70414c56a1f647df2693a1d401b1a9e73","service_url":"http:\/\/localhost:8081","status":2,"tokens":"15099984900","unstaking_time":"0001-01-01T00:00:00Z"},{"address":"2189325a17cc673060ba5a71d0e359388e7b9360","chains":["0001","0002","0003","0004","0005","0006","0009","0010","0011","0012","0021","0022","0025","0027","0028"],"jailed":false,"public_key":"5b3210eabe59db069255f12c230c9dfdf4244a440a4c2f5b70a6aa0fe157eb81","service_url":"http:\/\/localhost:8081","status":2,"tokens":"15199984800","unstaking_time":"0001-01-01T00:00:00Z"},{"address":"5b7a5f30e69cada0c89925b5700ddea41fda3819","chains":["0001","0002","0003","0004","0005","0006","0009","0010","0011","0012","0021","0022","0025","0027","0028"],"jailed":false,"public_key":"b4bd05765887810954465f206a1b0a6d90bc4c826b35e2cbb1e3dd25e7ed493e","service_url":"http:\/\/localhost:8081","status":2,"tokens":"15199969601","unstaking_time":"0001-01-01T00:00:00Z"}]}}')
            const newSession = Session.fromJSON(JSON.stringify(dispatchResponse.toJSON()))
            const updateSessionOrError = await sessionManager.updateCurrentSession(newSession, aat, blockchain, configuration)
            expect(updateSessionOrError).to.be.an.instanceof(Session)
    
            // Retrieve the session again
            const resultSessionOrError = await sessionManager.getCurrentSession(aat, blockchain, configuration)
            expect(resultSessionOrError).to.be.an.instanceof(Session)
            const resultSession = resultSessionOrError as Session
    
            // Compare with the new session, should be equal
            expect(resultSession.sessionHeader.sessionBlockHeight).to.be.equal(newSession.sessionHeader.sessionBlockHeight)
        }).timeout(0)
    
        it('should request five new sessions using three good and two bad node dispatchers', async () => {
            const dispatchers = [
                new URL("http://localhost:8081"), 
                new URL("http://badlocalhost:8081"), 
                new URL("http://localhost:8081"), 
                new URL("http://badlocalhost:8081"),
                new URL("http://localhost:8081")
            ]
    
            // Instantiate the Keybase and Session Manager
            const keybase = new Keybase()
            const sessionManager = new SessionManager(dispatchers, configuration)
    
            // Import Client Account
            const clientAccountOrError = await keybase.importAccount(Buffer.from(clientPrivKeyHex, "hex"), clientPassphrase)
            const clientAccount = clientAccountOrError as Account
            
            // Unlock client account
            await keybase.unlockAccount(clientAccount.addressHex, clientPassphrase, 0)
    
            // Create AAT for imported account
            const aat = await PocketAAT.from("0.0.1", clientAccount.publicKey.toString("hex"), appPubKeyHex, appPrivKeyHex)
            
            // Session array for storage
            const sessions: Session[] = []
            // Nock
            NockUtil.mockDispatch()
            NockUtil.mockDispatch()
            NockUtil.mockDispatch()
            NockUtil.mockDispatch()
            NockUtil.mockDispatch()
            for (let index = 0; index < 5; index++) {
                const session = await sessionManager.requestNewSession(aat, blockchain, configuration)
                sessions.push(session as Session)
            }
            expect(sessions.length).to.be.equal(5)
        }).timeout(0)
    });

    describe('Failure Scenarios',() => {
        it('should fail to initialize a session manager instance due to empty dispatcher list', () => {
            // Instantiate the session manager
            expect(function (){
                new SessionManager([], configuration)
            }).to.throw("Failed to instantiate the Session Manager due to empty dispatcher's list.");
        }).timeout(0)

        it('should fail to retrieve a new session due to empty dispatcher list', async () => {
            const dispatchers = [new URL("http://localhost:8081")]
            // Instantiate the Keybase and Session Manager
            const keybase = new Keybase()
            const sessionManager = new SessionManager(dispatchers, configuration)
    
            // Import Client Account
            const clientAccountOrError = await keybase.importAccount(Buffer.from(clientPrivKeyHex, "hex"), clientPassphrase)
            const clientAccount = clientAccountOrError as Account
            
            // Unlock client account
            await keybase.unlockAccount(clientAccount.addressHex, clientPassphrase, 0)
    
            // Create AAT for imported account
            const aat = await PocketAAT.from("0.0.1", clientAccount.publicKey.toString("hex"), appPubKeyHex, appPrivKeyHex)
            // We remove the provided dispatcher, this way the dispatcher's list is empty
            const deleteDispatcher = sessionManager.deleteDispatcher(dispatchers[0])
            expect(deleteDispatcher).to.be.true

            // Request a new session
            const sessionOrError = await sessionManager.requestNewSession(aat, blockchain, configuration)
            expect(sessionOrError).to.be.an.instanceof(Error)
            const sessionError = sessionOrError as Error
            expect(sessionError.message).to.be.equal("Unable to readRandomDispatcher(), No dispatcher\'s available.")
        }).timeout(0)

        it('should fail to retrieve a new session due to 400 dispatch response', async () => {
            const dispatchers = [new URL("http://localhost:8081")]
            // Instantiate the Keybase and Session Manager
            const keybase = new Keybase()
            const sessionManager = new SessionManager(dispatchers, configuration)
    
            // Import Client Account
            const clientAccountOrError = await keybase.importAccount(Buffer.from(clientPrivKeyHex, "hex"), clientPassphrase)
            const clientAccount = clientAccountOrError as Account
            
            // Unlock client account
            await keybase.unlockAccount(clientAccount.addressHex, clientPassphrase, 0)
    
            // Create AAT for imported account
            const aat = await PocketAAT.from("0.0.1", clientAccount.publicKey.toString("hex"), appPubKeyHex, appPrivKeyHex)
            // Nock
            NockUtil.mockBadDispatch()
            // Request a new session
            const sessionOrError = await sessionManager.requestNewSession(aat, blockchain, configuration)
            expect(sessionOrError).to.be.an.instanceof(Error)
            const sessionError = sessionOrError as Error
            expect(sessionError.message).to.be.equal("Unable to readRandomDispatcher(), No dispatcher\'s available.")
        }).timeout(0)
    })
    

}).timeout(0)
