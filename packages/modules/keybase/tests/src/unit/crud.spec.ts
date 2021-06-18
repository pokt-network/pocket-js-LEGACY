import { expect } from "chai"
import { Keybase, Account } from "../../../src"
import { InMemoryKVStore } from "@pokt-network/pocket-js-storage"

/**
 * @description Keybase class tests
 */
describe("Keybase Crud operations", () => {
    describe("Success scenarios", () => {
        it("should create an account given a passphrase", async () => {
            const keybase = new Keybase(new InMemoryKVStore())
            const account = await keybase.createAccount("test")
            expect(account).to.not.to.be.a("error")
        }).timeout(0)

        it("should return a list of all accounts in this keybase", async () => {
            const keybase = new Keybase(new InMemoryKVStore())
            const account1 = await keybase.createAccount("test")
            expect(account1).to.not.to.be.a("error")
            const account2 = await keybase.createAccount("test")
            expect(account2).to.not.to.be.a("error")

            const allAccountsOrError = keybase.listAccounts()
            const allAccounts = allAccountsOrError as Account[]
            expect(allAccounts).to.be.a("array")
            expect(allAccounts.length).to.equal(2)
            expect(allAccounts[0]).to.equal(account1)
            expect(allAccounts[1]).to.equal(account2)
        }).timeout(0)

        it("should return a account given it's address", async () => {
            const keybase = new Keybase(new InMemoryKVStore())
            const account = await keybase.createAccount("test")
            expect(account).to.not.to.be.a("error")
            const castedAccount: Account = account as Account
            const retrievedAccount = keybase.getAccount(
                castedAccount.addressHex
            )
            expect(account).to.equals(retrievedAccount)
        }).timeout(0)

        it("should delete an account given it's address and passphrase", async () => {
            // Create a new account
            const keybase = new Keybase(new InMemoryKVStore())
            const passphrase = "test"
            let account = await keybase.createAccount(passphrase)
            expect(account).to.not.to.be.a("error")

            // Delete the account
            account = account as Account
            const error = keybase.deleteAccount(
                account.addressHex,
                passphrase
            )
            expect(error).to.be.a('undefined')

            // Check internal account list to make sure account was deleted succesfully
            const allAccountsOrError = keybase.listAccounts()
            const allAccounts = allAccountsOrError as Account[]
            expect(allAccounts.length).to.equal(0)
        }).timeout(0)

        it("should update the passphrase for a given account given it's address and current passphrase", async () => {
            // Create a new account
            const keybase = new Keybase(new InMemoryKVStore())
            const passphrase = "test"
            let account = await keybase.createAccount(passphrase)
            expect(account).to.not.to.be.a("error")

            account = account as Account
            const newPassphrase = "test2"
            const error = keybase.updateAccountPassphrase(
                account.addressHex,
                passphrase,
                newPassphrase
            )
            expect(error).to.be.a('undefined')

            // Now we try to update the account again to make sure it worked
            const confirmPassphrase = "test3"
            const confirmErr = keybase.updateAccountPassphrase(
                account.addressHex,
                newPassphrase,
                confirmPassphrase
            )
            expect(confirmErr).to.be.a('undefined')
        }).timeout(0)
    }).timeout(0)

    describe("Error scenarios", () => {
        it("should error to create a account with an empty passphrase", async () => {
            // Create a new account with empty passphrase
            const keybase = new Keybase(new InMemoryKVStore())
            const passphrase = ""
            const accountEmpty = await keybase.createAccount(passphrase)
            expect(accountEmpty).to.be.a("error")
        }).timeout(0)

        describe("should error to do any crud operation on a account with an empty or not found address", () => {
            it("should error on getting an account", async () => {
                // Emtpy
                const keybase = new Keybase(new InMemoryKVStore())
                const emptyAddressError = keybase.getAccount("")
                expect(emptyAddressError).to.be.a("error")

                // Not found
                const notFoundError = keybase.getAccount(
                    "499c5b0651e10aafc7ff29cdf1a1763d6886a59b8052c3f257c7bdaabe0fc16b"
                )
                expect(notFoundError).to.be.a("error")
            }).timeout(0)

            it("should error on deleting an account", async () => {
                // Emtpy
                const keybase = new Keybase(new InMemoryKVStore())
                const emptyAddressError = keybase.deleteAccount("", "empty")
                expect(emptyAddressError).to.be.a("error")

                // Not found
                const notFoundError = keybase.deleteAccount(
                    "499c5b0651e10aafc7ff29cdf1a1763d6886a59b8052c3f257c7bdaabe0fc16b",
                    "notfound"
                )
                expect(notFoundError).to.be.a("error")
            }).timeout(0)

            it("should error on updating an account", async () => {
                // Emtpy
                const keybase = new Keybase(new InMemoryKVStore())
                const emptyAddressError = keybase.updateAccountPassphrase(
                    "",
                    "empty",
                    "empty1"
                )
                expect(emptyAddressError).to.be.a("error")

                // Not found
                const notFoundError = keybase.updateAccountPassphrase(
                    "499c5b0651e10aafc7ff29cdf1a1763d6886a59b8052c3f257c7bdaabe0fc16b",
                    "notfound",
                    "notfound1"
                )
                expect(notFoundError).to.be.a("error")
            }).timeout(0)
        }).timeout(0)

        it("should error to update a account with the wrong passphrase", async () => {
            // Create a new account
            const keybase = new Keybase(new InMemoryKVStore())
            const passphrase = "test"
            let account = await keybase.createAccount(passphrase)
            expect(account).not.to.be.a("error")

            // Update it with the wrong passphrase
            account = account as Account
            const wrongPassphrase = "wrongpassphrase"
            expect(passphrase).to.not.equal(wrongPassphrase)
            const error = keybase.updateAccountPassphrase(
                account.addressHex,
                wrongPassphrase,
                "anything"
            )
            expect(error).not.to.be.a('undefined')
        }).timeout(0)

        it("should error to delete a account with the wrong passphrase", async () => {
            // Create a new account
            const keybase = new Keybase(new InMemoryKVStore())
            const passphrase = "test"
            let account = await keybase.createAccount(passphrase)
            expect(account).not.to.be.a("error")

            // Update it with the wrong passphrase
            account = account as Account
            const wrongPassphrase = "wrongpassphrase"
            expect(passphrase).to.not.equal(wrongPassphrase)
            const error = keybase.deleteAccount(
                account.addressHex,
                wrongPassphrase
            )
            expect(error).not.to.be.a('undefined')
        }).timeout(0)
    }).timeout(0)
}).timeout(0)
