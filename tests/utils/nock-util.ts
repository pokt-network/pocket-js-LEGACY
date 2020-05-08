import nock from 'nock'
import enums = require("../../src/rpc/models/routes")
import { LocalNet } from "./env"
import {
    PocketAAT,
    Transaction,
    Hex,
    TxProof,
    SimpleProof,
    Node,
    StakingStatus,
    StoredReceipt,
    NodeReceipt,
    Application,
    ApplicationParams,
    PocketParams,
    PartSetHeader,
    BlockID,
    BlockHeader,
    BlockMeta,
    Block,
    CommitSignature,
    Commit,
    QueryBlockResponse,
    QueryAccountResponse,
    QueryTXResponse,
    QueryHeightResponse,
    QueryBalanceResponse,
    QueryNodeResponse,
    QueryNodeParamsResponse,
    NodeParams,
    QueryNodeReceiptsResponse,
    QueryNodeReceiptResponse,
    QueryAppsResponse,
    QueryAppResponse,
    QueryAppParamsResponse,
    QueryPocketParamsResponse,
    QuerySupportedChainsResponse,
    QuerySupplyResponse, RelayResponse, RelayPayload, DispatchResponse, RelayRequest
} from '../../src'
import { SessionHeader } from '../../src/rpc/models/input/session-header'
import { RelayProof } from '../../src/rpc/models/relay-proof'
import { ChallengeResponse } from "../../src/rpc/models/output/challenge-response"
import { RequestHash } from "../../src/rpc/models/input/request-hash"
import { RelayMeta } from "../../src/rpc/models/input/relay-meta"
import { RelayProofResponse } from '../../src/rpc/models/output/relay-proof-response'

const env = new LocalNet()
const version = '0.0.1'
const addressHex = "84871BAF5B4E01BE52E5007EACF7048F24BF57E0"
const clientPublicKey = 'f6d04ee2490e85f3f9ade95b80948816bd9b2986d5554aae347e7d21d93b6fb5'
const applicationPublicKey = 'd9c7f275388ca1f87900945dba7f3a90fa9bba78f158c070aa12e3eccf53a2eb'
const applicationPrivateKey = '15f53145bfa6efdde6e65ce5ebfd330ac0a2591ae451a8a03ace99eff894b9eed9c7f275388ca1f87900945dba7f3a90fa9bba78f158c070aa12e3eccf53a2eb'

export class NockUtil {
    public static mockQueries() {
        this.mockGetAccount()
        this.mockGetApp()
        this.mockGetAppParams()
        this.mockGetApps()
        this.mockGetBalance()
        this.mockGetBlock()
        this.mockGetHeight()
        this.mockGetNode()
        this.mockGetNodeParams()
        this.mockGetNodeReceipt()
        this.mockGetNodeReceipts()
        this.mockGetNodes()
        this.mockGetPocketParams()
        this.mockGetSupply()
        this.mockGetSupportedChains()
        this.mockGetTx()
        this.mockChallenge()
    }

    public static mockRawTx(code: number = 200): nock.Scope {
        const data: any = this.createData(code, {
            height: "1",
            raw_log: "[{\\\"msg_index\\\":0,\\\"success\\\":true,\\\"log\\\":\\\"\\\",\\\"events\\\":[{\\\"type\\\":\\\"message\\\",\\\"attributes\\\":[{\\\"key\\\":\\\"action\\\",\\\"value\\\":\\\"send\\\"}]}]}]\",\"logs\":[{\"msg_index\":0,\"success\":true,\"log\":\"\",\"events\":[{\"type\":\"message\",\"attributes\":[{\"key\":\"action\",\"value\":\"send\"}]}]}]",
            txhash: "1DE7AF0CDEF19B21D6BDE602A4916186E40D86854B2E747A464BD32C7616B5A2"
        })

        const response = this.getResponseObject(data, code)
        return this.nockRoute(enums.V1RPCRoutes.ClientRawTx.toString(), code, response.data)
    }

    // public static mockRelay(code: number = 200): nock.Scope {
    //     const relayPayload = new RelayPayload("data", "method", "path")
    //     const relayMeta = new RelayMeta(BigInt(1))
    //     const pocketAAT = await PocketAAT.from(version, clientPublicKey, applicationPublicKey, applicationPrivateKey)
    //     const proof = new RelayProof(BigInt(1), BigInt(5), applicationPublicKey, "ETH04",  pocketAAT, pocketAAT.applicationSignature, new RequestHash(relayPayload, relayMeta))
    //     const data: any = this.createData(code, {
    //         proof: proof.toJSON(),
    //         response: 'response',
    //         signature: addressHex
    //     })

    //     const response = this.getResponseObject(data, code)
    //     return this.nockRoute(enums.V1RPCRoutes.ClientRelay.toString(), code, response.data)
    // }

    public static mockDispatch(code: number = 200): nock.Scope {
        const blockchain = "36f028580bb02cc8272a9a020f4200e346e276ae664e45ee80745574e2f5ab80"
        const node01 = new Node(addressHex, applicationPublicKey, false, StakingStatus.Staked,
            BigInt(100), "http://127.0.0.1:80", [blockchain])
        const node02 = new Node(addressHex, applicationPublicKey, false, StakingStatus.Staked,
            BigInt(101), "http://127.0.0.1:80", [blockchain])
        const sessionHeader = new SessionHeader(applicationPublicKey, blockchain, BigInt(5))

        const data: any = this.createData(code, {
            header: sessionHeader.toJSON(),
            key: 'Qck/v4L3u7vH6SbrzMiscjEHYucFBFz3pMZv6r9KIZI=',
            nodes: [{ value: node01.toJSON() }, { value: node02.toJSON() }]
        })

        const response = this.getResponseObject(data, code)
        return this.nockRoute(enums.V1RPCRoutes.ClientDispatch.toString(), code, response.data)
    }
    public static mockDispatchForConsensus(code: number = 200): nock.Scope {
        const dispatchResponse = DispatchResponse.fromJSON('{"block_height":313,"session":{"header":{"app_public_key":"73f765cb848f9d40aa9a16a3726f1ec5703f77bad22b2487cd4baaaf777f6e90","chain":"8cf7f8799c5b30d36c86d18f0f4ca041cf1803e0414ed9e9fd3a19ba2f0938ff","session_height":311},"key":"Kxr7AStAenBzxJYasOfC0IRJalzydzI0xSuLZsDA8k8=","nodes":[{"address":"808053795c7b302218a26af6c40f8c39565ebe02","chains":["8ef9a7c67f6f8ad14f82c1f340963951245f912f037a7087f3f2d2f9f9ee38a8","a969144c864bd87a92e974f11aca9d964fb84cf5fb67bcc6583fe91a407a9309","0070eebec778ea95ef9c75551888971c27cce222e00b2f3f79168078b8a77ff9","4ae7539e01ad2c42528b6a697f118a3535e404fe65999b2c6fee506465390367","0de3141aec1e69aea9d45d9156269b81a3ab4ead314fbf45a8007063879e743b","8cf7f8799c5b30d36c86d18f0f4ca041cf1803e0414ed9e9fd3a19ba2f0938ff","10d1290eee169e3970afb106fe5417a11b81676ce1e2119a0292df29f0445d30","d9d669583c2d2a88e54c0120be6f8195b2575192f178f925099813ff9095d139","d9d77bce50d80e70026bd240fb0759f08aab7aee63d0a6d98c545f2b5ae0a0b8","dcc98e38e1edb55a97265efca6c34f21e55f683abdded0aa71df3958a49c8b69","26a2800156f76b66bcb5661f2988a9d09e76caaffd053fe17bf20d251b4cb823","73d8dd1b7d8aa02254e75936b09780447c06729f3e55f7ae5eb94ab732c1ec05","6cbb58da0b05d23022557dd2e479dd5cdf2441f20507b37383467d837ad40f5e","54cb0d71117aa644e74bdea848d61bd2fd410d3d4a3ed92b46b0847769dc132e","cb92cb81d6f72f55114140a7bbe5e0f63524d1200fe63250f58dfe5d907032bf","e458822c5f4d927c29aa4240a34647e11aff75232ccb9ffb50af06dc4469a5fa","0dfcabfb7f810f96cde01d65f775a565d3a60ad9e15575dfe3d188ff506c35a0","866d7183a24fad1d0a32c399cf2a1101f3a3bdfdff999e142bd8f49b2ebc45d4","4c0437dda63eff39f85c60d62ac936045da5e610aca97a3793771e271578c534","773eda9368243afe027062d771b08cebddf22e03451e0eb5ed0ff4460288847e","d5ddbb1ca49249438f552dccfd01918ee1fbdc6457997a142c8cfd144b40cd15","4ecc78e62904c833ad5b727b9abf343a17d0d24fb27e9b5d2dd8c34361c23156","d754973bdeab17eaed47729ee074ad87737c3ce51198263b8c4781568ea39e72"],"jailed":false,"public_key":"b82d84b5ab77574fc095b78526a4d17c40564a8d64156615ad80818882dff2be","service_url":"http://127.0.0.1:80","status":2,"tokens":"1000000000","unstaking_time":"0001-01-01T00:00:00Z"},{"address":"99438bc8937b3c5711886ca5c4ed657e17174657","chains":["8ef9a7c67f6f8ad14f82c1f340963951245f912f037a7087f3f2d2f9f9ee38a8","a969144c864bd87a92e974f11aca9d964fb84cf5fb67bcc6583fe91a407a9309","0070eebec778ea95ef9c75551888971c27cce222e00b2f3f79168078b8a77ff9","4ae7539e01ad2c42528b6a697f118a3535e404fe65999b2c6fee506465390367","0de3141aec1e69aea9d45d9156269b81a3ab4ead314fbf45a8007063879e743b","8cf7f8799c5b30d36c86d18f0f4ca041cf1803e0414ed9e9fd3a19ba2f0938ff","10d1290eee169e3970afb106fe5417a11b81676ce1e2119a0292df29f0445d30","d9d669583c2d2a88e54c0120be6f8195b2575192f178f925099813ff9095d139","d9d77bce50d80e70026bd240fb0759f08aab7aee63d0a6d98c545f2b5ae0a0b8","dcc98e38e1edb55a97265efca6c34f21e55f683abdded0aa71df3958a49c8b69","26a2800156f76b66bcb5661f2988a9d09e76caaffd053fe17bf20d251b4cb823","73d8dd1b7d8aa02254e75936b09780447c06729f3e55f7ae5eb94ab732c1ec05","6cbb58da0b05d23022557dd2e479dd5cdf2441f20507b37383467d837ad40f5e","54cb0d71117aa644e74bdea848d61bd2fd410d3d4a3ed92b46b0847769dc132e","cb92cb81d6f72f55114140a7bbe5e0f63524d1200fe63250f58dfe5d907032bf","e458822c5f4d927c29aa4240a34647e11aff75232ccb9ffb50af06dc4469a5fa","0dfcabfb7f810f96cde01d65f775a565d3a60ad9e15575dfe3d188ff506c35a0","866d7183a24fad1d0a32c399cf2a1101f3a3bdfdff999e142bd8f49b2ebc45d4","4c0437dda63eff39f85c60d62ac936045da5e610aca97a3793771e271578c534","773eda9368243afe027062d771b08cebddf22e03451e0eb5ed0ff4460288847e","d5ddbb1ca49249438f552dccfd01918ee1fbdc6457997a142c8cfd144b40cd15","4ecc78e62904c833ad5b727b9abf343a17d0d24fb27e9b5d2dd8c34361c23156","d754973bdeab17eaed47729ee074ad87737c3ce51198263b8c4781568ea39e72"],"jailed":false,"public_key":"c9228d57cfbc881059e3e07de6bbd46fd5d5a2491263090abd85f07b5ae71417","service_url":"http://127.0.0.1:80","status":2,"tokens":"1000000000","unstaking_time":"0001-01-01T00:00:00Z"},{"address":"deb8f5b8be1fab076db014ac9ecf92068e616d93","chains":["8ef9a7c67f6f8ad14f82c1f340963951245f912f037a7087f3f2d2f9f9ee38a8","a969144c864bd87a92e974f11aca9d964fb84cf5fb67bcc6583fe91a407a9309","0070eebec778ea95ef9c75551888971c27cce222e00b2f3f79168078b8a77ff9","4ae7539e01ad2c42528b6a697f118a3535e404fe65999b2c6fee506465390367","0de3141aec1e69aea9d45d9156269b81a3ab4ead314fbf45a8007063879e743b","8cf7f8799c5b30d36c86d18f0f4ca041cf1803e0414ed9e9fd3a19ba2f0938ff","10d1290eee169e3970afb106fe5417a11b81676ce1e2119a0292df29f0445d30","d9d669583c2d2a88e54c0120be6f8195b2575192f178f925099813ff9095d139","d9d77bce50d80e70026bd240fb0759f08aab7aee63d0a6d98c545f2b5ae0a0b8","dcc98e38e1edb55a97265efca6c34f21e55f683abdded0aa71df3958a49c8b69","26a2800156f76b66bcb5661f2988a9d09e76caaffd053fe17bf20d251b4cb823","73d8dd1b7d8aa02254e75936b09780447c06729f3e55f7ae5eb94ab732c1ec05","6cbb58da0b05d23022557dd2e479dd5cdf2441f20507b37383467d837ad40f5e","54cb0d71117aa644e74bdea848d61bd2fd410d3d4a3ed92b46b0847769dc132e","cb92cb81d6f72f55114140a7bbe5e0f63524d1200fe63250f58dfe5d907032bf","e458822c5f4d927c29aa4240a34647e11aff75232ccb9ffb50af06dc4469a5fa","0dfcabfb7f810f96cde01d65f775a565d3a60ad9e15575dfe3d188ff506c35a0","866d7183a24fad1d0a32c399cf2a1101f3a3bdfdff999e142bd8f49b2ebc45d4","4c0437dda63eff39f85c60d62ac936045da5e610aca97a3793771e271578c534","773eda9368243afe027062d771b08cebddf22e03451e0eb5ed0ff4460288847e","d5ddbb1ca49249438f552dccfd01918ee1fbdc6457997a142c8cfd144b40cd15","4ecc78e62904c833ad5b727b9abf343a17d0d24fb27e9b5d2dd8c34361c23156","d754973bdeab17eaed47729ee074ad87737c3ce51198263b8c4781568ea39e72"],"jailed":false,"public_key":"f0fba9adeaac04fa05abc0ba940e7bc26fe5d24f1b1a133224f73aa076b12dba","service_url":"http://127.0.0.1:80","status":2,"tokens":"1000000000","unstaking_time":"0001-01-01T00:00:00Z"},{"address":"e9ee23ea88967a3493c11d783d69b14a8a448f36","chains":["8ef9a7c67f6f8ad14f82c1f340963951245f912f037a7087f3f2d2f9f9ee38a8","a969144c864bd87a92e974f11aca9d964fb84cf5fb67bcc6583fe91a407a9309","0070eebec778ea95ef9c75551888971c27cce222e00b2f3f79168078b8a77ff9","4ae7539e01ad2c42528b6a697f118a3535e404fe65999b2c6fee506465390367","0de3141aec1e69aea9d45d9156269b81a3ab4ead314fbf45a8007063879e743b","8cf7f8799c5b30d36c86d18f0f4ca041cf1803e0414ed9e9fd3a19ba2f0938ff","10d1290eee169e3970afb106fe5417a11b81676ce1e2119a0292df29f0445d30","d9d669583c2d2a88e54c0120be6f8195b2575192f178f925099813ff9095d139","d9d77bce50d80e70026bd240fb0759f08aab7aee63d0a6d98c545f2b5ae0a0b8","dcc98e38e1edb55a97265efca6c34f21e55f683abdded0aa71df3958a49c8b69","26a2800156f76b66bcb5661f2988a9d09e76caaffd053fe17bf20d251b4cb823","73d8dd1b7d8aa02254e75936b09780447c06729f3e55f7ae5eb94ab732c1ec05","6cbb58da0b05d23022557dd2e479dd5cdf2441f20507b37383467d837ad40f5e","54cb0d71117aa644e74bdea848d61bd2fd410d3d4a3ed92b46b0847769dc132e","cb92cb81d6f72f55114140a7bbe5e0f63524d1200fe63250f58dfe5d907032bf","e458822c5f4d927c29aa4240a34647e11aff75232ccb9ffb50af06dc4469a5fa","0dfcabfb7f810f96cde01d65f775a565d3a60ad9e15575dfe3d188ff506c35a0","866d7183a24fad1d0a32c399cf2a1101f3a3bdfdff999e142bd8f49b2ebc45d4","4c0437dda63eff39f85c60d62ac936045da5e610aca97a3793771e271578c534","773eda9368243afe027062d771b08cebddf22e03451e0eb5ed0ff4460288847e","d5ddbb1ca49249438f552dccfd01918ee1fbdc6457997a142c8cfd144b40cd15","4ecc78e62904c833ad5b727b9abf343a17d0d24fb27e9b5d2dd8c34361c23156","d754973bdeab17eaed47729ee074ad87737c3ce51198263b8c4781568ea39e72"],"jailed":false,"public_key":"ba898b2cfdb9062109aa1496349feccb37f37bad534a7e9b3511a09b191b8d7d","service_url":"http://127.0.0.1:80","status":2,"tokens":"1000000000","unstaking_time":"0001-01-01T00:00:00Z"},{"address":"f31f77c8a882504ef8525e6557351295107f1680","chains":["8ef9a7c67f6f8ad14f82c1f340963951245f912f037a7087f3f2d2f9f9ee38a8","a969144c864bd87a92e974f11aca9d964fb84cf5fb67bcc6583fe91a407a9309","0070eebec778ea95ef9c75551888971c27cce222e00b2f3f79168078b8a77ff9","4ae7539e01ad2c42528b6a697f118a3535e404fe65999b2c6fee506465390367","0de3141aec1e69aea9d45d9156269b81a3ab4ead314fbf45a8007063879e743b","8cf7f8799c5b30d36c86d18f0f4ca041cf1803e0414ed9e9fd3a19ba2f0938ff","10d1290eee169e3970afb106fe5417a11b81676ce1e2119a0292df29f0445d30","d9d669583c2d2a88e54c0120be6f8195b2575192f178f925099813ff9095d139","d9d77bce50d80e70026bd240fb0759f08aab7aee63d0a6d98c545f2b5ae0a0b8","dcc98e38e1edb55a97265efca6c34f21e55f683abdded0aa71df3958a49c8b69","26a2800156f76b66bcb5661f2988a9d09e76caaffd053fe17bf20d251b4cb823","73d8dd1b7d8aa02254e75936b09780447c06729f3e55f7ae5eb94ab732c1ec05","6cbb58da0b05d23022557dd2e479dd5cdf2441f20507b37383467d837ad40f5e","54cb0d71117aa644e74bdea848d61bd2fd410d3d4a3ed92b46b0847769dc132e","cb92cb81d6f72f55114140a7bbe5e0f63524d1200fe63250f58dfe5d907032bf","e458822c5f4d927c29aa4240a34647e11aff75232ccb9ffb50af06dc4469a5fa","0dfcabfb7f810f96cde01d65f775a565d3a60ad9e15575dfe3d188ff506c35a0","866d7183a24fad1d0a32c399cf2a1101f3a3bdfdff999e142bd8f49b2ebc45d4","4c0437dda63eff39f85c60d62ac936045da5e610aca97a3793771e271578c534","773eda9368243afe027062d771b08cebddf22e03451e0eb5ed0ff4460288847e","d5ddbb1ca49249438f552dccfd01918ee1fbdc6457997a142c8cfd144b40cd15","4ecc78e62904c833ad5b727b9abf343a17d0d24fb27e9b5d2dd8c34361c23156","d754973bdeab17eaed47729ee074ad87737c3ce51198263b8c4781568ea39e72"],"jailed":false,"public_key":"d9c16082ea65ef00b07643a556c36af18a7aec8dd0033fc985fa01ef60e4c394","service_url":"http://127.0.0.1:80","status":2,"tokens":"1000000000","unstaking_time":"0001-01-01T00:00:00Z"}]}}')

        const data: any = this.createData(code, dispatchResponse.toJSON())

        const response = this.getResponseObject(data, code)
        return this.nockRoute(enums.V1RPCRoutes.ClientDispatch.toString(), code, response.data)
    }

    public static mockRelayForConsensus(code: number = 200): nock.Scope {
        const relayRequest = RelayRequest.fromJSON("{\"payload\":{\"data\":\"{\\\"address\\\":\\\"20421fe2cbfbd7fc7f120a1d8eb7bc223cfcf2d5\\\"}\",\"method\":\"\",\"path\":\"/v1/query/account\",\"headers\":null},\"meta\":{\"block_height\":881},\"proof\":{\"entropy\":25863001945781196,\"session_block_height\":876,\"servicer_pub_key\":\"78e4b0bd96eaa7acfa449c630f05a18acb21e4965c3c6245040f496382c28e67\",\"blockchain\":\"0002\",\"aat\":{\"version\":\"0.0.1\",\"app_pub_key\":\"3895f3a84afb824d7e2e63c5042a93ccdb13e0f891d5d61d10289df50d6c251d\",\"client_pub_key\":\"20ea750eda1fe0208b1098488966d52c741ea8246e76f2e51736c0131a63d442\",\"signature\":\"90f00816fccd213dcc2b0a0fe50372849cc453847cb0ce605c5b9a234099a80432e5962b50f104964683ed9d968afbdb2341c4782723d36310388068658a1b0c\"},\"signature\":\"7393e34b4423a04a26f12862b8667dfd4a8467078f637702632f45a569b4c8485e622edf7ed305a4607b2b9865ba4ec161d24791fcfe5b355e1808d696c8a40e\",\"request_hash\":\"7b227061796c6f6164223a7b2264617461223a227b5c22616464726573735c223a5c22323034323166653263626662643766633766313230613164386562376263323233636663663264355c227d222c226d6574686f64223a22222c2270617468223a222f76312f71756572792f6163636f756e74222c2268656164657273223a6e756c6c7d2c226d657461223a7b22626c6f636b5f686569676874223a3838317d7d\"}}")
        const proof = RelayProofResponse.fromJSON('{\"aat\":{\"app_pub_key\":\"73f765cb848f9d40aa9a16a3726f1ec5703f77bad22b2487cd4baaaf777f6e90\",\"client_pub_key\":\"a32329a020cab1fc0a9883630b0a2055faa8ea33280c7736701065afe2031a31\",\"signature\":\"b53c037ef3171badbd528661ca7e690ca0424a18355b8ff75a7fce51dce8875fca9930e60ffbb68259bee333bdbe49fc04e8925fdaa2597a934ca340c5eec30a\",\"version\":\"0.0.1\"},\"blockchain\":\"8cf7f8799c5b30d36c86d18f0f4ca041cf1803e0414ed9e9fd3a19ba2f0938ff\",\"entropy\":0,\"request_hash\":\"57ce01d285b9084dcee603710109b3048d9ed3424efbcd01fd17d8fdffdbfa61\",\"servicer_pub_key\":\"c9228d57cfbc881059e3e07de6bbd46fd5d5a2491263090abd85f07b5ae71417\",\"session_block_height\":12781,\"signature\":\"57ce01d285b9084dcee603710109b3048d9ed3424efbcd01fd17d8fdffdbfa61\"}')
        const relayResponse = new RelayResponse("880de421c0d0a084302c8d0c2188283b49e30807f42771666c64662f36a39b19cf7b69cf6d610c2584264a0cc15cb4a87d2976d82c486d70f3e9a93fd98c760e", "{\"jsonrpc\":\"2.0\",\"id\":67,\"result\":\"0x37e8ea61b1d51dd5\"}\n", proof, relayRequest)
        const data: any = this.createData(code, relayResponse.toJSON())

        const response = this.getResponseObject(data, code)
        return this.nockRoute(enums.V1RPCRoutes.ClientRelay.toString(), code, response.data)
    }

    public static mockRelayForConsensusFailure(code: number = 200): nock.Scope {
        const relayRequest = RelayRequest.fromJSON("{\"payload\":{\"data\":\"{\\\"address\\\":\\\"20421fe2cbfbd7fc7f120a1d8eb7bc223cfcf2d5\\\"}\",\"method\":\"\",\"path\":\"/v1/query/account\",\"headers\":null},\"meta\":{\"block_height\":881},\"proof\":{\"entropy\":25863001945781196,\"session_block_height\":876,\"servicer_pub_key\":\"78e4b0bd96eaa7acfa449c630f05a18acb21e4965c3c6245040f496382c28e67\",\"blockchain\":\"0002\",\"aat\":{\"version\":\"0.0.1\",\"app_pub_key\":\"3895f3a84afb824d7e2e63c5042a93ccdb13e0f891d5d61d10289df50d6c251d\",\"client_pub_key\":\"20ea750eda1fe0208b1098488966d52c741ea8246e76f2e51736c0131a63d442\",\"signature\":\"90f00816fccd213dcc2b0a0fe50372849cc453847cb0ce605c5b9a234099a80432e5962b50f104964683ed9d968afbdb2341c4782723d36310388068658a1b0c\"},\"signature\":\"7393e34b4423a04a26f12862b8667dfd4a8467078f637702632f45a569b4c8485e622edf7ed305a4607b2b9865ba4ec161d24791fcfe5b355e1808d696c8a40e\",\"request_hash\":\"7b227061796c6f6164223a7b2264617461223a227b5c22616464726573735c223a5c22323034323166653263626662643766633766313230613164386562376263323233636663663264355c227d222c226d6574686f64223a22222c2270617468223a222f76312f71756572792f6163636f756e74222c2268656164657273223a6e756c6c7d2c226d657461223a7b22626c6f636b5f686569676874223a3838317d7d\"}}")

        const proof = RelayProofResponse.fromJSON('{\"aat\":{\"app_pub_key\":\"73f765cb848f9d40aa9a16a3726f1ec5703f77bad22b2487cd4baaaf777f6e90\",\"client_pub_key\":\"a32329a020cab1fc0a9883630b0a2055faa8ea33280c7736701065afe2031a31\",\"signature\":\"b53c037ef3171badbd528661ca7e690ca0424a18355b8ff75a7fce51dce8875fca9930e60ffbb68259bee333bdbe49fc04e8925fdaa2597a934ca340c5eec30a\",\"version\":\"0.0.1\"},\"blockchain\":\"8cf7f8799c5b30d36c86d18f0f4ca041cf1803e0414ed9e9fd3a19ba2f0938ff\",\"entropy\":0,\"request_hash\":\"57ce01d285b9084dcee603710109b3048d9ed3424efbcd01fd17d8fdffdbfa61\",\"servicer_pub_key\":\"c9228d57cfbc881059e3e07de6bbd46fd5d5a2491263090abd85f07b5ae71417\",\"session_block_height\":12781,\"signature\":\"57ce01d285b9084dcee603710109b3048d9ed3424efbcd01fd17d8fdffdbfa61\"}')
        const relayResponse = new RelayResponse("880de421c0d0a084302c8d0c2188283b49e30807f42771666c64662f36a39b19cf7b69cf6d610c2584264a0cc15cb4a87d2976d82c486d70f3e9a93fd98c760e", "{\"jsonrpc\":\"2.0\",\"id\":67,\"result\":\"0x37e8aa61b1d51ee5\"}\n", proof, relayRequest)
        const data: any = this.createData(code, relayResponse.toJSON())

        const response = this.getResponseObject(data, code)
        return this.nockRoute(enums.V1RPCRoutes.ClientRelay.toString(), code, response.data)
    }

    public static mockGetBlock(code: number = 200): nock.Scope {
        const genericHex = "f6d04ee2490e85f3f9ade95b80948816bd9b2986d5554aae347e7d21d93b6fb5"
        const partSetHeader = new PartSetHeader(BigInt(1), genericHex)
        const blockID = new BlockID(genericHex, partSetHeader)
        const blockHeader = new BlockHeader("ETH04", BigInt(5), "TIME",
            BigInt(100), BigInt(10), blockID, genericHex,
            genericHex, genericHex, genericHex, genericHex,
            genericHex, genericHex, genericHex, genericHex)
        const commitSignature = new CommitSignature(genericHex, BigInt(5), 10, blockID,
            "TIME", genericHex, 10, genericHex)
        const commit = new Commit(blockID, [commitSignature])


        const blockMeta = new BlockMeta(blockID, blockHeader)
        const block = new Block(blockHeader, genericHex, genericHex, commit)

        const queryBlockResponse = new QueryBlockResponse(blockMeta, block)

        const data: any = this.createData(code, queryBlockResponse.toJSON())
        const response = this.getResponseObject(data, code)

        return this.nockRoute(enums.V1RPCRoutes.QueryBlock.toString(), code, response.data)
    }


    public static mockGetAccount(code: number = 200): nock.Scope {
        const jsonObject = {
            "type": "posmint/Account",
            "value": {
                "account_number": "10",
                "address": "4930289621aefbf9252c91c4c729b7f685e44c4b",
                "coins": [
                    {
                        "amount": "1000001000",
                        "denom": "upokt"
                    }
                ],
                "public_key": {
                    "type": "crypto/ed25519_public_key",
                    "value": "9i9322nUSMG1bzVAxjPylNI8za8AK/azdtBYoAtRz6o="
                },
                "sequence": "0"
            }
        }
        const data: any = this.createData(code, jsonObject)
        const response = this.getResponseObject(data, code)
        return this.nockRoute(enums.V1RPCRoutes.QueryAccount.toString(), code, response.data)
    }

    public static mockGetTx(code: number = 200): nock.Scope {
        const hash = "f6d04ee2490e85f3f9ade95b80948816bd9b2986d5554aae347e7d21d93b6fb5"
        const txHex: Hex = hash
        const simpleProof = new SimpleProof(BigInt(10), BigInt(1), txHex, [txHex])
        const txProof = new TxProof(hash, "data", simpleProof)
        const tx = new Transaction(hash, BigInt(3), BigInt(1), txHex, txProof)

        const queryTXResponse = new QueryTXResponse(tx)

        const data: any = this.createData(code, queryTXResponse.toJSON())
        const response = this.getResponseObject(data, code)
        return this.nockRoute(enums.V1RPCRoutes.QueryTX.toString(), code, response.data)
    }

    public static mockGetHeight(code: number = 200): nock.Scope {
        const data: any = this.createData(code, Number(BigInt(110).toString()))

        const response = this.getResponseObject(data, code)
        return this.nockRoute(enums.V1RPCRoutes.QueryHeight.toString(), code, response.data)
    }

    public static mockGetBalance(code: number = 200): nock.Scope {
        const balance = JSON.stringify(Number(BigInt(100).toString()))

        const data: any = this.createData(code, balance)
        const response = this.getResponseObject(data, code)

        return this.nockRoute(enums.V1RPCRoutes.QueryBalance.toString(), code, response.data)
    }

    public static mockGetNodes(code: number = 200): nock.Scope {
        const node01 = new Node(addressHex, applicationPublicKey, false, StakingStatus.Staked,
            BigInt(100), "http://127.0.0.1:80", ["ETH01", "ETH02"])
        const node02 = new Node(addressHex, applicationPublicKey, false, StakingStatus.Staked,
            BigInt(100), "http://127.0.0.2:80", ["ETH01", "ETH02"])

        const payload = [
            node01.toJSON(),
            node02.toJSON()
        ]
        const data: any = this.createData(code, payload)

        const response = this.getResponseObject(data, code)
        return this.nockRoute(enums.V1RPCRoutes.QueryNodes.toString(), code, response.data)
    }

    public static mockGetNode(code: number = 200): nock.Scope {
        const node01 = new Node(addressHex, applicationPublicKey, false, StakingStatus.Staked,
            BigInt(100), "http://127.0.0.1:80", ["ETH01", "ETH02"])

        const queryNodeResponse = new QueryNodeResponse(node01)
        const data: any = this.createData(code, queryNodeResponse.toJSON())

        const response = this.getResponseObject(data, code)
        return this.nockRoute(enums.V1RPCRoutes.QueryNode.toString(), code, response.data)
    }

    public static mockGetNodeParams(code: number = 200): nock.Scope {
        const nodeParams = new NodeParams(BigInt(101), BigInt(10), BigInt(10), BigInt(5), BigInt(1000), 'stake_denom', BigInt(1), BigInt(111), BigInt(3), 1, BigInt(101), 1, 10)
        const queryNodeParamsResponse = new QueryNodeParamsResponse(nodeParams)

        const data: any = this.createData(code, queryNodeParamsResponse.toJSON())

        const response = this.getResponseObject(data, code)
        return this.nockRoute(enums.V1RPCRoutes.QueryNodeParams.toString(), code, response.data)
    }

    public static mockGetNodeReceipts(code: number = 200): nock.Scope {
        const sessionHeader = new SessionHeader(applicationPublicKey, "ETH04", BigInt(5))
        const storedProof01 = new StoredReceipt(sessionHeader, addressHex, BigInt(100))
        const storedProof02 = new StoredReceipt(sessionHeader, addressHex, BigInt(200))

        const queryNodeProofsResponse = new QueryNodeReceiptsResponse([storedProof01, storedProof02])
        const data: any = this.createData(code, queryNodeProofsResponse.toJSON())

        const response = this.getResponseObject(data, code)
        return this.nockRoute(enums.V1RPCRoutes.QueryNodeReceipts.toString(), code, response.data)
    }

    public static mockGetNodeReceipt(code: number = 200): nock.Scope {
        const nodeProof = new NodeReceipt(addressHex, "ETH04", applicationPublicKey, BigInt(5), BigInt(5), "receiptType")
        const queryNodeProofResponse = new QueryNodeReceiptResponse(nodeProof)
        const data: any = this.createData(code, queryNodeProofResponse.toJSON())

        const response = this.getResponseObject(data, code)

        return this.nockRoute(enums.V1RPCRoutes.QueryNodeReceipt.toString(), code, response.data)
    }

    public static mockGetApps(code: number = 200): nock.Scope {
        const app01 = new Application(addressHex, applicationPublicKey, false, StakingStatus.Staked, ["ETH04"], BigInt(100), BigInt(1000))
        const app02 = new Application(addressHex, applicationPublicKey, false, StakingStatus.Unstaking, ["ETH04"], BigInt(200), BigInt(2000))

        const queryAppsResponse = new QueryAppsResponse([app01, app02])
        const data: any = this.createData(code, queryAppsResponse.toJSON())
        const response = this.getResponseObject(data, code)

        return this.nockRoute(enums.V1RPCRoutes.QueryApps.toString(), code, response.data)
    }

    public static mockGetApp(code: number = 200): nock.Scope {
        const app01 = new Application(addressHex, applicationPublicKey, false, StakingStatus.Staked, ["ETH04"], BigInt(100), BigInt(1000))
        const queryAppResponse = new QueryAppResponse(app01)

        const data: any = this.createData(code, queryAppResponse.toJSON())
        const response = this.getResponseObject(data, code)

        return this.nockRoute(enums.V1RPCRoutes.QueryApp.toString(), code, response.data)
    }

    public static mockGetAppParams(code: number = 200): nock.Scope {
        const appParams = new ApplicationParams("0101", BigInt(10), BigInt(1), BigInt(20), BigInt(1), true)
        const queryAppParamsResponse = new QueryAppParamsResponse(appParams)

        const data: any = this.createData(code, queryAppParamsResponse.toJSON())
        const response = this.getResponseObject(data, code)

        return this.nockRoute(enums.V1RPCRoutes.QueryAppParams.toString(), code, response.data)
    }

    public static mockGetPocketParams(code: number = 200): nock.Scope {
        const pocketParams = new PocketParams(BigInt(50), BigInt(5), ["ETH04"], BigInt(500))
        const queryPocketParamsResponse = new QueryPocketParamsResponse(pocketParams)
        const data: any = this.createData(code, queryPocketParamsResponse.toJSON())

        const response = this.getResponseObject(data, code)
        return this.nockRoute(enums.V1RPCRoutes.QueryPocketParams.toString(), code, response.data)
    }

    public static mockGetSupportedChains(code: number = 200): nock.Scope {
        const querySupportedChainsResponse = new QuerySupportedChainsResponse(["ETH04", "ETH01"])
        const data: any = this.createData(code, querySupportedChainsResponse.toJSON())

        const response = this.getResponseObject(data, code)
        return this.nockRoute(enums.V1RPCRoutes.QuerySupportedChains.toString(), code, response.data)
    }

    public static mockGetSupply(code: number = 200): nock.Scope {
        const querySupplyResponse = new QuerySupplyResponse(BigInt(10), BigInt(100), BigInt(2300), BigInt(100), BigInt(10), BigInt(100))

        const data: any = this.createData(code, querySupplyResponse.toJSON())

        const response = this.getResponseObject(data, code)
        return this.nockRoute(enums.V1RPCRoutes.QuerySupply.toString(), code, response.data)
    }

    public static mockChallenge(code: number = 200): nock.Scope {
        const challengeResponse = new ChallengeResponse(addressHex)

        const data: any = this.createData(code, challengeResponse.toJSON())

        const response = this.getResponseObject(data, code)
        return this.nockRoute(enums.V1RPCRoutes.ClientChallenge.toString(), code, response.data)
    }

    public static getMockRelayResponse(): RelayResponse {
        const relayRequest = RelayRequest.fromJSON("{\"payload\":{\"data\":\"{\\\"address\\\":\\\"20421fe2cbfbd7fc7f120a1d8eb7bc223cfcf2d5\\\"}\",\"method\":\"\",\"path\":\"/v1/query/account\",\"headers\":null},\"meta\":{\"block_height\":881},\"proof\":{\"entropy\":25863001945781196,\"session_block_height\":876,\"servicer_pub_key\":\"78e4b0bd96eaa7acfa449c630f05a18acb21e4965c3c6245040f496382c28e67\",\"blockchain\":\"0002\",\"aat\":{\"version\":\"0.0.1\",\"app_pub_key\":\"3895f3a84afb824d7e2e63c5042a93ccdb13e0f891d5d61d10289df50d6c251d\",\"client_pub_key\":\"20ea750eda1fe0208b1098488966d52c741ea8246e76f2e51736c0131a63d442\",\"signature\":\"90f00816fccd213dcc2b0a0fe50372849cc453847cb0ce605c5b9a234099a80432e5962b50f104964683ed9d968afbdb2341c4782723d36310388068658a1b0c\"},\"signature\":\"7393e34b4423a04a26f12862b8667dfd4a8467078f637702632f45a569b4c8485e622edf7ed305a4607b2b9865ba4ec161d24791fcfe5b355e1808d696c8a40e\",\"request_hash\":\"7b227061796c6f6164223a7b2264617461223a227b5c22616464726573735c223a5c22323034323166653263626662643766633766313230613164386562376263323233636663663264355c227d222c226d6574686f64223a22222c2270617468223a222f76312f71756572792f6163636f756e74222c2268656164657273223a6e756c6c7d2c226d657461223a7b22626c6f636b5f686569676874223a3838317d7d\"}}")
        const proof = RelayProofResponse.fromJSON('{\"aat\":{\"app_pub_key\":\"73f765cb848f9d40aa9a16a3726f1ec5703f77bad22b2487cd4baaaf777f6e90\",\"client_pub_key\":\"a32329a020cab1fc0a9883630b0a2055faa8ea33280c7736701065afe2031a31\",\"signature\":\"b53c037ef3171badbd528661ca7e690ca0424a18355b8ff75a7fce51dce8875fca9930e60ffbb68259bee333bdbe49fc04e8925fdaa2597a934ca340c5eec30a\",\"version\":\"0.0.1\"},\"blockchain\":\"8cf7f8799c5b30d36c86d18f0f4ca041cf1803e0414ed9e9fd3a19ba2f0938ff\",\"entropy\":0,\"request_hash\":\"57ce01d285b9084dcee603710109b3048d9ed3424efbcd01fd17d8fdffdbfa61\",\"servicer_pub_key\":\"c9228d57cfbc881059e3e07de6bbd46fd5d5a2491263090abd85f07b5ae71417\",\"session_block_height\":12781,\"signature\":\"57ce01d285b9084dcee603710109b3048d9ed3424efbcd01fd17d8fdffdbfa61\"}')
        const relayResponse = new RelayResponse("880de421c0d0a084302c8d0c2188283b49e30807f42771666c64662f36a39b19cf7b69cf6d610c2584264a0cc15cb4a87d2976d82c486d70f3e9a93fd98c760e", "{\"jsonrpc\":\"2.0\",\"id\":67,\"result\":\"0x37e8ea61b1d51dd5\"}\n", proof, relayRequest)
        return relayResponse
    }

    public static getMockRelayResponse2(): RelayResponse {
        const relayRequest = RelayRequest.fromJSON("{\"payload\":{\"data\":\"{\\\"address\\\":\\\"20421fe2cbfbd7fc7f120a1d8eb7bc223cfcf2d5\\\"}\",\"method\":\"\",\"path\":\"/v1/query/account\",\"headers\":null},\"meta\":{\"block_height\":881},\"proof\":{\"entropy\":25863001945781196,\"session_block_height\":876,\"servicer_pub_key\":\"78e4b0bd96eaa7acfa449c630f05a18acb21e4965c3c6245040f496382c28e67\",\"blockchain\":\"0002\",\"aat\":{\"version\":\"0.0.1\",\"app_pub_key\":\"3895f3a84afb824d7e2e63c5042a93ccdb13e0f891d5d61d10289df50d6c251d\",\"client_pub_key\":\"20ea750eda1fe0208b1098488966d52c741ea8246e76f2e51736c0131a63d442\",\"signature\":\"90f00816fccd213dcc2b0a0fe50372849cc453847cb0ce605c5b9a234099a80432e5962b50f104964683ed9d968afbdb2341c4782723d36310388068658a1b0c\"},\"signature\":\"7393e34b4423a04a26f12862b8667dfd4a8467078f637702632f45a569b4c8485e622edf7ed305a4607b2b9865ba4ec161d24791fcfe5b355e1808d696c8a40e\",\"request_hash\":\"7b227061796c6f6164223a7b2264617461223a227b5c22616464726573735c223a5c22323034323166653263626662643766633766313230613164386562376263323233636663663264355c227d222c226d6574686f64223a22222c2270617468223a222f76312f71756572792f6163636f756e74222c2268656164657273223a6e756c6c7d2c226d657461223a7b22626c6f636b5f686569676874223a3838317d7d\"}}")
        const proof = RelayProofResponse.fromJSON('{\"aat\":{\"app_pub_key\":\"73f765cb848f9d40aa9a16a3726f1ec5703f77bad22b2487cd4baaaf777f6e90\",\"client_pub_key\":\"a32329a020cab1fc0a9883630b0a2055faa8ea33280c7736701065afe2031a31\",\"signature\":\"b53c037ef3171badbd528661ca7e690ca0424a18355b8ff75a7fce51dce8875fca9930e60ffbb68259bee333bdbe49fc04e8925fdaa2597a934ca340c5eec30a\",\"version\":\"0.0.1\"},\"blockchain\":\"8cf7f8799c5b30d36c86d18f0f4ca041cf1803e0414ed9e9fd3a19ba2f0938ff\",\"entropy\":0,\"request_hash\":\"57ce01d285b9084dcee603710109b3048d9ed3424efbcd01fd17d8fdffdbfa61\",\"servicer_pub_key\":\"c9228d57cfbc881059e3e07de6bbd46fd5d5a2491263090abd85f07b5ae71417\",\"session_block_height\":12781,\"signature\":\"57ce01d285b9084dcee603710109b3048d9ed3424efbcd01fd17d8fdffdbfa61\"}')
        const relayResponse = new RelayResponse("880de421c0d0a084302c8d0c2188283b49e30807f42771666c64662f36a39b19cf7b69cf6d610c2584264a0cc15cb4a87d2976d82c486d70f3e9a93fd98c760e", "{\"jsonrpc\":\"2.0\",\"id\":67,\"result\":\"0x37e8ea61b1d51dd5\"}\n", proof, relayRequest)
        return relayResponse
    }

    // Private functions
    private static getResponseObject(data: {}, code: number) {
        return {
            config: {},
            data: data,
            headers: { "Content-Type": "application/json" },
            status: code,
            statusText: code.toString()
        }
    }

    private static nockRoute(path: string = "", code: number = 200, data: any): nock.Scope {
        return nock(env.getPOKTRPC()).post(path).reply(code, data)
    }

    private static getError(): any {
        const data: any = {
            code: 500,
            message: 'Internal Server Error.'
        }
        const response = this.getResponseObject(data, 500)
        return response
    }

    private static createData(code: number, payload: any): any {
        if (code === 200) {
            return payload
        }
        return this.getError()
    }
}