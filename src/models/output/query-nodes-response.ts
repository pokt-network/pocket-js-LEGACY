import { Node } from "../node";

/**
 *
 *
 * @class QueryNodesResponse
 */
export class QueryNodesResponse {
    /**
   *
   * Creates a QueryNodesResponse object using a JSON string
   * @param {String} json - JSON string.
   * @returns {QueryNodesResponse} - QueryNodesResponse object.
   * @memberof QueryNodesResponse
   */
    public static fromJSON(json: string): QueryNodesResponse {
        const jsonObject = JSON.parse(json);
        let nodes;

        jsonObject.forEach(function(nodeJSON: {}){
            let node = Node.fromJSON(JSON.stringify(nodeJSON));
            nodes.push(node);
        }); 
        if (nodes != undefined) {
            return new QueryNodesResponse(
                nodes as Node[]
            ); 
        }else{
            // TODO: Handle undefined scenario properly
            return new QueryNodesResponse(
                jsonObject
            ); 
        }
    }

    public readonly nodes: Node[];

    /**
     * Relay Response.
     * @constructor
     * @param {Node[]} nodes - Node object array.
     */
    constructor(
        nodes: Node[]

    ) {
        this.nodes = nodes

        if (!this.isValid()) {
            throw new TypeError("Invalid properties length.");
        }
    }
    /**
   *
   * Creates a JSON object with the QueryNodesResponse properties
   * @returns {JSON} - JSON Object.
   * @memberof QueryNodesResponse
   */
    public toJSON() {
        var nodeListJSON;
        this.nodes.forEach(node => {
            nodeListJSON.push(node.toJSON());
        });
        return {"nodes": nodeListJSON}
    }
    /**
   *
   * Check if the QueryNodesResponse object is valid
   * @returns {boolean} - True or false.
   * @memberof QueryNodesResponse
   */
    public isValid(): boolean {
        return this.nodes != undefined;
    }
}