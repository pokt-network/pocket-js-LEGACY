/**
 * @author Pabel Nunez Landestoy <pabel@pokt.network>
 * @description Unit test for the Pocket Core
 */
// Config
import * as config from "../config.json"
// Constants
import { expect } from 'chai'
import { Pocket } from '../src/pocket'
import { Node } from "../src/models/node"
import { Hex } from '../src/utils/Hex'

const DEV_ID = config.dev_id

describe('Pocket Class tests',() => {

    it('should instantiate a Pocket instance',() => {
        // Pocket options object
        const opts = {
            devID: DEV_ID,
            netIDs: [4],
            networkName: "ETH"
        }
        // New Pocket instance
        const pocket = new Pocket(opts)

        console.log(Hex.decodeString("48656c6c6f20476f7068657221"))
        
        expect(pocket).to.not.be.an.instanceof(Error)
        expect(pocket).to.be.an.instanceof(Pocket)
    }).timeout(0)

    it('should fail to instantiate a Pocket instance', () => {
        // Pocket options object
        const opts = {
            netIDs: [4],
            networkName: "ETH"
        }
        // New Pocket instance
        const pocket = new Pocket(opts)

        expect(pocket).to.be.an.instanceof(Error)
        expect(pocket).to.not.be.an.instanceof(Pocket)
    }).timeout(0)

    it('should retrieve a list of nodes from the Node Dispatcher', async () => {
        // Pocket options object
        const opts = {
            devID: DEV_ID,
            netIDs: [4],
            networkName: "ETH"
        }
        // New Pocket instance
        const pocket = new Pocket(opts)

        const result = await pocket.retrieveNodes()

        expect(result).to.not.be.an.instanceof(Error)
        expect(result).to.be.a('array')
    }).timeout(0)

    it('should retrieve a list of SSL only nodes from the Node Dispatcher', async () => {
        // Pocket options object
        const opts = {
            devID: DEV_ID,
            netIDs: [4],
            networkName: "ETH",
            sslOnly: true
        }
        // New Pocket instance
        const pocket = new Pocket(opts)

        const nodes = await pocket.retrieveNodes() as Node[]
        expect(nodes).to.not.be.an.instanceof(Error)

        const result: Node[] = []
        
        nodes.forEach((node: Node) =>  {
            if (node.port === "443") {
                result.push(node)
            }else{
                result.push(node)
            }
        })
    }).timeout(0)

    it('should fail to retrieve a list of nodes from the Node Dispatcher', async () => {
        // Pocket options object
        const opts = {
            devID: DEV_ID,
            netIDs: [40],
            networkName: "ETH2" // Wrong network name for intentional error scenario
            
        }
        // New Pocket instance
        const pocket = new Pocket(opts)

        const result = await pocket.retrieveNodes()

        expect(result).to.be.an.instanceof(Error)
    }).timeout(0)

    it('should send a relay to a node in the network', async () => {
        // Pocket options object
        const opts = {
            devID: DEV_ID,
            netIDs: [4],
            networkName: "ETH",
            requestTimeOut: 40000
        }
        // New Pocket instance
        const pocket = new Pocket(opts)
        // Properties for the relay class
        // Create data
        const data = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f\",\"latest\"],\"id\":67}'
        // Create a relay
        const relay = pocket.createRelay(pocket.configuration.blockchains[0], data)
        // Send relay
        const response = await pocket.sendRelay(relay)

        expect(response).to.not.be.an.instanceof(Error)
        expect(response).to.be.a('string')
    }).timeout(0)

    it('should fail to send a relay to a node in the network with bad network ID', async () => {
        // Pocket options object
        const opts = {
            devID: DEV_ID,
            netIDs: [10],
            networkName: "ETH",
            requestTimeOut: 40000
        }
        // New Pocket instance
        const pocket = new Pocket(opts)
        // Properties for the relay class
        const data = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f\",\"latest\"],\"id\":67}'
        // Create a relay
        // We are passing a bad netID as second parameter "10" for intentional error scenario
        const relay = pocket.createRelay(pocket.configuration.blockchains[0], data)
        // Send relay
        const response = await pocket.sendRelay(relay)

        expect(response).to.be.an.instanceof(Error)
    }).timeout(0)

    it('should send a relay to a node with REST API support in the network', async () => {
        // Pocket options object
        const opts = {
            devID: DEV_ID,
            netIDs: ["MAINNET"],
            networkName: "TEZOS",
            requestTimeOut: 40000
        }
        // New Pocket instance
        const pocket = new Pocket(opts)
        // Properties for the relay class
        const httpMethod = "GET"
        const path = "/network/version"
        const headers = {"Content-Type": "application/json"}
        // Create a relay
        const relay = pocket.createRelay(pocket.configuration.blockchains[0], "", httpMethod, path, "", headers)
        // Send relay
        const response = await pocket.sendRelay(relay)

        expect(response).to.not.be.an.instanceof(Error)
        expect(response).to.be.a('string')
    }).timeout(0)

    it('should send a report of a node to the Node Dispatcher', async () => {
        // Pocket options object
        const opts = {
            devID: DEV_ID,
            netIDs: [4],
            networkName: "ETH"
        }
        // New Pocket instance
        const pocket = new Pocket(opts)
        // Retrieve nodes first
        const nodes = await pocket.retrieveNodes()
        // Should return a list of nodes
        expect(nodes).to.be.a('array')
        // Properties for the report class
        const node = pocket.configuration.nodes[0]
        // TODO: Check if is a Node type object
        expect(node).to.be.an('object')

        // Create a report
        const report = pocket.createReport(node.ip, "test please ignore")
        // Send report
        const response = await pocket.sendReport(report)

        expect(response).to.not.be.an.instanceof(Error)
        expect(response).to.be.a('string')
    }).timeout(0)

    it('should fail to send a report of a node to the Node Dispatcher with no Node IP', async () => {
        // Pocket options object
        const opts = {
            devID: DEV_ID,
            netIDs: [4],
            networkName: "ETH"
        }
        // New Pocket instance
        const pocket = new Pocket(opts)
        // Retrieve nodes first
        const nodes = await pocket.retrieveNodes()
        // Should return a list of nodes
        expect(nodes).to.be.a('array')
        // Properties for the report class
        const node = pocket.configuration.nodes[0]
        // TODO: Check if is a Node type object
        expect(node).to.be.an('object')
        // Create a report
        // Sending empty "ip" parameter to createReport for intentional error scenario.
        const report = pocket.createReport("", "test please ignore")
        // Send report
        const response = await pocket.sendReport(report)

        expect(response).to.be.an.instanceof(Error)
    }).timeout(0)
})