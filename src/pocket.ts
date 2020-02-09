import { Configuration } from "./config"
import { RelayPayload, RelayHeaders, RelayRequest, RelayProof, RelayResponse, Session } from "./rpc/models"
import { addressFromPublickey, validatePrivateKey, publicKeyFromPrivate, typeGuard } from "./utils"
import { SessionManager } from "./session/session-manager"
import { Node, RPC, IRPCProvider, RpcError } from "./rpc"
import { Keybase } from "./keybase/keybase"
import { UnlockedAccount, Account } from "./keybase/models"
import { RoutingTable } from "./routing-table/routing-table"
import { PocketAAT } from "pocket-aat-js"
import { TransactionSender, TransactionSigner, ITransactionSender, InMemoryKVStore, IKVStore } from "./"

/**
 *
 *
 * @class Pocket
 */
export class Pocket {
  /**
   * Annonymous class which handles TxMsg encoding and Transaciton submission to the Network
   */
  // private static TransactionSender = 
  public readonly configuration: Configuration
  public readonly keybase: Keybase
  public readonly rpc: RPC
  private readonly routingTable: RoutingTable
  private readonly sessionManager: SessionManager

  /**
   * Creates an instance of Pocket.
   * @param {Configuration} configuration - Configuration object.
   * @param {IRPCProvider} rpcProvider - Provider which will be used to reach out to the Pocket Core RPC interface.
   * @param {IKVStore} store - Save data using a Key/Value relationship. This object save information in memory.
   * @memberof Pocket
   */
  constructor(
    configuration: Configuration,
    rpcProvider: IRPCProvider,
    store: IKVStore = new InMemoryKVStore(),
  ) {
    this.configuration = configuration
    try {
      this.routingTable = new RoutingTable(configuration.nodes, configuration, store)
    } catch (error) {
      throw error
    }
    this.sessionManager = new SessionManager(this.routingTable, store)
    this.keybase = new Keybase(store)
    this.rpc = new RPC(rpcProvider)
  }

  /**
   *
   * Sends a Relay Request
   * @param {string} data - string holding the json rpc call.
   * @param {string} blockchain - Blockchain hash.
   * @param {RelayHeaders} headers - An object holding the HTTP Headers.
   * @param {PocketAAT} pocketAAT - Pocket Authentication Token.
   * @param {Configuration} configuration - Pocket configuration object.
   * @param {Node} node - (Optional) Session node which will receive the Relay.
   * @param {string} method - (Optional) HTTP method for REST API calls.
   * @param {string} path - (Optional) REST API path.
   * @returns {RelayResponse} - A Relay Response object.
   * @memberof Pocket
   */
  public async sendRelay(
    data: string,
    blockchain: string,
    pocketAAT: PocketAAT,
    configuration: Configuration = this.configuration,
    headers?: RelayHeaders,
    method = "",
    path = "",
    node?: Node
  ): Promise<RelayResponse | RpcError> {
    try {
      // Get the current session
      const currentSessionOrError = await this.sessionManager.getCurrentSession(pocketAAT.applicationPublicKey, blockchain, configuration)

      if (typeGuard(currentSessionOrError, RpcError)) {
        return currentSessionOrError as RpcError
      }

      // Set the currentSession
      const currentSession = currentSessionOrError as Session

      // Determine the service node
      let serviceNode: Node
      // Provide a random service node from the session
      if (node !== undefined) {
        if (currentSession.isNodeInSession(node)) {
          serviceNode = node as Node
        } else {
          return new RpcError("0", "Provided Node is not part of the current session for this application, check your PocketAAT")
        }
      } else {
        const serviceNodeOrError = currentSession.getSessionNode()
        if (typeGuard(serviceNodeOrError, Error)) {
          return RpcError.fromError(serviceNodeOrError as Error)
        }
        serviceNode = serviceNodeOrError as Node
      }

      // Final Service Node check
      if (serviceNode === undefined) {
        return new RpcError("0", "Could not determine a Service Node to submit this relay")
      }

      // Create Relay Payload
      const relayPayload = new RelayPayload(data, method, path, headers)

      // Check if account is available for signing
      const clientAddressHex = addressFromPublickey(Buffer.from(pocketAAT.clientPublicKey, 'hex')).toString("hex")
      const isUnlocked = await this.keybase.isUnlocked(clientAddressHex)
      if (!isUnlocked) {
        return new RpcError("0", "Client account " + clientAddressHex + " for this AAT is not unlocked")
      }

      // Produce signature payload
      const entropy = BigInt(Math.floor(Math.random() * 99999999999999999))
      const proofBytes = RelayProof.bytes(
        entropy,
        currentSession.sessionHeader.sessionBlockHeight,
        serviceNode.publicKey,
        blockchain,
        pocketAAT
      )

      // Sign
      const signatureOrError = await this.keybase.signWithUnlockedAccount(clientAddressHex, proofBytes)
      if (typeGuard(signatureOrError, Error)) {
        return new RpcError("0", "Error signing Relay proof")
      }
      const signature = signatureOrError as Buffer
      const signatureHex = signature.toString("hex")

      // Produce RelayProof
      const relayProof = new RelayProof(
        entropy,
        currentSession.sessionHeader.sessionBlockHeight,
        serviceNode.publicKey,
        blockchain,
        pocketAAT,
        signatureHex
      )

      // Relay to be sent
      const relay = new RelayRequest(relayPayload, relayProof)
      // Send relay
      return await this.rpc.client.relay(
        relay
      )
    } catch (error) {
      return error
    }
  }


  /**
   * Creates an ITransactionSender given a private key
   * @param privateKey {Buffer | string}
   */
  public withPrivateKey(privateKey: Buffer | string): ITransactionSender | Error {
    try {
      const privKeyBuffer = typeGuard(privateKey, Buffer) ? privateKey as Buffer : Buffer.from(privateKey as string, 'hex')
      if (!validatePrivateKey(privKeyBuffer)) {
        throw new Error("Invalid private key")
      }
      const pubKey = publicKeyFromPrivate(privKeyBuffer)
      const unlockedAccount = new UnlockedAccount(new Account(pubKey, ''), privKeyBuffer)
      return new TransactionSender(this, unlockedAccount)
    } catch (err) {
      return err
    }
  }

  /**
   * Creates an ITransactionSender given an already imported account into this instanc keybase
   * @param address {Buffer | string} address of the account
   * @param passphrase {string} passphrase for the account
   */
  public async withImportedAccount(address: Buffer | string, passphrase: string): Promise<ITransactionSender | Error> {
    const unlockedAccountOrError = await this.keybase.getUnlockedAccount(
      typeGuard(address, "string") ? address as string : (address as Buffer).toString("hex"),
      passphrase)

    if (typeGuard(unlockedAccountOrError, Error)) {
      return unlockedAccountOrError as Error
    } else {
      return new TransactionSender(this, (unlockedAccountOrError as UnlockedAccount))
    }
  }

  /**
   * Creates an ITransactionSender given a {TransactionSigner} function
   * @param txSigner {TransactionSigner} Function which will sign the transaction bytes
   */
  public withTxSigner(txSigner: TransactionSigner): ITransactionSender | Error {
    try {
      return new TransactionSender(this, undefined, txSigner)
    } catch (err) {
      return err
    }
  }
}

export * from "pocket-aat-js"