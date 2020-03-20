import {ChallengeRequest} from "../rpc/models/input/challenge-request"
import {Hex} from "./hex"
import {RelayProof, RelayResponse} from "../rpc/models"
import {typeGuard} from "./type-guard"
import {MajorityResponse} from "../rpc/models/input/majority-response"
import {validateAddressHex} from "./key-pair"


/**
 * Validates a ChallengeRequest
 * @param {ChallengeRequest} request - The ChallengeRequest to be evaluated.
 * @returns {Error | undefined}.
 */
export function validateChallengeRequest(request: ChallengeRequest): Error | undefined {
    switch (true) {
        case typeGuard(validateRelayResponse(request.minorityResponse.relay), Error):
            return validateRelayResponse(request.minorityResponse.relay) as Error
        case request.majorityResponse.relays.length !== 2:
            return new Error("Invalid majority request. The amount of relays needs to be equals to 2")
        case typeGuard(validateMajorityResponse(request.majorityResponse), Error):
            return validateMajorityResponse(request.majorityResponse) as Error
        case typeGuard(validateAddressHex(request.address), Error):
            return validateAddressHex(request.address) as Error
        default:
            return undefined
    }
}

/**
 * Validates a MajorityResponse
 * @param {MajorityResponse} response - The MajorityResponse to be evaluated.
 * @returns {Error | undefined}.
 */
export function validateMajorityResponse(response: MajorityResponse): Error | undefined {
    let result: Error | undefined
    response.relays.forEach(relay => {
        result = validateRelayResponse(relay)
    })
    return result
}

/**
 * Validates a Relay
 * @param {Relay} relay - The Relay to be evaluated.
 * @returns {Error | undefined}.
 */
export function validateRelayResponse(relay: RelayResponse): Error | undefined {
    switch (true) {
        case !Hex.isHex(relay.signature):
            return new Error("Invalid string is not hex: " + relay.signature)
        case typeGuard(validateRelayProof(relay.proof), Error):
            return validateRelayProof(relay.proof) as Error
        default:
            return undefined
    }
}

/**
 * Validates a RelayProof
 * @param {RelayProof} proof - The RelayProof to be evaluated.
 * @returns {Error | undefined}.
 */
export function validateRelayProof(proof: RelayProof): Error | undefined  {
    switch (true) {
        case proof.blockchain.length === 0:
            return new Error("Invalid chain. The chain cannot be empty")
        case Number(proof.entropy.toString()) === undefined:
            return new Error("Invalid entropy. The entropy needs to be a number: " + proof.entropy)
        case !Hex.isHex(proof.signature):
            return new Error("Invalid string is not hex: " + proof.signature)
        case !Hex.isHex(proof.servicePubKey):
            return new Error("Invalid string is not hex: " + proof.servicePubKey)
        case Number(proof.sessionBlockHeight) === 0:
            return new Error("The Block Height needs to be bigger than 0")
        case !proof.token.isValid():
            return new Error("The token is invalid")
        default:
            return undefined
    }
}

