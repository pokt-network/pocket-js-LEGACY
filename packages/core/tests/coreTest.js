var assert = require('assert');
var expect = require('chai').expect;
var should = require('chai').should();
const Package = require("pocket-js-core");
const Pocket = Package.Pocket;

describe('Pocket Class tests', function () {
    it('should instantiate a Pocket instance', function () {
        // Pocket options object
        var opts = {
            devID: "DEVID1",
            networkName: "ETH",
            netIDs: [4],
            version: "0"
        }
        // New Pocket instance
        var pocket = new Pocket(opts);

        expect(pocket).to.not.be.an.instanceof(Error);
        expect(pocket).to.be.an.instanceof(Pocket);
    });

    it('should fail to instantiate a Pocket instance', function () {
        // Pocket options object
        var opts = {
            networkName: "ETH",
            netIDs: [4],
            version: "0"
        }
        // New Pocket instance
        var pocket = new Pocket(opts);

        expect(pocket).to.be.an.instanceof(Error);
        expect(pocket).to.not.be.an.instanceof(Pocket);
    });

    it('should retrieve a list of nodes from the Node Dispatcher', async () => {
        // Pocket options object
        var opts = {
            devID: "DEVID1",
            networkName: "ETH",
            netIDs: [4],
            version: "0"
        }
        // New Pocket instance
        var pocket = new Pocket(opts);

        var result = await pocket.retrieveNodes();

        expect(result).to.equal(true);
    });

    it('should fail to retrieve a list of nodes from the Node Dispatcher', async () => {
        // Pocket options object
        var opts = {
            devID: "DEVID1",
            networkName: "ETH2",
            netIDs: [40],
            version: "100"
        }
        // New Pocket instance
        var pocket = new Pocket(opts);
        var pocket = new Pocket(opts);

        var result = await pocket.retrieveNodes();

        expect(result).to.equal(false);
    });

    it('should send a relay to a node in the network', async () => {
        // Pocket options object
        var opts = {
            devID: "DEVID1",
            networkName: "ETH",
            netIDs: [4],
            version: "0"
        }
        // New Pocket instance
        var pocket = new Pocket(opts);
        // Properties for the relay class
        var version = pocket.configuration.blockchains[0].Version;
        var address = "0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f";
        var data = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":["' + address + '","latest"],\"id\":67}';
        // Retrieve nodes first
        var result = await pocket.retrieveNodes();
        // Should return true
        expect(result).to.equal(true);
        // Create a relay
        var relay = pocket.createRelay("ETH", pocket.configuration.blockchains[0].NetID, version, data, pocket.configuration.devID);
        // Send relay
        var response = await pocket.sendRelay(relay);

        expect(response).to.not.be.an.instanceof(Error);
        expect(response).to.be.a('string');
    });

    it('should fail to send a relay to a node in the network with bad relay properties "netID"', async () => {
        // Pocket options object
        var opts = {
            devID: "DEVID1",
            networkName: "ETH",
            netIDs: [4],
            version: "0"
        }
        // New Pocket instance
        var pocket = new Pocket(opts);
        // Properties for the relay class
        var version = pocket.configuration.blockchains[0].Version;
        var address = "0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f";
        var data = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":["' + address + '","latest"],\"id\":67}';
        // Retrieve nodes first
        var result = await pocket.retrieveNodes();
        // Should return true
        expect(result).to.equal(true);
        // Create a relay
        var relay = pocket.createRelay("ETH", 10, version, data, pocket.configuration.devID);
        // Send relay
        var response = await pocket.sendRelay(relay);

        expect(response).to.be.an.instanceof(Error);
    });

    it('should send a report of a node to the Node Dispatcher', async () => {
        // Pocket options object
        var opts = {
            devID: "DEVID1",
            networkName: "ETH",
            netIDs: [4],
            version: "0"
        }
        // New Pocket instance
        var pocket = new Pocket(opts);
        // Retrieve nodes first
        var result = await pocket.retrieveNodes();
        // Properties for the report class
        var node = pocket.configuration.nodes[0];
        expect(node).to.be.an('object');
        // Should return true
        expect(result).to.equal(true);
        // Create a report
        var report = pocket.createReport(node.ip, "test please ignore");
        // Send report
        var response = await pocket.sendReport(report);

        expect(response).to.not.be.an.instanceof(Error);
        expect(response).to.be.a('string');
    });

    it('should fail to send a report of a node to the Node Dispatcher with no Node IP', async () => {
        // Pocket options object
        var opts = {
            devID: "DEVID1",
            networkName: "ETH",
            netIDs: [4],
            version: "0"
        }
        // New Pocket instance
        var pocket = new Pocket(opts);
        // Retrieve nodes first
        var result = await pocket.retrieveNodes();
        // Properties for the report class
        var node = pocket.configuration.nodes[0];
        expect(node).to.be.an('object');
        // Should return true
        expect(result).to.equal(true);
        // Create a report
        var report = pocket.createReport("", "test please ignore");
        // Send report
        var response = await pocket.sendReport(report);

        expect(response).to.not.be.an.instanceof(Error);
        expect(response).to.be.a('string');
    });
});