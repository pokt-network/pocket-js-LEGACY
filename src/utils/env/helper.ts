import { LocalNet, TestNet, MainNet, Environment } from "./"

/**
 * Enum indicating all the environment networks
 */
export enum Network {
    LocalNet = "localNet",
    TestNet = "testNet",
    MainNet = "mainNet"
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
}