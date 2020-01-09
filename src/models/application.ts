import { BondStatus } from "./output/bond-status"
import { Hex } from "../utils/hex"
/**
 *
 *
 * @class Application
 */
export class Application {
    public static fromJSON(json: string): Application {
        const jsonObject = JSON.parse(json)
        const status: BondStatus = BondStatus.getStatus(jsonObject.status)

        return new Application(
            jsonObject.address,
            jsonObject.cons_pubkey,
            jsonObject.jailed,
            status,
            jsonObject.chains,
            jsonObject.Tokens,
            jsonObject.max_relays,
            jsonObject.unstaking_time
        )
    }

    public readonly address: string
    public readonly consPubKey: string
    public readonly jailed: boolean
    public readonly status: BondStatus
    public readonly chains: string[]
    public readonly stakedTokens: BigInt
    public readonly maxRelays: BigInt
    public readonly unstakingCompletionTime: string | undefined

    /**
     * Creates a Application.
     * @constructor
     * @param {string} address - the hex address of the validator
     * @param {string} consPubKey - the hex consensus public key of the validator.
     * @param {boolean} jailed - has the validator been jailed from staked status?
     * @param {BondStatus} status - validator status
     * @param {string[]} chains - chains
     * @param {BigInt} stakedTokens - how many staked tokens
     * @param {string} maxRelays - Service Application url
     * @param {string} unstakingCompletionTime - if unstaking, min time for the validator to complete unstaking
     */
    constructor(
        address: string,
        consPubKey: string,
        jailed: boolean,
        status: BondStatus,
        chains: string[] = [],
        stakedTokens: BigInt,
        maxRelays: BigInt,
        unstakingCompletionTime?: string
    ) {
        this.address = Hex.decodeString(address)
        this.consPubKey = Hex.decodeString(consPubKey)
        this.jailed = jailed
        this.status = status
        this.chains = chains
        this.stakedTokens = stakedTokens
        this.maxRelays = maxRelays
        this.unstakingCompletionTime = unstakingCompletionTime

        if (!this.isValid()) {
            throw new TypeError("Invalid properties length.")
        }
    }
    /**
   *
   * Creates a JSON object with the Application properties
   * @returns {JSON} - JSON Object.
   * @memberof Application
   */
    public toJSON() {
        return {
            "address": this.address,
            "cons_pubkey": this.consPubKey,
            "jailed": this.jailed,
            "status": this.status,
            "chains": this.chains,
            "tokens": this.stakedTokens,
            "max_relays": this.maxRelays,
            "unstaking_time": this.unstakingCompletionTime
        }
    }
    /**
     *
     * Verify if all properties are valid
     * @returns {boolean} - True or false.
     * @memberof Application
     */
    public isValid() {
        for (const property in this) {
            if (!this.hasOwnProperty(property) || property === "") {
                return false
            }
        }
        return true
    }
}