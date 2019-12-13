import {Blockchain} from './models/blockchain';
import {Node} from './models/node';
import {Dispatch} from './models/dispatch';
/**
 *
 *
 * @class Configuration
 */
export class Configuration {
    public readonly devID: string;
    public readonly blockchains: Blockchain[];
    public readonly maxNodes: number = 5;
    public readonly requestTimeOut: number = 10000;
    public readonly sslOnly: boolean = true;
    public nodes: Node[] = [];
    public dispatcher?: Dispatch;
    /**
     * Configuration stores settings.
     * @constructor
     * @param {string} devID - Unique developer ID.
     * @param {string} blockchains - Blockchain class type list.
     * @param {string} maxNodes - (optional) Maximun amount of nodes to store in instance, default 5.
     * @param {string} requestTimeOut - (optional) Maximun timeout for every request in miliseconds, default 10000.
     * @param {string} sslOnly - (optional) Indicates if you prefer nodes with ssl enabled only, default is true.
     */
    constructor(devID: string, blockchains: Blockchain[], maxNodes: number, requestTimeOut: number, sslOnly: boolean) {
      this.devID = devID;
      this.blockchains = blockchains;
      this.maxNodes = maxNodes || 5;
      this.requestTimeOut = requestTimeOut || 10000;
      this.sslOnly = sslOnly || true;
    }
    /**
     * Verify if the nodes list is empty
     *
     * @returns {Boolean}
     * @memberof Configuration
     */
    nodesIsEmpty() {
      if (this.nodes == null || this.nodes.length == 0) {
        return true;
      } else {
        return false;
      }
    }
    setDispatcher(dispatcher: Dispatch) {
        this.dispatcher = dispatcher;
    }
    setNodes(nodes: Node[]) {
        this.nodes = nodes;
    }
  }