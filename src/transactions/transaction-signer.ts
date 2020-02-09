import { TransactionSignature } from "./models/transaction-signature"

/**
 * Interface function for custom transaction signer object
 */
export type TransactionSigner = (encodedTxBytes: Buffer) => TransactionSignature | Error