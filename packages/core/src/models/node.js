const axios = require('axios');

// Dispatch
class Node {
    constructor(network, version, netID, ip, port, ipPort) {
        this.network = network;
        this.version = version;
        this.netID = netID;
        this.ip = ip;
        this.port = port;
        this.ipPort = "http://"+ipPort;
        this.relay = null;
    }

    async sendRelay(callback) {
        try {
            const axiosInstance = axios.create({
                baseURL: this.ipPort,
                timeout: this.relay.configuration.requestTimeOut,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            var response = await axiosInstance.post(this.relay.configuration.relayPath, {
                "Blockchain": this.network,
                "NetID": this.netID,
                "Version": this.version,
                "Data": this.relay.data,
                "DevID": this.relay.configuration.devID
              }
            );
            
            if (response.status == 200 && response.data != null) {
                var result = response.data;
        
                if (callback) {
                  callback(result, null);
                } else {
                  return result;
                }
              } else {
                if (callback) {
                  callback(null, new Error("Failed to send relay with error: " + response.data));
                } else {
                  throw new Error("Failed to send relay with error: " + response.data);
                }
              }
        } catch (error) {
            return new Error("Failed to send relay with error: " + error);
        }
    }
}

module.exports = {
    Node
}