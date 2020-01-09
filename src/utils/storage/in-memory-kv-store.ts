import { StorageItem  } from "./storage-item"
import { IStorageItem } from "./i-storage-item"
import { KVStore } from "./kv-store";

export class InMemoryKVStore implements KVStore {

    private readonly localStorage: Map<string, string> = new Map()

    public add(item: IStorageItem) {
        this.localStorage.set(item.key, item.value)
    }

    public get(key: string): string {
        const item = this.localStorage.get(key)
        if(item === undefined) {
            throw new TypeError("Key doesn't exist")
        }
        return item
        
    }

    public getItems(): IStorageItem[] {
        const list = new Array<StorageItem>()

        Array.from(this.localStorage.entries()).forEach(entry => {
            const key = entry[0]
            const value = entry[1]

            list.push(new StorageItem({key, value}))
        })
        
        return list
    }

    public remove(key: string) {
        this.localStorage.delete(key)
    }

    public clear() {
        this.localStorage.clear()
    }
}