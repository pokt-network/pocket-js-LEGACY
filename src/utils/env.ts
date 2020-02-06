
/**
 *
 *
 * @class Environment
 * This class provides a easy access to the different enviroments
 */
export abstract class Environment {
    
    abstract getTendermintRPC(): string
    abstract getTendermintPeers(): string
    abstract getPOKTRPC(): string
}

export namespace Environment {
    export class LocalNet extends Environment {

        private readonly ip: string = 'http://127.0.0.1'

        getTendermintRPC(): string {
            return this.ip + ':80'
        }       
        getTendermintPeers(): string {
            return this.ip + ':80'
        }
        getPOKTRPC(): string {
            return this.ip + ':80'
        }
    }

    export class TestNet extends Environment {

        private readonly ip: string = 'http://35.236.208.175'

        getTendermintRPC(): string {
            return this.ip + ':26657'
        }       
        getTendermintPeers(): string {
            return this.ip + ':26657'
        }
        getPOKTRPC(): string {
            return this.ip + ':26657'
        }
    }

    export class MainNet extends Environment {
        private readonly ip: string = 'http://35.236.208.175'

        getTendermintRPC(): string {
            return this.ip + ':26657'
        }       
        getTendermintPeers(): string {
            return this.ip + ':26657'
        }
        getPOKTRPC(): string {
            return this.ip + ':26657'
        }
    }
}