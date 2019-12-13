// Wallet - Model
export class Wallet {
	public readonly address: string;
	public readonly privateKey: string;
	public readonly network: string;
	public readonly networkID: string;
	public readonly data: {};
	/**
	 * Creates an instance of Wallet.
	 * @param {String} address - Public Key string.
	 * @param {String} privateKey - Private Key string.
	 * @param {String} network - Network name.
	 * @param {String} networkID - Network Identifier.
	 * @param {Object} data - Optional data object.
	 * @memberof Wallet
	 */
	constructor(address: string, privateKey: string, network: string, networkID: string, data: {}) {
		this.address = address;
		this.privateKey = privateKey;
		this.network = network;
		this.networkID = networkID;
		this.data = data;
	}
}