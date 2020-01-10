import { KVStore } from "./kv-store";

export class InMemoryKVStore implements KVStore {

    private readonly localStorage: Map<string, any> = new Map()

    public add(key: string, value: any) {
        this.localStorage.set(key, value)
    }

    public get(key: string): string {
        const item = this.localStorage.get(key)
        if(item === undefined) {
            throw new TypeError("Key doesn't exist")
        }
        return item
        
    }

    public getItems(): any[] {
        const list = new Array<any>()

        Array.from(this.localStorage.entries()).forEach(entry => {
            const key = entry[0]
            const value = entry[1]

            list.push({key, value})
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