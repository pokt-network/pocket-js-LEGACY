import nock from 'nock'
import enums = require("./enums")

export class NockUtil {

    private static nockRoute(path: string = "", code: number = 200, data: any): nock.Scope{
        return nock('127.0.0.1:80').get(path).reply(code, data)
    }

    private static getError(): any {
        return {
            code: 500,
            message: 'Error getting information'
        }
    }

    private static createData(code: number, payload: any): any {
        let data: any = undefined
        switch(true) {
            case (code > 190 && code < 204):
                data = payload
            default:
                data = this.getError()
        }

        return data
    }

    public static mockRelay(code: number = 200): nock.Scope{
        let data: any = this.createData(code, {
            signature: 'signature',
            response: 'response',
            proof: 'proof'
        })
        return this.nockRoute(enums.Routes.RELAY, code, data)
    }

    public static mockDispatch(code: number = 200): nock.Scope {
        let data: any = this.createData(code, {
            header: 'header',
            key: 'key',
            nodes: 'nodes'
        })
        
        return this.nockRoute(enums.Routes.DISPATCH, code, data)
    }

    public static mockGetBlock(code: number = 200): nock.Scope{
        let data: any = this.createData(code, {
            block: 'block',
            block_meta: 'block_meta'
        })
        
        return this.nockRoute(enums.RPCRoutes.QueryBlock.toString().toString(), code, data)
    }

    public static mockGetTx(code: number = 200): nock.Scope{
        let data: any = this.createData(code, {
            hash: 'hash',
            height: 'height',
            index: 'index',
            proof: 'proof',
            tx: 'tx'
        })

        return this.nockRoute(enums.RPCRoutes.QueryTX.toString().toString(), code, data)
    }

    public static mockGetHeight(code: number = 200): nock.Scope {
        let data: any = this.createData(code, {
            Height: 'Height'
        })
        return this.nockRoute(enums.RPCRoutes.QueryHeight.toString(), code, data)
    }

    public static mockGetBalance(code: number = 200): nock.Scope{
        let data: any = this.createData(code, {
            balance: 'balance'
        })
        return this.nockRoute(enums.RPCRoutes.QueryBalance.toString(), code, data)
    }

    public static mockGetNodes(code: number = 200): nock.Scope{
        let data: any = this.createData(code, {
            nodes: 'nodes'
        })
        return this.nockRoute(enums.RPCRoutes.QueryNodes.toString(), code, data)
    }

    public static mockGetNode(code: number = 200): nock.Scope{
        let data: any = this.createData(code, {
            Node: 'Node'
        })
        return this.nockRoute(enums.RPCRoutes.QueryNode.toString(), code, data)
    }

    public static mockGetNodeParams(code: number = 200): nock.Scope{
        let data: any = this.createData(code, {
            downtime_jail_duration: 'downtime_jail_duration',
            max_evidence_age: 'max_evidence_age',
            max_validator: 'max_validator',
            min_signed_per_window: 'max_evidence_age',
            proposer_reward_percentage: 'proposer_reward_percentage',
            relays_to_tokens: 'relays_to_tokens',
            session_block: 'session_block',
            signed_blocks_window: 'signed_blocks_window',
            slash_fraction_double_sign: 'slash_fraction_double_sign',
            slash_fraction_downtime: 'slash_fraction_downtime',
            stake_denom: 'stake_denom',
            stake_minimum: 'stake_minimum',
            unstaking_time: 'unstaking_time'
        })
        return this.nockRoute(enums.RPCRoutes.QueryNodeParams.toString(), code, data)
    }

    public static mockGetNodeProofs(code: number = 200): nock.Scope {
        let data: any = this.createData(code, {
            proofs: 'proofs'
        })
        return this.nockRoute(enums.RPCRoutes.QueryNodeProofs.toString(), code, data)
    }

    public static mockGetNodeProof(code: number = 200): nock.Scope {
        let data: any = this.createData(code, {
            servicer_address: 'servicer_address',
            session_header: 'session_header',
            total_relays: 'total_relays'
        })
        return this.nockRoute(enums.RPCRoutes.QueryNodeProof.toString(), code, data)
    }

    public static mockGetApps(code: number = 200): nock.Scope{
        let data: any = this.createData(code, {
            apps: 'apps'
        })
        return this.nockRoute(enums.RPCRoutes.QueryApps.toString(), code, data)
    }

    public static mockGetApp(code: number = 200): nock.Scope{
        let data: any = this.createData(code, {
            address: 'address',
            chains: 'chains',
            cons_pubkey: 'cons_pubkey',
            jailed: 'jailed',
            max_relays: 'max_relays',
            statu: 'statu',
            tokens: 'tokens',
            unstaking_time: 'unstaking_time'
        })
        return this.nockRoute(enums.RPCRoutes.QueryApp.toString(), code, data)
    }

    public static mockGetAppParams(code: number = 200): nock.Scope{
        let data: any = this.createData(code, {
            app_stake_min: 'app_stake_min',
            baseline_throughput_stake_rate: 'baseline_throughput_stake_rate',
            max_applications: 'max_applications',
            participation_rate_on: 'participation_rate_on',
            staking_adjustment: 'staking_adjustment',
            unstaking_time: 'unstaking_time'
        })
        return this.nockRoute(enums.RPCRoutes.QueryAppParams.toString(), code, data)
    }

    public static mockGetPocketParams(code: number = 200): nock.Scope{
        let data: any = this.createData(code, {
            claim_expiration: 'claim_expiration',
            proof_waiting_period: 'proof_waiting_period',
            session_node_count: 'session_node_count',
            supported_blockchains: 'supported_blockchains'
        })
        return this.nockRoute(enums.RPCRoutes.QueryPocketParams.toString(), code, data)
    }

    public static mockGetSupportedChains(code: number = 200): nock.Scope{
        let data: any = this.createData(code, {
            supported_chains: 'supported_chains'
        })
        return this.nockRoute(enums.RPCRoutes.QuerySupportedChains.toString(), code, data)
    }

    public static mockGetSupply(code: number = 200): nock.Scope{
        let data: any = this.createData(code, {
            appStaked: 'appStaked',
            dao: 'dao',
            nodeStaked: 'nodeStaked',
            total: 'total',
            totalStaked: 'totalStaked',
            totalUnstaked: 'totalUnstaked'
        })
        return this.nockRoute(enums.RPCRoutes.QuerySupply.toString(), code, data)
    }
}