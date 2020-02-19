/**
 * @description KeyBase store interface
 */
export interface IKVStore {
  add(key: string, value: any): void
  get(key: string): any | undefined
  has(key: string): boolean
  getItems(): any[]
  remove(key: string): boolean
  clear(): void
}
