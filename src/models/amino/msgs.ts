import { TxMsg } from "./tx-msg";
import { CoinDenom } from "../coin-denom";
import { validatePublicKey, validateAddressHex } from "../../utils/key-pair"
import { validateServiceURL } from "../../utils/url";

/**
 * Model representing a MsgSend to send POKT from one account to another
 */
export class MsgSend extends TxMsg {
    public readonly fromAddress: string
    public readonly toAddress: string
    public readonly amount: string
    public readonly amountDenom: CoinDenom
    public readonly AMINO_KEY: string = "posmint/MsgSend"

    /**
     * Constructor this message
     * @param fromAddress {string}
     * @param toAddress {string}
     * @param amount {string} Needs to be a valid number greater than 0
     * @param amountDenom {CoinDenom | undefined}
     */
    public constructor(fromAddress: string, toAddress: string, amount: string, amountDenom?: CoinDenom) {
        super()
        this.fromAddress = fromAddress
        this.toAddress = toAddress
        this.amount = amount
        this.amountDenom = amountDenom ? amountDenom : CoinDenom.Upokt
        const amountNumber = Number(this.amount) || -1;
        if (isNaN(amountNumber)) {
            throw new Error("Fee is not a valid number")
        } else if (amountNumber < 0) {
            throw new Error("Amount < 0")
        }
    }
    public getMsgTypeKey(): string {
        return this.AMINO_KEY
    }    
    public getMsgValueObj(): {} {
        return {
            from_address: this.fromAddress,
            to_address: this.toAddress,
            amount: [{
                denom: this.amountDenom,
                amount: this.amount
            }]
        }
    }
}

/**
 * Model representing a MsgAppStake to stake as an Application in the Pocket Network
 */
export class MsgAppStake extends TxMsg {
    public readonly AMINO_KEY: string = "apps/MsgAppStake"
    public readonly pubKey: Buffer
    public readonly chains: string[]
    public readonly amount: string

    /**
     * Constructor for this class
     * @param pubKey {Buffer}
     * @param chains {string[]} Network identifier list to be requested by this app
     * @param amount {string} the amount to stake, must be greater than 0
     */
    constructor(pubKey: Buffer, chains: string[], amount: string) {
        super()
        this.pubKey = pubKey
        this.chains = chains
        this.amount = amount
        const amountNumber = Number(this.amount) || -1;
        if (isNaN(amountNumber)) {
            throw new Error("Fee is not a valid number")
        } else if (amountNumber < 0) {
            throw new Error("Amount < 0")
        } else if (this.chains.length === 0) {
            throw new Error("Chains is empty")
        } else if (!validatePublicKey(this.pubKey)) {
            throw new Error("Invalid public key")
        }
    }

    getMsgTypeKey(): string {
        return this.AMINO_KEY
    }    
    getMsgValueObj(): {} {
        return {
            pubkey: this.pubKey.toString('hex'),
            chains: this.chains,
            value: this.amount
        }
    }
}

/**
 * Model representing a MsgAppStake to unstake an Application in the Pocket Network
 */
export class MsgAppUnstake extends TxMsg {
    public readonly AMINO_KEY: string = "apps/MsgAppBeginUnstake"
    public readonly appAddress: string

    /**
     * The address hex of the Application to unstake for
     * @param appAddress {string}
     */
    public constructor(appAddress: string) {
        super()
        this.appAddress = appAddress

        if (!validateAddressHex(this.appAddress)) {
            throw new Error("Invalid address hex")
        }
    }

    getMsgTypeKey(): string {
        return this.AMINO_KEY
    }   
    getMsgValueObj(): {} {
        return {
            application_address: this.appAddress
        }
    }
}

/**
 * Model representing a MsgAppUnjail to unjail an Application in the Pocket Network
 */
export class MsgAppUnjail extends TxMsg {
    public readonly AMINO_KEY: string = "apps/MsgAppUnjail"
    public readonly address: string

    /**
     * 
     * @param address {string} The address of the Application to unjail
     */
    public constructor(address: string) {
        super()
        this.address = address

        if (!validateAddressHex(this.address)) {
            throw new Error("Invalid address hex")
        }
    }

    getMsgTypeKey(): string {
        return this.AMINO_KEY
    }
    getMsgValueObj(): {} {
        return {
            address: this.address
        }
    }
}

/**
 * Model representing a MsgNodeStake to stake as an Node in the Pocket Network
 */
export class MsgNodeStake extends TxMsg {
    public readonly AMINO_KEY: string = "pos/MsgStake"
    public readonly pubKey: Buffer
    public readonly chains: string[]
    public readonly amount: string
    public readonly serviceURL: URL

    /**
     * 
     * @param pubKey {string}
     * @param chains {string[]} Cannot be empty
     * @param amount {string} Has to be a valid number and cannot be lesser than 0
     * @param serviceURL {URL} Needs to be https://
     */
    constructor(pubKey: Buffer, chains: string[], amount: string, serviceURL: URL) {
        super()
        this.pubKey = pubKey
        this.chains = chains
        this.amount = amount
        this.serviceURL = serviceURL

        if (isNaN(this.amount as any)) {
            throw new Error("Fee is not a valid number")
        } else if (this.chains.length === 0) {
            throw new Error("Chains is empty")
        } else if (!validatePublicKey(this.pubKey)) {
            throw new Error("Invalid public key")
        } else if (!validateServiceURL(this.serviceURL)) {
            throw new Error("Invalid Service URL")
        }
    }

    getMsgTypeKey(): string {
        return this.AMINO_KEY
    }
    getMsgValueObj(): {} {
        return {
            public_key: this.pubKey.toString('hex'),
            chains: this.chains,
            value: this.amount,
            service_url: this.serviceURL.toString()
        }
    }
}

/**
 * Model representing a MsgNodeStake to unstake as an Node in the Pocket Network
 */
export class MsgNodeUnstake extends TxMsg {
    public readonly AMINO_KEY: string = "pos/MsgBeginUnstake"
    public readonly nodeAddress: string

    /**
     * @param nodeAddress {string}
     */
    public constructor(nodeAddress: string) {
        super()
        this.nodeAddress = nodeAddress

        if (!validateAddressHex(this.nodeAddress)) {
            throw new Error("Invalid address hex")
        }
    }

    getMsgTypeKey(): string {
        return this.AMINO_KEY
    }
    getMsgValueObj(): {} {
        return {
            validator_address: this.nodeAddress
        }
    }
}

/**
 * Model representing a MsgNodeUnjail to unjail as an Node in the Pocket Network
 */
export class MsgNodeUnjail extends TxMsg {
    public readonly AMINO_KEY: string = "pos/MsgUnjail"
    public readonly address: string

    /**
    * @param address {string}
    */
    public constructor(address: string) {
        super()
        this.address = address

        if (!validateAddressHex(this.address)) {
            throw new Error("Invalid address hex")
        }
    }

    getMsgTypeKey(): string {
        return this.AMINO_KEY
    }
    getMsgValueObj(): {} {
        return {
            address: this.address
        }
    }
}
