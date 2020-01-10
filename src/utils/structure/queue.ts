/**
 *
 *
 * @class Queue
 * This class provides a TypeScript implementation of a Queue (FIFO Structure).
 */

export class Queue<T> {

    private _head?: QueueItem<T> = undefined
    private _tail?: QueueItem<T> = undefined
    private _length: number = 0

    constructor(...values: T[]) {
        if (values.length > 0) {
          values.forEach((value) => {
            this.append(value);
          });
        }
      }

      *iterator(): IterableIterator<T> {
        let currentItem = this._head;
    
        while(currentItem) {
          yield currentItem.value
          currentItem = currentItem.next
        }
      }
    
      [Symbol.iterator]() {
        return this.iterator();
      }
    
      get head(): T | undefined {
        return this._head !== undefined ? this._head.value : undefined;
      }
    
      get tail(): T | undefined {
        return this._tail !== undefined ? this._tail.value : undefined;
      }
    
      get length(): number {
        return this._length;
      }
    
      insert(val: T, previousItem: T, checkDuplicates: boolean = false): boolean {
    
        if (checkDuplicates && this.isDuplicate(val)) {
          return false;
        }
    
        let newItem: QueueItem<T> = new QueueItem<T>(val);
        let currentItem: QueueItem<T> | undefined = this._head;
    
        if (!currentItem) {
          return false;
        } else {
          while (true) {
            if (currentItem.value === previousItem) {
              newItem.next = currentItem.next;
              newItem.prev = currentItem;
              currentItem.next = newItem;
    
              if (newItem.next) {
                newItem.next.prev = newItem;
              } else {
                this._tail = newItem;
              }
              this._length++;
              return true;
            } else {
              if (currentItem.next) {
                currentItem = currentItem.next;
              }
              else {
                return false;
              }
            }
          }
        }
      }
    
      append(val: T, checkDuplicates: boolean = false): boolean {
    
        if (checkDuplicates && this.isDuplicate(val)) {
          return false;
        }
    
        let newItem = new QueueItem<T>(val);
    
        if (!this._tail) {
          this._head = this._tail = newItem;
        } else {
          this._tail.next = newItem;
          newItem.prev = this._tail;
          this._tail = newItem;
        }
    
        this._length++;
        return true;
      }
    
      prepend(val: T, checkDuplicates: boolean = false): boolean {
    
        if (checkDuplicates && this.isDuplicate(val)) {
          return false;
        }
        
        let newItem = new QueueItem<T>(val);
    
        if (!this._head) {
          this._head = this._tail = newItem;
        } else {
          newItem.next = this._head;
          this._head.prev = newItem;
          this._head = newItem;
        }
        
        this._length++;
        return true;
      }
    
      remove(val: T): T | undefined {
        let currentItem = this._head;
    
        if (!currentItem) {
          return;
        }
    
        if (currentItem.value === val) {
          this._head = currentItem.next;
          this._length--;

          if(this._head !== undefined){
            this._head.prev = undefined;
          }

          currentItem.next = currentItem.prev = undefined;
          
          return currentItem.value;
    
        } else {
          while (true) {
            if (currentItem.value === val) {
              if (currentItem.next) {
                if(currentItem.prev){
                    currentItem.prev.next = currentItem.next;
                }
                currentItem.next.prev = currentItem.prev;
                currentItem.next = currentItem.prev = undefined;
              } else {
                if(currentItem.prev){
                    currentItem.prev.next = undefined;
                }
                this._tail = currentItem.prev;
                currentItem.next = currentItem.prev = undefined;
              }
              this._length--;
              return currentItem.value;
            } else {
              if (currentItem.next) {
                currentItem = currentItem.next;
              } else {
                return;
              }
            }
          }
        }
      }
    
      removeHead(): T | undefined {
        let currentItem = this._head;
    
        // empty list
        if (!currentItem) {
          return
        }
    
        // single item list
        if (!this._head?.next) {
          this._head = undefined;
          this._tail = undefined;
        
        // full list
        } else {
            this._head.next.prev = undefined;  
          this._head = this._head.next;
          currentItem.next = currentItem.prev = undefined;
        }
    
        this._length--;
        return currentItem.value;
      }
    
      removeTail(): T | undefined {
        let currentItem = this._tail;
    
        // empty list
        if (!currentItem) {
          return
        }
    
        // single item list
        if (!this._tail?.prev) {
          this._head = undefined;
          this._tail = undefined;
              
        // full list
        } else {
          this._tail.prev.next = undefined;
          this._tail = this._tail.prev;
          currentItem.next = currentItem.prev = undefined;
        }
    
        this._length--;
        return currentItem.value;
      }
    
      first(num: number): T[] {
        let iter = this.iterator();
        let result = [];
    
        let n = Math.min(num, this.length);
    
        for (let i = 0; i < n; i++) {
          let val = iter.next();
          result.push(val.value);
        }
        return result;
      }
    
      toArray(): T[] {
        return [...this];
      }

      get front() {
        return this.head;
      }
    
      enqueue(val: T) {
        this.append(val);
      }
    
      dequeue(): T | undefined {
        return this.removeHead();
      }
    
      private isDuplicate(val: T): boolean {
        let set = new Set(this.toArray());
        return set.has(val);
      }
    }
    
    export class QueueItem<T> {
      value: T;
      next?: QueueItem<T>;
      prev?: QueueItem<T>;
    
      constructor(val: T) {
        this.value = val;
        this.next = undefined;
        this.prev = undefined;
      }
    }