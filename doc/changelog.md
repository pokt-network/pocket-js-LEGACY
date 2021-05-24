## 0.6.12-RC
- Configuration: 
  - Changed maxDispatchers default value to 50.
  - Changed maxSessionRefreshRetries default value to 1.
- Session Manager:
  - Improved requestCurrentSession().
  - Renamed requestCurrentSession() to requestNewSession().
  - Added deleteDispatcher() to the requestNewSession() flow.
  - Updated integration tests.
- Routing Table;
  - Added error scenario to the readRandomDispatchers().
  - Renamed readRandomDispatchers() to getRandomDispatchers().
  - Renamed readRandomDispatcher() to getRandomDispatcher().
  - Renamed readDispatcher() to getDispatcher().
  - Fixed a High CPU usage caused by the addDispatcher().
  - Fixed a High CPU usage caused by the deleteDispatcher().
  - readDispatcher() now returns Node | Error.
  - Fixed readDispatcher() not returning a record in some scenarios.
  - addDispatcher() now returns a boolean.
  - deleteDispatcher() now returns a boolean.
  - Updated unit tests.
- Pocket:
  - Fixed promise issue on the refresh session flow.
  - Removed unnecessary try/catch from constructor.
- Miscellaneous:
  - Added typedoc for document generation, after installation the docs are going to be inside the doc/main folder.
  - Added typedoc output to gitignore.
  - Fixed Browserify script not running properly after install.
  

## 0.6.11-RC
- Query Nodes and Apps now support empty StakingStatus and JailedStatus.
- SendRelay network error parsing is improved.
- RpcError now allows two new properties 'session' which is used when a sendRelay fails and the network provides
  the dispatch session information, reducing the need to perform another request; and 'nodePubKey' which is populated
  when a sendRelay fails for a easy way to track.
- Added Msg and StdTx properties to the Transaction model.
- Query BlockTxs and AccountTxs now uses the Transaction model.
- TransactionSender>submit now uses the createTransaction.
- Added new QueryUpgrade which returns the height and version for the network amino to protobuf upgrade.
- useLegacyTxCodec default set to true.

## 0.6.9-RC
- Improved sendRelay error handling.
  
## 0.6.8-RC
- Multiple fixes for the ProtoBuf tx codec messages.
- Renamed useLegacyTxSignature to useLegacyTxCodec.
- Changed default tx codec to ProtoBuf.
- Fixed entropy overflow.
  
## 0.6.7-RC
- Improved session management.
  
## 0.6.6-RC
- Added ProtoBuf encoding for transaction signing.
- Added useLegacyTxSignature property flag to the Configuration Class for backwards compatibility with AminoJS(default).

## 0.6.5-RC
- Nodes used for relay request are now added to the routing table dispatcher's list.
- Removed IKVStore property from the Session Manager class.
- Updated Session Manager constructor, no routing table is needed to instantiate the class.
- Failing dispatcher's are now being removed from the routing table.
- Added integration tests for the Session Manager.
- Bumped axios version to 0.21.1.
  
## 0.6.4-RC
- Updated RPC Call getBlock to support pocket-core Beta-0.5.2.x.
  
## 0.6.3-RC
- Fixed query AccountTxs failing to parse sent txs response for some scenarios.

## 0.6.2-RC
- Updated RawTxResponse rawLogs to be optional

## 0.6.1-RC
- Fixed session refresh mechanism

## 0.6.0-RC
- Updated dependencies

## 0.5.9-RC
- Improved the way sessions are refreshed; instead of timing blocks, it will retry dispatch

## 0.5.8-RC
- Changed the way the Relay session height is computed

## 0.5.7-RC
- Fixed sendRelay failing to send proper relay proof while using the instance in static environments.
- Fixed consensusRelay not setting up the majority response in some scenarios.
  
## 0.5.6-RC
- Fixed an issue with the Portable Private Key functionalities.

## 0.5.5-RC
- Fixes for the staking status of nodes and apps.

## 0.5.4-RC
- Added consensus relay support to the PocketRpcProvider.
- Fixed Send Transaction failing in some scenarios.
  
## 0.5.3-RC   
- Updated the RPC call response parsing to be more forgiving in some scenarios.
- Fixed the "Session not found" intermittent issue.
- Added rejectSelfSignedCertificates configuration flag.

## 0.5.2-RC
- Fixes for send rawTx response fails while using PocketRpcProvider.

## 0.5.1-RC
- Added createTransaction to TransactionSender interface.

## 0.5.0-RC
- New nodeClaim/nodeClaims RPC calls.
- New allParams RPC calls.
- Fixed package.json types.
- Portable Private Key implementation.
- Added pagination to nodeReceipt and nodeReceipts.
- Fixed staking/unstaking and unjailing calls.
- Updated PocketAAT to 0.1.1.

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
