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
describe("Keybase Import/Export of account", function() {
    describe("Success scenarios", function() {
        it("should import a account given it's private key and a passphrase for encryption", async function() {
            let keybase = new Keybase()
            let passphrase = "test"
            let importedAccountOrError = await keybase.importAccount(
                Buffer.from(
                    "11ec96f4ab9ba7e6fef32994a2b9ae81414704b3f21ee213155cf77ab1a75d0b373bf4dd9e1a7076bdbdb81fd681430cb242696a51d8230fbe3a966543239e6a",
                    "hex"
                ),
                passphrase
            )
            expect(importedAccountOrError).to.not.be.a("error")
            expect(<Account>importedAccountOrError).to.not.throw
        }).timeout(0)

        it("should export a private key given the address and passphrase", async function() {
            let keybase = new Keybase()
            let passphrase = "test"
            let importedAccountOrError = await keybase.importAccount(
                Buffer.from(
                    "11ec96f4ab9ba7e6fef32994a2b9ae81414704b3f21ee213155cf77ab1a75d0b373bf4dd9e1a7076bdbdb81fd681430cb242696a51d8230fbe3a966543239e6a",
                    "hex"
                ),
                passphrase
            )
            expect(importedAccountOrError).to.not.be.a("error")
            let account = <Account>importedAccountOrError

            // Export the private key
            let exportedPrivateKeyOrError = await keybase.exportAccount(
                account.addressHex,
                passphrase
            )
            expect(exportedPrivateKeyOrError).to.not.be.a("error")
            let privateKey = <Buffer>exportedPrivateKeyOrError
            expect(privateKey.length).to.equal(64)
        }).timeout(0)
    }).timeout(0)

    describe("Error scenarios", function() {
        it("should error to import an account given an empty/invalid private key", async function() {
            // Empty private key
            let keybase = new Keybase()
            let passphrase = "test"
            let importedAccountOrError = await keybase.importAccount(
                Buffer.from("", "hex"),
                passphrase
            )
            expect(importedAccountOrError).to.be.a("error")
            expect(<Account>importedAccountOrError).to.throw

            // Invalid private key
            let importedAccountOrInvalidError = await keybase.importAccount(
                Buffer.from("fba", "hex"),
                passphrase
            )
            expect(importedAccountOrInvalidError).to.be.a("error")
            expect(<Account>importedAccountOrInvalidError).to.throw
        }).timeout(0)

        it("should error to import an account given an empty passphrase", async function() {
            // Empty passphrase
            let keybase = new Keybase()
            let emptyPassphrase = ""
            expect(emptyPassphrase.length).to.equal(0)
            let importedAccountOrError = await keybase.importAccount(
                Buffer.from(
                    "11ec96f4ab9ba7e6fef32994a2b9ae81414704b3f21ee213155cf77ab1a75d0b373bf4dd9e1a7076bdbdb81fd681430cb242696a51d8230fbe3a966543239e6a",
                    "hex"
                ),
                emptyPassphrase
            )
            expect(importedAccountOrError).to.be.a("error")
        }).timeout(0)

        it("should fail to export non-existent account", async function() {
            let keybase = new Keybase()
            let addressHex = "0fb45a3d00033d373aad0ecefe2e125233c4537c"
            let passphrase = "test"

            // Export the non existent private key
            let exportedPrivateKeyOrError = await keybase.exportAccount(
                addressHex,
                passphrase
            )
            expect(exportedPrivateKeyOrError).to.be.a("error")
        })

        it("should fail to export with wrong/empty passphrase", async function() {
            let keybase = new Keybase()
            let passphrase = "test"
            let importedAccountOrError = await keybase.importAccount(
                Buffer.from(
                    "11ec96f4ab9ba7e6fef32994a2b9ae81414704b3f21ee213155cf77ab1a75d0b373bf4dd9e1a7076bdbdb81fd681430cb242696a51d8230fbe3a966543239e6a",
                    "hex"
                ),
                passphrase
            )
            expect(importedAccountOrError).to.not.be.a("error")
            let account = <Account>importedAccountOrError

            // Export the private key with a wrong passphrase
            let wrongPassphrase = "wrong"
            expect(wrongPassphrase).to.not.equal(passphrase)
            let wrongPassphraseError = await keybase.exportAccount(
                account.addressHex,
                wrongPassphrase
            )
            expect(wrongPassphraseError).to.be.a("error")

            // Export the private key with a wrong passphrase
            let emptyPassphrase = ""
            expect(emptyPassphrase).to.not.equal(passphrase)
            let emptyPassphraseError = await keybase.exportAccount(
                account.addressHex,
                emptyPassphrase
            )
            expect(emptyPassphraseError).to.be.a("error")
        })
    }).timeout(0)
}).timeout(0)
