import { ConsensusNode } from "../consensus-node"
import { MajorityResponse } from "../input/majority-response"
import { MinorityResponse } from "../input/minority-response"
import { RelayResponse } from "./relay-response"
/**
 *
 *
 * @class ConsensusRelayResponse
 */
export class ConsensusRelayResponse {
  /**
   *
   * Creates a ConsensusRelayResponse object using a JSON string
   * @param {String} json - JSON string.
   * @returns {ConsensusRelayResponse} - ConsensusRelayResponse object.
   * @memberof ConsensusRelayResponse
   */
  public static fromJSON(json: string): ConsensusRelayResponse {
    try {
      const jsonObject = JSON.parse(json)

      return new ConsensusRelayResponse(
        jsonObject.signature,
        jsonObject.payload,
        jsonObject.nodes
      )
    } catch (error) {
      throw error
    }
  }

  public readonly signature: string
  public readonly payload: string
  public readonly consensusNodes: ConsensusNode[] = []
  public consensusResult: boolean = false
  public majorityResponse?: MajorityResponse
  public minorityResponse?: MinorityResponse

  /**
   * Consensus Relay Response.
   * @constructor
   * @param {string} signature - Signature.
   * @param {string} payload - payload string.
   * @param {ConsensusNode[]} consensusNodes - List of the nodes participating in the consensus.
   */
  constructor(signature: string, payload: string, consensusNodes: ConsensusNode[]) {
    this.signature = signature
    this.payload = payload
    this.consensusNodes = consensusNodes

    this.setLocalConsensusResults()
    // Populate the majority and minority response objects
    const majorityResponse: RelayResponse[] = []
    const minorityResponse: RelayResponse[] = []

    this.consensusNodes.forEach(node => {
      if (this.consensusResult === true) {
        if (node.status) {
          majorityResponse.push(node.relayResponse)
        } else {
          minorityResponse.push(node.relayResponse)
        }
      } else {
        if (!node.status) {
          majorityResponse.push(node.relayResponse)
        } else {
          minorityResponse.push(node.relayResponse)
        }
      }
    })
    // We only wanna handle the case of 1 node being in disagreement with the rest
    if (minorityResponse.length === 1 && majorityResponse.length > 0) {
      if (majorityResponse.length > 2) {
        this.majorityResponse = new MajorityResponse(majorityResponse.slice(0, 2))
      }else if(majorityResponse.length === 2){
        this.majorityResponse = new MajorityResponse(majorityResponse)
      }else{
        throw new Error("Majority response is equal to 1, it should be 2 responses.")
      }
      
      this.minorityResponse = new MinorityResponse(minorityResponse[0])
    }

    if (!this.isValid()) {
      throw new TypeError("Invalid ConsensusRelayResponse properties.")
    }
  }

  /**
   *
   * Creates a JSON object with the ConsensusRelayResponse properties
   * @returns {JSON} - JSON Object.
   * @memberof ConsensusRelayResponse
   */
  public toJSON() {
    return {
      payload: this.payload,
      signature: this.signature
    }
  }
  /**
   *
   * Check if the ConsensusRelayResponse object is valid
   * @returns {boolean} - True or false.
   * @memberof ConsensusRelayResponse
   */
  public isValid(): boolean {
    return (
      this.signature.length !== 0 &&
      this.payload.length !== 0 &&
      this.consensusNodes.length !== 0
    )
  }
  /**
   *
   * Returns whether the local consensus result is positive or negative
   * @memberof ConsensusRelayResponse
   */
  private setLocalConsensusResults() {
    const results: boolean[] = []
    const firstResponseBuffer = Buffer.from(this.payload, 'utf8')
    // Iterate each consensus nodes
    this.consensusNodes.forEach(node => {
      const responseBuffer = Buffer.from(node.relayResponse.payload, 'utf8')
      // Compare each relay payload result
      if (Buffer.compare(responseBuffer, firstResponseBuffer) === 0) {
        // Set the node status for consensus to true
        node.status = true
        results.push(true)
      } else {
        // Set the node status for consensus to false
        node.status = false
        results.push(false)
      }
    })
    // Retrieve the true and false results
    const positive = results.filter(Boolean).length
    const negative = results.length - positive
    // Updated the consensus result based on the output
    if (positive > negative) {
      this.consensusResult = true
    } else {
      this.consensusResult = false
    }
  }
}
