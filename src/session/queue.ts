/**
 * @class Queue
 * This class provides a TypeScript implementation of a Queue (FIFO Structure).
 */
export class Queue<T> {
  private intHead?: QueueItem<T> = undefined
  private intTail?: QueueItem<T> = undefined
  private iintLength: number = 0

  constructor(...values: T[]) {
    if (values.length > 0) {
      values.forEach(value => {
        this.append(value)
      })
    }
  }
  /**
   *
   * Creates a Application object using a JSON string
   * @param {String} json - JSON string.
   * @returns {Application} - Application object.
   * @memberof Queue
   */
  public *iterator(): IterableIterator<T> {
    let currentItem = this.intHead

    while (currentItem) {
      yield currentItem.value
      currentItem = currentItem.next
    }
  }

  public [Symbol.iterator]() {
    return this.iterator()
  }

  get head(): T | undefined {
    return this.intHead !== undefined ? this.intHead.value : undefined
  }

  get tail(): T | undefined {
    return this.intTail !== undefined ? this.intTail.value : undefined
  }

  get length(): number {
    return this.iintLength
  }

  public insert(
    val: T,
    previousItem: T,
    checkDuplicates: boolean = false
  ): boolean {
    if (checkDuplicates && this.isDuplicate(val)) {
      return false
    }

    const newItem: QueueItem<T> = new QueueItem<T>(val)
    let currentItem: QueueItem<T> | undefined = this.intHead

    if (!currentItem) {
      return false
    } else {
      while (true) {
        if (currentItem.value === previousItem) {
          newItem.next = currentItem.next
          newItem.prev = currentItem
          currentItem.next = newItem

          if (newItem.next) {
            newItem.next.prev = newItem
          } else {
            this.intTail = newItem
          }
          this.iintLength++
          return true
        } else {
          if (currentItem.next) {
            currentItem = currentItem.next
          } else {
            return false
          }
        }
      }
    }
  }

  public append(val: T, checkDuplicates: boolean = false): boolean {
    if (checkDuplicates && this.isDuplicate(val)) {
      return false
    }

    const newItem = new QueueItem<T>(val)

    if (!this.intTail) {
      this.intHead = this.intTail = newItem
    } else {
      this.intTail.next = newItem
      newItem.prev = this.intTail
      this.intTail = newItem
    }

    this.iintLength++
    return true
  }

  public prepend(val: T, checkDuplicates: boolean = false): boolean {
    if (checkDuplicates && this.isDuplicate(val)) {
      return false
    }

    const newItem = new QueueItem<T>(val)

    if (!this.intHead) {
      this.intHead = this.intTail = newItem
    } else {
      newItem.next = this.intHead
      this.intHead.prev = newItem
      this.intHead = newItem
    }

    this.iintLength++
    return true
  }

  public remove(val: T): T | undefined {
    let currentItem = this.intHead

    if (!currentItem) {
      return
    }

    if (currentItem.value === val) {
      this.intHead = currentItem.next
      this.iintLength--

      if (this.intHead !== undefined) {
        this.intHead.prev = undefined
      }

      currentItem.next = currentItem.prev = undefined

      return currentItem.value
    } else {
      while (true) {
        if (currentItem.value === val) {
          if (currentItem.next) {
            if (currentItem.prev) {
              currentItem.prev.next = currentItem.next
            }
            currentItem.next.prev = currentItem.prev
            currentItem.next = currentItem.prev = undefined
          } else {
            if (currentItem.prev) {
              currentItem.prev.next = undefined
            }
            this.intTail = currentItem.prev
            currentItem.next = currentItem.prev = undefined
          }
          this.iintLength--
          return currentItem.value
        } else {
          if (currentItem.next) {
            currentItem = currentItem.next
          } else {
            return
          }
        }
      }
    }
  }

  public removeHead(): T | undefined {
    const currentItem = this.intHead

    // empty list
    if (!currentItem) {
      return
    }

    // single item list
    if (!this.intHead?.next) {
      this.intHead = undefined
      this.intTail = undefined

      // full list
    } else {
      this.intHead.next.prev = undefined
      this.intHead = this.intHead.next
      currentItem.next = currentItem.prev = undefined
    }

    this.iintLength--
    return currentItem.value
  }

  public removeTail(): T | undefined {
    const currentItem = this.intTail

    // empty list
    if (!currentItem) {
      return
    }

    // single item list
    if (!this.intTail?.prev) {
      this.intHead = undefined
      this.intTail = undefined

      // full list
    } else {
      this.intTail.prev.next = undefined
      this.intTail = this.intTail.prev
      currentItem.next = currentItem.prev = undefined
    }

    this.iintLength--
    return currentItem.value
  }

  public first(num: number): T[] {
    const iter = this.iterator()
    const result = []

    const n = Math.min(num, this.length)

    for (let i = 0; i < n; i++) {
      const val = iter.next()
      result.push(val.value)
    }
    return result
  }

  public toArray(): T[] {
    return [...this]
  }

  get front() {
    return this.head
  }

  public enqueue(val: T) {
    this.append(val)
  }

  public dequeue(): T | undefined {
    return this.removeHead()
  }

  private isDuplicate(val: T): boolean {
    const set = new Set(this.toArray())
    return set.has(val)
  }
}

export class QueueItem<T> {
  public value: T
  public next?: QueueItem<T>
  public prev?: QueueItem<T>

  constructor(val: T) {
    this.value = val
    this.next = undefined
    this.prev = undefined
  }
}
