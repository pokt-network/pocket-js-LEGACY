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

function formatFunctionParams(params) {
    var results = [];
    var resultStrArray = [];
    
    params.forEach(objParam => {
        var currStr = "";
        var objParamArray = [];
        if(typeof objParam == "array"){
            var objStrings = _objectsAsRpcParams(objParamArray);
            var result = objStrings.join(",");
            if (result != null) {
                currStr = "[\(result)]";
            }
        }else{
            currStr = _objectAsRpcParam(objParam);
        }
        results.push(currStr);
    });
    results.forEach(item => {
        resultStrArray.push(item.toString());
    });

    return resultStrArray;
}

function _objectsAsRpcParams(objParams) {
    var result = [];

    objParams.forEach(objParam => {
        var objParamStr = "";
        if (objParamStr = _objectAsRpcParam(objParam)) {
            result.push(objParamStr);
        }
    });

    return result;
}

function _objectAsRpcParam(objParam) {
    if (typeof objParam == "number" ){
        var strValue = (BigInt(objParam)).toString(16);
        if (strValue == null) {
            return null;
        }
        return strValue;
    }else if(typeof objParam == "bool") {
        var boolValue = (stringValue =="true");
        if (boolValue == null) {
            return null;
        }
        return objParam;
    }else if(typeof objParam == "string"){
        var ojbParamStr = JSON.stringify(objParam);
        return JSON.stringify(ojbParamStr);
    }

    return null;
}

module.exports = {
    send,
    formatFunctionParams
}