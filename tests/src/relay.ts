// TODO: Refactor this test to make use of the Enviroment
// import { Node, Configuration, Pocket, PocketAAT, Account, typeGuard } from "../../src"
// import { expect } from 'chai'

// const appPubKeyHex = "e24342efda5f137c88f538c0d0fad5b5ebcd96456f6abdce84e2ad1a9c4f77bb"
// const appPrivKeyHex = "eb4177731e91c538b9ef4da43a5f4e9f0fdf87e3f3fd3d2b50a9d614ea8a147fe24342efda5f137c88f538c0d0fad5b5ebcd96456f6abdce84e2ad1a9c4f77bb"
// const appAddressHex = "002FE59E366DA55C65CED4823DDD5499BD500007"
// const nodeJSON = "{\"address\":\"b5f68f97bcd6e5c749723150a509d98d7ae766b4\",\"public_key\":\"e9c04dfc08514377ddeb4d7451137a7ce11a0ab6ae4f86a51d6677667072530a\",\"jailed\":false,\"status\":2,\"tokens\":\"1000000000\",\"service_url\":\"http:\/\/35.236.203.13:8081\",\"chains\":[\"6d3ce011e06e27a74cfa7d774228c52597ef5ef26f4a4afa9ad3cebefb5f3ca8\",\"49aff8a9f51b268f6fc485ec14fb08466c3ec68c8d86d9b5810ad80546b65f29\"],\"unstaking_time\":\"0001-01-01T00:00:00Z\"}"


// describe("Pocket Relay Testnet", function() {
//     it("should successfully send a relay given the correct parameters", async function() {
//         // Generate pocket instance
//         const dispatchNode = Node.fromJSON(nodeJSON)
//         const configuration = new Configuration([dispatchNode], 1000000, 1000000, 1000000)
//         const pocket = new Pocket(configuration)

//         // Generate client account
//         const clientPassphrase = "1234"
//         const clientAccountOrError = await pocket.createAccount(clientPassphrase)
//         expect(typeGuard(clientAccountOrError, Error)).to.be.false
//         const clientAccount = clientAccountOrError as Account
//         const error = await pocket.unlockAccount(clientAccount.addressHex, clientPassphrase, 0)
//         expect(error).to.be.undefined

//         // Generate AAT
//         const aat = PocketAAT.from("0.0.1", clientAccount.publicKey.toString("hex"), appPubKeyHex, appPrivKeyHex)
        
//         // Let's submit a relay!
//         const relayData = '{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"0xf892400Dc3C5a5eeBc96070ccd575D6A720F0F9f\",\"latest\"],\"id\":67}'
//         const blockchain = "49aff8a9f51b268f6fc485ec14fb08466c3ec68c8d86d9b5810ad80546b65f29"
//         const relayResponse = await pocket.sendRelay(relayData, blockchain, aat)
//         console.log(relayResponse)
//     })
// })