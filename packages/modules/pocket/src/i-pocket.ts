import { RpcError } from "@pokt-network/pocket-js-utils";
import { IRPCProvider } from "@pokt-network/pocket-js-http-provider";
import { PocketAAT } from "@pokt-network/aat-js";
import { Configuration } from "@pokt-network/pocket-js-configuration";
import { RelayHeaders, RelayResponse } from "@pokt-network/pocket-js-relay-models";
import { ConsensusRelayResponse, ChallengeResponse, ConsensusNode } from "@pokt-network/pocket-js-rpc-models";
import { Keybase } from "@pokt-network/pocket-js-keybase";
import { SessionManager } from "@pokt-network/pocket-js-session-manager";
import { ITransactionSender, TransactionSigner } from "@pokt-network/pocket-js-transactions";
import { Client } from "@pokt-network/pocket-js-rpc-client";
import { Query } from "@pokt-network/pocket-js-query";
import { HTTPMethod } from "@pokt-network/pocket-js-relayer";

/**
 * Interface indicating all the main functionalities supported for PocketJS
 */
export interface IPocket {
    readonly configuration: Configuration
    readonly keybase: Keybase
    readonly sessionManager: SessionManager
    client?: Client
    query?: Query

    /**
     * Returns the Session Manager's routing table dispatcher's count
     *
     * @returns {Number} - Dispatcher's count.
     * @memberof Pocket
     */
    getDispatchersCount(): number;

    /**
     * Creates a new instance of the RPC Query if you set an IRPCProvider or return the previous existing instance
     *
     * @param {IRPCProvider} rpcProvider - Provider which will be used to reach out to the Pocket Core RPC interface.
     * @returns {RPC} - A RPC object.
     * @memberof Pocket
     */
    setQuery(rpcProvider?: IRPCProvider): Query | undefined;

    /**
     * Creates a new instance of the Relayer if you set an IRPCProvider or return the previous existing instance
     *
     * @param {IRPCProvider} rpcProvider - Provider which will be used to reach out to send transactions and relays.
     * @returns {RPC} - A RPC object.
     * @memberof Pocket
     */
    setRelayer(rpcProvider?: IRPCProvider): Client | undefined
    
    /**
     *
     * Sends a Relay Request to multiple nodes for manual consensus
     *
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
    sendConsensusRelay(
        data: string,
        blockchain: string,
        pocketAAT: PocketAAT,
        configuration: Configuration,
        headers?: RelayHeaders,
        method?: HTTPMethod,
        path?: string,
        node?: Node
    ): Promise<ConsensusRelayResponse | ChallengeResponse | Error>;

    /**
     *
     * Sends a Relay Request
     *
     * @param {string} data - string holding the json rpc call.
     * @param {string} blockchain - Blockchain hash.
     * @param {PocketAAT} pocketAAT - Pocket Authentication Token.
     * @param {Configuration} configuration - Pocket configuration object.
     * @param {RelayHeaders} headers - (Optional) An object holding the HTTP Headers.
     * @param {HTTPMethod} method - (Optional) HTTP method for REST API calls.
     * @param {string} path - (Optional) REST API path.
     * @param {Node} node - (Optional) Session node which will receive the Relay.
     * @param {boolean} consensusEnabled - (Optional) True or false if the relay will be sent to multiple nodes for consensus, default is false.
     * @returns {RelayResponse} - A Relay Response object.
     * @memberof Pocket
     */
    sendRelay(
        data: string,
        blockchain: string,
        pocketAAT: PocketAAT,
        configuration: Configuration,
        headers?: RelayHeaders,
        method?: HTTPMethod,
        path?: string,
        node?: Node,
        consensusEnabled?: boolean
    ): Promise<RelayResponse | ConsensusNode | RpcError>


    /**
     * Creates an ITransactionSender given a private key
     *
     * @param {Buffer | string} privateKey 
     * @returns {ITransactionSender} - Interface with all the possible MsgTypes in a Pocket Network transaction and a function to submit the transaction to the network.
     * @memberof Pocket
     */
    withPrivateKey(privateKey: Buffer | string): ITransactionSender | Error

    /**
     * Creates an ITransactionSender given an already imported account into this instanc keybase
     *
     * @param {Buffer | string} address - address of the account
     * @param {string} passphrase - passphrase for the account
     * @returns {ITransactionSender} - Interface with all the possible MsgTypes in a Pocket Network transaction and a function to submit the transaction to the network.
     * @memberof Pocket
     */
    withImportedAccount(address: Buffer | string, passphrase: string): Promise<ITransactionSender | Error>
    
    /**
     * Creates an ITransactionSender given a {TransactionSigner} function
     *
     * @param {TransactionSigner} txSigner - Function which will sign the transaction bytes
     * @returns {ITransactionSender} - Interface with all the possible MsgTypes in a Pocket Network transaction and a function to submit the transaction to the network.
     * @memberof Pocket
     */
    withTxSigner(txSigner: TransactionSigner): ITransactionSender | Error
}
