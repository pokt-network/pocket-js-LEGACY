import { IKVStore } from "./kv-store"


/**
 *
 *
 * @class InMemoryKVStore
 * @description Save data using a Key/Value relationship. This object save information in memory, that means if the application is closed,
 * the saved information will be deleted
 */

export class InMemoryKVStore implements IKVStore {
  private readonly localStorage: Map<string, any> = new Map()

  /**
   * @description Associates the specified value with the specified key and save this association in memory.
   * @param {string} key - key with which the specified value is to be associated
   * @param {any} value - value to be associated with the specified key
   * @memberof InMemoryKVStore
   */
  public add(key: string, value: any) {
    this.localStorage.set(key, value)
  }

  /**
   * @description Returns the value to which the specified key is mapped.
   * @param {string} key - the key whose associated value is to be returned
   * @returns {any | undefined} - Key or undefined.
   * @memberof InMemoryKVStore
   */
  public get(key: string): any | undefined {
    return this.localStorage.get(key)
  }
  
  /**
   * @description Returns a list with all the saved value
   * @returns {any[]} - An array of items.
   */
  public getItems(): any[] {
    const list = new Array<any>()

    Array.from(this.localStorage.entries()).forEach(entry => {
      const key = entry[0]
      const value = entry[1]

      list.push({ key, value })
    })

    return list
  }

  /**
   * @description Verifies if the object has an association identified with a key.
   * @param {string} key - key whose mapping is to be checked from the memory
   * @returns {boolean} - True or false if the key exists in the local storage.
   * @memberof InMemoryKVStore
   */
  public has(key: string): boolean {
    return this.localStorage.has(key)
  }

  /**
   * @description Removes the mapping for a key from this object if it is present.
   * @param {string} key - key whose mapping is to be removed from the memory
   * @returns {boolean} - True or false if the item was removed or not.
   * @memberof InMemoryKVStore
   */
  public remove(key: string): boolean {
    return this.localStorage.delete(key)
  }

  /**
   * @description Removes all of the mappings from this object.
   */
  public clear() {
    this.localStorage.clear()
  }
}
