import { expect } from 'chai'
import { Account, Configuration, Pocket, Node, BondStatus, HttpRpcProvider, ITransactionSender, typeGuard, RpcError, CoinDenom, RawTxResponse } from '../../../src'
import { env } from 'process'
import { EnvironmentHelper } from '../../utils/env'

// TODO: Use environment
const test = process.env.TEST
if (test === 'integration') {
    const env = EnvironmentHelper.getTestNet()
    const nodeAddress = "189ceb72c06b99e15a53fd437b81d4500f7a01f1"
    const nodePublicKey = "1839f4836f22d438692355b2ee34e47d396f6eb23b423bf3a1e623137ddbf7e3"
    const testNode = new Node(nodeAddress, nodePublicKey, false, BondStatus.bonded, BigInt(100), "http://35.245.90.148:8081", ["6d3ce011e06e27a74cfa7d774228c52597ef5ef26f4a4afa9ad3cebefb5f3ca8", "49aff8a9f51b268f6fc485ec14fb08466c3ec68c8d86d9b5810ad80546b65f29"])
    const senderPrivateKey = "5cdf6e47ab6c525b3f10418e557f4e2b10d486b4bb458dea1af53391c6d94664f62f77db69d448c1b56f3540c633f294d23ccdaf002bf6b376d058a00b51cfaa"

    describe("Pocket Send Transaction Integration Test", () => {
        it("should succesfully submit a send transaction", async () => {
            const pocket = new Pocket(new Configuration([testNode]), new HttpRpcProvider(new URL("http://35.245.90.148:8081")))

            // Create the account
            const passphrase = "1234"
            const accountOrError = await pocket.keybase.importAccount(Buffer.from(senderPrivateKey, "hex"), passphrase)
            const account = accountOrError as Account

            // Create the transaction sender
            const transactionSender = await pocket.withImportedAccount(account.address, passphrase) as ITransactionSender
            let rawTxResponse = await transactionSender
                .send(account.address.toString("hex"), "189CEB72C06B99E15A53FD437B81D4500F7A01F1", "1000")
                .submit("10", "1", "pocket-testet-playground", "100000", CoinDenom.Upokt, "This is a test!", 60000)
            expect(typeGuard(rawTxResponse, RpcError)).to.be.false
            rawTxResponse = rawTxResponse as RawTxResponse
            expect(rawTxResponse.hash).not.to.be.empty
        })
    })
}
