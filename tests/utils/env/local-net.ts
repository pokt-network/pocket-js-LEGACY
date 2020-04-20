import { Environment } from "./environment"
import * as dotenv from "dotenv"
dotenv.config()

export class LocalNet extends Environment {

    private readonly ip: string = process.env.localhost_env_url ?? ""

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