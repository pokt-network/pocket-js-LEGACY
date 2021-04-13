
/**
 * Parent class to all Msg to be sent over inside Transactions
 */
export abstract class TxMsg {
    public abstract toStdSignDocMsgObj(): object
    public abstract toStdTxMsgObj(): any
}