import { MsgNodeUnjailTx, MsgProtoSend, MsgProtoAppStake, MsgProtoAppUnstake, MsgProtoAppUnjail, MsgProtoNodeStakeTx, MsgProtoNodeUnstake, MsgProtoNodeUnjail } from './models/msgs';
import {
    TxMsg, CoinDenom, TxSignature, MsgSend,
    MsgAppStake, MsgAppUnstake, MsgAppUnjail, MsgNodeStake,
    MsgNodeUnstake, TransactionSignature
} from "./models/"
import { ITransactionSender, TransactionSigner } from "./index"
import { UnlockedAccount } from "../keybase/models"
import { Pocket, RawTxResponse, RpcError, typeGuard, addressFromPublickey, Keybase, RawTxRequest } from ".."
import { TxEncoderFactory } from "./factory/tx-encoder-factory"
import { Any } from './models/proto';
import { ProtoTxEncoder } from './factory';

export class TransactionSender implements ITransactionSender {
    public txMsg?: TxMsg
    private unlockedAccount?: UnlockedAccount
    private pocket: Pocket
    private txSigner?: TransactionSigner
    private txMsgError?: Error
    public offlineMode?: boolean

    /**
     * Constructor for this class. Requires either an unlockedAccount or txSigner
     * @param {Pocket} pocket - Pocket instance 
     * @param {UnlockedAccount} unlockedAccount - Unlocked account 
     * @param {TransactionSigner} txSigner - Transaction signer
     */
    public constructor(pocket: Pocket, unlockedAccount?: UnlockedAccount, txSigner?: TransactionSigner, offlineMode?: boolean) {
        this.unlockedAccount = unlockedAccount
        this.txSigner = txSigner
        this.pocket = pocket
        this.offlineMode = offlineMode

        if (!this.offlineMode && this.unlockedAccount === undefined && this.txSigner === undefined) {
            throw new Error("Need to define unlockedAccount or txSigner")
        }
    }

    /**
     * Signs and creates a transaction object that can be submitted to the network given the parameters and called upon Msgs.
     * Will empty the msg list after succesful creation
     * @param {string} chainID - The chainID of the network to be sent to
     * @param {string} fee - The amount to pay as a fee for executing this transaction
     * @param {CoinDenom | undefined} feeDenom - The denomination of the fee amount 
     * @param {string | undefined} memo - The memo field for this account
     * @returns {Promise<RawTxResponse | RpcError>} - A Raw transaction Response object or Rpc error.
     * @memberof TransactionSender
     */
     public async createTransaction(
        chainID: string,
        fee: string,
        feeDenom?: CoinDenom,
        memo?: string
    ): Promise<RawTxRequest | RpcError> {
        try {
            if (this.txMsgError !== undefined) {
                const rpcError = RpcError.fromError(this.txMsgError)
                this.txMsg = undefined
                this.txMsgError = undefined
                return rpcError
            }

            if (this.txMsg === undefined) {
                return new RpcError("0", "No messages configured for this transaction")
            }

            const entropy = Number(BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)).toString()).toString()
            const signer = TxEncoderFactory.createEncoder(entropy, chainID, this.txMsg, fee, feeDenom, memo, this.pocket.configuration.useLegacyTxCodec)
            let txSignatureOrError
            const bytesToSign = signer.marshalStdSignDoc()
            if (typeGuard(this.unlockedAccount, UnlockedAccount)) {
                txSignatureOrError = await this.signWithUnlockedAccount(bytesToSign, this.unlockedAccount as UnlockedAccount)
            } else if (this.txSigner !== undefined) {
                txSignatureOrError = this.signWithTrasactionSigner(bytesToSign, this.txSigner as TransactionSigner)
            } else {
                return new RpcError("0", "No account or TransactionSigner specified")
            }

            if (!typeGuard(txSignatureOrError, TxSignature)) {
                return new RpcError("0", "Error generating signature for transaction")
            }

            const txSignature = txSignatureOrError as TxSignature
            const addressHex = addressFromPublickey(txSignature.pubKey)
            const encodedTxBytes = signer.marshalStdTx(txSignature)
            // Clean message and error
            this.txMsg = undefined
            this.txMsgError = undefined

            const txRequest = new RawTxRequest(addressHex.toString("hex"), encodedTxBytes.toString("hex"))
            return txRequest
        } catch (error) {
            return RpcError.fromError(error as Error)
        }
    }

    /**
     * Creates an unsigned transaction hex that can be signed with a valid ed25519 private key
     * @param {string} chainID - The chainID of the network to be sent to
     * @param {string} fee - The amount to pay as a fee for executing this transaction
     * @param {CoinDenom | undefined} feeDenom - The denomination of the fee amount 
     * @param {string | undefined} memo - The memo field for this account
     * @param {string} entropy - The entropy for this tx
     * @returns {Promise<{ bytesToSign: string, stdTxMsgObj: string } | RpcError>} - bytes to sign and the stringified stxTxMsgObj
     * @memberof TransactionSender
     */
     public createUnsignedTransaction(
        chainID: string,
        fee: string,
        entropy: string,
        feeDenom?: CoinDenom,
        memo?: string,
    ): { bytesToSign: string, stdTxMsgObj: string } | RpcError {
        try {
            if (this.txMsgError !== undefined) {
                const rpcError = RpcError.fromError(this.txMsgError)
                this.txMsg = undefined
                this.txMsgError = undefined
                return rpcError
            }

            if (this.txMsg === undefined) {
                return new RpcError("0", "No messages configured for this transaction")
            }

             // This needs to be strinfigied so it can be stored offline,
            // since it's required to sign the transaction.            
            const stdTxMsgObj = Any.toJSON(this.txMsg.toStdTxMsgObj())
            const unsignedTxBytes = ProtoTxEncoder.marshalStdSignDoc(chainID, entropy, fee, stdTxMsgObj, memo, feeDenom)
            // Clean message and error
            this.txMsg = undefined
            this.txMsgError = undefined

            return { bytesToSign: unsignedTxBytes.toString('hex'), stdTxMsgObj: JSON.stringify(stdTxMsgObj) }
        } catch (error) {
            return RpcError.fromError(error as Error)
        }
    }

    /**
     * Signs and submits a transaction to the network given the parameters for each Msg in the Msg list. Will empty the msg list after submission attempt
     * @param {string} chainID - The chainID of the network to be sent to
     * @param {string} fee - The amount to pay as a fee for executing this transaction
     * @param {CoinDenom | undefined} feeDenom - The denomination of the fee amount 
     * @param {string | undefined} memo - The memo field for this account
     * @param {number | undefined} timeout - Request timeout
     * @returns {Promise<RawTxResponse | RpcError>} - A Raw transaction Response object or Rpc error.
     * @memberof TransactionSender
     */
    public async submit(
        chainID: string,
        fee: string,
        feeDenom?: CoinDenom,
        memo?: string,
        timeout?: number
    ): Promise<RawTxResponse | RpcError> {
        try {
            const rawTxRequestOrError = await this.createTransaction(chainID, fee, feeDenom, memo)

            if (!typeGuard(rawTxRequestOrError, RawTxRequest)) {
                return rawTxRequestOrError
            }
            const rawTxRequest = rawTxRequestOrError as RawTxRequest

            // Clean message and error
            this.txMsg = undefined
            this.txMsgError = undefined
            const response = await this.pocket.rpc()!.client.rawtx(rawTxRequest.address, rawTxRequest.txHex, timeout)

            return response
        } catch (error) {
            return RpcError.fromError(error as Error)
        }
    }

    /**
     * Adds a MsgSend TxMsg for this transaction
     * @param {string} fromAddress - Origin address
     * @param {string} toAddress - Destination address
     * @param {string} amount - Amount to be sent, needs to be a valid number greater than 0
     * @returns {ITransactionSender} - A transaction sender.
     * @memberof TransactionSender
     */
    public send(
        fromAddress: string,
        toAddress: string,
        amount: string
    ): ITransactionSender {
        try {
            if (this.pocket.configuration.useLegacyTxCodec)
                this.txMsg = new MsgSend(fromAddress, toAddress, amount)
            else
                this.txMsg = new MsgProtoSend(fromAddress, toAddress, amount)
        } catch (error) {
            this.txMsgError = error as Error
        }
        return this
    }

    /**
     * Adds a MsgAppStake TxMsg for this transaction
     * @param {string} appPubKey - Application Public Key
     * @param {string[]} chains - Network identifier list to be requested by this app
     * @param {string} amount - the amount to stake, must be greater than 0
     * @returns {ITransactionSender} - A transaction sender.
     * @memberof TransactionSender
     */
    public appStake(
        appPubKey: string,
        chains: string[],
        amount: string
    ): ITransactionSender {
        try {
            if (this.pocket.configuration.useLegacyTxCodec)
                this.txMsg = new MsgAppStake(Buffer.from(appPubKey, "hex"), chains, amount)
            else
                this.txMsg = new MsgProtoAppStake(Buffer.from(appPubKey, "hex"), chains, amount)
        } catch (error) {
            this.txMsgError = error as Error
        }
        return this
    }

    /**
     * Adds a MsgBeginAppUnstake TxMsg for this transaction
     * @param {string} address - Address of the Application to unstake for
     * @returns {ITransactionSender} - A transaction sender.
     * @memberof TransactionSender
     */
    public appUnstake(
        address: string
    ): ITransactionSender {
        try {
            if (this.pocket.configuration.useLegacyTxCodec)
                this.txMsg = new MsgAppUnstake(address)
            else
                this.txMsg = new MsgProtoAppUnstake(address)
        } catch (error) {
            this.txMsgError = error as Error
        }
        return this
    }

    /**
     * Adds a MsgAppUnjail TxMsg for this transaction
     * @param {string} address - Address of the Application to unjail
     * @returns {ITransactionSender} - A transaction sender.
     * @memberof TransactionSender
     */
    public appUnjail(
        address: string
    ): ITransactionSender {
        try {
            if (this.pocket.configuration.useLegacyTxCodec)
                this.txMsg = new MsgAppUnjail(address)
            else
                this.txMsg = new MsgProtoAppUnjail(address)
        } catch (error) {
            this.txMsgError = error as Error
        }
        return this
    }


    /**
     * Adds a MsgAppStake TxMsg for this transaction
     * @param {string} nodePubKey - Node Public key
     * @param {string[]} chains - Network identifier list to be serviced by this node
     * @param {string} amount - the amount to stake, must be greater than 0
     * @param {URL} serviceURL - Node service url
     * @returns {ITransactionSender} - A transaction sender.
     * @memberof TransactionSender
     */
    public nodeStake(
        nodePubKey: string,
        chains: string[],
        amount: string,
        serviceURL: URL
    ): ITransactionSender {
        try {
            if (this.pocket.configuration.useLegacyTxCodec)
                this.txMsg = new MsgNodeStake(Buffer.from(nodePubKey, "hex"), chains, amount, serviceURL)
            else
                this.txMsg = new MsgProtoNodeStakeTx(Buffer.from(nodePubKey, "hex"), chains, amount, serviceURL)
        } catch (error) {
            this.txMsgError = error as Error
        }
        return this
    }

    /**
     * Adds a MsgBeginUnstake TxMsg for this transaction
     * @param {string} address - Address of the Node to unstake for
     * @returns {ITransactionSender} - A transaction sender.
     * @memberof TransactionSender
     */
    public nodeUnstake(
        address: string
    ): ITransactionSender {
        try {
            if (this.pocket.configuration.useLegacyTxCodec)
                this.txMsg = new MsgNodeUnstake(address)
            else
                this.txMsg = new MsgProtoNodeUnstake(address)
        } catch (error) {
            this.txMsgError = error as Error
        }
        return this
    }


    /**
     * Adds a MsgUnjail TxMsg for this transaction
     * @param {string} address - Address of the Node to unjail
     * @returns {ITransactionSender} - A transaction sender.
     * @memberof TransactionSender
     */
    public nodeUnjail(
        address: string
    ): ITransactionSender {
        try {
            if (this.pocket.configuration.useLegacyTxCodec)
                this.txMsg = new MsgNodeUnjailTx(address)
            else
                this.txMsg = new MsgProtoNodeUnjail(address)
        } catch (error) {
            this.txMsgError = error as Error
        }
        return this
    }

    /**
     * Signs using the unlockedAccount attribute of this class
     * @param {Buffer} bytesToSign - Bytes to be signed
     * @param {UnlockedAccount} unlockedAccount - Unlocked account for signing
     * @returns {TxSignature | Error} - A transaction signature or error.
     * @memberof TransactionSender
     */
    private async signWithUnlockedAccount(bytesToSign: Buffer, unlockedAccount: UnlockedAccount): Promise<TxSignature | Error> {
        const signatureOrError = await Keybase.signWith(unlockedAccount.privateKey, bytesToSign)
        if (typeGuard(signatureOrError, Error)) {
            return signatureOrError as Error
        }
        return new TxSignature(unlockedAccount.publicKey, signatureOrError as Buffer)
    }

    /**
     * Signs using the txSigner attribute of this class
     * @param {Buffer} bytesToSign - Bytes to sign
     * @param {TransactionSigner} txSigner - Transaction signer
     * @returns {TxSignature | Error} - A transaction signature or error.
     * @memberof TransactionSender
     */
    private signWithTrasactionSigner(bytesToSign: Buffer, txSigner: TransactionSigner): TxSignature | Error {
        const transactionSignatureOrError = txSigner(bytesToSign)
        if (typeGuard(transactionSignatureOrError, Error)) {
            return transactionSignatureOrError as Error
        }
        const txSignature = transactionSignatureOrError as TransactionSignature
        return new TxSignature(txSignature.publicKey, txSignature.signature)
    }
}