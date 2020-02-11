/**
 * @author Pabel Nunez Landestoy <pabel@pokt.network>
 * @description Unit test for the Pocket Core
 */
// Constants
import { expect, assert } from 'chai'
import { EnvironmentHelper } from '../utils/env/helper'
import { Node, BondStatus, Configuration, HttpRpcProvider, Pocket, typeGuard } from '../../src'

// For Testing we are using dummy data, none of the following information is real.
const addressHex = "4930289621AEFBF9252C91C4C729B7F685E44C4B"
const applicationPublicKey = 'f62f77db69d448c1b56f3540c633f294d23ccdaf002bf6b376d058a00b51cfaa'
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
const node01 = new Node(addressHex, applicationPublicKey, false, BondStatus.bonded, BigInt(100), env.getPOKTRPC(), blockchains)
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
