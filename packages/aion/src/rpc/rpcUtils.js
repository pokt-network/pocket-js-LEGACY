/**
 * @author Pabel Nunez Landestoy <pabel@pokt.network>
 * @description RPC Utils for the ETH and Net methods.
 */
// Constants
const NETWORK_NAME = "AION";
// Send a relay with the rpc method params
async function send(params, method, pocketAion, netID, callback) {
    try {
        // Create data
        var data = {
            "jsonrpc": "2.0",
            "method": method,
            "params": params,
            "id": (new Date()).getTime()
        };

        data = JSON.stringify(data);
        // Create relay
        var relay = pocketAion.createRelay(NETWORK_NAME, netID, data);
        // Check for errors after creating the relay
        if (relay instanceof Error) {
            if (callback) {
                callback(relay);
            }
            return relay;
        }
        var response = await pocketAion.sendRelay(relay);
        // Check for errors after sending the relay
        if (response instanceof Error) {
            if (callback) {
                callback(response);
            }
            return response;
        }
        // Parse response
        var responseJSON = JSON.parse(response);
        if (responseJSON.error) {
            var error = new Error("Failed to send request with message: " + responseJSON.error.message);
            if (callback) {
                callback(error);
            }
            return error;
        } else {
            if (callback) {
                callback(null, responseJSON.result);
            }
            return responseJSON.result;
        }
    } catch (error) {
        if (callback) {
            callback(error);
        }
        return error;
    }
}

module.exports = {
    send
}