import { Hex, Event } from "../.."

/**
 *
 *
 * @class ResponseDeliverTx
 */
export class ResponseDeliverTx {
  /**
   *
   * Creates a ResponseDeliverTx object using a JSON string
   * @param {String} json - JSON string.
   * @returns {ResponseDeliverTx} - ResponseDeliverTx object.
   * @memberof ResponseDeliverTx
   */
  public static fromJSON(json: string): ResponseDeliverTx {
    try {
      const jsonObject = JSON.parse(json)
      const events: Event[] = []

      if (jsonObject.events) {
        jsonObject.events.forEach((eventObj: any) => {
          const event = Event.fromJSON(JSON.stringify(eventObj))
          events.push(event)
        })
      }

      const data = jsonObject.data !== undefined && jsonObject.data !== null ? jsonObject.data : ""

      return new ResponseDeliverTx(
        jsonObject.code,
        data,
        jsonObject.log,
        jsonObject.info,
        BigInt(jsonObject.gasWanted),
        BigInt(jsonObject.gasUsed),
        events,
        jsonObject.codespace
      )
    } catch (error) {
      throw error
    }
  }

  public readonly code: number
  public readonly codespace: string
  public readonly data: string[]
  public readonly events: Event[]
  public readonly gasUsed: BigInt
  public readonly gasWanted: BigInt
  public readonly info: string
  public readonly log: string  

  /**
   * Creates a ResponseDeliverTx.
   * @constructor
   * @param {number} code - 
   * @param {string[]} data - 
   * @param {string} log - 
   * @param {string} info - 
   * @param {BigInt} gasWanted - 
   * @param {BigInt} gasUsed - 
   * @param {Event[]} events - 
   * @param {string} codespace - 
   */
  constructor(
    code: number,
    data: string[],
    log: string,
    info: string,
    gasWanted: BigInt,
    gasUsed: BigInt,
    events: Event[],
    codespace: string
  ) {
    this.code = code
    this.data = data
    this.log = log
    this.info = info
    this.gasWanted = gasWanted
    this.gasUsed = gasUsed
    this.events = events
    this.codespace = codespace

    if (!this.isValid()) {
      throw new TypeError("Invalid ResponseDeliverTx properties.")
    }
  }
  /**
   *
   * Creates a JSON object with the ResponseDeliverTx properties
   * @returns {JSON} - JSON Object.
   * @memberof ResponseDeliverTx
   */
  public toJSON() {
    const events: object[] = []

    if (this.events.length > 0) {
      this.events.forEach(function (event: Event) {
        events.push(event.toJSON())
      })
    }

    return {
      code: this.code,
      data: this.data,
      log: this.log,
      info: this.info,
      gasWanted: Number(this.gasWanted.toString()),
      gasUsed: Number(this.gasUsed.toString()),
      events: events
    }
  }
  /**
   *
   * Verify if all properties are valid
   * @returns {boolean} - True or false.
   * @memberof ResponseDeliverTx
   */
  public isValid() {
    return this.code >= 0 &&
      Number(this.gasWanted.toString()) >= 0 &&
      Number(this.gasUsed.toString()) >= 0
  }
}
