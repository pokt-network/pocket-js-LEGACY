/**
 * @author Pabel Nunez L. <pabel@pokt.network>
 * @description Unit tests for the Keybase class portable private key functions
 *
 */
import { expect } from "chai"
import { Keybase, InMemoryKVStore, Account, typeGuard } from "../../../../src"

/**
 * @description Keybase class tests
 */
// Exports
describe("Keybase Export of a Portable Private Key", async () => {
    describe("Success scenarios", async () => {
        describe("exportPPK scenarios", async () => {
            it("should export a private key to a portable private key armored json", async () => {
                const keybase = new Keybase(new InMemoryKVStore())
                const password = "test"
                const privateKey = "11ec96f4ab9ba7e6fef32994a2b9ae81414704b3f21ee213155cf77ab1a75d0b373bf4dd9e1a7076bdbdb81fd681430cb242696a51d8230fbe3a966543239e6a"
                const ppkOrError = await keybase.exportPPK(privateKey, password, "test 123")
                expect(typeGuard(ppkOrError, "string")).to.be.true
            }).timeout(0)
        })

        describe("exportPPKfromAccount scenarios", async () => {
            it("should unlock and export an account to a portable private key armored json", async () => {
                const keybase = new Keybase(new InMemoryKVStore())
                const passphrase = "123"
                const password = "test"
                const accountOrError = await keybase.createAccount(passphrase)
                expect(typeGuard(accountOrError, Account)).to.be.true
                const account = accountOrError as Account
                // Export the account
                const ppkOrError = await keybase.exportPPKfromAccount(account, password, "test 123", passphrase)
                expect(typeGuard(ppkOrError, "string")).to.be.true
            }).timeout(0)
        })

        describe("exportPPKfromUnlockedAccount scenarios", async () => {
            it("should export an unlocked account using the account address hex to a portable private key armored json", async () => {
                const keybase = new Keybase(new InMemoryKVStore())
                const passphrase = "123"
                const password = "test"
                const accountOrError = await keybase.createAccount(passphrase)
                expect(typeGuard(accountOrError, Account)).to.be.true
                const account = accountOrError as Account
                const unlockAccountOrError = await keybase.unlockAccount(account.addressHex, passphrase, 0)
                expect(typeGuard(unlockAccountOrError, Error)).to.be.false
                // Export the account
                const ppkOrError = await keybase.exportPPKfromUnlockedAccount(account.addressHex, password, "test 123")
                expect(typeGuard(ppkOrError, "string")).to.be.true
            }).timeout(0)
        })
    }).timeout(0)

    describe("Error scenarios", async () => {
        describe("exportPPK scenarios", async () => {
            it("should fail to export a ppk using an empty string as private key", async () => {
                const keybase = new Keybase(new InMemoryKVStore())
                const password = "test"
                const privateKey = ""
                const ppkOrError = await keybase.exportPPK(privateKey, password, "test 123")
                expect(typeGuard(ppkOrError, Error)).to.be.true
            }).timeout(0)
    
            it("should fail to export a ppk using an empty string as password", async () => {
                const keybase = new Keybase(new InMemoryKVStore())
                const password = ""
                const privateKey = "11ec96f4ab9ba7e6fef32994a2b9ae81414704b3f21ee213155cf77ab1a75d0b373bf4dd9e1a7076bdbdb81fd681430cb242696a51d8230fbe3a966543239e6a"
                const ppkOrError = await keybase.exportPPK(privateKey, password, "test 123")
                expect(typeGuard(ppkOrError, Error)).to.be.true
            }).timeout(0)
        })
        describe("exportPPKfromAccount scenarios", async () => {
            it("should fail to export a ppk from an account by using an empty string as password", async () => {
                const keybase = new Keybase(new InMemoryKVStore())
                // Passphrase to create the account in the keybase
                const passphrase = "123"
                const password = ""
                const accountOrError = await keybase.createAccount(passphrase)
                expect(typeGuard(accountOrError, Account)).to.be.true
                const account = accountOrError as Account
                // Export the account
                const ppkOrError = await keybase.exportPPKfromAccount(account, password, "test 123", passphrase)
                expect(typeGuard(ppkOrError, Error)).to.be.true
            })
            it("should fail to export a ppk from an account by using an empty string as passphrase", async () => {
                const keybase = new Keybase(new InMemoryKVStore())
                // Passphrase to create the account in the keybase
                const passphrase = ""
                const password = "test"
                const accountOrError = await keybase.createAccount(passphrase)
                expect(typeGuard(accountOrError, Error)).to.be.true
                const account = accountOrError as Account
                // Export the account
                const ppkOrError = await keybase.exportPPKfromAccount(account, password, "test 123", passphrase)
                expect(typeGuard(ppkOrError, Error)).to.be.true
            })
        })
        describe("exportPPKfromUnlockedAccount scenarios", async () => {
            it("should fail to export an unlocked account due to invalid addressHex", async () => {
                const keybase = new Keybase(new InMemoryKVStore())
                // Passphrase to create the account in the keybase
                const passphrase = "123"
                const password = "test"
                const accountOrError = await keybase.createAccount(passphrase)
                expect(typeGuard(accountOrError, Account)).to.be.true
                const account = accountOrError as Account
                const unlockAccountOrError = await keybase.unlockAccount(account.addressHex, passphrase, 0)
                expect(typeGuard(unlockAccountOrError, Error)).to.be.false
                // Export the account
                const badAddressHex = account.addressHex + "$Z)1"
                const ppkOrError = await keybase.exportPPKfromUnlockedAccount(badAddressHex, password, "test 123")
                expect(typeGuard(ppkOrError, Error)).to.be.true
            }).timeout(0)

            it("should fail to export an unlocked account due to empty password", async () => {
                const keybase = new Keybase(new InMemoryKVStore())
                // Passphrase to create the account in the keybase
                const passphrase = "123"
                const password = ""
                const accountOrError = await keybase.createAccount(passphrase)
                expect(typeGuard(accountOrError, Account)).to.be.true
                const account = accountOrError as Account
                const unlockAccountOrError = await keybase.unlockAccount(account.addressHex, passphrase, 0)
                expect(typeGuard(unlockAccountOrError, Error)).to.be.false
                // Export the account
                const ppkOrError = await keybase.exportPPKfromUnlockedAccount(account.addressHex, password, "test 123")
                expect(typeGuard(ppkOrError, Error)).to.be.true
            }).timeout(0)

            it("should fail to export an unlocked account using the account address hex due to account not unlocked", async () => {
                const keybase = new Keybase(new InMemoryKVStore())
                // Passphrase to create the account in the keybase
                const passphrase = "123"
                const password = "test"
                const accountOrError = await keybase.createAccount(passphrase)
                expect(typeGuard(accountOrError, Account)).to.be.true
                const account = accountOrError as Account
                // Export the account
                const ppkOrError = await keybase.exportPPKfromUnlockedAccount(account.addressHex, password, "test 123")
                expect(typeGuard(ppkOrError, Error)).to.be.true
            }).timeout(0)
        })

    }).timeout(0)
}).timeout(0)
// Imports
describe("Keybase Import of a Portable Private Key", async () => {
    describe("Success scenarios", async () => {
        describe("importPPKFromJSON scenarios", async () => {
            it("should import an account using portable private key armored json string", async () => {
                const keybase = new Keybase(new InMemoryKVStore())
                const password = "t"
                const jsonStr = "{\"kdf\": \"scrypt\",\"salt\": \"562F04E15064C472279CF748324051FD\",\"secparam\": \"12\",\"hint\": \"t\",\"ciphertext\": \"SpkySM/0g4DUPjaOA/dzh+9r2/Kru/JCNi3VBLbjbs9Qw483ZjPd/b8fiwtujCSJaRQuejbAbZmx3DV6adiTzTA5MhcymzQwaUvVY6R6v6A40Y9cVeji4T94MZzcQfL9LPmddRvaLC1w9eWeVuweCY1SdU0m4TyMTGObxB34y14yyT0tnW3mz23IZ+SmqXKw\"}"
                const accountOrError = await keybase.importPPKFromJSON(password, jsonStr as string, "test123")
                expect(typeGuard(accountOrError, Account)).to.be.true
            }).timeout(0)
        })

        describe("importPPK scenarios", async () => {
            it("should import an account using the portable private key json properties", async () => {
                const keybase = new Keybase(new InMemoryKVStore())
                const password = "t"
                // Passphrase to store the account in the keybase
                const passphrase = "123"
                const json = JSON.parse("{\"kdf\": \"scrypt\",\"salt\": \"562F04E15064C472279CF748324051FD\",\"secparam\": \"12\",\"hint\": \"t\",\"ciphertext\": \"SpkySM/0g4DUPjaOA/dzh+9r2/Kru/JCNi3VBLbjbs9Qw483ZjPd/b8fiwtujCSJaRQuejbAbZmx3DV6adiTzTA5MhcymzQwaUvVY6R6v6A40Y9cVeji4T94MZzcQfL9LPmddRvaLC1w9eWeVuweCY1SdU0m4TyMTGObxB34y14yyT0tnW3mz23IZ+SmqXKw\"}")
                const accountOrError = await keybase.importPPK(password, json.salt, json.secparam, json.hint, json.ciphertext, passphrase)
                expect(typeGuard(accountOrError, Account)).to.be.true
            }).timeout(0)
        })

    }).timeout(0)

    describe("Error scenarios", async () => {
        describe("importPPKFromJSON scenarios", async () => {
            it("should fail to import an account using a wrong password", async () => {
                const keybase = new Keybase(new InMemoryKVStore())
                const password = "badpassword"
                const jsonStr = "{\"kdf\": \"scrypt\",\"salt\": \"562F04E15064C472279CF748324051FD\",\"secparam\": \"12\",\"hint\": \"t\",\"ciphertext\": \"SpkySM/0g4DUPjaOA/dzh+9r2/Kru/JCNi3VBLbjbs9Qw483ZjPd/b8fiwtujCSJaRQuejbAbZmx3DV6adiTzTA5MhcymzQwaUvVY6R6v6A40Y9cVeji4T94MZzcQfL9LPmddRvaLC1w9eWeVuweCY1SdU0m4TyMTGObxB34y14yyT0tnW3mz23IZ+SmqXKw\"}"
                const accountOrError = await keybase.importPPKFromJSON(password, jsonStr as string, "test123")
                expect(typeGuard(accountOrError, Error)).to.be.true
            }).timeout(0)

            it("should fail to import an account using a bad salt", async () => {
                const keybase = new Keybase(new InMemoryKVStore())
                const password = "t"
                const jsonStr = "{\"kdf\": \"scrypt\",\"salt\": \"562F04E15064C472279CF7483240zZz##\",\"secparam\": \"12\",\"hint\": \"t\",\"ciphertext\": \"SpkySM/0g4DUPjaOA/dzh+9r2/Kru/JCNi3VBLbjbs9Qw483ZjPd/b8fiwtujCSJaRQuejbAbZmx3DV6adiTzTA5MhcymzQwaUvVY6R6v6A40Y9cVeji4T94MZzcQfL9LPmddRvaLC1w9eWeVuweCY1SdU0m4TyMTGObxB34y14yyT0tnW3mz23IZ+SmqXKw\"}"
                const accountOrError = await keybase.importPPKFromJSON(password, jsonStr as string, "test123")
                expect(typeGuard(accountOrError, Error)).to.be.true
            }).timeout(0)

            it("should fail to import an account using a bad kdf", async () => {
                const keybase = new Keybase(new InMemoryKVStore())
                const password = "t"
                const jsonStr = "{\"kdf\": \"bcrypt\",\"salt\": \"562F04E15064C472279CF748324051FD\",\"secparam\": \"12\",\"hint\": \"t\",\"ciphertext\": \"SpkySM/0g4DUPjaOA/dzh+9r2/Kru/JCNi3VBLbjbs9Qw483ZjPd/b8fiwtujCSJaRQuejbAbZmx3DV6adiTzTA5MhcymzQwaUvVY6R6v6A40Y9cVeji4T94MZzcQfL9LPmddRvaLC1w9eWeVuweCY1SdU0m4TyMTGObxB34y14yyT0tnW3mz23IZ+SmqXKw\"}"
                const accountOrError = await keybase.importPPKFromJSON(password, jsonStr as string, "test123")
                expect(typeGuard(accountOrError, Error)).to.be.true
            }).timeout(0)

            it("should fail to import an account using a bad ciphertext", async () => {
                const keybase = new Keybase(new InMemoryKVStore())
                const password = "t"
                const jsonStr = "{\"kdf\": \"bcrypt\",\"salt\": \"562F04E15064C472279CF748324051FD\",\"secparam\": \"12\",\"hint\": \"t\",\"ciphertext\": \"SpkySM/0g4DUPjaOA/dzh+9r2/Kru/JCNi3VBLbjbs9Qw483ZjPd/b8fiwtujCSJaRQuejbAbZmx3DV6adiTzTA5MhcymzQwaUvVY6R6v6A40Y9cVeji4T94MZzcQfL9LPmddRvaLC1w9eWeVuweCY1SdU0m10JSSIAIA9S9S9S1WK\"}"
                const accountOrError = await keybase.importPPKFromJSON(password, jsonStr as string, "test123")
                expect(typeGuard(accountOrError, Error)).to.be.true
            }).timeout(0)
        })

    }).timeout(0)
}).timeout(0)
