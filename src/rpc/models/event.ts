
export interface IKVPair {
  key: string,
  value: string
}

/**
 *
 *
 * @class Event
 */
export class Event {
  /**
   *
   * Creates a Event object using a JSON string
   * @param {String} json - JSON string.
   * @returns {Event} - Event object.
   * @memberof Event
   */
  public static fromJSON(json: string): Event {
    try {
      const jsonObject = JSON.parse(json)
      const attributesArray: IKVPair[] = []

      jsonObject.attributes.forEach(function (attribute: IKVPair) {
        const test = { key: atob(attribute.key), value: atob(attribute.value) }
      })

      if (Array.isArray(jsonObject.attributes)) {
        attributesArray
      }
      return new Event(
        jsonObject.type,
        jsonObject.attributes as IKVPair[],
      )
    } catch (error) {
      throw error
    }
  }

  public readonly type: string
  public readonly attributes: IKVPair[]

  /**
   * Creates a Event.
   * @constructor
   * @param {string} type - 
   * @param {IKVPair} attributes - 
   */
  constructor(
    type: string,
    attributes: IKVPair[]
  ) {
    this.type = type
    this.attributes = attributes

    if (!this.isValid()) {
      throw new TypeError("Invalid Event properties.")
    }
  }
  /**
   *
   * Creates a JSON object with the Event properties
   * @returns {JSON} - JSON Object.
   * @memberof Event
   */
  public toJSON() {
    return {
      type: this.type,
      attributes: this.attributes,
    }
  }
  /**
   *
   * Verify if all properties are valid
   * @returns {boolean} - True or false.
   * @memberof Event
   */
  public isValid() {
    return this.type.length > 0 &&
      this.attributes !== undefined
  }
}
