import { Configuration } from "./models/configuration"
import { Node } from "./models/node"
import { RequestManager } from "./request-manager"
import { RelayPayload, RelayHeaders } from "./models/input/relay-payload"
import { RelayRequest } from "./models/input/relay-request"
import { Proof } from "./models/proof"
import { typeGuard } from "./utils/type-guard"
import { RelayResponse } from "./models/output/relay-response"
import { SessionManager } from "./utils/session-manager"
import { SessionHeader } from "./models/input/session-header"
import { QuerySessionBlockResponse } from "./models/output/query-session-block-response"
import { RpcErrorResponse } from "./models/output/rpc-error-response"
import { Session } from "./models/output/session"
import { Keybase } from "./keybase/keybase"
import { Account } from "./models/account"
import { Routing } from "./models/routing"
import { QueryBlockResponse } from "./models/output/query-block-response"
import { QueryTXResponse } from "./models/output/query-tx-response"
import { QueryHeightResponse } from "./models/output/query-height-response"
import { QueryBalanceResponse } from "./models/output/query-balance-response"
import { StakingStatus } from "./utils/enums"
import { QueryNodesResponse } from "./models/output/query-nodes-response"
import { QueryNodeResponse } from "./models/output/query-node-response"
import { QueryNodeParamsResponse } from "./models/output/query-node-params-response"
import { QueryNodeProofsResponse } from "./models/output/query-node-proofs-response"
import { NodeProof } from "./models/input/node-proof"
import { QueryNodeProofResponse } from "./models/output/query-node-proof-response"
import { QueryAppsResponse } from "./models/output/query-apps-response"
import { QueryAppResponse } from "./models/output/query-app-response"
import { QueryAppParamsResponse } from "./models/output/query-app-params-response"
import { QueryPocketParamsResponse } from "./models/output/query-pocket-params-response"
import { QuerySupportedChainsResponse } from "./models/output/query-supported-chains-response"
import { QuerySupplyResponse } from "./models/output/query-supply-response"
import { InMemoryKVStore, addressFromPublickey, Hex, validatePrivateKey, publicKeyFromPrivate } from "./utils"
import { PocketAAT } from "pocket-aat-js"
import { sha3_256 } from "js-sha3"
import { RawTxResponse } from "./models/output/raw-tx-response"
import { CoinDenom } from "./models/coin-denom"
import { MsgSend, MsgAppStake, MsgAppUnstake, MsgAppUnjail, MsgNodeStake, MsgNodeUnstake, MsgNodeUnjail } from "./models/amino/msgs"
import { StdSignDoc } from "./models/amino/std-sign-doc"
import { TxSignature } from "./models/amino/tx-signature"
import { StdTx } from "./models/amino/std-tx"
import { TxMsg } from "./models/amino/msgs/tx-msg"
import { ITransactionSender } from "./transactions/transaction-sender"
import { TransactionSignature, TransactionSigner } from "./transactions/transaction-signer"
import { UnlockedAccount } from "./models"
import { QueryAccountResponse } from "./models/output/query-account-response"

/**
 *
 *
 * @class Pocket
 */
export class Pocket {
  /**
   * Annonymous class which handles TxMsg encoding and Transaciton submission to the Network
   */
  private static TransactionSender = class implements ITransactionSender {
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
      node: Node,
      fee: string,
      feeDenom?: CoinDenom,
      memo?: string,
      configuration?: Configuration
    ): Promise<RawTxResponse | RpcErrorResponse> {
      try {
        if (this.txMsgErrors.length === 1) {
          return RpcErrorResponse.fromError(this.txMsgErrors[0])
        } else if (this.txMsgErrors.length > 1) {
          return new RpcErrorResponse("0", this.txMsgErrors[0].message + " and another " + (this.txMsgErrors.length - 1) + " errors")
        }

        if (this.txMgs.length === 0) {
          return new RpcErrorResponse("0", "No messages configured for this transaction")
        }
        const stdSignDoc = new StdSignDoc(accountNumber, sequence, chainId, this.txMgs, fee, feeDenom, memo)
        let txSignatureOrError
        const bytesToSign = stdSignDoc.marshalAmino()
        if (typeGuard(this.unlockedAccount, UnlockedAccount)) {
          txSignatureOrError = this.signWithUnlockedAccount(bytesToSign, this.unlockedAccount as UnlockedAccount)
        } else if (this.txSigner !== undefined) {
          txSignatureOrError = this.signWithTrasactionSigner(bytesToSign, this.txSigner as TransactionSigner)
        } else {
          return new RpcErrorResponse("0", "No account or TransactionSigner specified")
        }

        if (!typeGuard(txSignatureOrError, TxSignature)) {
          return new RpcErrorResponse("0", "Error generating signature for transaction")
        }

        const txSignature = txSignatureOrError as TxSignature
        const addressHex = addressFromPublickey(txSignature.pubKey)
        const transaction = new StdTx(stdSignDoc, [txSignature])
        const encodedTxBytes = transaction.marshalAmino()
        // Clean messages accumulated on submit
        this.txMgs = []
        return this.pocket.sendRawTx(addressHex, encodedTxBytes, node, configuration)
      } catch (error) {
        return error
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
      amount: string,
      amountDenom?: CoinDenom
    ): ITransactionSender {
      try {
        this.txMgs.push(new MsgSend(fromAddress, toAddress, amount, amountDenom))
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
  public readonly configuration: Configuration
  private readonly sessionManager: SessionManager
  private readonly routingTable: Routing
  private readonly keybase: Keybase = new Keybase(new InMemoryKVStore())

  /**
   * Creates an instance of Pocket.
   * @param {Object} opts - Options for the initializer, devID, networkName, netIDs, maxNodes, requestTimeOut.
   * @memberof Pocket
   */
  constructor(
    configuration: Configuration,
  ) {
    this.configuration = configuration
    try {
      this.routingTable = new Routing(configuration.nodes, configuration)
    } catch (error) {
      throw error
    }
    this.sessionManager = new SessionManager(this.routingTable)
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
    headers: RelayHeaders | null,
    pocketAAT: PocketAAT,
    configuration: Configuration = this.configuration,
    node?: Node,
    method = "",
    path = ""
  ): Promise<RelayResponse | Error> {
    try {
      // Relay Payload
      const relayPayload = new RelayPayload(data, method, path, headers)
      let activeNode

      if (node === undefined) {
        activeNode = this.getAnyNode()
      } else {
        activeNode = node
      }

      if (!typeGuard(activeNode, Node)) {
        return new Error(activeNode.message)
      }
      // Get block height
      const blockHeightResponse = await RequestManager.getHeight(
        activeNode,
        configuration
      )

      if (!typeGuard(blockHeightResponse, QueryHeightResponse)) {
        return new Error(blockHeightResponse.message)
      }
      // Get current session
      const sessionHeader = new SessionHeader(pocketAAT.applicationPublicKey, blockchain, blockHeightResponse.height)
      const currentSession = await this.sessionManager.getCurrentSession(sessionHeader, configuration)

      if (!typeGuard(currentSession, Session)) {
        return new Error(currentSession.message)
      }

      // Check if node is provided or retrieve one
      if (node !== undefined) {
        activeNode = node
      } else {
        // Session Node
        activeNode = currentSession.getSessionNode()
        if (!typeGuard(activeNode, Node)) {
          return activeNode
        }
      }

      // Create a Buffer from the applicationPublicKey in the pocketAAT
      const applicationPublicKeyBuffer = Buffer.from(pocketAAT.applicationPublicKey, 'hex')
      // Retrieve the addressHex from the publicKeyBuffer
      const addressHex = addressFromPublickey(applicationPublicKeyBuffer).toString("hex")
      // Create a proof object
      const proofIndex = BigInt(Math.floor(Math.random() * 99999999999999999))
      const relayProof = new Proof(
        proofIndex,
        currentSession.sessionHeader.sessionBlockHeight,
        activeNode.publicKey,
        blockchain,
        pocketAAT
      )
      // Generate sha3 hash of the relay proof object
      const hash = sha3_256.create()
      hash.update(JSON.stringify(relayProof.toJSON()))
      // Create a relay proof buffer
      const relayProofBuffer = Buffer.from(hash.hex(), 'hex')
      const signedRelayProof = await this.signWithUnlockedAccount(addressHex, relayProofBuffer)
      // Create a relay request with the new signature
      const proof = new Proof(
        proofIndex,
        currentSession.sessionHeader.sessionBlockHeight,
        activeNode.publicKey,
        blockchain,
        pocketAAT,
        signedRelayProof.toString("hex")
      )

      // Relay to be sent
      const relay = new RelayRequest(relayPayload, proof)
      // Send relay
      const relayResponse = await RequestManager.relay(
        relay,
        activeNode,
        configuration
      )
      // Increase session relay count
      // Return response
      if (!typeGuard(relayResponse, RelayResponse)) {
        return new Error(relayResponse.message)
      }
      return relayResponse
    } catch (error) {
      return error
    }
  }

  //
  // RPC Calls
  //

  /**
   *
   * Query a Block information
   * @param {BigInt} blockHeight - Block's number.
   * @param {Configuration} configuration - (Optional )Configuration object containing preferences information.
   * @param {Node} node - (Optional) Session node which will receive the Relay.
   * @memberof RequestManager
   */
  public async getBlock(
    blockHeight: BigInt,
    configuration = this.configuration,
    node?: Node
  ): Promise<QueryBlockResponse | Error> {
    let activeNode

    if (node === undefined) {
      activeNode = this.getAnyNode()
    } else {
      activeNode = node
    }

    // Check if node is Node.type
    if (!typeGuard(activeNode, Node)) {
      return new Error(activeNode.message)
    }
    // Retrieve the block information
    const blockHeightResponse = await RequestManager.getBlock(
      blockHeight,
      activeNode,
      configuration
    )

    if (!typeGuard(blockHeightResponse, QueryBlockResponse)) {
      return new Error(blockHeightResponse.message)
    }
    return blockHeightResponse
  }
  /**
   *
   * Retrieves a transaction information
   * @param {string} txHash - Transaction hash.
   * @param {Configuration} configuration - (Optional )Configuration object containing preferences information.
   * @param {Node} node - (Optional) Session node which will receive the Relay.
   * @memberof Pocket
   */
  public async getTX(
    txHash: string,
    configuration = this.configuration,
    node?: Node
  ): Promise<QueryTXResponse | Error> {
    let activeNode
    
    if (!Hex.isHex(txHash) && Hex.byteLength(txHash) !== 20) {
      return new Error("Invalid Address Hex")
    }

    if (node === undefined) {
      activeNode = this.getAnyNode()
    } else {
      activeNode = node
    }

    // Check if node is Node.type
    if (!typeGuard(activeNode, Node)) {
      return new Error(activeNode.message)
    }
    // Retrieve the transaction by hash
    const txResponse = await RequestManager.getTX(txHash, activeNode, configuration)

    if (!typeGuard(txResponse, QueryTXResponse)) {
      return new Error(txResponse.message)
    }
    return txResponse
  }
  /**
   *
   * Get the specified account information
   * @param {Configuration} configuration - (Optional )Configuration object containing preferences information.
   * @param {Node} node - (Optional) Session node which will receive the Relay.
   * @memberof RequestManager
   */
  public async queryGetAccount(
    address: string,
    configuration = this.configuration,
    node?: Node
  ): Promise<QueryAccountResponse | Error> {
    let activeNode

    if (!Hex.isHex(address) && Hex.byteLength(address) !== 20) {
      return new Error("Invalid Address Hex")
    }

    if (node === undefined) {
      activeNode = this.getAnyNode()
    } else {
      activeNode = node
    }

    // Check if node is Node.type
    if (!typeGuard(activeNode, Node)) {
      return new Error(activeNode.message)
    }
    // Retrieve the account information
    const queryAccountResponse = await RequestManager.getAccount(address, activeNode, configuration)

    if (!typeGuard(queryAccountResponse, QueryAccountResponse)) {
      return new Error(queryAccountResponse.message)
    }
    return queryAccountResponse
  }
  /**
   *
   * Get the current network block height
   * @param {Configuration} configuration - (Optional )Configuration object containing preferences information.
   * @param {Node} node - (Optional) Session node which will receive the Relay.
   * @memberof RequestManager
   */
  public async getHeight(
    configuration = this.configuration,
    node?: Node
  ): Promise<QueryHeightResponse | Error> {
    let activeNode

    if (node === undefined) {
      activeNode = this.getAnyNode()
    } else {
      activeNode = node
    }

    // Check if node is Node.type
    if (!typeGuard(activeNode, Node)) {
      return new Error(activeNode.message)
    }
    // Retrieve the current block height
    const queryHeightResponse = await RequestManager.getHeight(activeNode, configuration)

    if (!typeGuard(queryHeightResponse, QueryHeightResponse)) {
      return new Error(queryHeightResponse.message)
    }
    return queryHeightResponse
  }
  /**
   *
   * Retrieves an account balance
   * @param {string} address - Account's address.
   * @param {BigInt} blockHeight - Block's number.
   * @param {Configuration} configuration - (Optional )Configuration object containing preferences information.
   * @param {Node} node - (Optional) Session node which will receive the Relay.
   * @memberof Pocket
   */
  public async getBalance(
    address: string,
    blockHeight: BigInt,
    configuration = this.configuration,
    node?: Node
  ): Promise<QueryBalanceResponse | Error> {
    let activeNode

    if (!Hex.isHex(address) && Hex.byteLength(address) !== 20) {
      return new Error("Invalid Address Hex")
    }

    if (node === undefined) {
      activeNode = this.getAnyNode()
    } else {
      activeNode = node
    }

    // Check if node is Node.type
    if (!typeGuard(activeNode, Node)) {
      return new Error(activeNode.message)
    }
    // Retrieve the address current balance
    const balanceResponse = await RequestManager.getBalance(
      address,
      blockHeight,
      activeNode,
      configuration
    )

    if (!typeGuard(balanceResponse, QueryBalanceResponse)) {
      return new Error(balanceResponse.message)
    }
    return balanceResponse
  }
  /**
   *
   * Retrieves a list of nodes
   * @param {StakingStatus} stakingStatus - Staking status.
   * @param {BigInt} blockHeight - Block's number.
   * @param {Configuration} configuration - (Optional )Configuration object containing preferences information.
   * @param {Node} node - (Optional) Session node which will receive the Relay.
   * @memberof RequestManager
   */
  public async getNodes(
    stakingStatus: StakingStatus,
    blockHeight: BigInt,
    configuration = this.configuration,
    node?: Node
  ): Promise<QueryNodesResponse | Error> {
    let activeNode

    if (node === undefined) {
      activeNode = this.getAnyNode()
    } else {
      activeNode = node
    }

    // Check if node is Node.type
    if (!typeGuard(activeNode, Node)) {
      return new Error(activeNode.message)
    }
    // Retrieve a list of nodes
    const nodesResponse = await RequestManager.getNodes(
      stakingStatus,
      blockHeight,
      activeNode,
      configuration
    )

    if (!typeGuard(nodesResponse, QueryNodesResponse)) {
      return new Error(nodesResponse.message)
    }
    return nodesResponse
  }
  /**
   *
   * Query a Node information
   * @param {string} address - Node address.
   * @param {BigInt} blockHeight - Block's number.
   * @param {Configuration} configuration - (Optional )Configuration object containing preferences information.
   * @param {Node} node - (Optional) Session node which will receive the Relay.
   * @memberof Pocket
   */
  public async getNode(
    address: string,
    blockHeight: BigInt,
    configuration = this.configuration,
    node?: Node
  ): Promise<QueryNodeResponse | Error> {
    let activeNode

    if (!Hex.isHex(address) && Hex.byteLength(address) !== 20) {
      return new Error("Invalid Address Hex")
    }

    if (node === undefined) {
      activeNode = this.getAnyNode()
    } else {
      activeNode = node
    }

    // Check if node is Node.type
    if (!typeGuard(activeNode, Node)) {
      return new Error(activeNode.message)
    }
    // Retrieve a node information
    const nodeResponse = await RequestManager.getNode(
      address,
      blockHeight,
      activeNode,
      configuration
    )

    if (!typeGuard(nodeResponse, QueryNodeResponse)) {
      return new Error(nodeResponse.message)
    }
    return nodeResponse
  }
  /**
   *
   * Retrieves the node params
   * @param {BigInt} blockHeight - Block's number.
   * @param {Configuration} configuration - (Optional )Configuration object containing preferences information.
   * @param {Node} node - (Optional) Session node which will receive the Relay.
   * @memberof Pocket
   */
  public async getNodeParams(
    blockHeight: BigInt,
    configuration = this.configuration,
    node?: Node
  ): Promise<QueryNodeParamsResponse | Error> {
    let activeNode

    if (node === undefined) {
      activeNode = this.getAnyNode()
    } else {
      activeNode = node
    }

    // Check if node is Node.type
    if (!typeGuard(activeNode, Node)) {
      return new Error(activeNode.message)
    }
    // Retrieve the node params
    const nodeParamsResponse = await RequestManager.getNodeParams(
      blockHeight,
      activeNode,
      configuration
    )

    if (!typeGuard(nodeParamsResponse, QueryNodeParamsResponse)) {
      return new Error(nodeParamsResponse.message)
    }
    return nodeParamsResponse
  }
  /**
   *
   * Retrieves the node proofs information
   * @param {string} address - Node's address.
   * @param {BigInt} blockHeight - Block's number.
   * @param {Configuration} configuration - (Optional )Configuration object containing preferences information.
   * @param {Node} node - (Optional) Session node which will receive the Relay.
   * @memberof Pocket
   */
  public async getNodeProofs(
    address: string,
    blockHeight: BigInt,
    configuration = this.configuration,
    node?: Node
  ): Promise<QueryNodeProofsResponse | Error> {
    let activeNode

    if (!Hex.isHex(address) && Hex.byteLength(address) !== 20) {
      return new Error("Invalid Address Hex")
    }

    if (node === undefined) {
      activeNode = this.getAnyNode()
    } else {
      activeNode = node
    }

    // Check if node is Node.type
    if (!typeGuard(activeNode, Node)) {
      return new Error(activeNode.message)
    }
    // Retrieve a node proofs
    const nodeProofsResponse = await RequestManager.getNodeProofs(
      address,
      blockHeight,
      activeNode,
      configuration
    )

    if (!typeGuard(nodeProofsResponse, QueryNodeProofsResponse)) {
      return new Error(nodeProofsResponse.message)
    }
    return nodeProofsResponse
  }
  /**
   *
   * Retrieves the node proof information
   * @param {NodeProof} nodeProof - Node's address.
   * @param {Configuration} configuration - (Optional )Configuration object containing preferences information.
   * @param {Node} node - (Optional) Session node which will receive the Relay.
   * @memberof RequestManager
   */
  public async getNodeProof(
    nodeProof: NodeProof,
    configuration = this.configuration,
    node?: Node
  ): Promise<QueryNodeProofResponse | Error> {
    let activeNode

    if (!nodeProof.isValid()) {
      return new Error("Invalid Address Hex")
    }

    if (node === undefined) {
      activeNode = this.getAnyNode()
    } else {
      activeNode = node
    }

    // Check if node is Node.type
    if (!typeGuard(activeNode, Node)) {
      return new Error(activeNode.message)
    }
    // Retrieve a node proof
    const nodeProofResponse = await RequestManager.getNodeProof(
      nodeProof,
      activeNode,
      configuration
    )

    if (!typeGuard(nodeProofResponse, QueryNodeProofResponse)) {
      return new Error(nodeProofResponse.message)
    }
    return nodeProofResponse
  }
  /**
   *
   * Retrieves a list of apps
   * @param {StakingStatus} stakingStatus - Staking status.
   * @param {BigInt} blockHeight - Block's number.
   * @param {Configuration} configuration - (Optional )Configuration object containing preferences information.
   * @param {Node} node - (Optional) Session node which will receive the Relay.
   * @memberof Pocket
   */
  public async getApps(
    stakingStatus: StakingStatus,
    blockHeight: BigInt,
    configuration = this.configuration,
    node?: Node
  ): Promise<QueryAppsResponse | Error> {
    let activeNode

    if (node === undefined) {
      activeNode = this.getAnyNode()
    } else {
      activeNode = node
    }

    // Check if node is Node.type
    if (!typeGuard(activeNode, Node)) {
      return new Error(activeNode.message)
    }
    // Retrieve a list of apps
    const appsResponse = await RequestManager.getApps(
      stakingStatus,
      blockHeight,
      activeNode,
      configuration
    )

    if (!typeGuard(appsResponse, QueryAppsResponse)) {
      return new Error(appsResponse.message)
    }
    return appsResponse
  }
  /**
   *
   * Retrieves an app information
   * @param {string} address - Address of the app.
   * @param {BigInt} blockHeight - Block's number.
   * @param {Configuration} configuration - (Optional )Configuration object containing preferences information.
   * @param {Node} node - (Optional) Session node which will receive the Relay.
   * @memberof Pocket
   */
  public async getApp(
    address: string,
    blockHeight: BigInt,
    configuration = this.configuration,
    node?: Node
  ): Promise<QueryAppResponse | Error> {
    let activeNode

    if (!Hex.isHex(address) && Hex.byteLength(address) !== 20) {
      return new Error("Invalid Address Hex")
    }

    if (node === undefined) {
      activeNode = this.getAnyNode()
    } else {
      activeNode = node
    }

    // Check if node is Node.type
    if (!typeGuard(activeNode, Node)) {
      return new Error(activeNode.message)
    }
    // Retrieve an app
    const appResponse = await RequestManager.getApp(
      address,
      blockHeight,
      activeNode,
      configuration
    )

    if (!typeGuard(appResponse, QueryAppResponse)) {
      return new Error(appResponse.message)
    }
    return appResponse
  }
  /**
   *
   * Retrieves app params.
   * @param {BigInt} blockHeight - Block's number.
   * @param {Configuration} configuration - (Optional )Configuration object containing preferences information.
   * @param {Node} node - (Optional) Session node which will receive the Relay.
   * @memberof Pocket
   */
  public async getAppParams(
    blockHeight: BigInt,
    configuration = this.configuration,
    node?: Node
  ): Promise<QueryAppParamsResponse | Error> {
    let activeNode

    if (node === undefined) {
      activeNode = this.getAnyNode()
    } else {
      activeNode = node
    }

    // Check if node is Node.type
    if (!typeGuard(activeNode, Node)) {
      return new Error(activeNode.message)
    }
    // Retrieve the app params
    const appParamsResponse = await RequestManager.getAppParams(
      blockHeight,
      activeNode,
      configuration
    )

    if (!typeGuard(appParamsResponse, QueryAppParamsResponse)) {
      return new Error(appParamsResponse.message)
    }
    return appParamsResponse
  }
  /**
   *
   * Retrieves the pocket params.
   * @param {BigInt} blockHeight - Block's number.
   * @param {Configuration} configuration - (Optional )Configuration object containing preferences information.
   * @param {Node} node - (Optional) Session node which will receive the Relay.
   * @memberof Pocket
   */
  public async getPocketParams(
    blockHeight: BigInt,
    configuration = this.configuration,
    node?: Node
  ): Promise<QueryPocketParamsResponse | Error> {
    let activeNode

    if (node === undefined) {
      activeNode = this.getAnyNode()
    } else {
      activeNode = node
    }

    // Check if node is Node.type
    if (!typeGuard(activeNode, Node)) {
      return new Error(activeNode.message)
    }
    // Retrieve the pocket params
    const pocketParamsResponse = await RequestManager.getPocketParams(
      blockHeight,
      activeNode,
      configuration
    )

    if (!typeGuard(pocketParamsResponse, QueryPocketParamsResponse)) {
      return new Error(pocketParamsResponse.message)
    }
    return pocketParamsResponse
  }
  /**
   *
   * Retrieves supported chains
   * @param {BigInt} blockHeight - Block's number.
   * @param {Configuration} configuration - (Optional )Configuration object containing preferences information.
   * @param {Node} node - (Optional) Session node which will receive the Relay.
   * @memberof Pocket
   */
  public async getSupportedChains(
    blockHeight: BigInt,
    configuration = this.configuration,
    node?: Node
  ): Promise<QuerySupportedChainsResponse | Error> {
    let activeNode

    if (node === undefined) {
      activeNode = this.getAnyNode()
    } else {
      activeNode = node
    }

    // Check if node is Node.type
    if (!typeGuard(activeNode, Node)) {
      return new Error(activeNode.message)
    }
    // Retrieve a list of supported chains
    const supportedChainsResponse = await RequestManager.getSupportedChains(
      blockHeight,
      activeNode,
      configuration
    )

    if (!typeGuard(supportedChainsResponse, QuerySupportedChainsResponse)) {
      return new Error(supportedChainsResponse.message)
    }
    return supportedChainsResponse
  }
  /**
   *
   * Retrieves current supply information
   * @param {BigInt} blockHeight - Block's number.
   * @param {Configuration} configuration - (Optional )Configuration object containing preferences information.
   * @param {Node} node - (Optional) Session node which will receive the Relay.
   * @memberof Pocket
   */
  public async getSupply(
    blockHeight: BigInt,
    configuration = this.configuration,
    node?: Node
  ): Promise<QuerySupplyResponse | Error> {
    let activeNode

    if (node === undefined) {
      activeNode = this.getAnyNode()
    } else {
      activeNode = node
    }

    // Check if node is Node.type
    if (!typeGuard(activeNode, Node)) {
      return new Error(activeNode.message)
    }
    // Retrieve a supply information
    const supplyResponse = await RequestManager.getSupply(
      blockHeight,
      activeNode,
      configuration
    )

    if (!typeGuard(supplyResponse, QuerySupplyResponse)) {
      return new Error(supplyResponse.message)
    }
    return supplyResponse
  }

  /**
   * Submits a Raw Encoded and Amino Signed transaction to the network
   * @param fromAddress {Buffer | string} The address of the sender
   * @param tx {Buffer | string} The amino encoded transaction bytes
   * @param node {Node}
   * @param configuration {Configuration | undefined}
   * @memberof Pocket
   */
  public async sendRawTx(
    fromAddress: Buffer | string,
    tx: Buffer | string,
    node: Node,
    configuration?: Configuration
  ): Promise<RawTxResponse | RpcErrorResponse> {
    return RequestManager.sendRawTx(fromAddress, tx, node, configuration ? configuration : this.configuration)
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
      return new Pocket.TransactionSender(this, unlockedAccount)
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
      return new Pocket.TransactionSender(this, (unlockedAccountOrError as UnlockedAccount))
    }
  }

  /**
   * Creates an ITransactionSender given a {TransactionSigner} function
   * @param txSigner {TransactionSigner} Function which will sign the transaction bytes
   */
  public withTxSigner(txSigner: TransactionSigner): ITransactionSender | Error {
    try {
      return new Pocket.TransactionSender(this, undefined, txSigner)
    } catch (err) {
      return err
    }
  }

  /**
   * Creates an account
   * @param {string} passphrase - Account passphrase.
   * @returns {Account} - Account.
   * @memberof Pocket
   */
  public async createAccount(passphrase: string): Promise<Account | Error> {
    return await this.keybase.createAccount(passphrase)
  }
  /**
   * Unlock an account for passphrase free signing of arbitrary payloads using `signWithUnlockedAccount`
   * @param addressHex The address of the account that will be unlocked in hex string format
   * @param passphrase The passphrase of the account to unlock
   * @param unlockPeriod The amount of time (in ms) the account is going to be unlocked, defaults to 10 minutes. Use 0 to keep it unlocked indefinetely
   * @memberof Pocket
   */
  public async unlockAccount(
    addressHex: string,
    passphrase: string,
    unlockPeriod = 600000
  ): Promise<Error | undefined> {
    return await this.keybase.unlockAccount(addressHex, passphrase, unlockPeriod)
  }
  /**
   * Signs a payload with an unlocked account stored in this keybase
   * @param {string} passphrase - Account passphrase.
   * @returns {Account} - Account.
   * @memberof Pocket
   */
  public async signWithUnlockedAccount(
    addressHex: string,
    payload: Buffer
  ): Promise<Buffer | Error> {
    return await this.keybase.signWithUnlockedAccount(addressHex, payload)
  }
  /**
   * Lists all the accounts stored in this keybase
   * @returns {Account} - List of Accounts.
   * @memberof Pocket
   */
  public async listAccounts(): Promise<Account[] | Error> {
    return await this.keybase.listAccounts()
  }
  /**
   * Retrieves a single account from this keybase
   * @param addressHex The address of the account to retrieve in hex string format
   */
  public async getAccount(addressHex: string): Promise<Account | Error> {
    return await this.keybase.getAccount(addressHex)
  }
  /**
   * Deletes an account stored in the keybase
   * @param addressHex The address of the account to delete in hex string format
   * @param passphrase The passphrase for the account in this keybase
   */
  public async deleteAccount(
    addressHex: string,
    passphrase: string
  ): Promise<Error | undefined> {
    return await this.keybase.deleteAccount(addressHex, passphrase)
  }
  /**
   *
   * @param addressHex The address of the account to update in hex string format
   * @param passphrase The passphrase of the account
   * @param newPassphrase The new passphrase that the account will be updated to
   */
  public async updateAccountPassphrase(
    addressHex: string,
    passphrase: string,
    newPassphrase: string
  ): Promise<Error | undefined> {
    return await this.keybase.updateAccountPassphrase(addressHex, passphrase, newPassphrase)
  }
  /**
   * Import account from the keybase using a passphrase.
   * @param {string} passphrase - Account passphrase.
   * @param {string} privateKey - Account privateKey.
   * @returns {Account} - Account.
   * @memberof Pocket
   */
  public async importAccount(
    passphrase: string,
    privateKey: string
  ): Promise<Account | Error> {
    const importedAccountOrError = await this.keybase.importAccount(
      Buffer.from(privateKey, "hex"),
      passphrase
    )
    return importedAccountOrError
  }
  /**
   * Import and unlock an account.
   * @param {string} passphrase - Account passphrase.
   * @param {string} privateKey - Account privateKey.
   * @returns {Account} - Account.
   * @memberof Pocket
   */
  public async importAndUnlockAccount(
    passphrase: string,
    privateKey: string,
    unlockPeriod = 600000
  ): Promise<Account | Error> {
    // Import account
    const importedAccount = await this.importAccount(passphrase, privateKey)
    // Check if importedAccount is not an Account type
    if (!typeGuard(importedAccount, Account)) {
      // return error
      return importedAccount
    }
    // Unlock account
    const unlockAccount = await this.unlockAccount(importedAccount.addressHex, passphrase, unlockPeriod)
    // Check if unlockAccount is not an Account type
    if (typeGuard(unlockAccount, Error)) {
      // return error
      return unlockAccount
    }
    return importedAccount
  }
  /**
   * Export account to retrieve the private key.
   * @param {Account} blockchain - Account object.
   * @param {string} passphrase - Account passphrase.
   * @returns {Buffer} - Private Key buffer.
   * @memberof Pocket
   */
  public async exportAccount(
    account: Account,
    passphrase: string
  ): Promise<Buffer | Error> {

    // Export the private key
    const privateKey = await this.keybase.exportAccount(
      account.addressHex,
      passphrase
    )
    // Check if is type Buffer
    if (!typeGuard(privateKey, Buffer)) {
      return privateKey
    }
    // Check private key length
    if (privateKey.length === 64) {
      return privateKey
    } else {
      return new Error("Failed to export account")
    }
  }
  /**
   * Get a node from the routing table.
   * @returns {Node} - New Node.
   * @memberof Pocket
   */
  private getAnyNode(): Node | RpcErrorResponse {
    return this.routingTable.getNode()
  }
}

export * from "pocket-aat-js"