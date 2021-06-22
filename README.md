
<div align="center">
  <a href="https://www.pokt.network">
    <img src="https://user-images.githubusercontent.com/2219004/119198290-15776780-ba57-11eb-847c-ce4d68f1f018.png" alt="Pocket Network logo" width="340"/>
  </a>
</div>

# Pocket-JS
Official Javascript client for connecting an application to the Pocket Network of decentralized nodes.
<div align="lef">
  <a  href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference">
    <img src="https://img.shields.io/badge/js-reference-yellow.svg"/>
  </a>
  <a href="https://nodejs.org/"><img  src="https://img.shields.io/badge/node-%3E%3D%2011.6.0-brightgreen"/></a>
</div>

## Overview
  <div align="left">
    <a  href="https://github.com/pokt-network/pocket-js/releases">
      <img src="https://img.shields.io/github/release-pre/pokt-network/pocket-js.svg"/>
    </a>
    <a  href="https://github.com/pokt-network/pocket-js/pulse">
      <img src="https://img.shields.io/github/contributors/pokt-network/pocket-js.svg"/>
    </a>
    <a href="https://opensource.org/licenses/MIT">
      <img src="https://img.shields.io/badge/License-MIT-blue.svg"/>
    </a>
    <a href="https://github.com/pokt-network/pocket-js/pulse">
      <img src="https://img.shields.io/github/last-commit/pokt-network/pocket-js.svg"/>
    </a>
    <a href="https://github.com/pokt-network/pocket-js/pulls">
      <img src="https://img.shields.io/github/issues-pr/pokt-network/pocket-js.svg"/>
    </a>
    <a href="https://github.com/pokt-network/pocket-js/issues">
      <img src="https://img.shields.io/github/issues-closed/pokt-network/pocket-js.svg"/>
    </a>
</div>

Pocket-JS is the core client used for sending relays to any network that is [currently supported](https://docs.pokt.network/home/resources/references/supported-blockchains) on the Pocket Network.

## Getting Started

These instructions will outline how to start developing with the Pocket-JS SDK.

### Requirements

You should have a basic knowledge of blockchain technology and JavaScript. You will also need to install the [NPM tool](https://www.npmjs.com/get-npm).

### Installation

```
npm install --save @pokt-network/pocket-js
```

## Documentation

[Visit our docs site](https://docs.pokt.network) for tutorials and information about the Pocket Network or get started with the examples below:

### For all of the following examples, start with this initialization code:
```javascript
const pocketJS = require('@pokt-network/pocket-js')
const { Pocket, Configuration, HttpRpcProvider, PocketAAT } = pocketJS;

// The dispatcher provides information about your Pocket session so that your
// application can then connect to the decentralized network of nodes.
// You can use one of our dispatchers or any node connected to the Pocket blockchain.
const dispatchURL = new URL("https://node1.mainnet.pokt.network:443")
const rpcProvider = new HttpRpcProvider(dispatchURL)
const configuration = new Configuration(5, 1000, 0, 40000)
const pocketInstance = new Pocket([dispatchURL], rpcProvider, configuration)

// See https://docs.pokt.network/home/resources/references/supported-blockchains for blockchain choices
const blockchain = "0021" // Ethereum mainnet
```
---
### Use an AAT to connect to any blockchain:

An Application Authentication Token is a token signed by an account that has staked for bandwidth as an App on the Pocket blockchain. You can create an Application Authentication Token (AAT) for multiple clients using the [Pocket Core CLI](https://github.com/pokt-network/pocket-core).

An example of a properly-formed AAT:
```json
{
  "version": "0.0.1",
  "clientPublicKey": "78219c51f6157e629948166d3af8c90cf4c4f5b245513b47806ed4dbdb28d0b6",
  "applicationPublicKey": "a85ffc9026d9c9f7e302785f3f9ddd15c85ddc85eeaa3b24e23b9e736d66361d",
  "applicationSignature": "727d8bb9167861413b5c85a7f220b7464f05e3740d6f8dc78734fa764a3093ba7b84e81fae4e5574e300177564d93a1ca5b6f0e2bf594367fa39e99510bf800f"
}
```

Once you have your AAT, include it with your project as a JSON file.
```javascript
const aat = require('./aat.json')
```

To unlock the AAT for use in your application, you must first import and unlock the AAT's client account indicated by the ```clientPublicKey``` field. The PPK file is obtained through the [Pocket Core CLI](https://github.com/pokt-network/pocket-core) with ```pocket accounts export```.

A properly-formed ppk.json file will start with ```{"kdf":"scrypt"```. Include it with your project as a JSON file along with the passphrase used when creating it:
```javascript
const accountPPK = require('./ppk.json')
const accountPassphrase = 'Qwerty1234!'
```

Once unlocked, your app can use the AAT to send relayed RPC calls to the external blockchain:
```javascript
// This is only called once to setup the Pocket Instance and AAT
async function unlockAAT(aat, accountPPK, accountPassphrase) {
    try {
        const account = await pocketInstance.keybase.importPPKFromJSON(
            accountPassphrase,
            JSON.stringify(accountPPK),
            accountPassphrase
        )
        await pocketInstance.keybase.unlockAccount(account.addressHex, accountPassphrase, 0)
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
        return await pocketInstance.sendRelay(rpcQuery, blockchain, pocketAAT)
    } catch (e) {
        console.log(e)
    }
}

unlockAAT(aat, accountPPK, accountPassphrase).then(pocketAAT => {
    rpcQuery = '{"jsonrpc":"2.0","id":1,"method":"net_version","params":[]}'
    sendRelay(rpcQuery, blockchain, pocketAAT).then(result => {
        console.log(result.payload);
    })
})
```
---
### Use private keys to connect to any blockchain:
If you instead include the staked application's public and private keys, you can generate the AAT on-the-fly:
```javascript
const accountPrivateKey = '25a42ad8ef4b5...'
const accountPublicKey = '6e2cda5a6b6709...'
const accountPassphrase = 'Qwerty1234!'

// This is only called once to setup the Pocket Instance and AAT
async function unlockAccount(accountPrivateKey, accountPublicKey, accountPassphrase) {
    try {
        const account = await pocketInstance.keybase.importAccount(
            Buffer.from(accountPrivateKey, 'hex'),
            accountPassphrase
        )
        await pocketInstance.keybase.unlockAccount(account.addressHex, accountPassphrase, 0)
        return await PocketAAT.from(
            "0.0.1",
            accountPublicKey,
            accountPublicKey,
            accountPrivateKey
        )
    } catch(e) {
        console.log(e)
    }
}

// Call this every time you want to fetch RPC data
async function sendRelay(rpcQuery, blockchain, pocketAAT) {
    try {
        return await pocketInstance.sendRelay(rpcQuery, blockchain, pocketAAT)
    } catch (e) {
        console.log(e)
    }
}

unlockAccount(accountPrivateKey, accountPublicKey, accountPassphrase).then(pocketAAT => {
    rpcQuery = '{"jsonrpc":"2.0","id":1,"method":"net_version","params":[]}'
    sendRelay(rpcQuery, blockchain, pocketAAT).then(result => {
        console.log(result.payload);
    })
})
```
---
### Query the Pocket blockchain without using an account:
```javascript
const accountAddress = "36b783a1189f605969f438dfaece2a4b38c65752"
const balance = await pocketInstance.rpc().query.getBalance(accountAddress)
console.log("Account Balance: " + balance)
```

## Running the tests

```
npm run test
```

## Contributing

Please read [CONTRIBUTING.md](https://github.com/pokt-network/pocket-js/blob/master/CONTRIBUTING.md) for details on contributions and the process of submitting pull requests.

## Support & Contact

[Join us on Discord](https://discord.gg/pokt) for immediate assistance directly from the Pocket Team.

<div>
  <a href="https://discord.gg/pokt"><img alt="Discord" src="https://img.shields.io/discord/553741558869131266?label=discord"></a>
  <a href="https://t.me/POKTnetwork"><img src="https://img.shields.io/badge/Telegram-blue.svg"></a>
  <a href="https://www.facebook.com/POKTnetwork" ><img src="https://img.shields.io/badge/Facebook-red.svg"></a>
  <a href="https://forum.pokt.network"><img src="https://img.shields.io/discourse/https/research.pokt.network/posts.svg"></a>
  <a  href="https://twitter.com/poktnetwork" ><img alt="Twitter Follow" src="https://img.shields.io/twitter/follow/poktnetwork?style=social"></a>
</div>


## License

This project is licensed under the MIT License; see the [LICENSE.md](LICENSE.md) file for details.
