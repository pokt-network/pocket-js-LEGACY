import nock from 'nock'
import enums = require("../../src/utils/enums")
import { LocalNet } from "../../src/utils/env"
import {
    Block,
    Consensus, BlockID, PartSetHeader, Commit,
    CommitSignature,
    PocketAAT,
    Transaction,
    Hex,
    TxProof,
    SimpleProof,
    Node,
    BondStatus,
    StoredProof,
    NodeProof,
    Application,
    ApplicationParams,
    PocketParams
} from '../../src'
import { BlockHeader } from '../../src/models/block-header'
import { BlockMeta } from '../../src/models/block-meta'
import { SessionHeader } from '../../src/models/input/session-header'
import { RelayProof } from '../../src/models/relay-proof'

const env = new LocalNet()
const version = '0.0.1'
const addressHex = "84871BAF5B4E01BE52E5007EACF7048F24BF57E0"
const clientPublicKey = 'f6d04ee2490e85f3f9ade95b80948816bd9b2986d5554aae347e7d21d93b6fb5'
const applicationPublicKey = 'd9c7f275388ca1f87900945dba7f3a90fa9bba78f158c070aa12e3eccf53a2eb'
const applicationPrivateKey = '15f53145bfa6efdde6e65ce5ebfd330ac0a2591ae451a8a03ace99eff894b9eed9c7f275388ca1f87900945dba7f3a90fa9bba78f158c070aa12e3eccf53a2eb'

export class NockUtil {
    public static mockRawTx(code: number = 200): nock.Scope {
        const data: any = this.createData(code, {
            height: "0",
            raw_log: "[{\\\"msg_index\\\":0,\\\"success\\\":true,\\\"log\\\":\\\"\\\",\\\"events\\\":[{\\\"type\\\":\\\"message\\\",\\\"attributes\\\":[{\\\"key\\\":\\\"action\\\",\\\"value\\\":\\\"send\\\"}]}]}]\",\"logs\":[{\"msg_index\":0,\"success\":true,\"log\":\"\",\"events\":[{\"type\":\"message\",\"attributes\":[{\"key\":\"action\",\"value\":\"send\"}]}]}]",
            txhash: "1DE7AF0CDEF19B21D6BDE602A4916186E40D86854B2E747A464BD32C7616B5A2"
        })

        const response = this.getResponseObject(data, code)
        return this.nockRoute(enums.RPCRoutes.ClientRawTx.toString(), code, response)
    }

    public static mockRelay(code: number = 200): nock.Scope {
        const pocketAAT = PocketAAT.from(version, clientPublicKey, applicationPublicKey, applicationPrivateKey)
        const proof = new RelayProof(BigInt(1), BigInt(5), applicationPublicKey, "ETH04", pocketAAT, pocketAAT.applicationSignature)
        const data: any = this.createData(code, {
            proof: proof.toJSON(),
            response: 'response',
            signature: addressHex
        })
        
        const response = this.getResponseObject(data, code)
        return this.nockRoute(enums.Routes.RELAY.toString(), code, response)
    }

    public static mockDispatch(code: number = 200): nock.Scope {
        const node01 = new Node(addressHex, applicationPublicKey, false, BondStatus.bonded,
            BigInt(100), "http://127.0.0.1:80", ["ETH01", "ETH04"])
        const node02 = new Node(addressHex, applicationPublicKey, false, BondStatus.bonded,
            BigInt(100), "http://127.0.0.1:80", ["ETH01", "ETH04"])
        const sessionHeader = new SessionHeader(applicationPublicKey, "ETH04", BigInt(5))

        const data: any = this.createData(code, {
            header: sessionHeader.toJSON(),
            key: 'key',
            nodes: [node01.toJSON(), node02.toJSON()]
        })
        
        const response = this.getResponseObject(data, code)
        return this.nockRoute(enums.Routes.DISPATCH.toString(), code, response)
    }

    // public static mockGetBlock(code: number = 200): nock.Scope {
    //     // Block
    //     const genericHex = "f6d04ee2490e85f3f9ade95b80948816bd9b2986d5554aae347e7d21d93b6fb5"
    //     const version = new Consensus(BigInt(5), BigInt(6))
    //     const partSetHeader = new PartSetHeader(BigInt(1), genericHex)
    //     const blockID = new BlockID(genericHex, partSetHeader)
    //     const blockHeader = new BlockHeader(version, genericHex, BigInt(5), "TIME",
    //         BigInt(100), BigInt(10), blockID, genericHex,
    //         genericHex, genericHex, genericHex, genericHex,
    //         genericHex, genericHex, genericHex, genericHex)
    //     const commitSignature = new CommitSignature(genericHex, BigInt(5), 10, blockID,
    //         "TIME", genericHex, 10, genericHex)
    //     const commit = new Commit(blockID, commitSignature)
    //     const block = new Block(blockHeader, genericHex, genericHex, commit)
    //     // Block Meta
    //     const blockMeta = new BlockMeta(blockID, blockHeader)
    //     // Generate query block response object
    //     const blockResponse = {
    //         block: block.toJSON(),
    //         block_meta: blockMeta.toJSON()
    //     }
    //     const response = this.getResponseObject(blockResponse, code)
    //     return this.nockRoute(enums.RPCRoutes.QueryBlock.toString(), code, response)
    // }

    public static mockGetTx(code: number = 200): nock.Scope {
        // Data Setup
        const hash = "f6d04ee2490e85f3f9ade95b80948816bd9b2986d5554aae347e7d21d93b6fb5"
        const txHex: Hex = hash
        const simpleProof = new SimpleProof(BigInt(10), BigInt(1), txHex, [txHex])
        const txProof = new TxProof(hash, "data", simpleProof)
        const tx = new Transaction(hash, BigInt(3), BigInt(1), txHex, txProof)
        const data: any = this.createData(code, tx.toJSON())

        const response = this.getResponseObject(data, code)
        return this.nockRoute(enums.RPCRoutes.QueryTX.toString(), code, response)
    }

    public static mockGetHeight(code: number = 200): nock.Scope {
        const data: any = this.createData(code, {
            height: '5n'
        })
        const response = this.getResponseObject(data, code)
        return this.nockRoute(enums.RPCRoutes.QueryHeight.toString(), code, response)
    }

    public static mockGetBalance(code: number = 200): nock.Scope {
        const data: any = this.createData(code, {
            balance: '100n'
        })
        const response = this.getResponseObject(data, code)

        return this.nockRoute(enums.RPCRoutes.QueryBalance.toString(), code, response)
    }

    public static mockGetNodes(code: number = 200): nock.Scope {
        const node01 = new Node(addressHex, applicationPublicKey, false, BondStatus.bonded,
            BigInt(100), "http://127.0.0.1:80", ["ETH01", "ETH02"])
        const node02 = new Node(addressHex, applicationPublicKey, false, BondStatus.bonded,
            BigInt(100), "http://127.0.0.2:80", ["ETH01", "ETH02"])
        const data: any = this.createData(code, {
            nodes: [node01.toJSON(), node02.toJSON()]
        })

        const response = this.getResponseObject(data, code)
        return this.nockRoute(enums.RPCRoutes.QueryNodes.toString(), code, response)
    }

    public static mockGetNode(code: number = 200): nock.Scope {
        const node01 = new Node(addressHex, applicationPublicKey, false, BondStatus.bonded,
            BigInt(100), "http://127.0.0.1:80", ["ETH01", "ETH02"])
        const data: any = this.createData(code, node01.toJSON())

        const response = this.getResponseObject(data, code)
        return this.nockRoute(enums.RPCRoutes.QueryNode.toString(), code, response)
    }

    public static mockGetNodeParams(code: number = 200): nock.Scope {
        const data: any = this.createData(code, {
            downtime_jail_duration: BigInt(101).toString(16),
            max_evidence_age: BigInt(111).toString(16),
            max_validator: BigInt(10).toString(16),
            min_signed_per_window: BigInt(1).toString(16),
            proposer_reward_percentage: 50,
            relays_to_tokens: BigInt(2).toString(16),
            session_block: BigInt(5).toString(16),
            signed_blocks_window: BigInt(3).toString(16),
            slash_fraction_double_sign: BigInt(1).toString(16),
            slash_fraction_downtime: BigInt(10).toString(16),
            stake_denom: 'stake_denom',
            stake_minimum: BigInt(1).toString(16),
            unstaking_time: BigInt(1000).toString(16)
        })

        const response = this.getResponseObject(data, code)
        return this.nockRoute(enums.RPCRoutes.QueryNodeParams.toString(), code, response)
    }

    public static mockGetNodeProofs(code: number = 200): nock.Scope {
        const sessionHeader = new SessionHeader(applicationPublicKey, "ETH04", BigInt(5))
        const storedProof01 = new StoredProof(sessionHeader, addressHex, BigInt(100))
        const storedProof02 = new StoredProof(sessionHeader, addressHex, BigInt(200))
        const data: any = this.createData(code, [storedProof01.toJSON(), storedProof02.toJSON()])

        const response = this.getResponseObject(data, code)
        return this.nockRoute(enums.RPCRoutes.QueryNodeProofs.toString(), code, response)
    }

    public static mockGetNodeProof(code: number = 200): nock.Scope {
        const nodeProof = new NodeProof(addressHex, "ETH04", applicationPublicKey, BigInt(5), BigInt(5))
        const data: any = this.createData(code, nodeProof.toJSON())
        const response = this.getResponseObject(data, code)

        return this.nockRoute(enums.RPCRoutes.QueryNodeProof.toString(), code, response)
    }

    public static mockGetApps(code: number = 200): nock.Scope {
        const app01 = new Application(addressHex, applicationPublicKey, false, BondStatus.bonded, ["ETH04"], BigInt(100), BigInt(1000))
        const app02 = new Application(addressHex, applicationPublicKey, false, BondStatus.unbonded, ["ETH04"], BigInt(200), BigInt(2000))

        const data: any = this.createData(code, [app01.toJSON(), app02.toJSON()])
        const response = this.getResponseObject(data, code)

        return this.nockRoute(enums.RPCRoutes.QueryApps.toString(), code, response)
    }

    public static mockGetApp(code: number = 200): nock.Scope {
        const app01 = new Application(addressHex, applicationPublicKey, false, BondStatus.bonded, ["ETH04"], BigInt(100), BigInt(1000))

        const data: any = this.createData(code, app01.toJSON())
        const response = this.getResponseObject(data, code)

        return this.nockRoute(enums.RPCRoutes.QueryApp.toString(), code, response)
    }

    public static mockGetAppParams(code: number = 200): nock.Scope {
        const appParams = new ApplicationParams("0101", BigInt(10), BigInt(1), BigInt(20), BigInt(1), true)
        const data: any = this.createData(code, appParams.toJSON())
        const response = this.getResponseObject(data, code)

        return this.nockRoute(enums.RPCRoutes.QueryAppParams.toString(), code, response)
    }

    public static mockGetPocketParams(code: number = 200): nock.Scope {
        const pocketParams = new PocketParams(BigInt(50), BigInt(5), ["ETH04"], BigInt(500))
        const data: any = this.createData(code, pocketParams.toJSON())

        const response = this.getResponseObject(data, code)
        return this.nockRoute(enums.RPCRoutes.QueryPocketParams.toString(), code, response)
    }

    public static mockGetSupportedChains(code: number = 200): nock.Scope {
        const supportedChains = ["ETH04", "ETH01"]
        const data: any = this.createData(code, supportedChains)

        const response = this.getResponseObject(data, code)
        return this.nockRoute(enums.RPCRoutes.QuerySupportedChains.toString(), code, response)
    }

    public static mockGetSupply(code: number = 200): nock.Scope {
        const data: any = this.createData(code, {
            app_staked: BigInt(100).toString(16),
            dao: BigInt(2300).toString(16),
            node_staked: BigInt(10).toString(16),
            total: BigInt(100).toString(16),
            total_staked: BigInt(100).toString(16),
            total_unstaked: BigInt(10).toString(16)
        })

        const response = this.getResponseObject(data, code)
        return this.nockRoute(enums.RPCRoutes.QuerySupply.toString(), code, response)
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