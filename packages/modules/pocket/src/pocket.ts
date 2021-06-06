import { Configuration } from "@pokt-network/pocket-js-configuration"
import { RelayHeaders, RelayResponse } from "@pokt-network/pocket-js-relay-models"
import { ConsensusRelayResponse, ConsensusNode, ChallengeResponse, Node } from "@pokt-network/pocket-js-rpc-models"
import { validatePrivateKey, publicKeyFromPrivate, typeGuard, RpcError } from "@pokt-network/pocket-js-utils"
import { SessionManager } from "@pokt-network/pocket-js-session-manager"
import { IRPCProvider, HttpRpcProvider } from "@pokt-network/pocket-js-http-provider"
import { UnlockedAccount, Account, Keybase } from "@pokt-network/pocket-js-keybase"
import { PocketAAT } from "@pokt-network/aat-js"
import { IKVStore, InMemoryKVStore } from "@pokt-network/pocket-js-storage"
import { TransactionSigner, ITransactionSender, TransactionSender } from "@pokt-network/pocket-js-transactions"
import { HTTPMethod, Relayer } from "@pokt-network/pocket-js-relayer"
import { Query } from "@pokt-network/pocket-js-query"

/**
 *
 *
 * @class Pocket
 */
export class Pocket {
  public readonly configuration: Configuration
  public readonly keybase: Keybase
  public readonly sessionManager: SessionManager
  private relayer?: Relayer
  private query?: Query

  /**
   * Creates an instance of Pocket.
   * @param {URL} dispatchers - Array holding the initial dispatcher url(s).
   * @param {IRPCProvider} rpcProvider - Provider which will be used to reach out to the Pocket Core RPC interface.
   * @param {Configuration} configuration - Configuration object.
   * @param {IKVStore} store - Save data using a Key/Value relationship. This object save information in memory.
   * @memberof Pocket
   */
  constructor(
    dispatchers: URL[],
    configuration: Configuration = new Configuration(),
    store: IKVStore = new InMemoryKVStore()
  ) {
    this.configuration = configuration
    this.sessionManager = new SessionManager(dispatchers, configuration, store)
    this.keybase = new Keybase(store)

    if (dispatchers.length > 0) {
      // Select a random dispatcher for the provider
      const dispatcher = dispatchers[Math.floor(Math.random() * dispatchers.length)];
      const rpcProvider = new HttpRpcProvider(dispatcher)

      this.relayer = new Relayer(dispatchers)
      this.query = new Query(rpcProvider)
    } else {
      throw new Error("No dispatchers provided, please try again with at least 1.")
    }

  }

  /**
   * Returns the Session Manager's routing table dispatcher's count
   * @returns {Number} - Dispatcher's count.
   * @memberof Pocket
   */
  public getDispatchersCount() {
    return this.sessionManager.getDispatchersCount()
  }

  /**
   * Creates a new instance of the RPC Query if you set an IRPCProvider or return the previous existing instance
   * @param {IRPCProvider} rpcProvider - Provider which will be used to reach out to the Pocket Core RPC interface.
   * @returns {RPC} - A RPC object.
   * @memberof Pocket
   */
  public Query(rpcProvider?: IRPCProvider): Query | undefined {
    if (rpcProvider !== undefined) {
      this.query = new Query(rpcProvider)
    }

    if (this.query !== undefined) {
      return this.query
    }
  }

  /**
   * Creates a new instance of the Relayer if you provide a list of dispatchers or returns the previous existing instance
   * @param {URL[]} dispatchers - List of dispatchers.
   * @returns {Relayer | undefined} - The Relayer instance or undefined.
   * @memberof Pocket
   */
  public Relayer(dispatchers?: URL[]): Relayer | undefined {
    if (dispatchers !== undefined && dispatchers.length > 0) {
      this.relayer = new Relayer(dispatchers)
    }

    if (this.relayer !== undefined) {
      return this.relayer
    }
  }

  /**
   *
   * Sends a Relay Request to multiple nodes for manual consensus
   * @param {string} data - string holding the json rpc call.
   * @param {string} blockchain - Blockchain hash.
   * @param {PocketAAT} pocketAAT - Pocket Authentication Token.
   * @param {Configuration} configuration - Pocket configuration object.
   * @param {RelayHeaders} headers - (Optional) An object holding the HTTP Headers.
   * @param {HTTPMethod} method - (Optional) HTTP method for REST API calls.
   * @param {string} path - (Optional) REST API path.
   * @param {Node} node - (Optional) Session node which will receive the Relay.
   * @returns {ConsensusRelayResponse | ChallengeResponse | Error} - A Consensus Relay Response object, Challenge response or error.
   * @memberof Pocket
   */
  public async sendConsensusRelay(
    data: string,
    blockchain: string,
    pocketAAT: PocketAAT,
    configuration: Configuration = this.configuration,
    headers?: RelayHeaders,
    method: HTTPMethod = HTTPMethod.NA,
    path = "",
    node?: Node
  ): Promise<ConsensusRelayResponse | ChallengeResponse | RpcError> {
    try {
      if (this.relayer === undefined) {
        return new RpcError("NA","Failed to send the relay, the Relayer isn't set.")
      }
      const consensusRelayResponse = await this.relayer.sendConsensusRelay(data, blockchain, pocketAAT, configuration, headers, method, path, node)

      return consensusRelayResponse;

    } catch (error) {
      return RpcError.fromError(error);
    }
  }
  /**
   *
   * Sends a Relay Request
   * @param {string} data - string holding the json rpc call.
   * @param {string} blockchain - Blockchain hash.
   * @param {PocketAAT} pocketAAT - Pocket Authentication Token.
   * @param {Configuration} configuration - Pocket configuration object.
   * @param {RelayHeaders} headers - (Optional) An object holding the HTTP Headers.
   * @param {HTTPMethod} method - (Optional) HTTP method for REST API calls.
   * @param {string} path - (Optional) REST API path.
   * @param {Node} node - (Optional) Session node which will receive the Relay.
   * @param {boolean} consensusEnabled - (Optional) True or false if the relay will be sent to multiple nodes for consensus, default is false.
   * @returns {RelayResponse | ConsensusNode | Error} - A Relay Response, Consensus Node for Consensus Relay or an Error.
   * @memberof Pocket
   */
  public async sendRelay(
    data: string,
    blockchain: string,
    pocketAAT: PocketAAT,
    headers?: RelayHeaders,
    method: HTTPMethod = HTTPMethod.NA,
    path = "",
    node?: Node,
    consensusEnabled: boolean = false
  ): Promise<RelayResponse | ConsensusNode | RpcError> {
    try {
      if (this.relayer === undefined) {
        return new RpcError("NA","Failed to send the relay, the Relayer isn't set.")
      }
      const relayResponse = await this.relayer.send(data, blockchain, pocketAAT, headers, method, path, node, consensusEnabled)

      return relayResponse;

    } catch (error) {
      return RpcError.fromError(error);
    }
  }

  /**
   * Creates an ITransactionSender given a private key
   * @param {Buffer | string} privateKey 
   * @returns {ITransactionSender} - Interface with all the possible MsgTypes in a Pocket Network transaction and a function to submit the transaction to the network.
   * @memberof Pocket
   */
  public withPrivateKey(privateKey: Buffer | string): ITransactionSender | Error {
    try {
      const privKeyBuffer = typeGuard(privateKey, Buffer) ? privateKey as Buffer : Buffer.from(privateKey as string, 'hex')
      if (!validatePrivateKey(privKeyBuffer)) {
        throw new Error("Invalid private key")
      }
      const pubKey = publicKeyFromPrivate(privKeyBuffer)
      const unlockedAccount = new UnlockedAccount(new Account(pubKey, ''), privKeyBuffer)

      // Select a random dispatcher for the provider
      return new TransactionSender(this.query?.rpcProvider!, unlockedAccount)
    } catch (err) {
      return err
    }
  }

  /**
   * Creates an ITransactionSender given an already imported account into this instanc keybase
   * @param {Buffer | string} address - address of the account
   * @param {string} passphrase - passphrase for the account
   * @returns {ITransactionSender} - Interface with all the possible MsgTypes in a Pocket Network transaction and a function to submit the transaction to the network.
   * @memberof Pocket
   */
  public async withImportedAccount(address: Buffer | string, passphrase: string): Promise<ITransactionSender | Error> {
    const unlockedAccountOrError = await this.keybase.getUnlockedAccount(
      typeGuard(address, "string") ? address as string : (address as Buffer).toString("hex"),
      passphrase)

    if (typeGuard(unlockedAccountOrError, Error)) {
      return unlockedAccountOrError as Error
    } else {
      return new TransactionSender(this.query?.rpcProvider!, (unlockedAccountOrError as UnlockedAccount))
    }
  }

  /**
   * Creates an ITransactionSender given a {TransactionSigner} function
   * @param {TransactionSigner} txSigner - Function which will sign the transaction bytes
   * @returns {ITransactionSender} - Interface with all the possible MsgTypes in a Pocket Network transaction and a function to submit the transaction to the network.
   * @memberof Pocket
   */
  public withTxSigner(txSigner: TransactionSigner): ITransactionSender | Error {
    try {
      return new TransactionSender(this.query?.rpcProvider!, undefined, txSigner)
    } catch (err) {
      return err
    }
  }
}

export * from "@pokt-network/aat-js"