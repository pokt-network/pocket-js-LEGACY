# Quickstart

## Pocket-JS 0.6.8-rc highlight

On the latest version we introduce the new ProtoBuf transaction codec, this functionality is activated on the `Configuration` class for Pocket by default, to use the legacy AminoJS transaction codec the `useLegacyTxCodec` flag should be set to `true`.

```text
const useLegacyTxCodec = true;
const configuration = new Configuration(5, 2000, undefined, 100000, undefined, undefined, undefined, undefined, undefined, undefined, useLegacyTxCodec)
```

## How to Instantiate a Pocket Instance

For a basic Configuration file we just nee to set the three properties \(maxDispatchers, maxSessions and requestTimeOut\)

**Note:** We are going to use the default ProtoBuf transaction codec for the following examples.

```text
const maxDispatchers = 5;
const maxSessions = 2000;
const requestTimeOut = 100000;
const dispatchers = "https://node1.testnet.pokt.network,https://node2.testnet.pokt.network,https://node3.testnet.pokt.network,https://node4.testnet.pokt.network,https://node5.testnet.pokt.network"

const configuration = new Configuration(maxDispatchers, maxSessions, undefined, requestTimeOut);
const rpcProvider = new HttpRpcProvider(dispatchers[0]);

const pocket = new Pocket(dispatchers, rpcProvider, configuration);
```

## Prerequisites to send a transaction to the Network

To send a transaction over the network we need to accomplish 2 pre-steps:

1. Import the sender's account into the Pocket instance.
2. Create a Transaction Sender.

Example:

```text
const fromAccountPK = Buffer.from("88d48b0f4bbcfbd94ea3a19f7bf4d996b6e4cd249a50027a3b6f0d6c7f568d405f70ef6e7e851cc663e9fd2e5691430040dd34da212a4ff4f2146828c08a7386", "hex");
const passphrase = "pocket123";

// 1. Import the sender's account into the Pocket instance.
let account = await pocket.keybase.importAccount(fromAccountPK, passphrase)
account = account as Account

// 2. Create a Transaction Sender.
let transactionSender = await pocket.withImportedAccount(account.addressHex, passphrase)
transactionSender = transactionSender as TransactionSender
```

## How to send balance using Pocket

To send a balance we add 1 step to the whole process and that's it.

```text
// 3. Send Transaction.
const toAddress = "f81896be1964df0537a81274b4d2c9604124449e";
const chainID = "testnet";
const fee = "10000";
const balanceToSend = "100000";

let rawTxResponse = await transactionSender
    .send(account.addressHex, toAddress, balanceToSend)
    .submit(chainID, fee, CoinDenom.Upokt, "Sending a transaction memo")
rawTxResponse = rawTxResponse as rawTxResponse

// Print your transaction hash
console.log(rawTxResponse.hash)
```

## How to stake an App

```text
// 3. Stake App.
const chainID = "testnet";
const fee = "10000";
const chains = ["0001", "0002"];
const stakeAmount = "15000000";

let rawTxResponse = await transactionSender
    .appStake(account.publicKey.toString("hex"), chains, stakeAmount)
    .submit(chainID, fee, CoinDenom.Upokt, "App staking memo")
```

## How to unstake an App

```text
// 3. Unstake App.
const chainID = "testnet";
const fee = "10000";

let rawTxResponse = await transactionSender
    .appUnstake(account.addressHex)
    .submit(chainID, fee, CoinDenom.Upokt, "App unstaking memo")
```

## How to stake a Node

```text
// 3. Stake a Node.
const chainID = "testnet";
const fee = "10000";
const chains = ["0001", "0002"];
const stakeAmount = "150000000";
const serviceUrl = new URL("https://myawesomenode.network:443");

let rawTxResponse = await transactionSender
    .nodeStake(account.publicKey.toString("hex"), chains, stakeAmount, serviceUrl)
    .submit(chainID, fee, CoinDenom.Upokt, "Node staking memo")
```

## How to unstake a Node

```text
// 3. Unstake a Node.
const chainID = "testnet";
const fee = "10000";
const chains = ["0001", "0002"];

let rawTxResponse = await transactionSender
    .nodeUnstake(account.addressHex)
    .submit(chainID, fee, CoinDenom.Upokt, "Node unstaking memo")
```

## How to unjail a Node

```text
// 3. Unjail a Node.
const chainID = "testnet";
const fee = "10000";

let rawTxResponse = await transactionSender
    .nodeUnjail(account.addressHex)
    .submit(chainID, fee, CoinDenom.Upokt, "Node unjail memo")
```

