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
     * @param pocket {Pocket}
     * @param unlockedAccount {UnlockedAccount} 
     * @param txSigner {TransactionSigner}
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
     * @param accountNumber {string} Account number for this account
     * @param sequence {string} Sequence of transactions (or Nonce)
     * @param chainId {string} The chainId of the network to be sent to
     * @param node {Node} the Node object to send the transaction to
     * @param fee {string} The amount to pay as a fee for executing this transaction
     * @param feeDenom {CoinDenom | undefined} The denomination of the fee amount 
     * @param memo {string | undefined} The memo field for this account
     * @param configuration {Configuration | undefined} Alternative configuration to be used
     */
    public async submit(
        accountNumber: string,
        sequence: string,
        chainId: string,
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
            const stdSignDoc = new StdSignDoc(accountNumber, sequence, chainId, this.txMgs, fee, feeDenom, memo)
            let txSignatureOrError
            const bytesToSign = stdSignDoc.marshalAmino()
            if (typeGuard(this.unlockedAccount, UnlockedAccount)) {
                txSignatureOrError = this.signWithUnlockedAccount(bytesToSign, this.unlockedAccount as UnlockedAccount)
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
            return this.pocket.rpc()!.client.rawtx(addressHex, encodedTxBytes, timeout)
        } catch (error) {
            return RpcError.fromError(error)
        }
    }

    /**
     * Adds a MsgSend TxMsg for this transaction
     * @param fromAddress {string}
     * @param toAddress {string}
     * @param amount {string} Needs to be a valid number greater than 0
     * @param amountDenom {CoinDenom | undefined}
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
     * @param appPubKey {string}
     * @param chains {string[]} Network identifier list to be requested by this app
     * @param amount {string} the amount to stake, must be greater than 0
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
     * @param address {string} Address of the Application to unstake for
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
     * @param address {string} Address of the Application to unjail
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
     * @param nodePubKey {string}
     * @param chains {string[]} Network identifier list to be serviced by this node
     * @param amount {string} the amount to stake, must be greater than 0
     * @param serviceURL {URL}
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
     * @param address {string} Address of the Node to unstake for
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
     * @param address {string} Address of the Node to unjail
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
     * @param bytesToSign {Buffer}
     * @param unlockedAccount {UnlockedAccount}
     */
    private signWithUnlockedAccount(bytesToSign: Buffer, unlockedAccount: UnlockedAccount): TxSignature | Error {
        const signatureOrError = Keybase.signWith(unlockedAccount.privateKey, bytesToSign)
        if (typeGuard(signatureOrError, Error)) {
            return signatureOrError as Error
        }
        return new TxSignature(unlockedAccount.publicKey, signatureOrError as Buffer)
    }

    /**
     * Signs using the txSigner attribute of this class
     * @param bytesToSign {Buffer}
     * @param unlockedAccount {TransactionSigner}
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