import { IStorageItem } from "./IStorageItem"

export class StorageItem {
    public readonly key: string
    public readonly value: any

    constructor(data: IStorageItem) {
        this.key = data.key
        this.value = data.value
    }
}