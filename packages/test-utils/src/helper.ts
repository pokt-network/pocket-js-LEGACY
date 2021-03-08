import { LocalNet, TestNet, MainNet, NockNet, Environment } from "."

/**
 * Enum indicating all the environment networks
 */
export enum Network {
    LocalNet = "localNet",
    TestNet = "testNet",
    MainNet = "mainNet",
    NockNet = "nockNet"
}

/**
 * Class that will return the environment based on the Network provided
 */
export class EnvironmentHelper {
    public static get(network: Network = Network.LocalNet): Environment {
        const test = network
        switch (test) {
            case "localNet":
                return new LocalNet()
            case "testNet":
                return new TestNet()
            case "mainNet":
                return new MainNet()
            case "nockNet":
                return new NockNet()
            default:
                return new LocalNet()
        }
    }

    public static getNetwork(net: string | undefined): Environment {
        switch (net) {
            case "local":
                return new LocalNet()
            case "test":
                return new TestNet()
            case "main":
                return new MainNet()
            case "nock":
                return new NockNet()
            default:
                return new LocalNet()
        }
    }
    public static getLocalNet(): Environment {
        return new LocalNet()
    }
    public static getTestNet(): Environment {
        return new TestNet()
    }
    public static getMainNet(): Environment {
        return new MainNet()
    }
    public static getNockNet(): Environment {
        return new NockNet()
    }
}