
/**
 * Parent class to all Msg to be sent over inside Transactions
 */
export abstract class TxMsg {
    public abstract getMsgTypeKey(): string
    public abstract getMsgValueObj(): {}

    /**
     * Amino encodable structure
     */
    public toMsgObj(): {} {
        return {
            type: this.getMsgTypeKey(),
            value: this.getMsgValueObj()
        }
    }
}