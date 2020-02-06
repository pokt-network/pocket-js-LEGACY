
/**
 * Parent class to all Msg to be sent over inside Transactions
 */
export abstract class TxMsg {
    public abstract getMsgTypeKey(): string
    public abstract getMsgValueObj(): object

    /**
     * Amino encodable structure
     */
    public toMsgObj(): object {
        return {
            type: this.getMsgTypeKey(),
            value: this.getMsgValueObj()
        }
    }
}