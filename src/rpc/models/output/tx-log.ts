import { typeGuard } from "../../../utils"

/**
 * A model representing a log generated from a Transaction
 */
export class TxLog {
    /**
     * Construct this object from it's JSON representation
     * @param txLogObj {any}
     * @returns {TxLog | Error}
     * @memberof TxLog
     */
    public static fromJSONObj(txLogObj: any): TxLog | Error {
        let msgIndex: BigInt
        let success: boolean
        let log: string

        if (typeGuard(txLogObj.msg_index, "number")) {
            msgIndex = BigInt(txLogObj.msg_index)
        } else {
            return new Error("Invalid msg index for transaction log: " + JSON.stringify(txLogObj))
        }

        if (typeGuard(txLogObj.success, "boolean")) {
            success = txLogObj.success
        } else {
            return new Error("Invalid success field for transaction log: " + JSON.stringify(txLogObj))
        }

        if (typeGuard(txLogObj.log, "string")) {
            log = txLogObj.log
        } else {
            return new Error("Invalid log for transaction log: " + JSON.stringify(txLogObj))
        }

        return new TxLog(msgIndex, success, log)
    }

    public readonly msgIndex: BigInt
    public readonly success: boolean
    public readonly log: string

    /**
     * Constructor for this class
     * @param msgIndex {BigInt} index for this log in the logs list
     * @param success {boolean} whether or not this message was processed succesfully
     * @param log {string} The content of the log message
     */
    public constructor(msgIndex: BigInt, success: boolean, log: string) {
        this.msgIndex = msgIndex
        this.success = success
        this.log = log
    }
}