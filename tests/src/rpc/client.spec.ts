/**
 * @author Pabel Nunez Landestoy <pabel@pokt.network>
 * @description Unit test for the Pocket Core Client interface
 */
import { expect } from "chai"
import { Pocket, BondStatus, Configuration, HttpRpcProvider, 
    Node, PocketAAT, EnvironmentHelper, Network, RpcError, typeGuard, RelayResponse
} from "../../../src"
import { NockUtil } from "../../utils/nock-util"

// Constants
// For Testing we are using dummy data, none of the following information is real.
const version = '0.0.1'
const addressHex = "4930289621AEFBF9252C91C4C729B7F685E44C4B"
const clientPublicKey = 'f6d04ee2490e85f3f9ade95b80948816bd9b2986d5554aae347e7d21d93b6fb5'
const applicationPublicKey = 'f62f77db69d448c1b56f3540c633f294d23ccdaf002bf6b376d058a00b51cfaa'
const applicationPrivateKey = '5cdf6e47ab6c525b3f10418e557f4e2b10d486b4bb458dea1af53391c6d94664f62f77db69d448c1b56f3540c633f294d23ccdaf002bf6b376d058a00b51cfaa'
const applicationSignature = 'f9ef487152452ae417930a0c4144dc9d40fc95d93ebce35a95af30267f1d03d3d8db1ec8da173c144169a582836ff1a5fdf197714b6a893f5aa726edea434409'
const alternatePublicKey = "0c390b7a6c532bef52f484e3795ece973aea04776fe7d72a40e8ed6eb223fdc9"
const alternatePrivateKey = "de54546ae6bfb7b67e74546c9a55816effa1fc8af004f9b0d231340d29d505580c390b7a6c532bef52f484e3795ece973aea04776fe7d72a40e8ed6eb223fdc9"
const ethBlockchain = "36f028580bb02cc8272a9a020f4200e346e276ae664e45ee80745574e2f5ab80"
const blockchains = [ethBlockchain]

/** Specify the environment using using EnvironmentHelper.getLocalNet()
 * LocalNet will run the tests againt's nock which have a set of responses mocked.abs
 * TestNet will run the tests with the TestNet Network.
 * MainNet will run the tests with the MainNet Network (not available).
 * 
 * Note: Can be done also using the Network enum (LocalNet,TestNet and MainNet)
 * EnvironmentHelper.get(Network.LocalNet)
 */
const env = EnvironmentHelper.getLocalNet()

// Instances
const noSessionPocketAAT = PocketAAT.from(version, clientPublicKey, alternatePublicKey, alternatePrivateKey)
const node01 = new Node(addressHex, applicationPublicKey, false, BondStatus.bonded, BigInt(100), env.getPOKTRPC(), blockchains)
const configuration = new Configuration([node01], 5, 40000, 200)
const rpcProvider = new HttpRpcProvider(new URL(node01.serviceURL))

// Default pocket instance to reuse code
function getPocketDefaultInstance(): Pocket {
    return new Pocket(configuration, rpcProvider)
}

describe("Pocket RPC Client Interface", async () => {
    describe("Success scenarios", async () => {
         // TODO: Fix signing
        //  it('should successfully send a relay due to a valid information', async () => {
        //     const pocket = getPocketDefaultInstance()
        //     // Account
        //     const passphrase = "passphrase123"
        //     const result = await pocket.importAndUnlockAccount(passphrase, applicationPrivateKey)

        //     expect(result).to.not.be.an.instanceof(Error)
        //     // Relay
        //     const data = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f\",\"latest\"],\"id\":67}'
        //     NockUtil.mockDispatch()
        //     NockUtil.mockGetHeight()
        //     NockUtil.mockRelay()
        //     const response = await pocket.sendRelay(data, blockchain, null, pocketAAT)
        //     expect(typeGuard(response, RelayResponse)).to.be.true
        // }).timeout(0)
    })
    describe("Error scenarios", async () => {
        // Relay and RPC calls scenarios

        it('should fail to send a relay due to no sessions found', async () => {
            const pocket = getPocketDefaultInstance()

            const data = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f\",\"latest\"],\"id\":67}'
            NockUtil.mockRelay(500)
            const response = await pocket.sendRelay(data, ethBlockchain, noSessionPocketAAT)
            expect(typeGuard(response, RpcError)).to.be.true
        }).timeout(0)

        it('should fail to send a relay due to no stake amount', async () => {
            const pocket = getPocketDefaultInstance()

            const data = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f\",\"latest\"],\"id\":67}'

            NockUtil.mockRelay(500)
            const response = await pocket.sendRelay(data, ethBlockchain, noSessionPocketAAT)

            expect(typeGuard(response, RpcError)).to.be.true
        }).timeout(0)
    })
})