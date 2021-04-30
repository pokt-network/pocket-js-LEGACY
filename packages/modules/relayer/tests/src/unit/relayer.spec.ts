import { expect } from 'chai'
import { typeGuard, RpcError } from "@pokt-network/pocket-js-utils"
import { Configuration } from "@pokt-network/pocket-js-configuration"
import 'mocha';

const configuration = new Configuration()

describe("Relayer", function () {
    describe("Success scenarios", function () {
        it("Should instantiate a Relayer", async () => {
            const relayer = new Relayer(configuration)
            let data, blockchain, aat, headers, method, path, serviceNode, isConsensus

            const relayOrError = await relayer.send(data, blockchain, aat, headers, method, path, serviceNode, isConsensus)

            
        }) 
    })
})