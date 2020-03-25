import { RelayProof } from "../relay-proof"
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
      const proof = RelayProof.fromJSON(JSON.stringify(jsonObject.RelayProof))
  
      return new ConsensusRelayResponse(
        jsonObject.signature,
        jsonObject.payload,
        proof,
        jsonObject.nodes
      )
    } catch (error) {
      throw error
    }
  }

  public readonly signature: string
  public readonly payload: string
  public readonly proof: RelayProof
  public readonly consensusNodes: ConsensusNode[] = []
  public consensusResult: boolean = false
  public majorityResponse: MajorityResponse
  public minorityResponse: MinorityResponse
  
  /**
   * Relay payload.
   * @constructor
   * @param {string} signature - Signature.
   * @param {string} payload - payload string.
   * @param {RelayProof} proof - Proof object.
   * @param {ConsensusNode[]} consensusNodes - List of the nodes participating in the consensus.
   * @param {boolean} consensusResult - True or false if  the consensus was successful or not.
   */
  constructor(signature: string, payload: string, proof: RelayProof, consensusNodes: ConsensusNode[]) {
    this.signature = signature
    this.payload = payload
    this.proof = proof
    this.consensusNodes = consensusNodes
    
    this.setLocalConsensusResults()
    // Populate the majority and minotiry response objects
    const majorityResponse: RelayResponse[] = []
    const minorityResponse: RelayResponse[] = []

    this.consensusNodes.forEach(node => {
      if (this.consensusResult == true) {
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
    this.majorityResponse = new MajorityResponse(majorityResponse)
    this.minorityResponse = new MinorityResponse(minorityResponse[0])
    
    if (!this.isValid()) {
      throw new TypeError("Invalid ConsensusRelayResponse properties.")
    }
  }

  /**
   *
   * Returns whether the local consensus result is positive or negative
   * @memberof ConsensusRelayResponse
   */
  private setLocalConsensusResults() {
    const results: boolean[] = []
    const firstResponseBuffer = Buffer.from(JSON.stringify(this.toJSON()), 'utf8')

    this.consensusNodes.forEach(node => {
      let responseBuffer = Buffer.from(JSON.stringify(node.relayResponse.toJSON()), 'utf8')

      if (Buffer.compare(responseBuffer, firstResponseBuffer) == 0) {
        node.status = true
        results.push(true)
      }else {
        node.status = false
        results.push(false)
      }
    })

    let positive = results.filter(Boolean).length
    let negative = results.length - positive

    if (positive > negative) {
      this.consensusResult = true
    }else {
      this.consensusResult = false
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
      proof: this.proof.toJSON(),
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
      this.proof.isValid() &&
      this.payload.length !== 0
    )
  }
}
