/**
 * @author Pabel Nunez L. <pabel@pokt.network>
 * @description Unit tests for the Keybase class portable private key functions
 *
 */
import { expect } from "chai"
import { Keybase, InMemoryKVStore, Account } from "../../../../src"

/**
 * @description Keybase class tests
 */
describe("Keybase Export of a Portable Private Key", () => {
    describe("Success scenarios", () => {
        it("should export a private key to a portable private key armored json", async () => {
            const keybase = new Keybase(new InMemoryKVStore())
            const password = "test"
            const privateKey = "11ec96f4ab9ba7e6fef32994a2b9ae81414704b3f21ee213155cf77ab1a75d0b373bf4dd9e1a7076bdbdb81fd681430cb242696a51d8230fbe3a966543239e6a"
            const ppkOrError = await keybase.exportPPK(privateKey, password, "test 123")
            expect(ppkOrError).to.not.be.a("error")
        }).timeout(0)

        it("should import an account using portable private key armored json", async () => {
            const keybase = new Keybase(new InMemoryKVStore())
            const password = "test"
            const jsonStr = "{\"kdf\":\"bcrypt\",\"salt\":\"$2b$12$40ZeYR2.LuAlYBzdF9lxeO\",\"secparam\":\"12\",\"hint\":\"test 123\",\"ciphertext\":\"tG8Rv/NOx3I0UKBauaSzK76b4CTE4jInvsi+HV2rl1JgNEPfZz9SfPU7WdwFFuR972LxQRiwiFsaLypLrORdP7x898oP1x4MEMrD9NVwFq4miI7nlvgqedZ5qiwIkQhh9IrCN5uzcUe0F0sVW9C8oqFuJ9R68fcmQuOshflLxBjdKDq+DeXiHL1hCdMTF3chFloW90u2NYudp+CR\"}"
            const accountOrError = await keybase.importPPk(password, jsonStr, "test123")
            expect(accountOrError).to.not.be.a("error")
        }).timeout(0)

    }).timeout(0)

    describe("Error scenarios", () => {
        // TODO: Add error scenarios
    }).timeout(0)
}).timeout(0)
