/**
 * @author Luis C. de León <luis@pokt.network>
 * @description Unit tests for the Keybase class, currently uses the following:
 * ECDSA: ed25519
 *
 */
import { expect } from "chai"
import { Keybase } from "../../src/keybase/keybase"
import { Account } from "../../src/models/account"

/**
 * @description Keybase class tests
 */
describe("Keybase Crud operations", function() {
    describe("Success scenarios", function() {
        it("should create an account given a passphrase", async function() {
            let keybase = new Keybase()
            let account = await keybase.createAccount("test")
            expect(account).to.not.to.be.a("error")
        }).timeout(0)

        it("should return a list of all accounts in this keybase", async function() {
            let keybase = new Keybase()
            let account1 = await keybase.createAccount("test")
            expect(account1).to.not.to.be.a("error")
            let account2 = await keybase.createAccount("test")
            expect(account2).to.not.to.be.a("error")

            let allAccounts = await keybase.listAccounts()
            expect(allAccounts).to.be.a("array")
            expect(allAccounts.length).to.equal(2)
            expect(allAccounts[0]).to.equal(account1)
            expect(allAccounts[1]).to.equal(account2)
        }).timeout(0)

        it("should return a account given it's address", async function() {
            let keybase = new Keybase()
            let account = await keybase.createAccount("test")
            expect(account).to.not.to.be.a("error")
            let castedAccount: Account = <Account>account
            let retrievedAccount = await keybase.getAccount(
                castedAccount.addressHex
            )
            expect(account).to.equals(retrievedAccount)
        }).timeout(0)

        it("should delete an account given it's address and passphrase", async function() {
            // Create a new account
            let keybase = new Keybase()
            let passphrase = "test"
            let account = await keybase.createAccount(passphrase)
            expect(account).to.not.to.be.a("error")

            // Delete the account
            account = <Account>account
            let error = await keybase.deleteAccount(
                account.addressHex,
                passphrase
            )
            expect(error).to.be.undefined

            // Check internal account list to make sure account was deleted succesfully
            let allAccounts = await keybase.listAccounts()
            expect(allAccounts).to.be.empty
        }).timeout(0)

        it("should update the passphrase for a given account given it's address and current passphrase", async function() {
            // Create a new account
            let keybase = new Keybase()
            let passphrase = "test"
            let account = await keybase.createAccount(passphrase)
            expect(account).to.not.to.be.a("error")

            account = <Account>account
            let newPassphrase = "test2"
            let error = await keybase.updateAccountPassphrase(
                account.addressHex,
                passphrase,
                newPassphrase
            )
            expect(error).to.be.undefined

            // Now we try to update the account again to make sure it worked
            let confirmPassphrase = "test3"
            let confirmErr = await keybase.updateAccountPassphrase(
                account.addressHex,
                newPassphrase,
                confirmPassphrase
            )
            expect(confirmErr).to.be.undefined
        }).timeout(0)
    }).timeout(0)

    describe("Error scenarios", function() {
        it("should error to create a account with an empty passphrase", async function() {
            // Create a new account with empty passphrase
            let keybase = new Keybase()
            let passphrase = ""
            let accountEmpty = await keybase.createAccount(passphrase)
            expect(accountEmpty).to.be.a("error")
        }).timeout(0)

        describe("should error to do any crud operation on a account with an empty or not found address", function() {
            it("should error on getting an account", async function() {
                // Emtpy
                let keybase = new Keybase()
                let emptyAddressError = await keybase.getAccount("")
                expect(emptyAddressError).to.be.a("error")

                // Not found
                let notFoundError = await keybase.getAccount(
                    "499c5b0651e10aafc7ff29cdf1a1763d6886a59b8052c3f257c7bdaabe0fc16b"
                )
                expect(notFoundError).to.be.a("error")
            }).timeout(0)

            it("should error on deleting an account", async function() {
                // Emtpy
                let keybase = new Keybase()
                let emptyAddressError = await keybase.deleteAccount("", "empty")
                expect(emptyAddressError).to.be.a("error")

                // Not found
                let notFoundError = await keybase.deleteAccount(
                    "499c5b0651e10aafc7ff29cdf1a1763d6886a59b8052c3f257c7bdaabe0fc16b",
                    "notfound"
                )
                expect(notFoundError).to.be.a("error")
            }).timeout(0)

            it("should error on updating an account", async function() {
                // Emtpy
                let keybase = new Keybase()
                let emptyAddressError = await keybase.updateAccountPassphrase(
                    "",
                    "empty",
                    "empty1"
                )
                expect(emptyAddressError).to.be.a("error")

                // Not found
                let notFoundError = await keybase.updateAccountPassphrase(
                    "499c5b0651e10aafc7ff29cdf1a1763d6886a59b8052c3f257c7bdaabe0fc16b",
                    "notfound",
                    "notfound1"
                )
                expect(notFoundError).to.be.a("error")
            }).timeout(0)
        }).timeout(0)

        it("should error to update a account with the wrong passphrase", async function() {
            // Create a new account
            let keybase = new Keybase()
            let passphrase = "test"
            let account = await keybase.createAccount(passphrase)
            expect(account).not.to.be.a("error")

            // Update it with the wrong passphrase
            account = <Account>account
            let wrongPassphrase = "wrongpassphrase"
            expect(passphrase).to.not.equal(wrongPassphrase)
            let error = await keybase.updateAccountPassphrase(
                account.addressHex,
                wrongPassphrase,
                "anything"
            )
            expect(error).not.to.be.undefined
        }).timeout(0)

        it("should error to delete a account with the wrong passphrase", async function() {
            // Create a new account
            let keybase = new Keybase()
            let passphrase = "test"
            let account = await keybase.createAccount(passphrase)
            expect(account).not.to.be.a("error")

            // Update it with the wrong passphrase
            account = <Account>account
            let wrongPassphrase = "wrongpassphrase"
            expect(passphrase).to.not.equal(wrongPassphrase)
            let error = await keybase.deleteAccount(
                account.addressHex,
                wrongPassphrase
            )
            expect(error).not.to.be.undefined
        }).timeout(0)
    }).timeout(0)
}).timeout(0)
