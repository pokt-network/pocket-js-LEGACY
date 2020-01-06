/**
 * @author Luis C. de León <luis@pokt.network>
 * @description Unit tests for the Keybase class, currently uses the following:
 * ECDSA: ed25519
 *
 */
import { expect } from "chai"
import { Keybase } from "../../src/keybase/keybase"
import { Account } from "../../src/models/account"

describe("Keybase Digital signature operations", function() {
    describe("Success scenarios", function() {
        it("should produce a valid signature for a payload given the account address and passphrase", async function() {
            // Create a new account
            let keybase = new Keybase()
            let passphrase = "test"
            let accountOrError = await keybase.createAccount(passphrase)
            expect(accountOrError).not.to.be.a("error")
            let account = <Account>accountOrError

            // Sign arbitrary payload
            let payload = Buffer.from("Arbitrary Message", "utf8")
            let signatureOrError = await keybase.sign(
                account.addressHex,
                passphrase,
                payload
            )
            expect(signatureOrError).not.to.be.a("error")
            let signature = <Buffer>signatureOrError
            expect(signature.length).to.be.greaterThan(0)
        }).timeout(0)

        it("should verify a valid signature for a given a public key and payload", async function() {
            // Create a new account
            let keybase = new Keybase()
            let passphrase = "test"
            let accountOrError = await keybase.createAccount(passphrase)
            expect(accountOrError).not.to.be.a("error")
            let account = <Account>accountOrError

            // Sign arbitrary payload
            let payload = Buffer.from("Arbitrary Message", "utf8")
            let signatureOrError = await keybase.sign(
                account.addressHex,
                passphrase,
                payload
            )
            expect(signatureOrError).not.to.be.a("error")
            let signature = <Buffer>signatureOrError
            expect(signature.length).to.be.greaterThan(0)

            // Verify signature
            let verification = await keybase.verifySignature(
                account.publicKey,
                payload,
                signature
            )
            expect(verification).to.be.true
        }).timeout(0)

        it("should return a falsey result for a valid signature given the incorrect public key and/or payload", async function() {
            // Create a new account
            let keybase = new Keybase()
            let passphrase = "test"
            let accountOrError = await keybase.createAccount(passphrase)
            expect(accountOrError).not.to.be.a("error")
            let account = <Account>accountOrError

            // Sign arbitrary payload
            let payload = Buffer.from("Arbitrary Message", "utf8")
            let signatureOrError = await keybase.sign(
                account.addressHex,
                passphrase,
                payload
            )
            expect(signatureOrError).not.to.be.a("error")
            let signature = <Buffer>signatureOrError
            expect(signature.length).to.be.greaterThan(0)

            // Verify signature with the wrong public key
            let verificationWrongPK = await keybase.verifySignature(
                Buffer.from("wrong public key", "utf8"),
                payload,
                signature
            )
            expect(verificationWrongPK).to.be.false

            // Verify signature with the wrong payload
            let verificationWrongPayload = await keybase.verifySignature(
                account.publicKey,
                Buffer.from("wrong payload", "utf8"),
                signature
            )
            expect(verificationWrongPayload).to.be.false

            // Verify signature with the wrong payload and wrong public key
            let verificationWrongBoth = await keybase.verifySignature(
                Buffer.from("wrong public key", "utf8"),
                Buffer.from("wrong payload", "utf8"),
                signature
            )
            expect(verificationWrongBoth).to.be.false
        }).timeout(0)
    }).timeout(0)

    describe("Error scenarios", function() {
        it("should produce an error to create a signature for a payload given an empty/non-existent address", async function() {
            // Create a new account
            let keybase = new Keybase()
            let passphrase = "test"
            let accountOrError = await keybase.createAccount(passphrase)
            expect(accountOrError).not.to.be.a("error")
            let account = <Account>accountOrError
            let payload = Buffer.from("Arbitrary Message", "utf8")

            // Sign arbitrary payload with empty address
            let emptyAddress = ""
            expect(emptyAddress).to.not.equal(account.addressHex)
            let signatureOrErrorEmpty = await keybase.sign(
                emptyAddress,
                passphrase,
                payload
            )
            expect(signatureOrErrorEmpty).to.be.a("error")

            // Sign arbitrary payload with a non-existent address
            let wrongAddress = "1234"
            expect(wrongAddress).to.not.equal(account.addressHex)
            let signatureOrErrorWrong = await keybase.sign(
                wrongAddress,
                passphrase,
                payload
            )
            expect(signatureOrErrorWrong).to.be.a("error")
        }).timeout(0)

        it("should produce an error to create a signature for a payload given a account an invalid/empty passphrase", async function() {
            // Create a new account
            let keybase = new Keybase()
            let passphrase = "test"
            let accountOrError = await keybase.createAccount(passphrase)
            expect(accountOrError).not.to.be.a("error")
            let account = <Account>accountOrError
            let payload = Buffer.from("Arbitrary Message", "utf8")

            // Sign arbitrary payload with empty address
            let emptyPassphrase = ""
            expect(emptyPassphrase).to.not.equal(passphrase)
            let signatureOrErrorEmpty = await keybase.sign(
                account.addressHex,
                emptyPassphrase,
                payload
            )
            expect(signatureOrErrorEmpty).to.be.a("error")

            // Sign arbitrary payload with a non-existent address
            let wrongPassphrase = "1234"
            expect(wrongPassphrase).to.not.equal(passphrase)
            let signatureOrErrorWrong = await keybase.sign(
                account.addressHex,
                wrongPassphrase,
                payload
            )
            expect(signatureOrErrorWrong).to.be.a("error")
        }).timeout(0)
    }).timeout(0)

    describe("Account unlocking for passphrase free signing", function() {
        describe("Success scenarios", function() {
            it("should unlock an account given it's passphrase", async function() {
                // Create a new account
                let keybase = new Keybase()
                let passphrase = "test"
                let account = await keybase.createAccount(passphrase)
                expect(account).not.to.be.a("error")
                account = <Account>account

                // Unlock account
                let errorOrUndefined = await keybase.unlockAccount(
                    account.addressHex,
                    passphrase
                )
                expect(errorOrUndefined).to.be.undefined
                // Check wheter or not is unlocked
                let isUnlocked = await keybase.isUnlocked(account.addressHex)
                expect(isUnlocked).to.be.true
            }).timeout(0)

            it("should lock an unlocked account given it's address", async function() {
                // Create a new account
                let keybase = new Keybase()
                let passphrase = "test"
                let account = await keybase.createAccount(passphrase)
                expect(account).not.to.be.a("error")
                account = <Account>account

                // Unlock account
                let errorOrUndefined = await keybase.unlockAccount(
                    account.addressHex,
                    passphrase
                )
                expect(errorOrUndefined).to.be.undefined

                // Re-lock account
                let errorOrUndefinedLock = await keybase.lockAccount(
                    account.addressHex
                )
                expect(errorOrUndefinedLock).to.be.undefined

                // Check wheter or not is unlocked
                let isUnlocked = await keybase.isUnlocked(account.addressHex)
                expect(isUnlocked).to.be.false
            }).timeout(0)

            it("should produce a valid signature for a payload given an unlocked account address", async function() {
                // Create a new account
                let keybase = new Keybase()
                let passphrase = "test"
                let account = await keybase.createAccount(passphrase)
                expect(account).not.to.be.a("error")
                account = <Account>account

                // Unlock account
                let errorOrUndefined = await keybase.unlockAccount(
                    account.addressHex,
                    passphrase
                )
                expect(errorOrUndefined).to.be.undefined
                expect(await keybase.isUnlocked(account.addressHex))

                // Produce signature with unlocked account
                // Sign arbitrary payload
                let payload = Buffer.from("Arbitrary Message", "utf8")
                let signatureOrError = await keybase.signWithUnlockedAccount(
                    account.addressHex,
                    payload
                )
                expect(signatureOrError).not.to.be.a("error")
                let signature = <Buffer>signatureOrError
                expect(signature.length).to.be.greaterThan(0)
            }).timeout(0)
        }).timeout(0)

        describe("Error scenarios", function() {
            it("should fail to unlock an account given an wrong or empty passphrase", async function() {
                // Create a new account
                let keybase = new Keybase()
                let passphrase = "test"
                let account = await keybase.createAccount(passphrase)
                expect(account).not.to.be.a("error")
                account = <Account>account

                // Unlock account with wrong passphrase
                let wrongPassphrase = "wrong"
                expect(wrongPassphrase).to.not.equal(passphrase)
                let errorOrUndefined = await keybase.unlockAccount(
                    account.addressHex,
                    wrongPassphrase
                )
                expect(errorOrUndefined).to.be.a("error")
                // Check wheter or not is unlocked
                let isUnlocked = await keybase.isUnlocked(account.addressHex)
                expect(isUnlocked).to.be.false

                // Unlock account with empty passphrase
                let emptyPassphrase = ""
                expect(emptyPassphrase).to.not.equal(passphrase)
                errorOrUndefined = await keybase.unlockAccount(
                    account.addressHex,
                    emptyPassphrase
                )
                expect(errorOrUndefined).to.be.a("error")
                // Check wheter or not is unlocked
                isUnlocked = await keybase.isUnlocked(account.addressHex)
                expect(isUnlocked).to.be.false
            }).timeout(0)

            it("should fail to lock an account given an address that has not been unlocked yet", async function() {
                // Create a new account
                let keybase = new Keybase()
                let passphrase = "test"
                let account = await keybase.createAccount(passphrase)
                expect(account).not.to.be.a("error")
                account = <Account>account

                // Lock account
                let errorOrUndefinedLock = await keybase.lockAccount(
                    account.addressHex
                )
                expect(errorOrUndefinedLock).to.be.a("error")
            }).timeout(0)

            it("should fail to produce a valid signature for a payload given an address that has not been unlocked yet", async function() {
                // Create a new account
                let keybase = new Keybase()
                let passphrase = "test"
                let account = await keybase.createAccount(passphrase)
                expect(account).not.to.be.a("error")
                account = <Account>account

                // Produce signature with unlocked account
                // Sign arbitrary payload
                let payload = Buffer.from("Arbitrary Message", "utf8")
                let signatureOrError = await keybase.signWithUnlockedAccount(
                    account.addressHex,
                    payload
                )
                expect(signatureOrError).to.be.a("error")
            }).timeout(0)
        }).timeout(0)
    }).timeout(0)
}).timeout(0)
