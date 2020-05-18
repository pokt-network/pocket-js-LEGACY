## 0.4.0-RC
- Replaced webpack with browserify.
- Multiple fixes for the web version.
- Added HTTPMethod enum for sendRelay.
- Fixed appStake and appUnstake functions.
- Updated serviceUrl validation.

## 0.3.1-RC
- Fixes for queryBlockTxs RPC Call.

## 0.3.0-RC
- Compatible with [Pocket Core version RC-0.3.0](https://github.com/pokt-network/pocket-core/releases/tag/RC-0.3.0)
- Added queryAccountTxs RPC Call.
- Added queryBlockTxs RPC Call.

## 0.2.3-RC
- Fixed Session tumbling
- Fixed multiple query issues

## 0.2.2-RC
- Removed dependency `@types/pokt-network__ed25519`

## 0.2.1-RC
- Switched ECDSA library to `libsodium-wrapper`
- Added [Webpack support](https://webpack.js.org)

## 0.2.0-RC
- Compatible with [Pocket Core version RC-0.2.1](https://github.com/pokt-network/pocket-core/releases/tag/RC-0.2.1)
- Added ability to run in-browser with webpack
- Added challenge transaction functionality; if a node returns data different from the majority of other nodes, a challenge will be issued to create a possible slashing scenario
- Added local consensus; developers can now choose the number of nodes to query with each relay to ensure data integrity
- Added acceptDisputed flag (default: false); if set to true and a disputed response is received, the majority answer will be accepted
- [Fixed issue](https://github.com/pokt-network/pocket-js/issues/233) where connection timeout wasn't respected
- [Fixed issue](https://github.com/pokt-network/pocket-js/issues/232) with invalid message signatures preventing transactions
- Updated dependencies (TSLint and more)
- Added support for Node 12.15 
