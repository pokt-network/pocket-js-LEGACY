import nock from 'nock'
import { Hex } from "@pokt-network/pocket-js-utils"
import { PocketAAT } from "@pokt-network/aat-js"
import {
    Event,
    Transaction,
    TxProof,
    SimpleProof,
    Node,
    StakingStatus,
    StoredReceipt,
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
    QueryAppsResponse,
    QueryAppResponse,
    QueryAppParamsResponse,
    QueryPocketParamsResponse,
    QuerySupportedChainsResponse,
    QuerySupplyResponse, DispatchResponse, 
    ResponseDeliverTx, V1RPCRoutes, SessionHeader,
    ChallengeResponse
} from '@pokt-network/pocket-js-rpc-models'
import { RelayProof, RelayMeta, RequestHash, RelayProofResponse, RelayRequest, RelayPayload, RelayResponse } from '@pokt-network/pocket-js-relay-models'

const envUrl = new URL("http://localhost:8081")
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
        return this.nockRoute(V1RPCRoutes.ClientRawTx.toString(), code, response.data)
    }

    public static mockDispatch(code: number = 200): nock.Scope {
        const dispatchResponse = DispatchResponse.fromJSON('{"block_height":26260,"session":{"header":{"app_public_key":"a6588933478b72c6e0639fcbee7039e0ff28e323d712e69f269aa519fce93b61","chain":"0002","session_height":26257},"key":"SqX7bCSB+9o2FJ+r6M91waUNzo3\/0V6Nf26x6ff3hjc=","nodes":[{"address":"b289b5f47165302cb8369aa7854c43fab805de45","chains":["0001","0002","0003","0004","0005","0006","0007","0008","0009","0010","0011","0012","0013","0021","0027"],"jailed":false,"public_key":"41401b10ebbbc41cc996c97c452f82dd4a90292b0eacfe916e87b0dc6257dd0b","service_url":"http:\/\/localhost:8081","status":2,"tokens":"15099969801","unstaking_time":"0001-01-01T00:00:00Z"},{"address":"633269f3f5a4cb7b6f224527bbeb550f2bc3571b","chains":["0001","0002","0003","0004","0005","0006","0009","0010","0011","0012","0021","0022","0025","0027","0028"],"jailed":false,"public_key":"83a848427f94d1d352b01c3d32cacd4617cc7f4a956df9859d115e7d61130c08","service_url":"http:\/\/localhost:8081","status":2,"tokens":"15199969601","unstaking_time":"0001-01-01T00:00:00Z"},{"address":"de24fc52321b2661995176eb996b26169e595aed","chains":["0001","0002","0003","0004","0005","0006","0007","0008","0009","0010","0011","0012","0013","0021","0027"],"jailed":false,"public_key":"fbb5e5c915e253e10403269e978fe6c70414c56a1f647df2693a1d401b1a9e73","service_url":"http:\/\/localhost:8081","status":2,"tokens":"15099984900","unstaking_time":"0001-01-01T00:00:00Z"},{"address":"2189325a17cc673060ba5a71d0e359388e7b9360","chains":["0001","0002","0003","0004","0005","0006","0009","0010","0011","0012","0021","0022","0025","0027","0028"],"jailed":false,"public_key":"5b3210eabe59db069255f12c230c9dfdf4244a440a4c2f5b70a6aa0fe157eb81","service_url":"http:\/\/localhost:8081","status":2,"tokens":"15199984800","unstaking_time":"0001-01-01T00:00:00Z"},{"address":"5b7a5f30e69cada0c89925b5700ddea41fda3819","chains":["0001","0002","0003","0004","0005","0006","0009","0010","0011","0012","0021","0022","0025","0027","0028"],"jailed":false,"public_key":"b4bd05765887810954465f206a1b0a6d90bc4c826b35e2cbb1e3dd25e7ed493e","service_url":"http:\/\/localhost:8081","status":2,"tokens":"15199969601","unstaking_time":"0001-01-01T00:00:00Z"}]}}')

        const data: any = this.createData(code, dispatchResponse.toJSON())

        const response = this.getResponseObject(data, code)
        return this.nockRoute(V1RPCRoutes.ClientDispatch.toString(), code, response.data)
    }

    public static mockRelayForConsensus(code: number = 200): nock.Scope {
        const relayResponse = '{"response":"{\\"id\\":67,\\"jsonrpc\\":\\"2.0\\",\\"result\\":\\"0x1043561a882930000\\"}","signature":"952352cc3b1e915c4470612e7f25b3cf811b30e1a95ab79d0c593d6afcbf0a7d0f50a945345e97c263641dfb8b1ba66911debe0be6d0586268720c3f9b83530f"}'

        const data: any = this.createData(code, relayResponse)

        const result = this.getResponseObject(data, code)
        return this.nockRoute(V1RPCRoutes.ClientRelay.toString(), code, result.data)
    }

    public static mockRelayForConsensusFailure(code: number = 200): nock.Scope {
        const relayResponse = '{"response":"{\\"id\\":67,\\"jsonrpc\\":\\"2.0\\",\\"result\\":\\"0x2043561a88111\\"}","signature":"952352cc3b1e915c4470612e7f25b3cf811b30e1a95ab79d0c593d6afcbf0a7d0f50a945345e97c263641dfb8b1ba66911debe0be6d0586268720c3f9b83530f"}'

        const data: any = this.createData(code, relayResponse)

        const result = this.getResponseObject(data, code)
        return this.nockRoute(V1RPCRoutes.ClientRelay.toString(), code, result.data)
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

        return this.nockRoute(V1RPCRoutes.QueryBlock.toString(), code, response.data)
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
        return this.nockRoute(V1RPCRoutes.QueryAccount.toString(), code, response.data)
    }

    public static mockGetTx(code: number = 200): nock.Scope {
        const hash = "f6d04ee2490e85f3f9ade95b80948816bd9b2986d5554aae347e7d21d93b6fb5"
        const simpleProof = new SimpleProof(BigInt(10), BigInt(1), hash, [hash])
        const txProof = new TxProof(hash, "data", simpleProof)
        const event = new Event("type", [{"key": "key value","value": "test"}])
        const txResult = new ResponseDeliverTx(0, ["9292"], "logs", "info", BigInt(0), BigInt(0), [event], "")

        const tx = new Transaction(hash, BigInt(3), BigInt(1), hash, txProof, txResult)

        const queryTXResponse = new QueryTXResponse(tx)

        const data: any = this.createData(code, queryTXResponse.toJSON())
        const response = this.getResponseObject(data, code)
        return this.nockRoute(V1RPCRoutes.QueryTX.toString(), code, response.data)
    }

    public static mockGetHeight(code: number = 200): nock.Scope {
        const data: any = this.createData(code, Number(BigInt(110).toString()))

        const response = this.getResponseObject(data, code)
        return this.nockRoute(V1RPCRoutes.QueryHeight.toString(), code, response.data)
    }

    public static mockGetBalance(code: number = 200): nock.Scope {
        const balance = JSON.stringify(Number(BigInt(100).toString()))

        const data: any = this.createData(code, balance)
        const response = this.getResponseObject(data, code)

        return this.nockRoute(V1RPCRoutes.QueryBalance.toString(), code, response.data)
    }

    public static mockGetNodes(code: number = 200): nock.Scope {
        const node01 = new Node(addressHex, applicationPublicKey, false, StakingStatus.Staked,
            BigInt(100), "http://localhost:8081", ["0021", "0022"])
        const node02 = new Node(addressHex, applicationPublicKey, false, StakingStatus.Staked,
            BigInt(100), "http://127.0.0.2:80", ["0001", "0002"])

        const payload = [
            node01.toJSON(),
            node02.toJSON()
        ]
        const data: any = this.createData(code, payload)

        const response = this.getResponseObject(data, code)
        return this.nockRoute(V1RPCRoutes.QueryNodes.toString(), code, response.data)
    }

    public static mockGetNode(code: number = 200): nock.Scope {
        const node01 = new Node(addressHex, applicationPublicKey, false, StakingStatus.Staked,
            BigInt(100), "http://localhost:8081", ["0001", "0002"])

        const queryNodeResponse = new QueryNodeResponse(node01)
        const data: any = this.createData(code, queryNodeResponse.toJSON())

        const response = this.getResponseObject(data, code)
        return this.nockRoute(V1RPCRoutes.QueryNode.toString(), code, response.data)
    }

    public static mockGetNodeParams(code: number = 200): nock.Scope {
        const nodeParams = new NodeParams(BigInt(101), BigInt(10), BigInt(10), BigInt(5), BigInt(1000), 'stake_denom', BigInt(1), BigInt(111), BigInt(3), 1, BigInt(101), 1, 10)
        const queryNodeParamsResponse = new QueryNodeParamsResponse(nodeParams)

        const data: any = this.createData(code, queryNodeParamsResponse.toJSON())

        const response = this.getResponseObject(data, code)
        return this.nockRoute(V1RPCRoutes.QueryNodeParams.toString(), code, response.data)
    }

    public static mockGetApps(code: number = 200): nock.Scope {
        const app01 = new Application(addressHex, applicationPublicKey, false, StakingStatus.Staked, ["0001", "0002"], BigInt(100), BigInt(1000))
        const app02 = new Application(addressHex, applicationPublicKey, false, StakingStatus.Unstaking, ["0001", "0002"], BigInt(200), BigInt(2000))

        const queryAppsResponse = new QueryAppsResponse([app01, app02], 1, 1)
        const data: any = this.createData(code, queryAppsResponse.toJSON())
        const response = this.getResponseObject(data, code)

        return this.nockRoute(V1RPCRoutes.QueryApps.toString(), code, response.data)
    }

    public static mockGetApp(code: number = 200): nock.Scope {
        const app01 = new Application(addressHex, applicationPublicKey, false, StakingStatus.Staked, ["0001", "0002"], BigInt(100), BigInt(1000))
        const queryAppResponse = new QueryAppResponse(app01)

        const data: any = this.createData(code, queryAppResponse.toJSON())
        const response = this.getResponseObject(data, code)

        return this.nockRoute(V1RPCRoutes.QueryApp.toString(), code, response.data)
    }

    public static mockGetAppParams(code: number = 200): nock.Scope {
        const appParams = new ApplicationParams("0101", BigInt(10), BigInt(1), BigInt(20), BigInt(1), true)
        const queryAppParamsResponse = new QueryAppParamsResponse(appParams)

        const data: any = this.createData(code, queryAppParamsResponse.toJSON())
        const response = this.getResponseObject(data, code)

        return this.nockRoute(V1RPCRoutes.QueryAppParams.toString(), code, response.data)
    }

    public static mockGetPocketParams(code: number = 200): nock.Scope {
        const pocketParams = new PocketParams(BigInt(50), BigInt(5), ["0001", "0002"], BigInt(500))
        const queryPocketParamsResponse = new QueryPocketParamsResponse(pocketParams)
        const data: any = this.createData(code, queryPocketParamsResponse.toJSON())

        const response = this.getResponseObject(data, code)
        return this.nockRoute(V1RPCRoutes.QueryPocketParams.toString(), code, response.data)
    }

    public static mockGetSupportedChains(code: number = 200): nock.Scope {
        const querySupportedChainsResponse = new QuerySupportedChainsResponse(["0001", "0002"])
        const data: any = this.createData(code, querySupportedChainsResponse.toJSON())

        const response = this.getResponseObject(data, code)
        return this.nockRoute(V1RPCRoutes.QuerySupportedChains.toString(), code, response.data)
    }

    public static mockGetSupply(code: number = 200): nock.Scope {
        const querySupplyResponse = new QuerySupplyResponse(BigInt(10), BigInt(100), BigInt(2300), BigInt(100), BigInt(10), BigInt(100))

        const data: any = this.createData(code, querySupplyResponse.toJSON())

        const response = this.getResponseObject(data, code)
        return this.nockRoute(V1RPCRoutes.QuerySupply.toString(), code, response.data)
    }

    public static mockChallenge(code: number = 200): nock.Scope {
        const challengeResponse = new ChallengeResponse(addressHex)

        const data: any = this.createData(code, challengeResponse.toJSON())

        const response = this.getResponseObject(data, code)
        return this.nockRoute(V1RPCRoutes.ClientChallenge.toString(), code, response.data)
    }

    public static mockRelayResponse(code: number = 200): nock.Scope {
        const randomNumber = Math.floor(Math.random() * 100000)
        const relayResponse = '{"response":"{\\"id\\":67,\\"jsonrpc\\":\\"2.0\\",\\"result\\":\\"0x1043561a88'+randomNumber.toString()+'\\"}","signature":"952352cc3b1e915c4470612e7f25b3cf811b30e1a95ab79d0c593d6afcbf0a7d0f50a945345e97c263641dfb8b1ba66911debe0be6d0586268720c3f9b83530f"}'

        const data: any = this.createData(code, relayResponse)

        const result = this.getResponseObject(data, code)
        return this.nockRoute(V1RPCRoutes.ClientRelay.toString(), code, result.data)
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
        return nock(envUrl.toString()).post(path).reply(code, data)
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