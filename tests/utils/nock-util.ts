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
    StoredProof,
    NodeProof,
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
    QueryNodesResponse,
    QueryNodeResponse,
    QueryNodeParamsResponse,
    NodeParams,
    QueryNodeProofsResponse,
    QueryNodeProofResponse,
    QueryAppsResponse,
    QueryAppResponse,
    QueryAppParamsResponse,
    QueryPocketParamsResponse,
    QuerySupportedChainsResponse,
    QuerySupplyResponse, RelayResponse, RelayPayload
} from '../../src'
import { SessionHeader } from '../../src/rpc/models/input/session-header'
import { RelayProof } from '../../src/rpc/models/relay-proof'
import {ChallengeResponse} from "../../src/rpc/models/output/challenge-response"
import {RequestHash} from "../../src/rpc/models/input/request-hash"
import {RelayMeta} from "../../src/rpc/models/input/relay-meta"

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
        this.mockGetNodeProof()
        this.mockGetNodeProofs()
        this.mockGetNodes()
        this.mockGetPocketParams()
        this.mockGetSupply()
        this.mockGetSupportedChains()
        this.mockGetTx()
        this.mockChallenge()
    }

    public static mockRawTx(code: number = 200): nock.Scope {
        const data: any = this.createData(code, {
            height: "0",
            raw_log: "[{\\\"msg_index\\\":0,\\\"success\\\":true,\\\"log\\\":\\\"\\\",\\\"events\\\":[{\\\"type\\\":\\\"message\\\",\\\"attributes\\\":[{\\\"key\\\":\\\"action\\\",\\\"value\\\":\\\"send\\\"}]}]}]\",\"logs\":[{\"msg_index\":0,\"success\":true,\"log\":\"\",\"events\":[{\"type\":\"message\",\"attributes\":[{\"key\":\"action\",\"value\":\"send\"}]}]}]",
            txhash: "1DE7AF0CDEF19B21D6BDE602A4916186E40D86854B2E747A464BD32C7616B5A2"
        })

        const response = this.getResponseObject(data, code)
        return this.nockRoute(enums.V1RPCRoutes.ClientRawTx.toString(), code, response.data)
    }

    public static mockRelay(code: number = 200): nock.Scope {
        const relayPayload = new RelayPayload("data", "method", "path")
        const relayMeta = new RelayMeta(BigInt(1))
        const pocketAAT = PocketAAT.from(version, clientPublicKey, applicationPublicKey, applicationPrivateKey)
        const proof = new RelayProof(new RequestHash(relayPayload, relayMeta), BigInt(1), BigInt(5), applicationPublicKey, "ETH04", pocketAAT, pocketAAT.applicationSignature)
        const data: any = this.createData(code, {
            proof: proof.toJSON(),
            response: 'response',
            signature: addressHex
        })
        
        const response = this.getResponseObject(data, code)
        return this.nockRoute(enums.V1RPCRoutes.ClientRelay.toString(), code, response.data)
    }

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
            nodes: [{ value: node01.toJSON() }, {value: node02.toJSON()}]
        })
        
        const response = this.getResponseObject(data, code)
        return this.nockRoute(enums.V1RPCRoutes.ClientDispatch.toString(), code, response.data)
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

    public static mockGetNodeProofs(code: number = 200): nock.Scope {
        const sessionHeader = new SessionHeader(applicationPublicKey, "ETH04", BigInt(5))
        const storedProof01 = new StoredProof(sessionHeader, addressHex, BigInt(100))
        const storedProof02 = new StoredProof(sessionHeader, addressHex, BigInt(200))

        const queryNodeProofsResponse = new QueryNodeProofsResponse([storedProof01, storedProof02])
        const data: any = this.createData(code, queryNodeProofsResponse.toJSON())

        const response = this.getResponseObject(data, code)
        return this.nockRoute(enums.V1RPCRoutes.QueryNodeProofs.toString(), code, response.data)
    }

    public static mockGetNodeProof(code: number = 200): nock.Scope {
        const nodeProof = new NodeProof(addressHex, "ETH04", applicationPublicKey, BigInt(5), BigInt(5))
        const queryNodeProofResponse = new QueryNodeProofResponse(nodeProof)
        const data: any = this.createData(code, queryNodeProofResponse.toJSON())

        const response = this.getResponseObject(data, code)

        return this.nockRoute(enums.V1RPCRoutes.QueryNodeProof.toString(), code, response.data)
    }

    public static mockGetApps(code: number = 200): nock.Scope {
        const app01 = new Application(addressHex, applicationPublicKey, false, StakingStatus.Staked, ["ETH04"], BigInt(100), BigInt(1000))
        const app02 = new Application(addressHex, applicationPublicKey, false, StakingStatus.Unstaked, ["ETH04"], BigInt(200), BigInt(2000))

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
        const pocketAAT = PocketAAT.from(version, clientPublicKey, applicationPublicKey, applicationPrivateKey)
        const relayPayload = new RelayPayload("data", "method", "path")
        const relayMeta = new RelayMeta(BigInt(1))
        const proof = new RelayProof(new RequestHash(relayPayload, relayMeta), BigInt(1), BigInt(5), applicationPublicKey, "ETH04", pocketAAT, pocketAAT.applicationSignature)

        const relayResponse: RelayResponse = new RelayResponse(addressHex, "payload", proof)
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