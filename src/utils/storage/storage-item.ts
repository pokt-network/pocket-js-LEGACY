import { IStorageItem } from "./i_storage_item"

export class StorageItem {
    public readonly key: string
    public readonly value: string

    constructor(data: IStorageItem) {
        this.key = data.key
        this.value = data.value
    }
}