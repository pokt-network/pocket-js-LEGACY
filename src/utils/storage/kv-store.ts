import { IStorageItem } from "./i_storage_item"

export interface KVStore {
    add(item: IStorageItem): void
    get(key: string): string
    getItems(): IStorageItem[]
    remove(key: string): void
    clear(): void
}