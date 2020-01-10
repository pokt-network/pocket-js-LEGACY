export interface KVStore {
    add(key: string, value: any): void
    get(key: string): string
    getItems(): any[]
    remove(key: string): void
    clear(): void
}