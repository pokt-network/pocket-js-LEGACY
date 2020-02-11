/**
 * @author Luis C. de León <luis@pokt.network>
 * @description Unit tests for the Keybase class, currently uses the following:
 * ECDSA: ed25519
 *
 */
import { expect } from "chai"
import { Keybase, InMemoryKVStore, Account } from "../../../../src"

/**
 * @description Keybase class tests
 */
describe("Keybase Import/Export of account", () => {
    describe("Success scenarios", () => {
        it("should import a account given it's private key and a passphrase for encryption", async () => {
            const keybase = new Keybase(new InMemoryKVStore())
            const passphrase = "test"
            const importedAccountOrError = await keybase.importAccount(
                Buffer.from(
                    "11ec96f4ab9ba7e6fef32994a2b9ae81414704b3f21ee213155cf77ab1a75d0b373bf4dd9e1a7076bdbdb81fd681430cb242696a51d8230fbe3a966543239e6a",
                    "hex"
                ),
                passphrase
            )
            expect(importedAccountOrError).to.not.be.a("error")
        }).timeout(0)

        it("should export a private key given the address and passphrase", async () => {
            const keybase = new Keybase(new InMemoryKVStore())
            const passphrase = "test"
            const importedAccountOrError = await keybase.importAccount(
                Buffer.from(
                    "11ec96f4ab9ba7e6fef32994a2b9ae81414704b3f21ee213155cf77ab1a75d0b373bf4dd9e1a7076bdbdb81fd681430cb242696a51d8230fbe3a966543239e6a",
                    "hex"
                ),
                passphrase
            )
            expect(importedAccountOrError).to.not.be.a("error")
            const account = importedAccountOrError as Account

            // Export the private key
            const exportedPrivateKeyOrError = await keybase.exportAccount(
                account.addressHex,
                passphrase
            )
            expect(exportedPrivateKeyOrError).to.not.be.a("error")
            const privateKey = exportedPrivateKeyOrError as Buffer
            expect(privateKey.length).to.equal(64)
        }).timeout(0)
    }).timeout(0)

    describe("Error scenarios", () => {
        it("should error to import an account given an empty/invalid private key", async () => {
            // Empty private key
            const keybase = new Keybase(new InMemoryKVStore())
            const passphrase = "test"
            const importedAccountOrError = await keybase.importAccount(
                Buffer.from("", "hex"),
                passphrase
            )
            expect(importedAccountOrError).to.be.a("error")

            // Invalid private key
            const importedAccountOrInvalidError = await keybase.importAccount(
                Buffer.from("fba", "hex"),
                passphrase
            )
            expect(importedAccountOrInvalidError).to.be.a("error")
        }).timeout(0)

        it("should error to import an account given an empty passphrase", async () => {
            // Empty passphrase
            const keybase = new Keybase(new InMemoryKVStore())
            const emptyPassphrase = ""
            expect(emptyPassphrase.length).to.equal(0)
            const importedAccountOrError = await keybase.importAccount(
                Buffer.from(
                    "11ec96f4ab9ba7e6fef32994a2b9ae81414704b3f21ee213155cf77ab1a75d0b373bf4dd9e1a7076bdbdb81fd681430cb242696a51d8230fbe3a966543239e6a",
                    "hex"
                ),
                emptyPassphrase
            )
            expect(importedAccountOrError).to.be.a("error")
        }).timeout(0)

        it("should fail to export non-existent account", async () => {
            const keybase = new Keybase(new InMemoryKVStore())
            const addressHex = "0fb45a3d00033d373aad0ecefe2e125233c4537c"
            const passphrase = "test"

            // Export the non existent private key
            const exportedPrivateKeyOrError = await keybase.exportAccount(
                addressHex,
                passphrase
            )
            expect(exportedPrivateKeyOrError).to.be.a("error")
        })

        it("should fail to export with wrong/empty passphrase", async () => {
            const keybase = new Keybase(new InMemoryKVStore())
            const passphrase = "test"
            const importedAccountOrError = await keybase.importAccount(
                Buffer.from(
                    "11ec96f4ab9ba7e6fef32994a2b9ae81414704b3f21ee213155cf77ab1a75d0b373bf4dd9e1a7076bdbdb81fd681430cb242696a51d8230fbe3a966543239e6a",
                    "hex"
                ),
                passphrase
            )
            expect(importedAccountOrError).to.not.be.a("error")
            const account = importedAccountOrError as Account

            // Export the private key with a wrong passphrase
            const wrongPassphrase = "wrong"
            expect(wrongPassphrase).to.not.equal(passphrase)
            const wrongPassphraseError = await keybase.exportAccount(
                account.addressHex,
                wrongPassphrase
            )
            expect(wrongPassphraseError).to.be.a("error")

            // Export the private key with a wrong passphrase
            const emptyPassphrase = ""
            expect(emptyPassphrase).to.not.equal(passphrase)
            const emptyPassphraseError = await keybase.exportAccount(
                account.addressHex,
                emptyPassphrase
            )
            expect(emptyPassphraseError).to.be.a("error")
        })
    }).timeout(0)
}).timeout(0)
