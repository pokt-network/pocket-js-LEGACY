/**
 * Interface to be implemented by all models that need to be encoded to Amino encoding format
 */
export interface IAminoEncodable {

    /**
     * Returns the Amino-encoded bytes representation of the class implementing the interface
     * @returns {Buffer}
     */
    marshalAmino(): Buffer
}