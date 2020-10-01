const PocketJS = require('@pokt-network/pocket-js');
const testPPK = require(`./testnetPK.json`) //modify
const aat = require('./aat.json') //modify
const Pocket = PocketJS.Pocket;
const Configuration = PocketJS.Configuration;
const Provider = PocketJS.HttpRpcProvider;
const PocketAAT = PocketJS.PocketAAT;

// decrpytion PPK passphrase. 
const testppkPassphrase = 'Kirito!' //modify

/*
Create an array of dispatchers that will be connecting you to a Pocket Node. A list of Dispatchers can be found here: https://docs.pokt.network/v2.1/docs/known-dispatcher-list
*/
const dispatchers = [new URL("https://node3.testnet.pokt.network:443"), new URL("https://node2.testnet.pokt.network:443")];


/* 
The blockchain hash needed to identify the blockchain you wish to connect to. See Supported Networks(https://docs.pokt.network/v2.1/docs/supported-networks) 
*/
const blockchain = "0022";

/*
(optional)Configuration stores multiple properties used to interact with the Pocket Network. 
   - maxDispatchers - (optional) Maximun amount of dispatchers urls to stored in rounting table, default 0.
   - maxSessions - (optional) Maximun amount of sessions to stored for the session manager, default 0.
   - maxConsensusNodes - (optional) Maximun amount of nodes for local consensus, mandatory ODD number, default 0.
   - requestTimeOut - (optional) Maximun timeout for every request in miliseconds, default 0.
   - acceptDisputedResponses - (optional) Accept or reject responses based on having a full consensus, default false.
   - sessionBlockFrequency - (optional) Amount of blocks that need to elapse for a new session to be tumbled, look at https://github.com/pokt-network/pocket-network-genesis for more information
   - blockTime - (optional) Amount of time (in milliseconds) for a new block to be produced in the Pocket Network
   - maxSessionRefreshRetries - (optional) Amount of times to perform a session refresh in case of getting error code 1124 (Invalid Session)
   - validateRelayResponses - (optional) If True the relay responses are validated againt's the relay request information, False will not validate
   - rejectSelfSignedCertificates - (optional) If True the HTTP RPC provider will force certificates to come from CAs, False will allow self signed
*/
const configuration = new Configuration(5, 1000, 5, 4000,true,undefined, undefined, undefined, undefined, false)

// create RPC provider 
const rpcProvider = new Provider(dispatchers)

/*
 create a pocket instance and stores muliple configuration options for your node
  - dispatchers: Array holding the initial dispatcher url(s).
  - rpcProvider:(optional) Provider which will be used to reach out to the Pocket Core RPC interface.
  - configuration:(optional) configuration object
  - store: (optional)Save data using a Key/Value relationship. This object save information in memory.
*/
const pocket = new Pocket(dispatchers, rpcProvider, configuration)


// This is only called once to setup the Pocket Instance and AAT
async function unlockAAT(aat, testPPK, testppkPassphrase) {
    try {
        const account = await pocket.keybase.importPPKFromJSON(
            testppkPassphrase,
            JSON.stringify(testPPK),
            testppkPassphrase
        )
        await pocket.keybase.unlockAccount(account.addressHex, testppkPassphrase, 0)
        return await PocketAAT.fromSignature(
            aat.version,
            account.publicKey.toString('hex'),
            aat.applicationPublicKey,
            aat.applicationSignature
        )
    } catch(e) {
        console.log(e)
    }
}

// Call this every time you want to fetch RPC data
async function sendRelay(rpcQuery, blockchain, pocketAAT) {
    try {
        return await pocket.sendRelay(rpcQuery, blockchain, pocketAAT)
    } catch (e) {
        console.log(e)
    }
}


unlockAAT(aat, testPPK, testppkPassphrase).then(pocketAAT => {
    rpcQuery = '{"jsonrpc":"2.0","id":1,"method":"net_version","params":[]}'
    sendRelay(rpcQuery, blockchain, pocketAAT).then(result => {
        console.log(result.payload);
    })
})