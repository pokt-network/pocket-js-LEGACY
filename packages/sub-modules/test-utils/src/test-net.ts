import { Environment } from "./environment"

export class TestNet extends Environment {

    private readonly ip: string = 'https://node1.testnet.pokt.network'

    public getTendermintRPC(): string {
        return this.ip + ':26657'
    }
    public getTendermintPeers(): string {
        return this.ip + ':26656'
    }
    public getPOKTRPC(): string {
        return this.ip + ':443'
    }
}