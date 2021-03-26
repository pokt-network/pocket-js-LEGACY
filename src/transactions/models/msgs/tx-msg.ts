
/**
 * Parent class to all Msg to be sent over inside Transactions
 */
export abstract class TxMsg {
    public abstract toStdSignDocMsgObj(): any
    public abstract toStdTxMsgObj(): any
}