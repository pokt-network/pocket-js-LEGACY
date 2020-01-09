import { StorageItem  } from "./storage_item"
import { IStorageItem } from "./i_storage_item"
import { KVStore } from "./kv_store";

export class InMemoryKVStore implements KVStore {

    private localStorage: any = undefined

    public add(item: IStorageItem) {
        this.init()
        this.localStorage.setItem(item.key, item.value)
    }

    public get(key: string): string {
        this.init()

        const item = this.localStorage.getItem(key)
        if(item === undefined) {
            throw new TypeError("Key doesn't exist")
        }
        return item
        
    }

    public getItems(): IStorageItem[] {
        const list = new Array<StorageItem>()

        for (let index = 0; index < this.localStorage.length; index++) {
            const key = this.localStorage.key(index)
            const value = this.localStorage.getItem(key)

            list.push(new StorageItem({key, value}))
        }

        return list
    }

    public remove(key: string) {
        this.init()
        this.localStorage.removeItem(key)
    }

    public clear() {
        this.init()
        this.localStorage.clear()
    }

    private init(){
        if (typeof window.localStorage === "undefined" || window.localStorage === null) {
            var LocalStorage = require('node-localstorage').LocalStorage;
            this.localStorage = new LocalStorage('./scratch');
          }

    }    
}