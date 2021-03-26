import { Environment } from "./environment"

export class MainNet extends Environment {
    private readonly ip: string = 'http://35.236.208.175'

    public getTendermintRPC(): string {
        return this.ip + ':26657'
    }
    public getTendermintPeers(): string {
        return this.ip + ':26656'
    }
    public getPOKTRPC(): string {
        return this.ip + ':8081'
    }
}