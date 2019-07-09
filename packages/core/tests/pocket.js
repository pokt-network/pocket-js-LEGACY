/**
 * @author Pabel Nunez Landestoy <pabel@pokt.network>
 * @description Unit test for the Pocket Core
 */
// Config
var config = require('../../../config.json')
// Constants
const expect = require('chai').expect;
const Pocket = require("../src/index.js").Pocket;
const DEV_ID = config.dev_id;

describe('Pocket Class tests', function () {

    it('should instantiate a Pocket instance', function () {
        // Pocket options object
        var opts = {
            devID: DEV_ID,
            networkName: "ETH",
            netIDs: [4]
        }
        // New Pocket instance
        var pocket = new Pocket(opts);

        expect(pocket).to.not.be.an.instanceof(Error);
        expect(pocket).to.be.an.instanceof(Pocket);
    }).timeout(0);

    it('should fail to instantiate a Pocket instance', function () {
        // Pocket options object
        var opts = {
            networkName: "ETH",
            netIDs: [4]
        }
        // New Pocket instance
        var pocket = new Pocket(opts);

        expect(pocket).to.be.an.instanceof(Error);
        expect(pocket).to.not.be.an.instanceof(Pocket);
    }).timeout(0);

    it('should retrieve a list of nodes from the Node Dispatcher', async () => {
        // Pocket options object
        var opts = {
            devID: DEV_ID,
            networkName: "ETH",
            netIDs: [4]
        }
        // New Pocket instance
        var pocket = new Pocket(opts);

        var result = await pocket.retrieveNodes();

        expect(result).to.not.be.an.instanceof(Error);
        expect(result).to.be.a('array');
    }).timeout(0);

    it('should retrieve a list of SSL only nodes from the Node Dispatcher', async () => {
        // Pocket options object
        var opts = {
            devID: DEV_ID,
            networkName: "ETH",
            netIDs: [4],
            sslOnly: true
        }
        // New Pocket instance
        var pocket = new Pocket(opts);

        var nodes = await pocket.retrieveNodes();
        expect(nodes).to.not.be.an.instanceof(Error);

        var result = []
        nodes.forEach(node => {
            if (node.port == 443 || node.port == "443") {
                result.push(node);
          }else{
                result.push(node);
          }
        });
        expect(result).to.not.be.empty;
    }).timeout(0);

    it('should fail to retrieve a list of nodes from the Node Dispatcher', async () => {
        // Pocket options object
        var opts = {
            devID: DEV_ID,
            networkName: "ETH2", // Wrong network name for intentional error scenario
            netIDs: [40]
        }
        // New Pocket instance
        var pocket = new Pocket(opts);

        var result = await pocket.retrieveNodes();

        expect(result).to.be.an.instanceof(Error);
    }).timeout(0);

    it('should send a relay to a node in the network', async () => {
        // Pocket options object
        var opts = {
            devID: DEV_ID,
            networkName: "ETH",
            netIDs: [4],
            requestTimeOut: 40000
        }
        // New Pocket instance
        var pocket = new Pocket(opts);
        // Properties for the relay class
        // Create data
        var data = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f\",\"latest\"],\"id\":67}';
        // Create a relay
        var relay = pocket.createRelay("ETH", pocket.configuration.blockchains[0].netID, data);
        // Send relay
        var response = await pocket.sendRelay(relay);

        expect(response).to.not.be.an.instanceof(Error);
        expect(response).to.be.a('string');
    }).timeout(0);

    it('should fail to send a relay to a node in the network with bad relay properties "netID"', async () => {
        // Pocket options object
        var opts = {
            devID: DEV_ID,
            networkName: "ETH",
            netIDs: [4],
            requestTimeOut: 40000
        }
        // New Pocket instance
        var pocket = new Pocket(opts);
        // Properties for the relay class
        var data = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f\",\"latest\"],\"id\":67}';
        // Create a relay
        // We are passing a bad netID as second parameter "10" for intentional error scenario
        var relay = pocket.createRelay("ETH", 10, data);
        // Send relay
        var response = await pocket.sendRelay(relay);

        expect(response).to.be.an.instanceof(Error);
    }).timeout(0);

    it('should send a relay to a node with REST API support in the network', async () => {
        // Pocket options object
        var opts = {
            devID: DEV_ID,
            networkName: "TEZOS",
            netIDs: ["MAINNET"],
            requestTimeOut: 40000
        }
        // New Pocket instance
        var pocket = new Pocket(opts);
        // Properties for the relay class
        var httpMethod = "GET";
        var path = "/network/version";
        // Retrieve nodes first
        var nodes = await pocket.retrieveNodes();
        // Should return a list of nodes
        expect(nodes).to.be.a('array');
        // Create a relay
        var relay = pocket.createRelay(pocket.configuration.blockchains[0].name, pocket.configuration.blockchains[0].netID, null, httpMethod, path, null);
        // Send relay
        var response = await pocket.sendRelay(relay);

        expect(response).to.not.be.an.instanceof(Error);
        expect(response).to.be.a('string');
    }).timeout(0);

    it('should send a report of a node to the Node Dispatcher', async () => {
        // Pocket options object
        var opts = {
            devID: DEV_ID,
            networkName: "ETH",
            netIDs: [4]
        }
        // New Pocket instance
        var pocket = new Pocket(opts);
        // Retrieve nodes first
        var nodes = await pocket.retrieveNodes();
        // Should return a list of nodes
        expect(nodes).to.be.a('array');
        // Properties for the report class
        var node = pocket.configuration.nodes[0];
        // TODO: Check if is a Node type object
        expect(node).to.be.an('object');

        // Create a report
        var report = pocket.createReport(node.ip, "test please ignore");
        // Send report
        var response = await pocket.sendReport(report);

        expect(response).to.not.be.an.instanceof(Error);
        expect(response).to.be.a('string');
    }).timeout(0);

    it('should fail to send a report of a node to the Node Dispatcher with no Node IP', async () => {
        // Pocket options object
        var opts = {
            devID: DEV_ID,
            networkName: "ETH",
            netIDs: [4],
        }
        // New Pocket instance
        var pocket = new Pocket(opts);
        // Retrieve nodes first
        var nodes = await pocket.retrieveNodes();
        // Should return a list of nodes
        expect(nodes).to.be.a('array');
        // Properties for the report class
        var node = pocket.configuration.nodes[0];
        // TODO: Check if is a Node type object
        expect(node).to.be.an('object');
        // Create a report
        // Sending empty "ip" parameter to createReport for intentional error scenario.
        var report = pocket.createReport("", "test please ignore");
        // Send report
        var response = await pocket.sendReport(report);

        expect(response).to.be.an.instanceof(Error);
    }).timeout(0);
});