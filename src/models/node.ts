import axios from "axios"
import constants = require("../utils/constants")
import { Relay } from "./relay"
import { Blockchain } from "./blockchain"
const httpsRequestProtocol = "https://"
const httpRequestProtocol = "http://"
// Dispatch
/**
 *
 *
 * @class Node
 */
export class Node {
  public readonly blockchain: Blockchain
  public readonly ipPort: string
  public readonly ip: string
  public readonly port: string
  /**
   * Creates an instance of Node.
   * @param {Blockchain} blockchain - Blockchain object.
   * @param {string} ipPort - Ip and port string ("127.0.0.1:80")
   * @memberof Node
   */
  constructor(blockchain: Blockchain, ipPort: string) {
    this.blockchain = blockchain
    const ipPortArr = ipPort.split(":")
    this.ip = ipPortArr[0]
    this.port = ipPortArr[1]

    if (
      ipPort.indexOf(httpsRequestProtocol) > -1 ||
      ipPort.indexOf(httpRequestProtocol) > -1
    ) {
      this.ipPort = ipPort
    } else {
      if (this.port === "443") {
        this.ipPort = httpsRequestProtocol + ipPort
      } else {
        this.ipPort = httpRequestProtocol + ipPort
      }
    }
  }

  /**
   *
   * Verify if all properties are valid
   * @returns {boolean} - True or false.
   * @memberof Node
   */
  public isValid() {
    for (const property in this) {
      if (!this.hasOwnProperty(property) || property === "") {
        return false
      }
    }
    return true
  }

  /**
   *
   * Checks if params are equal to stored properties
   * @param {String} netID - Network Identifier.
   * @param {String} network - Network name.
   * @returns {boolean} - True or false.
   * @memberof Node
   */
  public isEqual(blockchain: Blockchain) {
    if (this.blockchain === blockchain) {
      return true
    }
    return false
  }

  /**
   *
   * Sends a relay to a service node
   * @param {Relay} relay - Relay object with the information.
   * @param {callback} callback - callback handler.
   * @returns {Object} - Object with the response.
   * @memberof Node
   */
  public async sendRelay(
    relay: Relay,
    callback?: (result?: any, error?: Error) => any
  ) {
    try {
      const axiosInstance = axios.create({
        baseURL: this.ipPort,
        headers: {
          "Content-Type": "application/json"
        },
        timeout: relay.configuration.requestTimeOut
      })

      const response = await axiosInstance.post(
        constants.relayPath,
        relay.toJSON()
      )

      if (response.status === 200 && response.data !== null) {
        const result = response.data

        if (callback) {
          callback(result)
          return
        } else {
          return result
        }
      } else {
        if (callback) {
          callback(
            null,
            new Error("Failed to send relay with error: " + response.data)
          )
          return
        } else {
          return new Error("Failed to send relay with error: " + response.data)
        }
      }
    } catch (error) {
      if (callback) {
        callback(null, new Error("Failed to send relay with error: " + error))
        return
      } else {
        return new Error("Failed to send relay with error: " + error)
      }
    }
  }
}
