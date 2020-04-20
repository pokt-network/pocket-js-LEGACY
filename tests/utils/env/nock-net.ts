import { Environment } from "./environment"

export class NockNet extends Environment {

    private readonly ip: string = "http://127.0.0.1"

    public getTendermintRPC(): string {
        return this.ip + ':80'
    }
    public getTendermintPeers(): string {
        return this.ip + ':80'
    }
    public getPOKTRPC(): string {
        return this.ip + ':80'
    }
}