import { StorageItem  } from "./storage_item"
import { IStorageItem } from "./i_storage_item"
import { KVStore } from "./kv_store";

export class InMemoryKVStore implements KVStore {

    private readonly localStorageSupported: boolean = false

    public add(item: IStorageItem) {
        this.init()
        if (this.localStorageSupported) {
            localStorage.setItem(item.key, item.value)
        }
    }

    public get(key: string): string {
        this.init()
        if (this.localStorageSupported) {
            const item = localStorage.getItem(key)
            return item
        } else {
            return null
        }
    }

    public getItems(): IStorageItem[] {
        const list = new Array<StorageItem>()

        for (let index = 0; index < localStorage.length; index++) {
            const key = localStorage.key(index)
            const value = localStorage.getItem(key)

            list.push(new StorageItem({key, value}))
        }

        return list
    }

    public remove(key: string) {
        this.init()
        if (this.localStorageSupported) {
            localStorage.removeItem(key)
        }
    }

    public clear() {
        this.init()
        if (this.localStorageSupported) {
            localStorage.clear()
        }
    }

    private init(){
        this.localStorageSupported = typeof window.localStorage !== "undefined" && window.localStorage !== null
    }    
}