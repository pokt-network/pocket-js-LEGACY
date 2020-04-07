import { TxMsg, CoinDenom, StdSignDoc, TxSignature, StdTx, MsgSend, 
    MsgAppStake, MsgAppUnstake, MsgAppUnjail, MsgNodeStake, 
    MsgNodeUnstake, MsgNodeUnjail, TransactionSignature 
} from "./models/"
import { ITransactionSender, TransactionSigner} from "./index"
import { UnlockedAccount } from "../keybase/models"
import { Pocket, RawTxResponse, RpcError, typeGuard, addressFromPublickey, Keybase } from ".."

export class TransactionSender implements ITransactionSender {
    private txMgs: TxMsg[] = []
    private unlockedAccount?: UnlockedAccount
    private pocket: Pocket
    private txSigner?: TransactionSigner
    private txMsgErrors: Error[] = []

    /**
     * Constructor for this class. Requires either an unlockedAccount or txSigner
     * @param {Pocket} pocket - Pocket instance 
     * @param {UnlockedAccount} unlockedAccount - Unlocked account 
     * @param {TransactionSigner} txSigner - Transaction signer
     */
    public constructor(pocket: Pocket, unlockedAccount?: UnlockedAccount, txSigner?: TransactionSigner) {
        this.unlockedAccount = unlockedAccount
        this.txSigner = txSigner
        this.pocket = pocket

        if (this.unlockedAccount === undefined && this.txSigner === undefined) {
            throw new Error("Need to define unlockedAccount or txSigner")
        }
    }

    /**
     * Signs and submits a transaction to the network given the parameters and called upon Msgs. Will empty the msg list after succesful submission
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
            if (this.txMsgErrors.length === 1) {
                return RpcError.fromError(this.txMsgErrors[0])
            } else if (this.txMsgErrors.length > 1) {
                return new RpcError("0", this.txMsgErrors[0].message + " and another " + (this.txMsgErrors.length - 1) + " errors")
            }

            if (this.txMgs.length === 0) {
                return new RpcError("0", "No messages configured for this transaction")
            }
            const entropy = Number(BigInt(Math.floor(Math.random() * 99999999999999999)).toString()).toString()
            const stdSignDoc = new StdSignDoc(entropy, chainID, this.txMgs, fee, feeDenom, memo)
            let txSignatureOrError
            const bytesToSign = stdSignDoc.marshalAmino()
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
            const transaction = new StdTx(stdSignDoc, [txSignature])
            const encodedTxBytes = transaction.marshalAmino()
            // Clean messages accumulated on submit
            this.txMgs = []
            const response = await this.pocket.rpc()!.client.rawtx(addressHex, encodedTxBytes, timeout)
            
            return response
        } catch (error) {
            return RpcError.fromError(error)
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
            this.txMgs.push(new MsgSend(fromAddress, toAddress, amount))
        } catch (error) {
            this.txMsgErrors.push(error)
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
            this.txMgs.push(new MsgAppStake(Buffer.from(appPubKey, "hex"), chains, amount))
        } catch (error) {
            this.txMsgErrors.push(error)
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
            this.txMgs.push(new MsgAppUnstake(address))
        } catch (error) {
            this.txMsgErrors.push(error)
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
            this.txMgs.push(new MsgAppUnjail(address))
        } catch (error) {
            this.txMsgErrors.push(error)
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
            this.txMgs.push(new MsgNodeStake(Buffer.from(nodePubKey, "hex"), chains, amount, serviceURL))
        } catch (error) {
            this.txMsgErrors.push(error)
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
            this.txMgs.push(new MsgNodeUnstake(address))
        } catch (error) {
            this.txMsgErrors.push(error)
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
            this.txMgs.push(new MsgNodeUnjail(address))
        } catch (error) {
            this.txMsgErrors.push(error)
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