import { StorageItem  } from "./StorageItem"

export class LocalStorageHelper {

    public static add(key: string, item: string) {
        this.init()
        if (this.localStorageSupported) {
            localStorage.setItem(key, item)
        }
    }

    public static get(key: string): string {
        this.init()
        if (this.localStorageSupported) {
            const item = localStorage.getItem(key)
            return item
        } else {
            return null
        }
    }

    public static getItems(): StorageItem[] {
        const list = new Array<StorageItem>()

        for (let index = 0; index < localStorage.length; index++) {
            const key = localStorage.key(index)
            const value = localStorage.getItem(key)

            list.push(new StorageItem({key, value}))
        }

        return list
    }

    public static remove(key: string) {
        this.init()
        if (this.localStorageSupported) {
            localStorage.removeItem(key)
        }
    }

    public static clear() {
        this.init()
        if (this.localStorageSupported) {
            localStorage.clear()
        }
    }

    private static localStorageSupported: boolean

    private static init(){
        this.localStorageSupported = typeof window.localStorage !== "undefined" && window.localStorage !== null
    }    
}