import { TxLog } from "./tx-log"
import { typeGuard } from "../../../utils"

/**
 * Represents a /v1/rawtx RPC response
 */
export class RawTxResponse {
    /**
     * Construct this model from it's JSON representation
     * @param jsonStr {string}
     * @returns {RawTxResponse | Error}
     */
    public static fromJSON(jsonStr: string): RawTxResponse | Error {
        try {
            const rawTxResObj = JSON.parse(jsonStr)
            let height: BigInt
            let hash: string
            const logs: TxLog[] = []
            if (rawTxResObj.height !== undefined) {
                height = BigInt(rawTxResObj.height)
            } else {
                return new Error("Invalid height: " + rawTxResObj.height)
            }

            if (rawTxResObj.txhash && typeGuard(rawTxResObj.txhash, "string")) {
                hash = rawTxResObj.txhash as string
            } else {
                return new Error("Invalid tx hash: " + rawTxResObj.txhash)
            }

            if (rawTxResObj.logs && typeGuard(rawTxResObj.logs, Array)) {
                const rawLogObjs = rawTxResObj.logs as {}[]
                for (let i = 0; i < rawLogObjs.length; i++) {
                    const txLogOrError = TxLog.fromJSONObj(rawLogObjs[i])
                    if (typeGuard(txLogOrError, TxLog)) {
                        logs.push(txLogOrError as TxLog)
                    }
                }
            }

            return new RawTxResponse(
                height, hash,
                rawTxResObj.code ? BigInt(rawTxResObj.code) : undefined,
                rawTxResObj.data ? rawTxResObj.data : undefined,
                rawTxResObj.raw_log ? rawTxResObj.raw_log : undefined,
                logs,
                rawTxResObj.info ? rawTxResObj.info : undefined,
                rawTxResObj.codespace ? rawTxResObj.codespace : undefined,
                rawTxResObj.tx ? rawTxResObj.tx : undefined,
                rawTxResObj.timestamp ? rawTxResObj.timestamp : undefined
            )
        } catch (err) {
            return err
        }
    }

    // Required fields
    public readonly height: BigInt
    public readonly hash: string
    // Optional fields
    public readonly code?: BigInt
    public readonly data?: string
    public readonly rawLog?: string
    public readonly logs?: TxLog[] 
    public readonly info?: string
    public readonly codeSpace?: string
    public readonly tx?: string
    public readonly timestamp?: string

    /**
     * Constructor for this class
     * @param height {BigInt} The height for this Transaction
     * @param hash {string} The transaction hash in hex format
     * @param code {BigInt} The code for this tx
     * @param data {string} Data hex for this tranaction
     * @param rawLog {string} Dumped logs in string format
     * @param logs {TxLog[]} Logs for this transaction
     * @param info {string}
     * @param codeSpace {string}
     * @param tx {string}
     * @param timestamp {string}
     */
    public constructor(height: BigInt, hash: string, code?: BigInt, data?: string, rawLog?: string, logs?: TxLog[], info?: string, codeSpace?: string, tx?: string, timestamp?: string) {
        this.height = height
        this.hash = hash
        this.code = code
        this.data = data
        this.rawLog = rawLog
        this.logs = logs
        this.info = info
        this.codeSpace = codeSpace
        this.tx = tx
        this.timestamp = timestamp
    }
}