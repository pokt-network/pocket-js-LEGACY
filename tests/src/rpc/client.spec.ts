/**
 * @author Pabel Nunez Landestoy <pabel@pokt.network>
 * @description Unit test for the Pocket Core Client interface
 */
import { expect } from "chai"
import { NockUtil } from "../../utils/nock-util"
import { EnvironmentHelper } from "../../../src/utils/env/helper"
import { Node, PocketAAT, BondStatus, Configuration, HttpRpcProvider, Pocket, typeGuard, RpcError } from "../../../src"

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
const nodeAddress = "84871BAF5B4E01BE52E5007EACF7048F24BF57E0"
const nodePublicKey = "d9c7f275388ca1f87900945dba7f3a90fa9bba78f158c070aa12e3eccf53a2eb"
const testNode = new Node(nodeAddress, nodePublicKey, false, BondStatus.bonded, BigInt(100), env.getPOKTRPC(), ["ETH04"])


// Default pocket instance to reuse code
function getPocketDefaultInstance(): Pocket {
    return new Pocket(configuration, rpcProvider)
}

function defaultConfiguration(): Configuration {
    return new Configuration([testNode])
}

function createPocketInstance(configuration?: Configuration): Pocket {
    if (configuration === undefined) {
        const baseURL = new URL(defaultConfiguration().nodes[0].serviceURL)
        const rpcProvider = new HttpRpcProvider(baseURL)
        return new Pocket(defaultConfiguration(), rpcProvider)
    } else {
        const baseURL = new URL(configuration.nodes[0].serviceURL)
        const rpcProvider = new HttpRpcProvider(baseURL)
        return new Pocket(configuration, rpcProvider)
    }
}

describe("Pocket RPC Client Interface", async () => {
    describe("Sending raw transactions", function () {
        describe("Success scenarios", function () {
            it("should succesfully send a raw transaction given a fromAddress, tx hex and Node", async () => {
                NockUtil.mockRawTx()
                const pocket = createPocketInstance()
                const senderAddressHex = "11AD05777C30F529C3FD3753AD5D0EA97192716E"
                const txHex = "c001db0b170d0a3c939866b00a1411ad05777c30f529c3fd3753ad5d0ea97192716e12149e8e373ff27ec202f82d07df64f388ff42f9516d1a0a0a04706f6b7412023130120b0a04706f6b7412033130301a690a259d54477420917fe8e7fc02ceabddfbb10168dcd6885180d9f2db8855dbe063f6c5f7f93c9c12402c40788aac1e27539647a14a447d89966ab5fa6d4380c2b24a839c91be0106fbae55b76a9168a780108a40466b85b190ef12b9b6db6a879f6daa3b70b090100a22046c6f6c6f"
                const response = await pocket.rpc.client.rawtx(senderAddressHex, txHex, pocket.configuration.requestTimeOut)
                expect(response).not.to.be.a('error')
            })
        })

        describe("Error scenarios", function () {
            it("should fail given an invalid or empty address hex", async () => {
                NockUtil.mockRawTx()

                // Invalid address
                const pocket = createPocketInstance()
                let senderAddressHex = "11AD05777C30F529C3FD3753AD5D0EA9719271"
                let txHex = "c001db0b170d0a3c939866b00a1411ad05777c30f529c3fd3753ad5d0ea97192716e12149e8e373ff27ec202f82d07df64f388ff42f9516d1a0a0a04706f6b7412023130120b0a04706f6b7412033130301a690a259d54477420917fe8e7fc02ceabddfbb10168dcd6885180d9f2db8855dbe063f6c5f7f93c9c12402c40788aac1e27539647a14a447d89966ab5fa6d4380c2b24a839c91be0106fbae55b76a9168a780108a40466b85b190ef12b9b6db6a879f6daa3b70b090100a22046c6f6c6f"
                const invalidResponse = await pocket.rpc.client.rawtx(senderAddressHex, txHex, pocket.configuration.requestTimeOut)
                expect(typeGuard(invalidResponse, RpcError)).to.be.true

                // Empty address
                senderAddressHex = ""
                txHex = "c001db0b170d0a3c939866b00a1411ad05777c30f529c3fd3753ad5d0ea97192716e12149e8e373ff27ec202f82d07df64f388ff42f9516d1a0a0a04706f6b7412023130120b0a04706f6b7412033130301a690a259d54477420917fe8e7fc02ceabddfbb10168dcd6885180d9f2db8855dbe063f6c5f7f93c9c12402c40788aac1e27539647a14a447d89966ab5fa6d4380c2b24a839c91be0106fbae55b76a9168a780108a40466b85b190ef12b9b6db6a879f6daa3b70b090100a22046c6f6c6f"
                const emptyResponse = await pocket.rpc.client.rawtx(senderAddressHex, txHex, pocket.configuration.requestTimeOut)
                expect(typeGuard(emptyResponse, RpcError)).to.be.true
            })

            it("should fail given an empty tx hex", async () => {
                NockUtil.mockRawTx()
                // Empty address
                const pocket = createPocketInstance()
                const senderAddressHex = "11AD05777C30F529C3FD3753AD5D0EA9719271"
                const txHex = ""
                const response = await pocket.rpc.client.rawtx(senderAddressHex, txHex, pocket.configuration.requestTimeOut)
                expect(typeGuard(response, RpcError)).to.be.true
            })
        })
    })

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