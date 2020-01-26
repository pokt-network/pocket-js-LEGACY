/**
 * @author Luis C. de León <luis@pokt.network>
 * @description Unit tests for the Keybase class, currently uses the following:
 * ECDSA: ed25519
 *
 */
import { expect } from "chai"
import { Keybase } from "../../../src/keybase/keybase"
import { Account } from "../../../src/models/account"
import { InMemoryKVStore, typeGuard } from "../../../src"

describe("Keybase Digital signature operations", () => {
    describe("Success scenarios", () => {
        it("should produce a valid signature for a payload given the account address and passphrase", async () => {
            // Create a new account
            const keybase = new Keybase(new InMemoryKVStore())
            const passphrase = "test"
            const accountOrError = await keybase.createAccount(passphrase)
            expect(accountOrError).not.to.be.a("error")
            const account = accountOrError as Account

            // Sign arbitrary payload
            const payload = Buffer.from("Arbitrary Message", "utf8")
            const signatureOrError = await keybase.sign(
                account.addressHex,
                passphrase,
                payload
            )
            expect(signatureOrError).not.to.be.a("error")
            const signature = signatureOrError as Buffer
            expect(signature.length).to.be.greaterThan(0)
        }).timeout(0)

        it("should verify a valid signature for a given a public key and payload", async () => {
            // Create a new account
            const keybase = new Keybase(new InMemoryKVStore())
            const passphrase = "test"
            const accountOrError = await keybase.createAccount(passphrase)
            expect(accountOrError).not.to.be.a("error")
            const account = accountOrError as Account

            // Sign arbitrary payload
            const payload = Buffer.from("Arbitrary Message", "utf8")
            const signatureOrError = await keybase.sign(
                account.addressHex,
                passphrase,
                payload
            )
            expect(signatureOrError).not.to.be.a("error")
            const signature = signatureOrError as Buffer
            expect(signature.length).to.be.greaterThan(0)

            // Verify signature
            const verification = await keybase.verifySignature(
                account.publicKey,
                payload,
                signature
            )
            expect(verification).to.equal(true)
        }).timeout(0)

        it("should return a falsey result for a valid signature given the incorrect public key and/or payload", async () => {
            // Create a new account
            const keybase = new Keybase(new InMemoryKVStore())
            const passphrase = "test"
            const accountOrError = await keybase.createAccount(passphrase)
            expect(accountOrError).not.to.be.a("error")
            const account = accountOrError as Account

            // Sign arbitrary payload
            const payload = Buffer.from("Arbitrary Message", "utf8")
            const signatureOrError = await keybase.sign(
                account.addressHex,
                passphrase,
                payload
            )
            expect(signatureOrError).not.to.be.a("error")
            const signature = signatureOrError as Buffer
            expect(signature.length).to.be.greaterThan(0)

            // Verify signature with the wrong public key
            const verificationWrongPK = await keybase.verifySignature(
                Buffer.from("wrong public key", "utf8"),
                payload,
                signature
            )
            expect(verificationWrongPK).to.equal(false)

            // Verify signature with the wrong payload
            const verificationWrongPayload = await keybase.verifySignature(
                account.publicKey,
                Buffer.from("wrong payload", "utf8"),
                signature
            )
            expect(verificationWrongPayload).to.equal(false)

            // Verify signature with the wrong payload and wrong public key
            const verificationWrongBoth = await keybase.verifySignature(
                Buffer.from("wrong public key", "utf8"),
                Buffer.from("wrong payload", "utf8"),
                signature
            )
            expect(verificationWrongBoth).to.equal(false)
        }).timeout(0)
    }).timeout(0)

    describe("Error scenarios", () => {
        it("should produce an error to create a signature for a payload given an empty/non-existent address", async () => {
            // Create a new account
            const keybase = new Keybase(new InMemoryKVStore())
            const passphrase = "test"
            const accountOrError = await keybase.createAccount(passphrase)
            expect(accountOrError).not.to.be.a("error")
            const account = accountOrError as Account
            const payload = Buffer.from("Arbitrary Message", "utf8")

            // Sign arbitrary payload with empty address
            const emptyAddress = ""
            expect(emptyAddress).to.not.equal(account.addressHex)
            const signatureOrErrorEmpty = await keybase.sign(
                emptyAddress,
                passphrase,
                payload
            )
            expect(signatureOrErrorEmpty).to.be.a("error")

            // Sign arbitrary payload with a non-existent address
            const wrongAddress = "1234"
            expect(wrongAddress).to.not.equal(account.addressHex)
            const signatureOrErrorWrong = await keybase.sign(
                wrongAddress,
                passphrase,
                payload
            )
            expect(signatureOrErrorWrong).to.be.a("error")
        }).timeout(0)

        it("should produce an error to create a signature for a payload given a account an invalid/empty passphrase", async () => {
            // Create a new account
            const keybase = new Keybase(new InMemoryKVStore())
            const passphrase = "test"
            const accountOrError = await keybase.createAccount(passphrase)
            expect(accountOrError).not.to.be.a("error")
            const account = accountOrError as Account
            const payload = Buffer.from("Arbitrary Message", "utf8")

            // Sign arbitrary payload with empty address
            const emptyPassphrase = ""
            expect(emptyPassphrase).to.not.equal(passphrase)
            const signatureOrErrorEmpty = await keybase.sign(
                account.addressHex,
                emptyPassphrase,
                payload
            )
            expect(signatureOrErrorEmpty).to.be.a("error")

            // Sign arbitrary payload with a non-existent address
            const wrongPassphrase = "1234"
            expect(wrongPassphrase).to.not.equal(passphrase)
            const signatureOrErrorWrong = await keybase.sign(
                account.addressHex,
                wrongPassphrase,
                payload
            )
            expect(signatureOrErrorWrong).to.be.a("error")
        }).timeout(0)
    }).timeout(0)

    describe("Account unlocking for passphrase free signing", () => {
        describe("Success scenarios", () => {
            it("should unlock an account given it's passphrase", async () => {
                // Create a new account
                const keybase = new Keybase(new InMemoryKVStore())
                const passphrase = "test"
                let account = await keybase.createAccount(passphrase)
                expect(account).not.to.be.a("error")
                account = account as Account

                // Unlock account
                const errorOrUndefined = await keybase.unlockAccount(
                    account.addressHex,
                    passphrase,
                    0
                )
                expect(errorOrUndefined).to.be.a('undefined')
                // Check wheter or not is unlocked
                const isUnlocked = await keybase.isUnlocked(account.addressHex)
                expect(isUnlocked).to.equal(true)
            }).timeout(0)

            it("should lock an unlocked account given it's address", async () => {
                // Create a new account
                const keybase = new Keybase(new InMemoryKVStore())
                const passphrase = "test"
                let account = await keybase.createAccount(passphrase)
                expect(account).not.to.be.a("error")
                account = account as Account

                // Unlock account
                const errorOrUndefined = await keybase.unlockAccount(
                    account.addressHex,
                    passphrase,
                    0
                )
                expect(errorOrUndefined).to.be.a('undefined')

                // Re-lock account
                const errorOrUndefinedLock = await keybase.lockAccount(
                    account.addressHex
                )
                expect(errorOrUndefinedLock).to.be.a('undefined')

                // Check wheter or not is unlocked
                const isUnlocked = await keybase.isUnlocked(account.addressHex)
                expect(isUnlocked).to.equal(false)
            }).timeout(0)

            it("should produce a valid signature for a payload given an unlocked account address", async () => {
                // Create a new account
                const keybase = new Keybase(new InMemoryKVStore())
                const passphrase = "test"
                let account = await keybase.createAccount(passphrase)
                expect(account).not.to.be.a("error")
                account = account as Account

                // Unlock account
                const errorOrUndefined = await keybase.unlockAccount(
                    account.addressHex,
                    passphrase,
                    0
                )
                expect(errorOrUndefined).to.be.a('undefined')
                expect(await keybase.isUnlocked(account.addressHex))

                // Produce signature with unlocked account
                // Sign arbitrary payload
                const payload = Buffer.from("Arbitrary Message", "utf8")
                const signatureOrError = await keybase.signWithUnlockedAccount(
                    account.addressHex,
                    payload
                )
                expect(signatureOrError).not.to.be.a("error")
                const signature = signatureOrError as Buffer
                expect(signature.length).to.be.greaterThan(0)
            }).timeout(0)

            it("should lock an unlocked account after the given time period", (done) => {
                // Create a new account
                const keybase = new Keybase(new InMemoryKVStore())
                const passphrase = "test"
                keybase.createAccount(passphrase).then(function(account){
                    expect(account).not.to.be.a("error")
                    account = account as Account

                    // Unlock account
                    const waitPeriod = 1
                    keybase.unlockAccount(
                        account.addressHex,
                        passphrase,
                        waitPeriod
                    ).then(function (errorOrUndefined) {
                        expect(errorOrUndefined).to.be.a('undefined')
                        expect(typeGuard(account, Account)).to.be.true
                        account = account as Account

                        // Wait for the waitPeriod and then check in the keybase if the account is unlocked
                        setTimeout(async function (addressHex) {
                            // Check wheter or not is unlocked
                            const isUnlocked = await keybase.isUnlocked(addressHex)
                            expect(isUnlocked).to.equal(false)
                            done()
                        }, waitPeriod, account.addressHex)
                    })
                })
            }).timeout(0)
        }).timeout(0)

        describe("Error scenarios", () => {
            it("should fail to unlock an account given an wrong or empty passphrase", async () => {
                // Create a new account
                const keybase = new Keybase(new InMemoryKVStore())
                const passphrase = "test"
                let account = await keybase.createAccount(passphrase)
                expect(account).not.to.be.a("error")
                account = account as Account

                // Unlock account with wrong passphrase
                const wrongPassphrase = "wrong"
                expect(wrongPassphrase).to.not.equal(passphrase)
                let errorOrUndefined = await keybase.unlockAccount(
                    account.addressHex,
                    wrongPassphrase,
                    0
                )
                expect(errorOrUndefined).to.be.a("error")
                // Check wheter or not is unlocked
                let isUnlocked = await keybase.isUnlocked(account.addressHex)
                expect(isUnlocked).to.equal(false)

                // Unlock account with empty passphrase
                const emptyPassphrase = ""
                expect(emptyPassphrase).to.not.equal(passphrase)
                errorOrUndefined = await keybase.unlockAccount(
                    account.addressHex,
                    emptyPassphrase,
                    0
                )
                expect(errorOrUndefined).to.be.a("error")
                // Check wheter or not is unlocked
                isUnlocked = await keybase.isUnlocked(account.addressHex)
                expect(isUnlocked).to.equal(false)
            }).timeout(0)

            it("should fail to lock an account given an address that has not been unlocked yet", async () => {
                // Create a new account
                const keybase = new Keybase(new InMemoryKVStore())
                const passphrase = "test"
                let account = await keybase.createAccount(passphrase)
                expect(account).not.to.be.a("error")
                account = account as Account

                // Lock account
                const errorOrUndefinedLock = await keybase.lockAccount(
                    account.addressHex
                )
                expect(errorOrUndefinedLock).to.be.a("error")
            }).timeout(0)

            it("should fail to produce a valid signature for a payload given an address that has not been unlocked yet", async () => {
                // Create a new account
                const keybase = new Keybase(new InMemoryKVStore())
                const passphrase = "test"
                let account = await keybase.createAccount(passphrase)
                expect(account).not.to.be.a("error")
                account = account as Account

                // Produce signature with unlocked account
                // Sign arbitrary payload
                const payload = Buffer.from("Arbitrary Message", "utf8")
                const signatureOrError = await keybase.signWithUnlockedAccount(
                    account.addressHex,
                    payload
                )
                expect(signatureOrError).to.be.a("error")
            }).timeout(0)
        }).timeout(0)
    }).timeout(0)
}).timeout(0)
