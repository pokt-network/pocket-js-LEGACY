export interface IKVStore {
  add(key: string, value: any): void
  get(key: string): any
  has(key: string): boolean
  getItems(): any[]
  remove(key: string): void
  clear(): void
}
