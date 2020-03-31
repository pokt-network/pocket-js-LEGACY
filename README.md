<div align="center">
  <a href="https://www.pokt.network">
    <img src="https://user-images.githubusercontent.com/16605170/74199287-94f17680-4c18-11ea-9de2-b094fab91431.png" alt="Pocket Network logo" width="340"/>
  </a>
</div>

# Pocket-JS
Official Javascript client to use with the Pocket Network
<div align="lef">
  <a  href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference">
    <img src="https://img.shields.io/badge/js-reference-yellow.svg"/>
  </a>
  <a href="https://nodejs.org/"><img  src="https://img.shields.io/badge/node-%3E%3D%2011.6.0-brightgreen"/></a>
</div>

<h1 align="left">Overview</h1>
  <div align="left">
    <a  href="https://github.com/pokt-network/pocket-js/releases">
      <img src="https://img.shields.io/github/release-pre/pokt-network/pocket-js.svg"/>
    </a>
    <a href="https://circleci.com/gh/pokt-network/pocket-js/tree/master">
      <img src="https://circleci.com/gh/pokt-network/pocket-js/tree/master.svg?style=svg"/>
    </a>
    <a  href="https://github.com/pokt-network/pocket-js/pulse">
      <img src="https://img.shields.io/github/contributors/pokt-network/pocket-js.svg"/>
    </a>
    <a href="https://opensource.org/licenses/MIT">
      <img src="https://img.shields.io/badge/License-MIT-blue.svg"/>
    </a>
    <br >
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

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Requirements

You should have at least have a basic knowledge of blockchain technology and know your way around JavaScript. You will also need to install the [NPM tool](https://www.npmjs.com/get-npm).

### Installation

```
npm install --save @pokt-network/pocket-js
```

## Documentation

If you would like to know how to integrate Pocket-JS into your DApp, [visit our developer portal](https://pocket-network.readme.io) that has a lot of useful tutorials and material about the Pocket Network.

```javascript
const module = require('@pokt-network/pocket-js')
const Pocket = module.Pocket
const Configuration = module.Configuration
const HttpRpcProvider = module.HttpRpcProvider
const Node = module.Node

const dispatchURL = new URL("http://node9.testnet.pokt.network:8081")
const rpcProvider = new HttpRpcProvider(dispatchURL)
const configuration = new Configuration(5, 1000, undefined, 40000)

const pocketInstance = new Pocket([dispatchURL], rpcProvider, configuration)

const balance = await pocketInstance.rpc.query.getBalance(accountAddress)
console.log("Account Balance: " + balance)
```

## Running the tests

```
npm run test:unit
npm run test:integration
```

## Contributing

Please read [CONTRIBUTING.md](https://github.com/pokt-network/pocket-js/blob/staging/CONTRIBUTING.md) for details on contributions and the process of submitting pull requests.

## Support & Contact

<div>
  <a  href="https://twitter.com/poktnetwork" ><img src="https://img.shields.io/twitter/url/http/shields.io.svg?style=social"></a>
  <a href="https://t.me/POKTnetwork"><img src="https://img.shields.io/badge/Telegram-blue.svg"></a>
  <a href="https://www.facebook.com/POKTnetwork" ><img src="https://img.shields.io/badge/Facebook-red.svg"></a>
  <a href="https://research.pokt.network"><img src="https://img.shields.io/discourse/https/research.pokt.network/posts.svg"></a>
</div>

## License

This project is licensed under the MIT License; see the [LICENSE.md](LICENSE.md) file for details.
