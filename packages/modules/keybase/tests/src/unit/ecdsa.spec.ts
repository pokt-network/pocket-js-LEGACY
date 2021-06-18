import { expect } from "chai"
import { Keybase, Account } from "../../../src"
import { typeGuard } from "@pokt-network/pocket-js-utils"
import { InMemoryKVStore } from "@pokt-network/pocket-js-storage"


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
                const errorOrUndefined = keybase.unlockAccount(
                    account.addressHex,
                    passphrase,
                    0
                )
                expect(errorOrUndefined).to.be.a('undefined')
                // Check wheter or not is unlocked
                const isUnlocked = keybase.isUnlocked(account.addressHex)
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
                const errorOrUndefined = keybase.unlockAccount(
                    account.addressHex,
                    passphrase,
                    0
                )
                expect(errorOrUndefined).to.be.a('undefined')

                // Re-lock account
                const errorOrUndefinedLock = keybase.lockAccount(
                    account.addressHex
                )
                expect(errorOrUndefinedLock).to.be.a('undefined')

                // Check wheter or not is unlocked
                const isUnlocked = keybase.isUnlocked(account.addressHex)
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
                const errorOrUndefined = keybase.unlockAccount(
                    account.addressHex,
                    passphrase,
                    0
                )
                expect(errorOrUndefined).to.be.a('undefined')
                expect(keybase.isUnlocked(account.addressHex))

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

            it("should lock an unlocked account after the given time period", async () => {
                // Create a new account
                const keybase = new Keybase(new InMemoryKVStore())
                const passphrase = "test"
                let account = await keybase.createAccount(passphrase)
                expect(typeGuard(account, Account)).to.be.true
                account = account as Account
                // Unlock account
                const waitPeriod = 1
                const errorOrUndefined = keybase.unlockAccount(
                    account.addressHex,
                    passphrase,
                    waitPeriod
                )
                expect(typeGuard(errorOrUndefined, Error)).to.be.false

                // Wait for the waitPeriod and then check in the keybase if the account is unlocked
                setTimeout(async function (addressHex: string) {
                    // Check wheter or not is unlocked
                    const isUnlocked = keybase.isUnlocked(addressHex)
                    expect(isUnlocked).to.equal(false)
                }, waitPeriod + 1, account.addressHex)
            }).timeout(0)
        }).timeout(0)

        describe("Error scenarios", () => {
            it("should fail to unlock an account given an wrong or empty passphrase", async () => {
                // Create a new account
                const keybase = new Keybase(new InMemoryKVStore())
                const passphrase = "test"
                let account = await keybase.createAccount(passphrase)
                expect(typeGuard(account, Account)).to.be.true
                account = account as Account

                // Unlock account with wrong passphrase
                const wrongPassphrase = "wrong"
                expect(wrongPassphrase).to.not.equal(passphrase)
                let errorOrUndefined = keybase.unlockAccount(
                    account.addressHex,
                    wrongPassphrase,
                    0
                )
                expect(typeGuard(errorOrUndefined, Error)).to.be.true
                // Check wheter or not is unlocked
                let isUnlocked = keybase.isUnlocked(account.addressHex)
                expect(isUnlocked).to.equal(false)

                // Unlock account with empty passphrase
                const emptyPassphrase = ""
                expect(emptyPassphrase).to.not.equal(passphrase)
                errorOrUndefined = keybase.unlockAccount(
                    account.addressHex,
                    emptyPassphrase,
                    0
                )
                expect(typeGuard(errorOrUndefined, Error)).to.be.true
                // Check wheter or not is unlocked
                isUnlocked = keybase.isUnlocked(account.addressHex)
                expect(isUnlocked).to.equal(false)
            }).timeout(0)

            it("should fail to lock an account given an address that has not been unlocked yet", async () => {
                // Create a new account
                const keybase = new Keybase(new InMemoryKVStore())
                const passphrase = "test"
                let account = await keybase.createAccount(passphrase)

                expect(typeGuard(account, Account)).to.be.true
                account = account as Account

                // Lock account
                const errorOrUndefinedLock = keybase.lockAccount(
                    account.addressHex
                )

                expect(typeGuard(errorOrUndefinedLock, Error)).to.be.true
            }).timeout(0)

            it("should fail to produce a valid signature for a payload given an address that has not been unlocked yet", async () => {
                // Create a new account
                const keybase = new Keybase(new InMemoryKVStore())
                const passphrase = "test"
                let account = await keybase.createAccount(passphrase)
                expect(typeGuard(account, Account)).to.be.true
                account = account as Account

                // Produce signature with unlocked account
                // Sign arbitrary payload
                const payload = Buffer.from("Arbitrary Message", "utf8")
                const signatureOrError = await keybase.signWithUnlockedAccount(
                    account.addressHex,
                    payload
                )
                expect(typeGuard(signatureOrError, Error)).to.be.true
            }).timeout(0)
        }).timeout(0)
    }).timeout(0)
}).timeout(0)
