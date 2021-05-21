# **Quickstart: Pocket-JS 0.6.8-rc highlight**

In the latest version of this SDK, we introduce the new ProtoBuf transaction codec. This functionality is activated on the `Configuration` class for Pocket by default. To revert to the legacy AminoJS transaction code, make sure to set the `useLegacyTxCodec` flag to `true`.

```js
const useLegacyTxCodec = true;
const configuration = new Configuration(5, 2000, undefined, 100000, undefined, undefined, undefined, undefined, undefined, undefined, useLegacyTxCodec)
```

# **HOWTO: Instantiate a Pocket Instance and Send Transactions**

For a basic configuration file, we simply need to set the following three properties: `maxDispatchers`, `maxSessions`, & `requestTimeOut`.

**Note:** We are using the default ProtoBuf transaction codec for the following examples.

```js
const maxDispatchers = 5;
const maxSessions = 2000;
const requestTimeOut = 100000;
const dispatchers = "https://node1.testnet.pokt.network,https://node2.testnet.pokt.network,https://node3.testnet.pokt.network,https://node4.testnet.pokt.network,https://node5.testnet.pokt.network"

const configuration = new Configuration(maxDispatchers, maxSessions, undefined, requestTimeOut);
const rpcProvider = new HttpRpcProvider(dispatchers[0]);

const pocket = new Pocket(dispatchers, rpcProvider, configuration);
```

## **Prerequisites**

To send a transaction over the network, we need to first perform the following two initial steps:

1. Import the sender's account into the Pocket instance.
2. Create a Transaction Sender.

Example:

```js
const fromAccountPK = Buffer.from("88d48b0f4bbcfbd94ea3a19f7bf4d996b6e4cd249a50027a3b6f0d6c7f568d405f70ef6e7e851cc663e9fd2e5691430040dd34da212a4ff4f2146828c08a7386", "hex");
const passphrase = "pocket123";

// 1. Import the sender's account into the Pocket instance.
let account = await pocket.keybase.importAccount(fromAccountPK, passphrase)
account = account as Account

// 2. Create a Transaction sender.
let transactionSender = await pocket.withImportedAccount(account.addressHex, passphrase)
transactionSender = transactionSender as TransactionSender
```

### **Performing Transactions**

Afterward importing the sender's account and creating a transaction sender object, any of the transactions below can be performed.

### **Send a balance**

```js
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

### **Stake an app**

```js
const chainID = "testnet";
const fee = "10000";
const chains = ["0001", "0002"];
const stakeAmount = "15000000";

let rawTxResponse = await transactionSender
    .appStake(account.publicKey.toString("hex"), chains, stakeAmount)
    .submit(chainID, fee, CoinDenom.Upokt, "App staking memo")
```

### **Unstake an app**

```js
const chainID = "testnet";
const fee = "10000";

let rawTxResponse = await transactionSender
    .appUnstake(account.addressHex)
    .submit(chainID, fee, CoinDenom.Upokt, "App unstaking memo")
```

## **Stake a node**

```js
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

## **Unstake a node**

```js
const chainID = "testnet";
const fee = "10000";
const chains = ["0001", "0002"];

let rawTxResponse = await transactionSender
    .nodeUnstake(account.addressHex)
    .submit(chainID, fee, CoinDenom.Upokt, "Node unstaking memo")
```

## **Unjail a node**

```js
const chainID = "testnet";
const fee = "10000";

let rawTxResponse = await transactionSender
    .nodeUnjail(account.addressHex)
    .submit(chainID, fee, CoinDenom.Upokt, "Node unjail memo")
```
