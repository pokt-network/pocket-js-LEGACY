/**
 * @class Environment
 * This class provides a easy access to the different enviroments
 */
export abstract class Environment {
    public abstract getTendermintRPC(): string
    public abstract getTendermintPeers(): string
    public abstract getPOKTRPC(): string
}