/**
 * @author Pabel Nunez Landestoy <pabel@pokt.network>
 * @description Unit test for the Pocket Network Provider interface
 */
import * as dotenv from "dotenv"
import { expect } from "chai"
import { EnvironmentHelper, Network } from "../../../utils/env/helper"
import {
    Configuration, HttpRpcProvider, Pocket, typeGuard, RpcError, PocketRpcProvider, PocketAAT, V1RPCRoutes, Account,
} from "../../../../src"

// Constants
// For Testing we are using dummy data, none of the following information is real.
const addressHex = "175090018C3796FA05F4C0120EC61E2BBDA523F6"
const pocketBlockchain = "0002"
const blockchains = [pocketBlockchain]
const nodeAddress = "20421fe2cbfbd7fc7f120a1d8eb7bc223cfcf2d5"

/** Specify the environment using using EnvironmentHelper.getLocalNet()
 * LocalNet will run the tests againt's a local network which can be setup in the .env file = localhost_env_url="http://35.245.7.53"
 * TestNet will run the tests with the TestNet Network.
 * MainNet will run the tests with the MainNet Network (not available yet).
 * 
 * Note: Can be done also using the Network enum (LocalNet,TestNet and MainNet)
 * EnvironmentHelper.get(Network.LocalNet)
 * Note: process.env.localhost_env_url is set in the .env file, add if it doesn't exist in the root directory of the project
 * To use unit tests run "npm run test:unit" or "npmtest", for integration run "npm run test:integration"
 */
dotenv.config()
const env = EnvironmentHelper.getLocalNet()
const dispatcher = new URL(env.getPOKTRPC())
const configuration = new Configuration(5, 1000, undefined, 40000)
const appPubKeyHex = "3895f3a84afb824d7e2e63c5042a93ccdb13e0f891d5d61d10289df50d6c251d"
const appPrivKeyHex = "7ae62c4d807a85fb5e60ffd80d30b3132b836fd3506cc0d4cef87d9dd118db0d3895f3a84afb824d7e2e63c5042a93ccdb13e0f891d5d61d10289df50d6c251d"


// Default pocket instance to reuse code
async function getPocketDefaultInstance(): Promise<Pocket> {
    return new Pocket([dispatcher], undefined, configuration)
}

describe("Pocket Provider Query Interface", async () => {
    describe("Success scenarios", async () => {

        it('should successfully retrieve an account information', async () => {
            const pocket = await getPocketDefaultInstance()
            const clientPassphrase = "1234"
            const clientAccountOrError = await pocket.keybase.createAccount(clientPassphrase)
            expect(typeGuard(clientAccountOrError, Error)).to.be.false
            const clientAccount = clientAccountOrError as Account
            
            const error = await pocket.keybase.unlockAccount(clientAccount.addressHex, clientPassphrase, 0)
            expect(error).to.be.undefined

            const aat = await PocketAAT.from("0.0.1", clientAccount.publicKey.toString("hex"), appPubKeyHex, appPrivKeyHex)
            
            const provider = new PocketRpcProvider(pocket, aat, pocketBlockchain)
            const payload = JSON.stringify({ address: "20421fe2cbfbd7fc7f120a1d8eb7bc223cfcf2d5" })
            const accountResponse = await provider.send(V1RPCRoutes.QueryAccount.toString(), payload)
            expect(typeGuard(accountResponse, String)).to.be.true
        }).timeout(0)

    })
    // describe("Error scenarios", async () => {
    //     it('should returns an error trying to get a block due block height lower than 0.', async () => {
    //         const pocket = getPocketDefaultInstance()

    //         const blockResponse = await pocket.rpc()!.query.getBlock(BigInt(-1))
    //         expect(typeGuard(blockResponse, RpcError)).to.be.true
    //     }).timeout(0)
    // })
})