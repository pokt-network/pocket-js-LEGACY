/**
 * @author Pabel Nunez Landestoy <pabel@pokt.network>
 * @description Unit test for the Pocket Core
 */
// Constants
import { expect, assert } from 'chai'
import { Node, BondStatus, Configuration, Pocket, 
    LocalNet, HttpRpcProvider, typeGuard, EnvironmentHelper 
} from '../../src'

// For Testing we are using dummy data, none of the following information is real.
const addressHex = "175090018C3796FA05F4C0120EC61E2BBDA523F6"
const applicationPublicKey = '633149e7e361b521e6a37f47c38b2f409fbaa0a5e5b3ad67280982a27e543bc2'
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
const node01 = new Node(addressHex, applicationPublicKey, false, BondStatus.bonded, BigInt(100), env.getPOKTRPC.toString(), blockchains)
const configuration = new Configuration([node01],5, 40000, 200)
const rpcProvider = new HttpRpcProvider(new URL(node01.serviceURL))

describe("Pocket Interface functionalities", async () => {
    describe("Success scenarios", async () => {
        it('should instantiate a Pocket instance due to a valid configuration is being used', () => {
            try {
                const pocket = new Pocket(configuration, rpcProvider)
                expect(typeGuard(pocket, Pocket)).to.be.true
            } catch (error) {
                assert.fail()
            }
        }).timeout(0)        
    })
})
