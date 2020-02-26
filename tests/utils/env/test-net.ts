import { Environment } from "./environment"

export class TestNet extends Environment {

    private readonly ip: string = 'http://node4.testnet.pokt.network'

    public getTendermintRPC(): string {
        return this.ip + ':26657'
    }
    public getTendermintPeers(): string {
        return this.ip + ':26657'
    }
    public getPOKTRPC(): string {
        return this.ip + ':8081'
    }
}